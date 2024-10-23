import { v4 as uuidv4 } from "uuid";
import { Transaction } from "mssql";

interface UserData {
  name: string;
  lastname: string;
  email: string;
  password: string;
  phone: string;
  day: string;
  month: string;
  year: string;
  gender: string;
  userIdentityType: string;
  userIdentity: string;
  operationCenter: number;
  operationPoint: number;
  rol: string;
}

interface UserResult {
  UsuarioId: number;
  UsuarioUser: string;
  UsuarioGUID: string;
}

interface SessionResult {
  UsuarioSesionId: number;
}

export async function insertUser(
  transaction: Transaction,
  userData: UserData,
  hashedPassword: string
): Promise<UserResult> {
  const SesionGUID = uuidv4();

  const userResult = await transaction
    .request()
    .input("UsuarioNombre", userData.name)
    .input("UsuarioIdentificacion", userData.userIdentity)
    .input("UsuarioApellido", userData.lastname)
    .input("UsuarioGUID", SesionGUID)
    .input("UsuarioTerminal", "N")
    .input("UsuarioUltPO", 0)
    .input("UsuarioUser", userData.email)
    .input("UsuarioActivo", 0)
    .input("IMPImpresoraExternaId", null)
    .input("password", hashedPassword)
    .input("Gender", userData.gender)
    .input("RolId", userData.rol)
    .input("IdentificationType", userData.userIdentityType)
    .input("Phone", userData.phone)
    .input("BirthDate", `${userData.day}-${userData.month}-${userData.year}`)
    .query(`
      INSERT INTO ${process.env.USER_TABLE} (UsuarioNombre, UsuarioIdentificacion, UsuarioApellido, UsuarioGUID, UsuarioTerminal, UsuarioUltPO, UsuarioUser, UsuarioActivo, IMPImpresoraExternaId, password, Gender, IdentificationType, Phone, BirthDate, RolId)
      OUTPUT INSERTED.UsuarioId, INSERTED.UsuarioUser, INSERTED.UsuarioGUID
      VALUES (@UsuarioNombre, @UsuarioIdentificacion, @UsuarioApellido, @UsuarioGUID, @UsuarioTerminal, @UsuarioUltPO, @UsuarioUser, @UsuarioActivo, @IMPImpresoraExternaId, @password, @Gender, @IdentificationType, @Phone, @BirthDate, @RolId)
    `);

  return userResult.recordset[0];
}

export async function insertSession(
  transaction: Transaction,
  userResult: UserResult,
  ordenanteId: number,
  custodioId: number,
  titularId: number,
  userData: UserData
): Promise<SessionResult> {
  const UsuarioSesionGUID = null;
  const UsuarioSesionIP = null;

  const sessionResult = await transaction
    .request()
    .input("UsuarioSesionUsuarioId", userResult.UsuarioId)
    .input("UsuarioSesionUser", userResult.UsuarioUser)
    .input("UsuarioSesionOrdenanteId", ordenanteId)
    .input("UsuarioSesionTitularId", titularId)
    .input("UsuarioSesionCustodioId", custodioId)
    .input("UsuarioSesionCentroOperacionId", userData.operationCenter)
    .input("UsuarioSesionPuntoOperacionId", userData.operationPoint)
    .input("UsuarioSesionGUID", UsuarioSesionGUID)
    .input("UsuarioSesionIP", UsuarioSesionIP)
    .input("RolId", userData.rol).query(`
      INSERT INTO ${process.env.SESSION_TABLE} (UsuarioSesionUsuarioId,
      UsuarioSesionUser, UsuarioSesionOrdenanteId, UsuarioSesionTitularId,
        UsuarioSesionCustodioId, UsuarioSesionCentroOperacionId,
        UsuarioSesionPuntoOperacionId, UsuarioSesionGUID, UsuarioSesionIP,
        RolId) OUTPUT INSERTED.UsuarioSesionId
      VALUES (@UsuarioSesionUsuarioId, @UsuarioSesionUser, @UsuarioSesionOrdenanteId, @UsuarioSesionTitularId, @UsuarioSesionCustodioId, @UsuarioSesionCentroOperacionId, @UsuarioSesionPuntoOperacionId, @UsuarioSesionGUID, @UsuarioSesionIP, @RolId)
    `);

  return sessionResult.recordset[0];
}

export async function insertSessionInfo(
  transaction: Transaction,
  sessionResult: SessionResult,
  userResult: UserResult
): Promise<void> {
  const CreatedAt = null;
  const ExpiresAt = null;
  const IsActive = 0;
  const LastActivityAt = null;

  await transaction
    .request()
    .input("UsuarioSesionId", sessionResult.UsuarioSesionId)
    .input("SesionGUID", null)
    .input("UsuarioId", userResult.UsuarioId)
    .input("UsuarioGUID", userResult.UsuarioGUID)
    .input("CreatedAt", CreatedAt)
    .input("ExpiresAt", ExpiresAt)
    .input("IsActive", IsActive)
    .input("LastActivityAt", LastActivityAt)
    .query(
      `INSERT INTO ${process.env.SESION_INFO_TABLE} (UsuarioSesionId, SesionGUID, UsuarioId, UsuarioGUID, CreatedAt, ExpiresAt, IsActive, LastActivityAt) VALUES (@UsuarioSesionId, @SesionGUID, @UsuarioId, @UsuarioGUID, @CreatedAt, @ExpiresAt, @IsActive, @LastActivityAt)`
    );
}
