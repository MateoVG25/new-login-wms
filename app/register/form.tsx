"use client";

import { useFormState } from "react-dom";
import { Input } from "@nextui-org/input";
import { IconEmailOutline, IconUser, UserIdentityIcon } from "@/lib/icons";
import { Select, SelectItem } from "@nextui-org/select";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import es from "react-phone-input-2/lang/es.json";
import { useState, useMemo } from "react";
import { genderValues, identificationTypeValues, months } from "./data";

// components
import SelectOperationPoint from "./components/select-operation-point";
import SelectOperationCenter from "./components/select-operation-center";
import { RegisterButton } from "./components/register-button";

import { signup } from "./actions";

const initialState = {
  errors: {},
  message: "",
};

export default function SignupForm() {
  const [state, action] = useFormState(signup, initialState);
  const [phone, setPhone] = useState("");

  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - i);
  }, []);

  return (
    <form action={action} className="space-y-4">
      <div className="flex flex-col gap-2">
        <div
          id="name-lastname-container"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2"
        >
          <div id="name-container">
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
            {state?.errors?.name && (
              <p className="text-sm text-red-500">{state.errors.name}</p>
            )}
          </div>
          <div id="lastname-container">
            <Input
              id="lastname"
              name="lastname"
              placeholder="perez"
              label="Apellido"
              labelPlacement="outside"
              type="text"
              endContent={<IconUser />}
            />
            {state?.errors?.lastname && (
              <p className="text-sm text-red-500">{state.errors.lastname}</p>
            )}
          </div>
        </div>
        <div
          id="email-password-container"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2"
        >
          <div id="email-container">
            <Input
              id="email"
              name="email"
              placeholder="wms@ejemplo.com"
              label="Email"
              labelPlacement="outside"
              type="email"
              endContent={<IconEmailOutline />}
            />
            {state?.errors?.email && (
              <p className="text-sm text-red-500">{state.errors.email}</p>
            )}
          </div>
          <div id="password-container">
            <Input
              id="password"
              name="password"
              type="password"
              label="Contraseña"
              labelPlacement="outside"
              placeholder="********"
            />
            {state?.errors?.password && (
              <div className="text-sm text-red-500">
                <p>La contraseña debe de:</p>
                <ul>
                  {state.errors.password.map((error: string) => (
                    <li key={error}>- {error}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        <div
          id="phone-birthdate-container"
          className="grid grid-cols-1 gap-4 lg:grid-cols-2"
        >
          <div id="phone-container">
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
            {state?.errors?.phone && (
              <p className="text-sm text-red-500">{state.errors.phone}</p>
            )}
          </div>
          <div>
            <label>Fecha de Nacimiento</label>
            <div className="grid grid-cols-3 gap-4" id="birthdate-container">
              <div>
                <Select id="day" name="day" placeholder="Día" aria-label="day">
                  {days.map((d) => (
                    <SelectItem
                      key={d}
                      value={d.toString()}
                      textValue={d.toString()}
                    >
                      {d}
                    </SelectItem>
                  ))}
                </Select>
                {state?.errors?.day && (
                  <p className="text-sm text-red-500">{state.errors.day}</p>
                )}
              </div>
              <div>
                <Select
                  id="month"
                  name="month"
                  placeholder="Mes"
                  aria-label="month"
                >
                  {months.map((m) => (
                    <SelectItem key={m.key} value={m.key} textValue={m.key}>
                      {m.label}
                    </SelectItem>
                  ))}
                </Select>
                {state?.errors?.month && (
                  <p className="text-sm text-red-500">{state.errors.month}</p>
                )}
              </div>
              <div>
                <Select
                  id="year"
                  name="year"
                  placeholder="Año"
                  aria-label="year"
                >
                  {years.map((y) => (
                    <SelectItem
                      key={y}
                      value={y.toString()}
                      textValue={y.toString()}
                    >
                      {y}
                    </SelectItem>
                  ))}
                </Select>
                {state?.errors?.year && (
                  <p className="text-sm text-red-500">{state.errors.year}</p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div id="gender-container">
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
          {state?.errors?.gender && (
            <p className="text-sm text-red-500">{state.errors.gender}</p>
          )}
        </div>
        <div id="userIdentityType-container">
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
          {state?.errors?.userIdentityType && (
            <p className="text-sm text-red-500">
              {state.errors.userIdentityType}
            </p>
          )}
        </div>
        <div id="userIdentity-container">
          <Input
            id="userIdentity"
            name="userIdentity"
            placeholder="12345678"
            label="Identificación"
            labelPlacement="outside"
            endContent={<UserIdentityIcon />}
          />
          {state?.errors?.userIdentity && (
            <p className="text-sm text-red-500">{state.errors.userIdentity}</p>
          )}
        </div>
        <div id="operation-center-container" className="grid grid-cols-2 gap-2">
          <div>
            <SelectOperationCenter />
            {state?.errors?.operationCenter && (
              <p className="text-sm text-red-500">
                {state.errors.operationCenter}
              </p>
            )}
          </div>
          <div>
            <SelectOperationPoint />
            {state?.errors?.operationPoint && (
              <p className="text-sm text-red-500">
                {state.errors.operationPoint}
              </p>
            )}
          </div>
        </div>
        <RegisterButton />
      </div>
    </form>
  );
}
