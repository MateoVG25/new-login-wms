import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import { verifySession } from "../session-verification";
import dotenv from "dotenv";

dotenv.config();

export async function GET() {
  try {
    const session = await verifySession();

    if (!session?.isValid) {
      return NextResponse.json(
        {
          error: "Sesión no válida",
        },
        { status: 401 }
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

    console.log("SessionUserId", SessionUserId);

    const result = await db
      .request()
      .input("UsuarioId", SessionUserId)
      .query(
        `SELECT M.MenuTitle,LP.ListProgramName, ULP.UsuarioId
        FROM TC_Laura_Pruebas..UsuarioListProgram AS ULP
        INNER JOIN	TC_Laura_Pruebas..ListProgram AS LP ON ULP.ListProgramId = LP.ListProgramId
        INNER JOIN TC_Laura_Pruebas..Menu AS M ON LP.MenuId=M.MenuId
        WHERE ULP.UsuarioId=32
        ORDER BY 1`
      );

    if (result.recordset.length === 0) {
      return NextResponse.json(
        {
          error: "No se encontraron resultados",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      data: result.recordset,
    });
  } catch (error) {
    console.error("Error obteniendo los modulos del usuario: ", error);
    return NextResponse.json(
      {
        error: "Error obteniendo los modulos del usuario",
      },
      { status: 500 }
    );
  }
}
