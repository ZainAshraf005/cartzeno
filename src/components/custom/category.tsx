"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useErrorHandler } from "@/hooks/use-error";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  products: [];
}

interface CategoryProps {
  users: User[]; // Adjust this to match your actual data type
  setUsers: React.Dispatch<React.SetStateAction<User[]>>; // Function to update users
}

export function Category({ users, setUsers }: CategoryProps) {
  const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false); // New state for dialog
  const { handleError } = useErrorHandler();
  const { toast } = useToast();

  const handleSubmit = async () => {
    try {
      const res = await axios.post("/api/category", { category: name });
      if (res.data.success) {
        setUsers([{ id: 0, name: name, products: [] }, ...users]);
        toast({
          title: "Category added",
        });
        setName("");
        setIsOpen(false); // Close the dialog
      }
    } catch (error: unknown) {
      handleError(error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Create Category
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-poppins">
        <DialogHeader>
          <DialogTitle>Create New Category</DialogTitle>
          <DialogDescription>
            Make sure the new category name doesn&apos;t match the previous one.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Pedro Duarte"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit}>create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
