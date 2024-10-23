"use client";

import { GoMainPageButton } from "./components/go-main-page-button";
import { useFormState } from "react-dom";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { login } from "./actions";
import { LoginButton } from "./components/login-button";
import { motion } from "framer-motion";
import { Warehouse } from "lucide-react";

import { Toaster, toast } from "sonner";
import { ReactNode, useEffect } from "react";

const initialState = {
  errors: {},
  message: "",
};

export default function LoginForm() {
  const [state, action] = useFormState(login, initialState);
  const router = useRouter();

  useEffect(() => {
    if (state.success) {
      toast.success(state.message);
      router.push("/home");
    } else if (state.message) {
      toast.error(state.message);
    }

    if (state.errors && typeof state.errors === "object") {
      const priorityFields = ["email", "password"];
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
    <div className="relative flex h-screen w-screen items-center justify-center">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="absolute top-4 left-4 z-10"
      >
        <GoMainPageButton />
      </motion.div>
      <Toaster
        duration={5000}
        richColors
        position="top-center"
        expand={false}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-xl p-8 rounded-2xl shadow-2xl w-full max-w-md border  border-opacity-15 m-4"
      >
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <Warehouse className="text-blue-500 w-16 h-16" />
        </motion.div>
        <h2 className="text-3xl font-bold text-center text-black mb-6">
          Iniciar sesión
        </h2>
        <form className="space-y-6" action={action}>
          <div className="flex gap-3">
            <Input type="email" name="email" label="Email" minLength={6} />
          </div>
          <div>
            <Input type="password" name="password" label="Contraseña" />
          </div>
          <div className="flex justify-center">
            <LoginButton />
          </div>
        </form>
        <p className="mt-6 text-center text-sm text-black">
          No tienes una cuenta?{" "}
          <a
            href="/register"
            className="text-blue-500 hover:text-blue-300 font-medium transition duration-300"
          >
            Registrarse
          </a>
        </p>
      </motion.div>
    </div>
  );
}
