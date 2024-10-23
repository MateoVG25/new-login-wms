"use client";

import { Select, SelectItem } from "@nextui-org/select";
import { useMemo } from "react";
import { months } from "@/app/register/data";
import { Label } from "@/components/ui/label";

export const BirthdateInputs = () => {
  const days = useMemo(() => Array.from({ length: 31 }, (_, i) => i + 1), []);
  const years = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 100 }, (_, i) => currentYear - i);
  }, []);

  return (
    <div>
      <Label htmlFor="birthdate">Fecha de nacimiento</Label>
      <div className="grid grid-cols-3 gap-4" id="birthdate">
        <Select id="day" name="day" placeholder="Día" aria-label="day">
          {days.map((d) => (
            <SelectItem key={d} value={d.toString()} textValue={d.toString()}>
              {d}
            </SelectItem>
          ))}
        </Select>
        <Select id="month" name="month" placeholder="Mes" aria-label="month">
          {months.map((m) => (
            <SelectItem key={m.key} value={m.key} textValue={m.key}>
              {m.label}
            </SelectItem>
          ))}
        </Select>
        <Select id="year" name="year" placeholder="Año" aria-label="year">
          {years.map((y) => (
            <SelectItem key={y} value={y.toString()} textValue={y.toString()}>
              {y}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
};
