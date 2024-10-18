import { NextResponse } from "next/server";
import { connectToDatabase } from "@/db/connection";
import { hash } from "bcrypt";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";

dotenv.config();

// ordenanteId
async function getSenderId() {
  const apiUrl = "http://localhost:3000/api/getSender";

  const response = await fetch(`${apiUrl}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el ordenante: " + response.statusText);
  }

  const data = await response.json();

  if (!data.ordenantes || data.ordenantes.length === 0) {
    throw new Error("No se encontraron ordenantes");
  }
  return data.ordenantes[0].OrdenanteId;
}

async function getCustodyId() {
  const apiUrl = "http://localhost:3000/api/getCustody";

  const response = await fetch(`${apiUrl}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el custodio: " + response.statusText);
  }

  const data = await response.json();

  if (!data.custodios || data.custodios.length === 0) {
    throw new Error("No se encontraron custodios");
  }
  return data.custodios[0].CustodioId;
}

async function getTitularId() {
  const apiUrl = "http://localhost:3000/api/getTitular";

  const response = await fetch(`${apiUrl}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el titular: " + response.statusText);
  }

  const data = await response.json();

  if (!data.titulares || data.titulares.length === 0) {
    throw new Error("No se encontraron titulares");
  }
  return data.titulares[0].TitularId;
}

export async function POST(request: Request) {
  try {
    const {
      name,
      lastname,
      email,
      password,
      phone,
      day,
      month,
      year,
      gender,
      userIdentityType,
      userIdentity,
      operationCenter,
      operationPoint,
    } = await request.json();

    const db = await connectToDatabase();

    if (!db) {
      return NextResponse.json(
        {
          error: "Error al conectar con la base de datos",
        },
        { status: 500 }
      );
    }

    const transaction = db.transaction();
    await transaction.begin();

    try {
      const existingUser = await transaction.request().input("email", email)
        .query(`
          SELECT UsuarioId FROM ${process.env.USER_TABLE} WHERE UsuarioUser = @email
        `);

      if (existingUser.recordset.length > 0) {
        await transaction.rollback();
        return NextResponse.json(
          {
            error: "Este email ya está registrado. Por favor intente con otro",
          },
          { status: 400 }
        );
      }

      const hashedPassword = await hash(password, 10);

      const SesionGUID = uuidv4();

      const userResult = await transaction
        .request()
        .input("UsuarioNombre", name)
        .input("UsuarioIdentificacion", userIdentity)
        .input("UsuarioApellido", lastname)
        .input("UsuarioGUID", SesionGUID)
        .input("UsuarioTerminal", "N")
        .input("UsuarioUltPO", 0)
        .input("UsuarioUser", email)
        .input("UsuarioActivo", 1)
        .input("IMPImpresoraExternaId", null)
        .input("password", hashedPassword)
        .input("Gender", gender)
        .input("IdentificationType", userIdentityType)
        .input("Phone", phone)
        .input("BirthDate", `${day}-${month}-${year}`).query(`
          INSERT INTO ${process.env.USER_TABLE} (UsuarioNombre, UsuarioIdentificacion, UsuarioApellido, UsuarioGUID, UsuarioTerminal, UsuarioUltPO, UsuarioUser, UsuarioActivo, IMPImpresoraExternaId, password, Gender, IdentificationType, Phone, BirthDate)
          OUTPUT INSERTED.UsuarioId, INSERTED.UsuarioUser, INSERTED.UsuarioGUID
          VALUES (@UsuarioNombre, @UsuarioIdentificacion, @UsuarioApellido, @UsuarioGUID, @UsuarioTerminal, @UsuarioUltPO, @UsuarioUser, @UsuarioActivo, @IMPImpresoraExternaId, @password, @Gender, @IdentificationType, @Phone, @BirthDate)
        `);

      const UserId = userResult.recordset[0].UsuarioId;
      const UserSesionUser = userResult.recordset[0].UsuarioUser;
      const UserGUID = userResult.recordset[0].UsuarioGUID;

      const ordenanteId = await getSenderId();
      const custodioId = await getCustodyId();
      const titularId = await getTitularId();

      const UsuarioSesionGUID = null;
      const UsuarioSesionIP = null;

      const sessionResult = await transaction
        .request()
        .input("UsuarioSesionUsuarioId", UserId)
        .input("UsuarioSesionUser", UserSesionUser)
        .input("UsuarioSesionOrdenanteId", ordenanteId)
        .input("UsuarioSesionTitularId", titularId)
        .input("UsuarioSesionCustodioId", custodioId)
        .input("UsuarioSesionCentroOperacionId", operationCenter)
        .input("UsuarioSesionPuntoOperacionId", operationPoint)
        .input("UsuarioSesionGUID", UsuarioSesionGUID)
        .input("UsuarioSesionIP", UsuarioSesionIP).query(`
          INSERT INTO ${process.env.SESSION_TABLE} (UsuarioSesionUsuarioId,
          UsuarioSesionUser, UsuarioSesionOrdenanteId, UsuarioSesionTitularId,
          UsuarioSesionCustodioId, UsuarioSesionCentroOperacionId, UsuarioSesionPuntoOperacionId, UsuarioSesionGUID, UsuarioSesionIP) OUTPUT INSERTED.UsuarioSesionId
          VALUES (@UsuarioSesionUsuarioId, @UsuarioSesionUser, @UsuarioSesionOrdenanteId, @UsuarioSesionTitularId, @UsuarioSesionCustodioId, @UsuarioSesionCentroOperacionId, @UsuarioSesionPuntoOperacionId, @UsuarioSesionGUID, @UsuarioSesionIP)
        `);

      const SessionId = sessionResult.recordset[0].UsuarioSesionId;
      const CreatedAt = null;
      const ExpiresAt = null;
      const IsActive = 0;
      const LastActivityAt = null;

      // sesion info
      await transaction
        .request()
        .input("UsuarioSesionId", SessionId)
        .input("SesionGUID", UsuarioSesionGUID)
        .input("UsuarioId", UserId)
        .input("UsuarioGUID", UserGUID)
        .input("CreatedAt", CreatedAt)
        .input("ExpiresAt", ExpiresAt)
        .input("IsActive", IsActive)
        .input("LastActivityAt", LastActivityAt)
        .query(
          `INSERT INTO ${process.env.SESION_INFO_TABLE} (UsuarioSesionId, SesionGUID, UsuarioId, UsuarioGUID, CreatedAt, ExpiresAt, IsActive, LastActivityAt) VALUES (@UsuarioSesionId, @SesionGUID, @UsuarioId, @UsuarioGUID, @CreatedAt, @ExpiresAt, @IsActive, @LastActivityAt)`
        );

      await transaction.commit();

      return NextResponse.json({
        success: true,
        message: "Usuario registrado exitosamente",
      });
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      {
        error: "Error al registrar usuario",
      },
      { status: 500 }
    );
  }
}
