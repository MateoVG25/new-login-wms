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
      const sender = await db
        .request()
        .query(
          `SELECT OrdenanteId, OrdenanteCodigo, OrdenanteNombre, OrdenanteDireccion, CiudadId FROM ${process.env.SENDER_TABLE}`
        );

      if (sender.recordset.length === 0) {
        return NextResponse.json(
          {
            error: "No se encontraron ordenantes",
          },
          { status: 404 }
        );
      }

      return NextResponse.json(
        {
          message: "Ordenantes encontrados",
          ordenantes: sender.recordset,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error en la consulta: ", error);
      throw error;
    }
  } catch (error) {
    console.error("Error al buscar ordenantes:", error);
    return NextResponse.json(
      { error: "Error al buscar ordenantes" },
      { status: 500 }
    );
  }
}
