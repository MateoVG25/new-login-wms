"use client";

import { useState, useEffect } from "react";

interface UserRole {
  RolId: number;
}

export const LeftNavbar = () => {
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const response = await fetch("/api/auth/user/profile");
        if (!response.ok) {
          throw new Error("Failed to fetch user profile");
        }
        const userData = await response.json();
        setUserRole({ RolId: userData.RolId });
      } catch (err) {
        setError("Error al obtener el rol del usuario");
        console.error("Error al obtener el rol del usuario:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const renderComponents = () => {
    switch (userRole?.RolId) {
      case 1:
        return (
          <>
            <div>Admin Component 1</div>
            <div>Admin Component 2</div>
          </>
        );

      case 2:
        return (
          <>
            <div>Supervisor Component 1</div>
            <div>Supervisor Component 2</div>
          </>
        );
      case 3:
        return (
          <>
            <div>User Component 1</div>
            <div>User Component 2</div>
          </>
        );
      case 4:
        return (
          <>
            <div>Consultor Component 1</div>
            <div>Consultor Component 2</div>
          </>
        );
      default:
        return <div>No hay componentes disponibles para este rol</div>;
    }
  };

  return (
    <div className="left-navbar">
      <h2>Bienvenido, {userRole?.RolId}</h2>
      {renderComponents()}
    </div>
  );
};