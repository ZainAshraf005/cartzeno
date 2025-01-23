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
    fullName: string;
    email: string;
  }

interface DeleteCategoryProps {
  user: User;
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
}

export function DeleteUser({ user,setUsers }: DeleteCategoryProps) {
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const [isOpen, setIsOpen] = useState(false); // New state for dialog

  const handleDelete = async () => {
    try {
      const res = await axios.post(`/api/users/delete`, { id: user.id });
      if (res.data.success) {
        toast({
          title: "user removed",
        });
        setUsers((prev) => prev.filter((item) => item.id !== user.id));
        setIsOpen(false);
      }
    } catch (error: unknown) {
      handleError(error);
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
            Delete User {user.fullName}
          </DialogTitle>
          <DialogDescription>
            Email: {user.email} <br /><br />
            This will delete all orders, address and cart along with this user.
            <br />
            This action can&apos;t be undo
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
