import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import { hash } from "bcrypt";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

export async function POST(request: Request) {
  try {
    const {
      name,
      lastname,
      email,
      password,
      phone,
      day,
      month,
      year,
      gender,
      userIdentityType,
      userIdentity,
      operationCenter,
      operationPoint,
    } = await request.json();

    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        {
          error: "Error al conectar con la base de datos",
        },
        { status: 500 }
      );
    }

    const transaction = db.transaction();
    await transaction.begin();

    try {
      const existingUser = await transaction.request().input("email", email)
        .query(`
          SELECT UsuarioId FROM ${process.env.USER_TABLE} WHERE UsuarioUser = @email
        `);

      if (existingUser.recordset.length > 0) {
        await transaction.rollback();
        return NextResponse.json(
          {
            error: "Este email ya está registrado. Por favor intente con otro",
          },
          { status: 400 }
        );
      }

      const hashedPassword = await hash(password, 10);

      const UserGUID = uuidv4();

      const userResult = await transaction
        .request()
        .input("UsuarioNombre", name)
        .input("UsuarioIdentificacion", userIdentity)
        .input("UsuarioApellido", lastname)
        .input("UsuarioGUID", UserGUID)
        .input("UsuarioTerminal", "N")
        .input("UsuarioUltPO", 0)
        .input("UsuarioUser", email)
        .input("UsuarioActivo", 1)
        .input("IMPImpresoraExternaId", null)
        .input("password", hashedPassword)
        .input("Gender", gender)
        .input("IdentificationType", userIdentityType)
        .input("Phone", phone)
        .input("BirthDate", `${day}-${month}-${year}`).query(`
          INSERT INTO ${process.env.USER_TABLE} (UsuarioNombre, UsuarioIdentificacion, UsuarioApellido, UsuarioGUID, UsuarioTerminal, UsuarioUltPO, UsuarioUser, UsuarioActivo, IMPImpresoraExternaId, password, Gender, IdentificationType, Phone, BirthDate)
          OUTPUT INSERTED.UsuarioId
          VALUES (@UsuarioNombre, @UsuarioIdentificacion, @UsuarioApellido, @UsuarioGUID, @UsuarioTerminal, @UsuarioUltPO, @UsuarioUser, @UsuarioActivo, @IMPImpresoraExternaId, @password, @Gender, @IdentificationType, @Phone, @BirthDate)
        `);

      const userId = userResult.recordset[0].UsuarioId;

      // Crear sesión inicial (sin expiresAt y UsuarioSesionGUID)
      await transaction.request().input("userId", userId).query(`
          INSERT INTO ${process.env.SESSION_TABLE} (userId, expiresAt, UsuarioSesionGUID)
          VALUES (@userId, NULL, NULL)
        `);

      // Confirmar transacción
      await transaction.commit();

      return NextResponse.json({
        success: true,
        message: "Usuario registrado exitosamente",
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      {
        error: "Error al registrar usuario",
      },
      { status: 500 }
    );
  }
}
