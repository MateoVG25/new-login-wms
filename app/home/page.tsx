"use client";

import { useEffect, useState } from "react";
import { Header } from "./components/header";
import { DashboardPage } from "./components/dashboard";

export default function HomePage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user/profile", {
          credentials: "include", // Importante para enviar las cookies
        });

        if (!response.ok) {
          throw new Error("Fallo al obtener los datos del usuario");
        }
        const data = await response.json();
      } catch (error) {
        console.error("Error al obtener los datos del usuario: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <DashboardPage />
      </main>
    </div>
  );
}
