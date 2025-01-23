"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "../ui/label";

export function CheckBox({ label }: { label: string }) {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox  id={label[0]} />
      <Label
        htmlFor={label[0]}
        className="text-sm font-medium first-letter:uppercase leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
      </Label>
    </div>
  );
}
