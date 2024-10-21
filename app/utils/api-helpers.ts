export async function getSenderId() {
  const apiUrl = "http://localhost:3000/api/getSender";

  const response = await fetch(`${apiUrl}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el ordenante: " + response.statusText);
  }

  const data = await response.json();

  if (!data.ordenantes || data.ordenantes.length === 0) {
    throw new Error("No se encontraron ordenantes");
  }
  return data.ordenantes[0].OrdenanteId;
}

export async function getCustodyId() {
  const apiUrl = "http://localhost:3000/api/getCustody";

  const response = await fetch(`${apiUrl}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el custodio: " + response.statusText);
  }

  const data = await response.json();

  if (!data.custodios || data.custodios.length === 0) {
    throw new Error("No se encontraron custodios");
  }
  return data.custodios[0].CustodioId;
}

export async function getTitularId() {
  const apiUrl = "http://localhost:3000/api/getTitular";

  const response = await fetch(`${apiUrl}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error("Error al obtener el titular: " + response.statusText);
  }

  const data = await response.json();

  if (!data.titulares || data.titulares.length === 0) {
    throw new Error("No se encontraron titulares");
  }
  return data.titulares[0].TitularId;
}
