import { LoginFormSchema } from "@/types/login-schema";

interface LoginState {
  errors?: {
    [key: string]: string[] | undefined;
  };
  message?: string;
  success?: boolean;
}

export async function login(prevState: LoginState, formData: FormData) {
  const loginData = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const validationResult = LoginFormSchema.safeParse(loginData);

  if (!validationResult.success) {
    return {
      errors: validationResult.error.flatten().fieldErrors,
      message: "Por favor, revise los campos del formulario.",
    };
  }

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        errors: data.errors || {},
        message: data.error || "Error al iniciar sesión",
      };
    }

    return {
      success: true,
      message: "Login exitoso",
    };
  } catch {
    return {
      message: "Error al conectar con el servidor",
    };
  }
}
