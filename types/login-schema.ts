import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Por favor ingrese un correo electrónico válido." })
    .min(6, {
      message: " El campo email debe tener al menos 6 caracteres.",
    })
    .max(100, {
      message: "El campo email no debe tener más de 100 caracteres.",
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
});

export const initialState = {
  errors: {},
  message: "",
  success: false,
};
