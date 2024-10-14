import z from "zod";

export const RegisterFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .max(100, { message: "El nombre debe tener como máximo 100 caracteres" })
    .trim(),
  lastname: z
    .string()
    .min(2, { message: "El apellido debe tener al menos 2 caracteres" })
    .max(100, { message: "El apellido debe tener como máximo 100 caracteres" })
    .trim(),
  email: z
    .string()
    .email({ message: "Por favor ingrese un correo electrónico válido." })
    .min(6, { message: "El campo de correo debe tener al menos 6 caracteres." })
    .max(100, {
      message: "El campo de correo no debe tener más de 100 caracteres.",
    })
    .trim(),
  password: z
    .string()
    .min(8, { message: "Tener al menos 8 caracteres" })
    .max(32, { message: "Tener como maximo 32 caracteres" })
    .regex(/[a-zA-Z]/, {
      message: "Tener al menos una letra",
    })
    .regex(/[0-9]/, {
      message: "Tener al menos un número",
    })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Tener al menos un carácter especial",
    })
    .trim(),
  phone: z
    .string()
    .min(10, {
      message: "El número de teléfono debe tener al menos 10 caracteres",
    })
    .max(20, {
      message: "El número de teléfono debe tener como máximo 20 caracteres",
    })
    .trim(),
  day: z.string().min(1, { message: "Selecciona un dia" }).max(31),
  month: z.string().min(1, { message: "Selecciona un mes" }).max(12),
  year: z.string().min(1, { message: "Selecciona un año" }).trim(),
  gender: z.string().min(1, { message: "Selecciona un genero" }).trim(),
  userIdentityType: z.string().min(1, {
    message: "Selecciona un tipo de identificación",
  }),
  userIdentity: z
    .string()
    .min(8, {
      message: "El campo de identidad debe tener al menos 8 caracteres",
    })
    .max(20, {
      message:
        "El campo de identificación debe tener como maximo 20 caracteres",
    })
    .trim(),

  operationCenter: z.string().min(1, {
    message: "El centro de operación es obligatorio",
  }),
  operationPoint: z.string().min(1, {
    message: "El punto de operación es obligatorio",
  }),
});
