import { RegisterFormSchema } from "@/types/register-schema";
export async function signup(prevState: any, formData: FormData) {
  const signupData = {
    name: formData.get("name"),
    lastname: formData.get("lastname"),
    email: formData.get("email"),
    password: formData.get("password"),
    phone: formData.get("phone"),
    day: formData.get("day"),
    month: formData.get("month"),
    year: formData.get("year"),
    gender: formData.get("gender"),
    userIdentityType: formData.get("userIdentityType"),
    userIdentity: formData.get("userIdentity"),
    operationCenter: formData.get("operationCenter"),
    operationPoint: formData.get("operationPoint"),
  };

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
      body: JSON.stringify(signupData),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        errors: data.errors || {},
        message: data.error || "Error al registrar usuario",
      };
    }

    window.location.href = "/login";
    return { message: "Registro exitoso" };
  } catch {
    return {
      message: "Error al conectar con el servidor",
    };
  }
}
