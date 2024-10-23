"use client";

import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { MapPinHouse } from "lucide-react";

interface OperationCenter {
  CentroOperacionId: number;
  CentroOperacionCodigo: string;
  CentroOperacionNombre: string;
  CustodioId: number;
  CentroOperacionDireccion: string;
  CentroOperacionCiudadId: number;
}

interface ApiResponse {
  message: string;
  data: OperationCenter[];
}

export const SelectOperationCenter = () => {
  const [operationCenter, setOperationCenter] = useState<OperationCenter[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOperationCenters = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/getOperationCenter");

        if (!response.ok) {
          throw new Error("Error al obtener los centros de operación");
        }

        const data: ApiResponse = await response.json();

        setOperationCenter(data.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchOperationCenters();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-2 border border-gray-200 rounded-md bg-gray-50">
        Cargando centros de operación...
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

  if (operationCenter.length === 0) {
    return (
      <div className="w-full p-2 border border-yellow-200 rounded-md bg-yellow-50 text-yellow-600">
        No hay centros de operación disponibles
      </div>
    );
  }

  return (
    <Select
      id="operationCenter"
      name="operationCenter"
      placeholder="Seleccionar..."
      label="Centro de operación"
      labelPlacement="outside"
      aria-label="Centro de operación"
      startContent={<MapPinHouse />}
    >
      {operationCenter.map((center) => (
        <SelectItem
          key={center.CentroOperacionId}
          value={center.CentroOperacionId}
        >
          {center.CentroOperacionNombre}
        </SelectItem>
      ))}
    </Select>
  );
};
