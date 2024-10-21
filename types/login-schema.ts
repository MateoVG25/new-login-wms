import { z } from "zod";

export const LoginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Por favor ingrese un correo electrónico válido." }),
  password: z.string().min(1, { message: "La contraseña es requerida." }),
});
