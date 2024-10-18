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
import { motion } from "framer-motion";

// components
import { Warehouse } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-10 backdrop-filter p-8 rounded-2xl shadow-2xl w-full max-w-7xl relative overflow-hidden border border-opacity-15 m-4"
      >
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r"></div>
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 lg:pr-8">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center mb-8"
            >
              <Warehouse className="text-blue-500 w-16 h-16" />
            </motion.div>
            <h2 className="text-3xl font-bold text-center text-black mb-6">
              Unete a nuestro WMS
            </h2>
            <p className="text-black text-center mb-8">
              Agilice las operaciones de su almacén con nuestro vanguardista
              sistema de gestión.
            </p>
            <div className="bg-gradient-to-br from-blue-400 to-cyan-300 p-6 rounded-xl shadow-lg">
              <h3 className="text-xl font-semibold text-white mb-4">
                ¿Por qué elegirnos?
              </h3>
              <ul className="text-blue-50 space-y-2">
                <li>✓ Seguimiento del inventario en tiempo real</li>
                <li>✓ Picking y packing optimizados</li>
                <li>✓ Análisis e informes avanzados</li>
                <li>✓ Integración perfecta con sus sistemas actuales</li>
                <li>✓ Integración sencilla con sistemas existentes</li>
              </ul>
            </div>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0">
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
                      <p className="text-sm text-red-500">
                        {state.errors.name}
                      </p>
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
                      <p className="text-sm text-red-500">
                        {state.errors.lastname}
                      </p>
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
                      <p className="text-sm text-red-500">
                        {state.errors.email}
                      </p>
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
                      <p className="text-sm text-red-500">
                        {state.errors.phone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label>Fecha de Nacimiento</label>
                    <div
                      className="grid grid-cols-3 gap-4"
                      id="birthdate-container"
                    >
                      <div>
                        <Select
                          id="day"
                          name="day"
                          placeholder="Día"
                          aria-label="day"
                        >
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
                          <p className="text-sm text-red-500">
                            {state.errors.day}
                          </p>
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
                            <SelectItem
                              key={m.key}
                              value={m.key}
                              textValue={m.key}
                            >
                              {m.label}
                            </SelectItem>
                          ))}
                        </Select>
                        {state?.errors?.month && (
                          <p className="text-sm text-red-500">
                            {state.errors.month}
                          </p>
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
                          <p className="text-sm text-red-500">
                            {state.errors.year}
                          </p>
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
                    <p className="text-sm text-red-500">
                      {state.errors.gender}
                    </p>
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
                    <p className="text-sm text-red-500">
                      {state.errors.userIdentity}
                    </p>
                  )}
                </div>
                <div
                  id="operation-center-container"
                  className="grid grid-cols-2 gap-2"
                >
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
            <p className="mt-6 text-center text-sm text-black">
              Ya tienes una cuenta?{" "}
              <a
                href="/login"
                className="text-blue-500 hover:underline font-medium"
              >
                Inicia sesión
              </a>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
