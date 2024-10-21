"use client";

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import es from "react-phone-input-2/lang/es.json";

export const PhoneInputComponent=()=> {
  const [phone, setPhone] = useState("");

  return (
    <div>
      <label htmlFor="phone" className="text-gray">
        Teléfono
      </label>
      <PhoneInput
        country={"co"}
        localization={es}
        regions={["america"]}
        value={phone}
        onChange={setPhone}
        defaultErrorMessage="Por favor ingresa tu número de teléfono"
        containerStyle={{ width: "100%" }}
        inputStyle={{ width: "100%" }}
        dropdownStyle={{ animation: "ease-in-out" }}
        inputProps={{
          name: "phone",
          required: true,
          autoFocus: false,
        }}
      />
    </div>
  );
};
