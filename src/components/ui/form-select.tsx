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

interface Category {
    id: string | number;
    name: string;
  }

// Define the prop types for the component
interface SelectTagProps {
  label: string;
  array: Category[];
  value:string;
  onValueChange:(value:string)=>void;
}

export function FormSelect({ label, array,value,onValueChange }: SelectTagProps) {
  return (
    <Select value={value} onValueChange={onValueChange} >
      <SelectTrigger className="w-[250px] ring-white focus-visible:ring-0">
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {array?.map((item) => (
            <SelectItem key={item.id} value={item.id as string}>
              {item.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
