import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import { compare } from "bcrypt";
import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";

const cookieConfig = {
  name: "session",
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Solo true en producción
    sameSite:
      process.env.NODE_ENV === "production"
        ? ("strict" as const)
        : ("lax" as const), // "strict" en producción
    path: "/",
    maxAge: 4 * 60 * 60,
  },
};

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        { error: "Error de conexión a la base de datos" },
        { status: 500 }
      );
    }

    const userResult = await db.request().input("email", email).query(`
      SELECT UsuarioId, password FROM ${process.env.USER_TABLE} WHERE UsuarioUser = @email
    `);

    if (userResult.recordset.length === 0) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const user = userResult.recordset[0];
    const validPassword = await compare(password, user.password);

    if (!validPassword) {
      return NextResponse.json(
        { error: "Credenciales inválidas" },
        { status: 401 }
      );
    }

    const sessionGuid = uuidv4();
    const expiresAt = new Date(Date.now() + cookieConfig.options.maxAge * 1000);

    // Actualizar o crear sesión
    const sessionResult = await db
      .request()
      .input("userId", user.UsuarioId)
      .input("guid", sessionGuid)
      .input("expiresAt", expiresAt).query(`
        MERGE ${process.env.SESSION_TABLE} AS target
        USING (SELECT @userId as userId) AS source
        ON target.userId = source.userId
        WHEN MATCHED THEN
          UPDATE SET UsuarioSesionGUID = @guid, expiresAt = @expiresAt
        WHEN NOT MATCHED THEN
          INSERT (userId, UsuarioSesionGUID, expiresAt)
          VALUES (@userId, @guid, @expiresAt)
        OUTPUT INSERTED.id, INSERTED.UsuarioSesionGUID;
      `);

    if (sessionResult.recordset.length === 0) {
      return NextResponse.json(
        { error: "Error al gestionar la sesión" },
        { status: 500 }
      );
    }

    const { id, UsuarioSesionGUID: sessionGuidUpdated } =
      sessionResult.recordset[0];

    // Crear JWT
    const key = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
      userId: user.UsuarioId,
      sessionId: id,
      sessionGuid: sessionGuidUpdated,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(`${cookieConfig.options.maxAge}s`)
      .sign(key);

    // Crear respuesta
    const response = NextResponse.json({
      success: true,
      redirect: "/home", // Añadimos la URL de redirección en la respuesta
    });

    // Establecer cookie
    response.cookies.set(cookieConfig.name, token, cookieConfig.options);

    return response;
  } catch (error) {
    console.error("Error en login:", error);
    return NextResponse.json(
      { error: "Error al iniciar sesión" },
      { status: 500 }
    );
  }
}
