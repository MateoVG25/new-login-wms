export async function getUserProfile() {
  try {
    const response = await fetch("/api/auth/user/profile", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.error || "Error al obtener la información del usuario"
      );
    }

    return data;
  } catch (error) {
    return {
      error:
        (error as Error).message ||
        "Error al obtener la información del usuario",
    };
  }
}
