"use client";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useErrorHandler } from "@/hooks/use-error";
import axios from "axios";
import { Category } from "@/components/custom/category";
import { Input } from "@/components/ui/input";
import { DeleteCategory } from "@/components/custom/delete-category";

interface User {
  id: number;
  name: string;
  products: [];
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const { handleError } = useErrorHandler();

  useEffect(() => {
    const getUsers = async () => {
      try {
        const res = await axios.get("/api/category");
        if (res.data.success) {
          setUsers(res.data.categories);
        }
      } catch (error: unknown) {
        handleError(error);
      }
    };

    getUsers();
  }, []);

  // Filtered users based on search query
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex gap-4">
        <Category users={users} setUsers={setUsers} />
        <Input
          className="focus-visible:ring-0"
          type="search"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)} // Update search query
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px] hidden md:flex items-center ">
              ID
            </TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Products</TableHead>
            <TableHead className="text-start flex items-center">
              Action
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length < 1 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                no categories to show
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium md:items-center py-4 hidden md:flex">
                  {++index}
                </TableCell>
                <TableCell className="py-4">{item.name}</TableCell>
                <TableCell className="py-4">{item.products.length}</TableCell>
                <TableCell className="text-start py-4">
                  <DeleteCategory
                    cName={item.name}
                    cId={item.id}
                    setUsers={setUsers}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
