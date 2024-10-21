"use client";

import { Select, SelectItem } from "@nextui-org/select";
import { genderValues } from "@/app/register/data";

export const GenderSelect = () => {
  return (
    <Select
      id="gender"
      name="gender"
      label="Género"
      labelPlacement="outside"
      placeholder="Seleccionar..."
    >
      {genderValues.map((gender) => (
        <SelectItem value={gender.key} key={gender.key}>
          {gender.label}
        </SelectItem>
      ))}
    </Select>
  );
};