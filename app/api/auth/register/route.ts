import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import { hash } from "bcrypt";
import dotenv from "dotenv";
import { RegisterFormSchema } from "@/types/register-schema";
import {
  getSenderId,
  getCustodyId,
  getTitularId,
} from "@/app/utils/api-helpers";
import {
  insertUser,
  insertSession,
  insertSessionInfo,
} from "@/app/utils/db-helpers";

dotenv.config();

export async function POST(request: Request) {
  try {
    const userData = await request.json();
    const validationResult = RegisterFormSchema.safeParse(userData);

    if (!validationResult.success) {
      return NextResponse.json(
        { error: validationResult.error.errors[0].message },
        { status: 400 }
      );
    }

    const db = await connectToDatabase();
    if (!db) {
      return NextResponse.json(
        { error: "Error al conectar con la base de datos" },
        { status: 500 }
      );
    }

    const transaction = db.transaction();
    await transaction.begin();

    try {
      // Check for existing user
      const existingUser = await transaction
        .request()
        .input("email", userData.email)
        .query(
          `SELECT UsuarioId FROM ${process.env.USER_TABLE} WHERE UsuarioUser = @email`
        );

      if (existingUser.recordset.length > 0) {
        throw new Error(
          "Este email ya está registrado. Por favor intente con otro"
        );
      }

      // Insertar usuario

      const hashedPassword = await hash(userData.password, 10);
      const userResult = await insertUser(
        transaction,
        userData,
        hashedPassword
      );

      // Fetch additional data
      const [ordenanteId, custodioId, titularId] = await Promise.all([
        getSenderId(),
        getCustodyId(),
        getTitularId(),
      ]);

      // Insert session
      const sessionResult = await insertSession(
        transaction,
        userResult,
        ordenanteId,
        custodioId,
        titularId,
        userData
      );

      // Insert session info
      await insertSessionInfo(transaction, sessionResult, userResult);

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
        error:
          error instanceof Error ? error.message : "Error al registrar usuario",
      },
      { status: 500 }
    );
  }
}
