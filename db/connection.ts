import sql from "mssql";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  server: process.env.DB_SERVER as string,
  database: process.env.DB_NAME as string,
  options: {
    encrypt: process.env.ENCRYPT === "true",
    trustServerCertificate: process.env.TRUST_SERVER_CERTIFICATE === "true",
  },
};

export const connectToDatabase = async () => {
  try {
    const pool = await sql.connect(dbConfig);
    return pool;
  } catch (error) {
    console.log(
      "Se tiene el siguiente error al intentar conectarse con la base de datos: ",
      error
    );
  }
};
