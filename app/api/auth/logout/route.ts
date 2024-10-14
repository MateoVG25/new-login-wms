import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import { verifySession } from "../session-verification";

export async function POST() {
  try {
    const session = await verifySession();

    if (session?.userId) {
      const db = await connectToDatabase();

      if (!db) {
        throw new Error("No se pudo conectar a la base de datos");
      }

      await db.request().input("userId", session.userId).query(`
          UPDATE ${process.env.SESSION_TABLE}
          SET UsuarioSesionGUID = NULL,
              expiresAt = NULL
          WHERE userId = @userId
        `);
    }

    const response = NextResponse.json({
      success: true,
      message: "Sesión cerrada correctamente",
    });

    response.cookies.delete("session");

    return response;
  } catch (error) {
    console.error("Error en logout:", error);
    return NextResponse.json(
      { error: "Error al cerrar sesión" },
      { status: 500 }
    );
  }
}
