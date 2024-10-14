import { Button } from "@nextui-org/button";
import { useFormStatus } from "react-dom";

export function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Iniciando sesión..." : "Iniciar sesión"}
    </Button>
  );
}
