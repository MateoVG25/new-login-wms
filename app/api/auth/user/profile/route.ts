import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import dotenv from "dotenv";
import { verifySession } from "../../session-verification";

dotenv.config();

export async function GET() {
  try {
    const session = await verifySession();

    if (!session?.isValid) {
      return NextResponse.json(
        {
          error: "Sesión no válida o no existe",
        },
        { status: 404 }
      );
    }

    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        {
          error: "No se pudo conectar a la base de datos",
        },
        { status: 500 }
      );
    }

    const SessionUserId = session.userId;

    const result = await db
      .request()
      .input("UsuarioId", SessionUserId)
      .query(
        `SELECT * FROM ${process.env.USER_TABLE} WHERE UsuarioId = @UsuarioId`
      );

    if (result.recordset.length === 0) {
      return NextResponse.json(
        {
          error: "No se encontraron resultados",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(result.recordset[0]);
  } catch (error) {
    console.error("Error obteniendo perfil de usuario:", error);
    return NextResponse.json(
      {
        error: "Error obteniendo perfil de usuario",
      },
      {
        status: 500,
      }
    );
  }
}
