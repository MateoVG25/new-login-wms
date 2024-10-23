"use client";

import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { BookUserIcon } from "lucide-react";

interface Role {
  RolId: number;
  RolName: string;
  Description: string;
  AccessLevel: number;
  CreatedAt: Date;
  LastModification: Date;
  Active: boolean;
}

interface ApiResponse {
  message: string;
  roles: Role[];
}

export const RolSelect = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getRoles");

        if (!response.ok) {
          throw new Error("Error al obtener los roles");
        }

        const data: ApiResponse = await response.json();

        const filteredData = data.roles.filter((role) => role.RolId !== 1);

        setRoles(filteredData);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchRoles();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-2 border border-gray-200 rounded-md bg-gray-50">
        Cargando roles...
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

  if (roles.length === 0) {
    return (
      <div className="w-full p-2 border border-yellow-200 rounded-md bg-yellow-50 text-yellow-600">
        No hay roles disponibles
      </div>
    );
  }

  return (
    <Select
      id="rol"
      name="rol"
      label="Rol"
      labelPlacement="outside"
      placeholder="Seleccionar..."
      startContent={<BookUserIcon />}
    >
      {roles &&
        roles.map((role) => (
          <SelectItem key={role.RolId} value={role.RolId.toString()}>
            {role.RolName}
          </SelectItem>
        ))}
    </Select>
  );
};
