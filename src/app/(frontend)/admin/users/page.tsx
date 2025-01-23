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
import { DeleteUser } from "@/components/custom/delete-user";
import { Input } from "@/components/ui/input";

interface User {
  id: number;
  fullName: string;
  email: string;
}

export default function Page() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query

  const { handleError } = useErrorHandler();

  const getUsers = async () => {
    try {
      const res = await axios.post("/api/all-users");
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error: unknown) {
      handleError(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div>
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
            <TableHead className="w-[100px] hidden md:block">id</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-start">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredUsers.length < 1 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                no users to show
              </TableCell>
            </TableRow>
          ) : (
            filteredUsers.map((item, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium  md:items-center py-4 hidden md:flex">
                  {++index}
                </TableCell>
                <TableCell className="py-4 ">{item.fullName}</TableCell>
                <TableCell className="py-4">{item.email}</TableCell>
                <TableCell className="text-start py-4 ">
                  <DeleteUser user={item} setUsers={setUsers} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
