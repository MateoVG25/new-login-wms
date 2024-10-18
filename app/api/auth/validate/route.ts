import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import { jwtVerify } from "jose";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request: Request) {
  try {
    const token = request.headers.get("x-session-token");

    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    // 1. Verificar JWT
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const db = await connectToDatabase();

    if (!db) {
      throw new Error("No se pudo conectar a la base de datos");
    }

    const result = await db
      .request()
      .input("sessionId", payload.sessionId)
      .input("guid", payload.sessionGuid).query(`
        SELECT TOP 1 1 
        FROM ${process.env.SESSION_TABLE} 
        WHERE UsuarioSesionId = @sessionId 
        AND UsuarioSesionGUID = @guid;
      `);

    return NextResponse.json({
      valid: result.recordset.length > 0,
    });
  } catch (error) {
    console.error("Error validando sesión:", error);
    return NextResponse.json(
      {
        valid: false,
      },
      { status: 500 }
    );
  }
}
