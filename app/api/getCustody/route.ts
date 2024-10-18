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
      const custody = await db
        .request()
        .query(
          `SELECT CustodioId, CustodioCodigo, CustodioNombre, OrdenanteId, CustodioDireccion, CustodioCiudadId FROM ${process.env.CUSTODY_TABLE}`
        );

      if (custody.recordset.length === 0) {
        return NextResponse.json(
          {
            error: "No se encontraron custodios",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "Custodios encontrados",
          custodios: custody.recordset,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error en la consulta: ", error);
      throw error;
    }
  } catch (error) {
    console.error("Error al buscar custodios:", error);
    return NextResponse.json(
      { error: "Error al buscar custodios" },
      { status: 500 }
    );
  }
}
