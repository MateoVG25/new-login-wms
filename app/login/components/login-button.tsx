import { Button } from "@nextui-org/button";
import { useFormStatus } from "react-dom";

export function LoginButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      variant="shadow"
      className="bg-blue-500 text-white"
    >
      {pending ? "Iniciando sesión..." : "Iniciar sesión"}
    </Button>
  );
}
