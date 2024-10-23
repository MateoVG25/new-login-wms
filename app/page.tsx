"use client";

import { Button } from "@nextui-org/button";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Warehouse, Box, BarChart, Clock, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjEiLz48cGF0aCBkPSJNMiAyaDJ2MkgyeiIgZmlsbD0iI2ZmZiIgZmlsbC1vcGFjaXR5PSIuMSIvPjwvZz48L3N2Zz4=')]"
          style={{
            transform: `translate(${mousePosition.x * 0.05}px, ${
              mousePosition.y * 0.05
            }px)`,
          }}
        ></div>
      </div>
      <div className="relative z-10">
        <header className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Warehouse className="h-8 w-8" />
            <span className="text-2xl font-bold">Tecnocedi</span>
          </div>
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  href="#features"
                  className="hover:text-gray-300 transition-colors"
                >
                  Features
                </Link>
              </li>
            </ul>
          </nav>
        </header>

        <main className="container mx-auto px-4 py-16 flex flex-col items-center text-center">
          <motion.h1
            className="text-5xl md:text-7xl font-extrabold mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Revolucione la gestión de su almacén
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl mb-12 max-w-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Agilice las operaciones, aumente la eficiencia y controle su
            inventario con nuestro vanguardista sistema de gestión de almacenes.
          </motion.p>
          <motion.div
            className="flex space-x-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button size="lg" variant="faded" href="/login">
              <Link
                href={"/login"}
                className="w-full h-full flex items-center justify-center"
              >
                Login
              </Link>
            </Button>
            <Button size="lg" variant="bordered">
              <Link href={"/register"} className="text-white">
                Registrarse
              </Link>
            </Button>
          </motion.div>
        </main>

        <section id="features" className="container mx-auto px-4 py-16">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Características clave
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Box,
                title: "Seguimiento de inventarios",
                description:
                  "Gestión y seguimiento del inventario en tiempo real",
              },
              {
                icon: BarChart,
                title: "Analíticas",
                description:
                  "Potentes funciones de información y elaboración de informes",
              },
              {
                icon: Clock,
                title: "Gestión de pedidos",
                description:
                  "Procesamiento y cumplimiento de pedidos estructurados",
              },
              {
                icon: Shield,
                title: "Seguridad",
                description:
                  "Medidas de seguridad avanzadas para proteger tus datos",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <feature.icon className="h-12 w-12 mb-4 text-blue-400" />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
