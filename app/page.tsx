import { Button } from "@nextui-org/button";
import Link from "next/link";

export default async function Page() {
  return (
    <div className="grid grid-cols-1">
      <header>
        <Button color="success" variant="shadow">
          <Link href="/login">Iniciar sesion</Link>
        </Button>
        <Button color="primary">
          <Link href="/register">Registrarse</Link>
        </Button>
      </header>

      <main></main>

      <footer></footer>
    </div>
  );
}
