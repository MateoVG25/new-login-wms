"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@nextui-org/button";
import { ArrowLeft } from "lucide-react";
const GoMainPageButton: React.FC = () => {
  const router = useRouter();
  return (
    <div className="flex justify-start">
      <Button
        onClick={() => router.push("/")}
        isIconOnly
        size="lg"
        variant="light"
        className="text-black"
      >
        <ArrowLeft />
      </Button>
    </div>
  );
};

export default GoMainPageButton;
