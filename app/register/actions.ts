import { RegisterFormSchema } from "@/types/register-schema";

interface SignUpState {
  errors?: {
    [key: string]: string[] | undefined;
  };
  message?: string;
  success?: boolean;
}

export async function signup(prevState: SignUpState, formData: FormData) {
  const signupData = Object.fromEntries(formData.entries());

  const validation = RegisterFormSchema.safeParse(signupData);

  if (!validation.success) {
    return {
      errors: validation.error.flatten().fieldErrors,
      message: "Por favor, corrija los errores en el formulario",
    };
  }

  try {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(validation.data),
    });

    if (!response.ok) {
      const data = await response.json();
      return {
        errors: data.errors || {},
        message: data.error || "Error al registrar usuario",
      };
    }

    return { message: "Registro exitoso", success: true };
  } catch (error) {
    console.error("Error durante el registro", error);
    return {
      message: "Error al conectar con el servidor",
      success: false,
    };
  }
}
