import { Button } from "@nextui-org/button";
import { useFormStatus } from "react-dom";

export const RegisterButton = () => {
  const { pending } = useFormStatus();

  return (
    <div className="flex justify-center mt-2">
      <Button
        disabled={pending}
        type="submit"
        variant="shadow"
        className="my-2 w-full bg-blue-500 sm:w-[40%] text-white lg:w-[20%]"
      >
        {pending ? "Registrando..." : "Crear cuenta"}
      </Button>
    </div>
  );
};
