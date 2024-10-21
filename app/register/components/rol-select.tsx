"use client";

import { Select, SelectItem } from "@nextui-org/select";

export const RolSelect = () => {
  return (
    <Select
      id="rol"
      name="rol"
      label="Rol"
      labelPlacement="outside"
      placeholder="Seleccionar..."
    >
      <SelectItem key={"admin"} value="admin">Administrador</SelectItem>
    </Select>
  );
};
