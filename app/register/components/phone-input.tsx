"use client";

import { useState } from "react";
import { PhoneInput } from "react-international-phone";
import { Phone } from "lucide-react";
import { Label } from "@/components/ui/label";

export const PhoneInputComponent = () => {
  const [phone, setPhone] = useState("");

  return (
    <div>
      <Label htmlFor="phone">Teléfono</Label>

      <div className="relative">
        <Phone
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-black"
          size={18}
        />
        <PhoneInput
          defaultCountry="co"
          value={phone}
          onChange={(phone) => setPhone(phone)}
          inputStyle={{
            width: "100%",
            height: "2.5rem",
            fontSize: "0.875rem",
            borderRadius: "0.375rem 0.357rem 0.357rem 0.375rem",
            border: "1px solid #D1D5DB",
            paddingLeft: "2.5rem",
          }}
          countrySelectorStyleProps={{
            buttonStyle: {
              display: "none",
            },
          }}
          inputProps={{
            placeholder: "Teléfono",
            name: "phone",
          }}
          className="focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
        />
      </div>
    </div>
  );
};
