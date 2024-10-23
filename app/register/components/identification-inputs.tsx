"use client";

import { Select, SelectItem } from "@nextui-org/select";
import { Input } from "@nextui-org/input";
import { identificationTypeValues } from "@/app/register/data";
import { FingerprintIcon } from "lucide-react";
import { IdCardIcon } from "lucide-react";


export const IdentificationInputs = () => {
  return (
    <>
      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
        <Select
          id="userIdentityType"
          name="userIdentityType"
          label="Tipo de identificación"
          labelPlacement="outside"
          placeholder="Seleccionar..."
          startContent={<FingerprintIcon />}
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
          startContent={<IdCardIcon />}
        />
      </div>
    </>
  );
};
