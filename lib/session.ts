import "server-only";

import { SignJWT, jwtVerify } from "jose";
import dotenv from "dotenv";
import { connectToDatabase } from "../db/connection";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";

import type { SessionPayload } from "@/types/session-payload";

dotenv.config();

const key = new TextEncoder().encode(process.env.SECRET);

const cookie = {
  name: "session",
  options: {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
  },
  duration: 4 * 60 * 60 * 1000, // 4 horas en milisegundos
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(cookie.duration)
    .sign(key);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (error) {
    console.log("Error al desencriptar la sesion: ", error);
    return null;
  }
}

export async function createSession(id: number) {
  const db = await connectToDatabase();

  if (!db) {
    throw new Error("Error al conectar con la base de datos");
  }

  const expiresAt = null;
  const UsuarioSesionGUID = null;

  try {
    const createSession = await db
      .request()
      .input("userId", id)
      .input("expiresAt", expiresAt)
      .input("UsuarioSesionGUID", UsuarioSesionGUID)
      .query(
        `INSERT INTO ${process.env.SESSION_TABLE} (userId, expiresAt, UsuarioSesionGUID) OUTPUT INSERTED.id VALUES (@userId, @expiresAt, @UsuarioSesionGUID)`
      );
    console.log("Sesion creada con exito: ", createSession.recordset[0]);
    // me lleva a la pagina de inicio
    redirect("/home");
  } catch (error) {
    console.error("Error al crear la sesion: ", error);
  }
}

export async function getSession(sessionId: string) {
  const db = await connectToDatabase();
  if (!db) {
    throw new Error("Error al conectar con la base de datos");
  }

  try {
    const session = await db
      .request()
      .input("sessionId", sessionId)
      .query(
        `SELECT * FROM ${process.env.SESSION_TABLE} WHERE id = @sessionId`
      );
    if (session.recordset.length > 0) {
      console.log("Sesion encontrada: ", session.recordset[0]);
      return session.recordset[0];
    }
  } catch (error) {
    console.error("Error al obtener la sesion: ", error);
  }
}

export async function updateSession(sessionId: string) {
  const db = await connectToDatabase();
  if (!db) {
    throw new Error("Error al conectar con la base de datos");
  }

  const expiresAt = new Date(Date.now() + cookie.duration);
  const UsuarioSesionGUID = uuidv4();

  try {
    const updateSession = await db
      .request()
      .input("sessionId", sessionId)
      .input("expiresAt", expiresAt)
      .input("UsuarioSessionGUID", UsuarioSesionGUID)
      .query(
        `UPDATE ${process.env.SESSION_TABLE} SET expiresAt = @expiresAt, UsuarioSessionGUID = @UsuarioSessionGUID WHERE id = @sessionId`
      );

    console.log("Sesion actualizada con exito: ");
    return { updatedSession: updateSession.recordset[0] };
  } catch (error) {
    console.error("Error al actualizar la sesion: ", error);
  }
}

export async function logout(sessionId: string) {
  const db = await connectToDatabase();

  if (!db) {
    throw new Error("Error al conectar con la base de datos");
  }

  try {
    const logoutSession = await db
      .request()
      .input("sessionId", sessionId)
      .input("expiresAt", null)
      .input("UsuarioSesionGUID", null)
      .query(
        `UPDATE ${process.env.SESSION_TABLE} SET expiresAt = @expiresAt, UsuarioSesionGUID = @UsuarioSesionGUID WHERE id = @sessionId`
      );

    console.log("Sesion cerrada con exito: ", logoutSession.recordset[0]);
    redirect("/login");
  } catch (error) {
    console.error("Error al cerrar la sesion: ", error);
  }
}
