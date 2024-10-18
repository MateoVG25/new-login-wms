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
      const titular = await db
        .request()
        .query(
          `SELECT TitularId, TitularCiudadId, TitularDireccion, TitularCodigo, TitularNombre, LoteIdTitular, ContenedorIdTitular, OrdenanteId, UbicacionLogicaIdTitular, ProductoListaIdTitular, PresentacionListaIdTitular FROM ${process.env.TITULAR_TABLE}`
        );

      if (titular.recordset.length === 0) {
        return NextResponse.json(
          {
            error: "No se encontraron titulares",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "Titulares encontrados",
          titulares: titular.recordset,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error en la consulta: ", error);
      throw error;
    }
  } catch (error) {
    console.error("Error al buscar titulares:", error);
    return NextResponse.json(
      {
        error: "Error al buscar titulares",
      },
      { status: 500 }
    );
  }
}
