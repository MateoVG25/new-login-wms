"use client";

import { useEffect, useState } from "react";
import { Select, SelectItem } from "@nextui-org/select";

interface OperationPoint {
  PuntoOperacionId: number;
  PuntoOperacionCodigo: string;
  PuntoOperacionNombre: string;
  CentroOperacionId: number;
  PuntoOperacionDireccion: string;
  PuntoOperacionCiudadId: number;
}

interface ApiResponse {
  message: string;
  data: OperationPoint[];
}

export default function SelectOperationPoint() {
  const [operationPoint, setOperationPoint] = useState<OperationPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOperationPoints = async () => {
      try {
        setLoading(true);

        const response = await fetch("/api/getOperationPoint");
        if (!response.ok) {
          throw new Error("Error al obtener los puntos de operación");
        }

        const data: ApiResponse = await response.json();

        setOperationPoint(data.data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };
    fetchOperationPoints();
  }, []);

  if (loading) {
    return (
      <div className="w-full p-2 border border-gray-200 rounded-md bg-gray-50">
        Cargando puntos de operación...
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

  if (operationPoint.length === 0) {
    return (
      <div className="w-full p-2 border border-yellow-200 rounded-md bg-yellow-50 text-yellow-600">
        No hay puntos de operación disponibles
      </div>
    );
  }

  return (
    <Select
      id="operationPoint"
      name="operationPoint"
      placeholder="Seleccionar..."
      label="Punto de operación"
      labelPlacement="outside"
      aria-label="Punto de operación"
    >
      {operationPoint.map((point) => (
        <SelectItem key={point.PuntoOperacionId} value={point.PuntoOperacionId}>
          {point.PuntoOperacionNombre}
        </SelectItem>
      ))}
    </Select>
  );
}
