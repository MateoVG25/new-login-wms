import { connectToDatabase } from "@/db/connection";
import { NextResponse } from "next/server";
import dotenv from "dotenv";

dotenv.config();

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        {
          error: "No se pudo conectar a la base de datos",
        },
        { status: 500 }
      );
    }

    try {
      const operationPoint = await db
        .request()
        .query(`SELECT * FROM ${process.env.OPERATION_POINT_TABLE}`);

      if (operationPoint.recordset.length === 0) {
        return NextResponse.json(
          {
            message: "No hay puntos de operación disponibles",
            data: [],
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          message: "Puntos de operación encontrados",
          data: operationPoint.recordset,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error en la consulta: ", error);
      throw error;
    }
  } catch (error) {
    console.error("Error al buscar puntos de operación:", error);
    return NextResponse.json(
      {
        error: "Error al buscar puntos de operación",
      },
      { status: 500 }
    );
  }
}
