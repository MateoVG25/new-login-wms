import React, { useMemo } from "react";

import { Select, SelectItem } from "@nextui-org/select";

export const BirthdateComponent = () => {
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);

  const months = [
    { key: "01", label: "Enero" },
    { key: "02", label: "Febrero" },
    { key: "03", label: "Marzo" },
    { key: "04", label: "Abril" },
    { key: "05", label: "Mayo" },
    { key: "06", label: "Junio" },
    { key: "07", label: "Julio" },
    { key: "08", label: "Agosto" },
    { key: "09", label: "Septiembre" },
    { key: "10", label: "Octubre" },
    { key: "11", label: "Noviembre" },
    { key: "12", label: "Diciembre" },
  ];

  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - i);
  }, []);

  return (
    <>
      <label>Fecha de nacimiento</label>
      <div className="grid grid-cols-3 gap-4" id="birthdate-container">
        <Select id="day" name="day" label="Dia" aria-label="day">
          {days.map((day) => (
            <SelectItem key={day} value={day.toString()}>
              {day}
            </SelectItem>
          ))}
        </Select>
      </div>
    </>
  );
};
