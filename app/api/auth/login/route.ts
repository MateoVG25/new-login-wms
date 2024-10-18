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
      SELECT UsuarioId, password, UsuarioGUID FROM ${process.env.USER_TABLE} WHERE UsuarioUser = @email
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

    const UsuarioSesionGUID = uuidv4();
    const UserId = user.UsuarioId;

    const sessionResult = await db
      .request()
      .input("UsuarioSesionUsuarioId", UserId)
      .input("UsuarioSesionGUID", UsuarioSesionGUID).query(`
        MERGE ${process.env.SESSION_TABLE} AS target
        USING (SELECT @UsuarioSesionUsuarioId as UsuarioSesionUsuarioId) AS source
        ON target.UsuarioSesionUsuarioId = source.UsuarioSesionUsuarioId
        WHEN MATCHED THEN
          UPDATE SET UsuarioSesionGUID = @UsuarioSesionGUID
        WHEN NOT MATCHED THEN
          INSERT (UsuarioSesionUsuarioId, UsuarioSesionGUID)
          VALUES (@UsuarioSesionUsuarioId, @UsuarioSesionGUID)
        OUTPUT INSERTED.UsuarioSesionId, INSERTED.UsuarioSesionGUID;
      `);

    if (sessionResult.recordset.length === 0) {
      return NextResponse.json(
        { error: "Error al crear o actualizar la sesión" },
        { status: 500 }
      );
    }

    const { UsuarioSesionId, UsuarioSesionGUID: sessionGuidUpdated } =
      sessionResult.recordset[0];

    const ExpiresAt = new Date(Date.now() + cookieConfig.options.maxAge * 1000);
    const CreatedAt = new Date();
    const IsActive = 1;
    const LastActivityAt = new Date();

    await db
      .request()
      .input("UsuarioSesionId", UsuarioSesionId)
      .input("SesionGUID", sessionGuidUpdated)
      .input("UsuarioId", UserId)
      .input("UsuarioGUID", user.UsuarioGUID)
      .input("CreatedAt", CreatedAt)
      .input("ExpiresAt", ExpiresAt)
      .input("IsActive", IsActive)
      .input("LastActivityAt", LastActivityAt).query(`
        MERGE ${process.env.SESION_INFO_TABLE} AS target
        USING (SELECT @UsuarioSesionId as UsuarioSesionId) AS source
        ON target.UsuarioSesionId = source.UsuarioSesionId
        WHEN MATCHED THEN
          UPDATE SET 
            SesionGUID = @SesionGUID,
            CreatedAt = @CreatedAt,
            ExpiresAt = @ExpiresAt,
            IsActive = @IsActive,
            LastActivityAt = @LastActivityAt
        WHEN NOT MATCHED THEN
          INSERT (UsuarioSesionId, SesionGUID, UsuarioId, UsuarioGUID, CreatedAt, ExpiresAt, IsActive, LastActivityAt)
          VALUES (@UsuarioSesionId, @SesionGUID, @UsuarioId, @UsuarioGUID, @CreatedAt, @ExpiresAt, @IsActive, @LastActivityAt);
      `);

    const key = new TextEncoder().encode(process.env.JWT_SECRET);
    const token = await new SignJWT({
      userId: user.UsuarioId,
      sessionId: UsuarioSesionId,
      sessionGuid: sessionGuidUpdated,
    })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuedAt()
      .setExpirationTime(`${cookieConfig.options.maxAge}s`)
      .sign(key);

    // Crear respuesta
    const response = NextResponse.json({
      success: true,
      redirect: "/home",
    });

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
