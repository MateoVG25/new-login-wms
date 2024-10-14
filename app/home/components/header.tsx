import LogoutButton from "./logout-button";

export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center gap-4">
            <span>Bienvenido, </span>
            <LogoutButton />
          </div>
        </div>
      </div>
    </header>
  );
}
