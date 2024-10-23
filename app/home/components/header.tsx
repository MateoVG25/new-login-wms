"use client";

// components
import LogoutButton from "./logout-button";
import { LeftNavbar } from "./left-navbar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";

// icons
import { ArrowRightFromLine } from "lucide-react";

export function Header() {
  return (
    <header className="bg-white shadow">
      <div className="mx-auto px-2 py-6 flex justify-between items-center">
        <Sheet>
          <SheetTrigger>
            <div className="border-2 shadow">
              <ArrowRightFromLine size={24} />
            </div>
          </SheetTrigger>
          <SheetContent side={"left"} className="flex flex-col h-full">
            <SheetHeader>
              <SheetTitle>Menú de integraciones</SheetTitle>
              <SheetDescription>
                Aqui vas a poder ver tus modulos disponibles
              </SheetDescription>
            </SheetHeader>
            <div className="flex-grow">
              <LeftNavbar />
            </div>
            <hr />
            <SheetFooter className="mt-auto flex justify-center">
              <LogoutButton />
              <SheetClose />
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
