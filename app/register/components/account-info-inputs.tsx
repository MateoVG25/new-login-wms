"use client";

import { Input } from "@nextui-org/input";
import { MailIcon } from "lucide-react";
import { KeyRoundIcon } from "lucide-react";

export const AccountInfoInputs = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
      <div>
        <Input
          id="email"
          name="email"
          placeholder="wms@ejemplo.com"
          label="Email"
          labelPlacement="outside"
          type="email"
          startContent={<MailIcon />}
        />
      </div>
      <div>
        <Input
          id="password"
          name="password"
          type="password"
          label="Contraseña"
          labelPlacement="outside"
          placeholder="********"
          startContent={<KeyRoundIcon />}
        />
      </div>
    </div>
  );
};
