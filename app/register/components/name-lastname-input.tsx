"use client";

import { Input } from "@nextui-org/input";
import { IconUser } from "@/lib/icons";

export const NameLastnameInput = () => {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
      <div>
        <Input
          id="name"
          name="name"
          placeholder="pepe"
          label="Nombre"
          labelPlacement="outside"
          type="text"
          endContent={<IconUser />}
          minLength={2}
        />
      </div>
      <div>
        <Input
          id="lastname"
          name="lastname"
          placeholder="perez"
          label="Apellido"
          labelPlacement="outside"
          type="text"
          endContent={<IconUser />}
        />
      </div>
    </div>
  );
};
