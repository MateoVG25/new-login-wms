import { Button } from "@nextui-org/button";
import { useFormStatus } from "react-dom";

export const RegisterButton = () => {
  const { pending } = useFormStatus();

  return (
    <div className="flex justify-center">
      <Button
        disabled={pending}
        type="submit"
        variant="shadow"
        className="my-2 w-full bg-[#2d525d] text-white lg:w-[20%]"
      >
        {pending ? "Registrando..." : "Crear cuenta"}
      </Button>
    </div>
  );
};
