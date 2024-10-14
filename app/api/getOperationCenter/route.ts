import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
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
      const operationCenter = await db
        .request()
        .query(`SELECT * FROM ${process.env.OPERATION_CENTER_TABLE}`);

      if (operationCenter.recordset.length === 0) {
        return NextResponse.json(
          {
            message: "No hay centros de operación disponibles",
            data: [],
          },
          { status: 200 }
        );
      }

      return NextResponse.json(
        {
          message: "Centros de operación encontrados",
          data: operationCenter.recordset,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error en la consulta: ", error);
      throw error; // esta propaga el error al siguiente catch
    }
  } catch (error) {
    console.error("Error al buscar centros de operación:", error);
    return NextResponse.json(
      { error: "Error al buscar centros de operación" },
      { status: 500 }
    );
  }
}
