"use client";

import { useFormState } from "react-dom";
import { useEffect, ReactNode } from "react";
import { motion } from "framer-motion";

// components
import { Warehouse } from "lucide-react";
import { Toaster, toast } from "sonner";
import { useRouter } from "next/navigation";

// Components
import { NameLastnameInput } from "./components/name-lastname-input";
import { AccountInfoInputs } from "./components/account-info-inputs";
import { PhoneInputComponent } from "./components/phone-input";
import { BirthdateInputs } from "./components/birthdate-inputs";
import { GenderSelect } from "./components/gender-select";
import { IdentificationInputs } from "./components/identification-inputs";
import { SelectOperationPoint } from "./components/select-operation-point";
import { SelectOperationCenter } from "./components/select-operation-center";
import { RegisterButton } from "./components/register-button";

import { signup } from "./actions";
import { RolSelect } from "./components/rol-select";

const initialState = {
  errors: {},
  message: "",
};

export default function SignupForm() {
  const router = useRouter();
  const [state, action] = useFormState(signup, initialState);

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/login");
    } else if (state.message) {
      toast.error(state.message);
    }

    if (state.errors && typeof state.errors === "object") {
      const priorityFields = [
        "name",
        "lastname",
        "email",
        "password",
        "phone",
        "day",
        "month",
        "year",
        "gender",
        "userIdentityType",
        "userIdentity",
        "operationCenter",
        "operationPoint",
      ];
      const firstPriorityError = priorityFields.find(
        (field) => state.errors[field]
      );

      if (firstPriorityError) {
        toast.error(state.errors[firstPriorityError]);
      } else {
        const firstError = Object.values(state.errors).find((error) => error);
        if (firstError) {
          toast.error(firstError as ReactNode);
        }
      }
    }
  }, [state, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br">
      <Toaster duration={5000} richColors position="top-center" expand={true} />
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
                <li>✓ Integración sencilla con tus sistemas existentes</li>
              </ul>
            </div>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <form action={action} className="space-y-4">
              <div className="flex flex-col gap-2">
                <NameLastnameInput />
                <AccountInfoInputs />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <PhoneInputComponent />
                  <BirthdateInputs />
                </div>
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                  <GenderSelect />
                  <RolSelect />
                </div>
                <IdentificationInputs />
                <div className="grid grid-cols-2 gap-2">
                  <SelectOperationCenter />
                  <SelectOperationPoint />
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
