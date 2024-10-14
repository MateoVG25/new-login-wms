import { jwtVerify } from "jose";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/db/connection";

interface SessionPayload {
  userId: number;
  sessionId: number;
  sessionGuid: string;
}

interface SessionInfo {
  userId: number;
  sessionId: number;
  isValid: boolean;
}

export async function verifySession(): Promise<SessionInfo | null> {
  try {
    // 1. Obtener la cookie de sesión
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get("session");

    if (!sessionCookie?.value) {
      return null;
    }

    // 2. Verificar y decodificar el JWT
    const key = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = (await jwtVerify(sessionCookie.value, key)) as {
      payload: SessionPayload;
    };

    if (!payload.userId || !payload.sessionId || !payload.sessionGuid) {
      return null;
    }

    // 3. Conectar a la base de datos
    const db = await connectToDatabase();
    if (!db) {
      throw new Error("No se pudo conectar a la base de datos");
    }

    const result = await db
      .request()
      .input("userId", payload.userId)
      .input("sessionId", payload.sessionId)
      .input("sessionGuid", payload.sessionGuid).query(`
        SELECT id, userId, UsuarioSesionGUID, expiresAt
        FROM ${process.env.SESSION_TABLE}
        WHERE userId = @userId 
        AND id = @sessionId 
        AND UsuarioSesionGUID = @sessionGuid
        AND expiresAt > GETDATE()
      `);

    // 5. Verificar si la sesión existe y es válida
    if (result.recordset.length === 0) {
      return {
        userId: payload.userId,
        sessionId: payload.sessionId,
        isValid: false,
      };
    }

    // 6. Devolver la información de la sesión validada
    return {
      userId: payload.userId,
      sessionId: payload.sessionId,
      isValid: true,
    };
  } catch (error) {
    console.error("Error verificando sesión:", error);
    return null;
  }
}

// Middleware helper para rutas API que requieren autenticación
// export async function requireSession(
//   handler: (request: Request) => Promise<Response>
// ) {
//   return async (request: Request) => {
//     const session = await verifySession();

//     if (!session || !session.isValid) {
//       return new Response(JSON.stringify({ error: "No autorizado" }), {
//         status: 401,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       });
//     }

//     // Añadir la información de la sesión al request
//     const authenticatedRequest = new Request(request, {
//       headers: new Headers({
//         ...Object.fromEntries(request.headers),
//         "x-user-id": session.userId.toString(),
//         "x-session-id": session.sessionId.toString(),
//       }),
//     });

//     return handler(authenticatedRequest);
//   };
// }

// Helper para obtener el userId de una solicitud autenticada
// export function getAuthenticatedUserId(request: Request): number | null {
//   const userId = request.headers.get("x-user-id");
//   return userId ? parseInt(userId, 10) : null;
// }

// export async function getSessionUser() {
//   try {
//     const session = await verifySession();

//     if (!session?.isValid) {
//       return null;
//     }

//     const db = await connectToDatabase();
//     if (!db) {
//       throw new Error("No se pudo conectar a la base de datos");
//     }

//     // Obtener información del usuario
//     const result = await db.request().input("userId", session.userId).query(`
//         SELECT UsuarioId, UsuarioNombre, UsuarioUser
//         FROM ${process.env.USER_TABLE}
//         WHERE UsuarioId = @userId
//       `);

//     if (result.recordset.length === 0) {
//       return null;
//     }

//     return result.recordset[0];
//   } catch (error) {
//     console.error("Error obteniendo sesion de usuario:", error);
//     return null;
//   }
// }
