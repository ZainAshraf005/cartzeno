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
import { useErrorHandler } from "@/hooks/use-error";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";

interface User {
  id: number;
  name: string;
  products: [];
}

interface DeleteCategoryProps {
  cName: string;
  cId: number;
  users?: User[]; // Adjust this to match your actual data type
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export function DeleteCategory({ cName, cId, setUsers }: DeleteCategoryProps) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const [isOpen, setIsOpen] = useState(false); // New state for dialog

  const handleDelete = async () => {
    try {
      const res = await axios.post(`/api/category/delete`, { id: cId });
      if (res.data.success) {
        toast({
          title: "category removed",
        });
        setUsers((prev) => prev.filter((item) => item.id !== cId));
        setIsOpen(false);
      }
    } catch (error: unknown) {
      handleError(error)
    }
  };
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Delete</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] font-poppins tracking-wide">
        <DialogHeader>
          <DialogTitle className="tracking-wide">
            Delete Category {cName}
          </DialogTitle>
          <DialogDescription>
            this will delete all products along with category.
            <br />
            this action can&apos;t be undo
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4"></div>
        <DialogFooter>
          <Button onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
