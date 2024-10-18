import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import { verifySession } from "../session-verification";

export async function POST() {
  try {
    const session = await verifySession();

    const SessionUserId = session?.userId;

    if (SessionUserId) {
      const db = await connectToDatabase();

      if (!db) {
        throw new Error("No se pudo conectar a la base de datos");
      }

      await db.request().input("UsuarioSesionUsuarioId", SessionUserId).query(`
          UPDATE ${process.env.SESSION_TABLE}
          SET UsuarioSesionGUID = NULL WHERE UsuarioSesionUsuarioId = @UsuarioSesionUsuarioId
        `);

      const LastActivityAt = new Date();

      const SesionGUID = null;
      const ExpiresAt = null;
      const IsActive = 0;

      await db
        .request()
        .input("UsuarioId", SessionUserId)
        .input("UsuarioSesionId", session.userId)
        .input("LastActivityAt", LastActivityAt)
        .input("SesionGUID", SesionGUID)
        .input("ExpiresAt", ExpiresAt)
        .input("IsActive", IsActive)
        .query(`UPDATE ${process.env.SESION_INFO_TABLE}
        SET SesionGUID = @SesionGUID, ExpiresAt = @ExpiresAt, IsActive = @IsActive, LastActivityAt = @LastActivityAt WHERE UsuarioId = @UsuarioId`);
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
