"use client";

import { useEffect, useState } from "react";

interface UserInformation {
  UsuarioId: number;
  UsuarioNombre: string;
  UsuarioIdenticacion: string;
  UsuarioApellido: string;
  UsuarioUser: string;
  UsuarioActivo: boolean;
  Gender: string;
  IdentificationType: string;
  Phone: string;
  Birthdate: string;
}

export default function UserInformation() {
  const [userInformation, setUserInformation] = useState<UserInformation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserInformation = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/auth/user/profile");
        if (!response.ok) {
          throw new Error("Error al obtener la información del usuario");
        }

        const data = await response.json();

        // Ensure data is an array
        const userDataArray = Array.isArray(data) ? data : [data];

        setUserInformation(userDataArray);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchUserInformation();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-2 border border-gray-200 rounded-md bg-gray-50">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-2 border border-red-200 rounded-md bg-red-50 text-red-600">
        Error: {error}
      </div>
    );
  }

  if (userInformation.length === 0) {
    return (
      <div className="w-full p-2 border border-yellow-200 rounded-md bg-yellow-50 text-yellow-600">
        No hay información disponible
      </div>
    );
  }

  return (
    <div>
      {userInformation.map((user) => (
        <div key={user.UsuarioId}>
          Ingresaste con el usuario: {user.UsuarioUser}
        </div>
      ))}
    </div>
  );
}
