"use client";

import { useFormState } from "react-dom";
import { Input } from "@nextui-org/input";
import { useRouter } from "next/navigation";
import { login } from "./actions";
import { initialState } from "@/types/login-schema";
import { LoginButton } from "./components/login-button";

export default function LoginForm() {
  const router = useRouter();
  const [state, action] = useFormState(login, initialState);

  if (state.success) {
    router.push("/home");
  }

  return (
    <form action={action}>
      <div>
        <Input type="email" name="email" label="Email" minLength={6} />
        {state?.errors?.email && (
          <div className="text-red-500">{state.errors.email}</div>
        )}
      </div>

      <div>
        <Input type="password" name="password" label="Contraseña" />
        {state?.errors?.password && (
          <div className="text-red-500">{state.errors.password}</div>
        )}
      </div>
      {state?.message && (
        <div className={`${state.success ? "text-green-500" : "text-red-500"}`}>
          {state.message}
        </div>
      )}
      <LoginButton />
    </form>
  );
}
