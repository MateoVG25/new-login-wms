import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const session = request.cookies.get("session");

    if (!session?.value) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Aquí deberías validar el token y obtener la información del usuario
    // Este es un ejemplo, ajústalo según tu lógica de autenticación
    const userData = {
      name: "Usuario",
      email: "usuario@ejemplo.com",
      // más datos del usuario...
    };

    return NextResponse.json(userData);
  } catch (error) {
    console.error("Error en la ruta de perfil de usuario: ", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
