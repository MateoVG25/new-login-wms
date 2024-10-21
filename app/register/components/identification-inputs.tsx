"use client";

import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import { UserIdentityIcon } from "@/lib/icons";
import { identificationTypeValues } from "@/app/register/data";

export const IdentificationInputs = () => {
  return (
    <>
      <Select
        id="userIdentityType"
        name="userIdentityType"
        label="Tipo de identificación"
        labelPlacement="outside"
        placeholder="Seleccionar..."
      >
        {identificationTypeValues.map((identificationType) => (
          <SelectItem
            value={identificationType.value}
            key={identificationType.value}
          >
            {identificationType.label}
          </SelectItem>
        ))}
      </Select>
      <Input
        id="userIdentity"
        name="userIdentity"
        placeholder="12345678"
        label="Identificación"
        labelPlacement="outside"
        endContent={<UserIdentityIcon />}
      />
    </>
  );
};
