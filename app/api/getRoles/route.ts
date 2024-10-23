import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import dotenv from "dotenv";

dotenv.config();

export async function GET() {
  try {
    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        { error: "Error al conectar con la base de datos" },
        { status: 500 }
      );
    }

    try {
      const roles = await db
        .request()
        .query(`SELECT * FROM ${process.env.ROLES_TABLE}`);

      if (roles.recordset.length === 0) {
        return NextResponse.json(
          { error: "No se encontraron roles" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Roles encontrados", roles: roles.recordset },
        { status: 200 }
      );
    } catch (error) {
      console.error("Error al obtener los roles", error);
      return NextResponse.json(
        { error: "Error al obtener los roles" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error al conectar con la base de datos", error);
    return NextResponse.json(
      { error: "Error al conectar con la base de datos" },
      { status: 500 }
    );
  }
}
