import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Define the prop types for the component
interface SelectTagProps {
  label: string;
  array: string[];
}

export function SelectTag({ label, array }: SelectTagProps) {
  return (
    <Select>
      <SelectTrigger className="w-[250px] ring-white shadow-none border-none focus:ring-0">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {array.map((item, index) => (
            <SelectItem key={index} value={item.toLowerCase()}>
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
