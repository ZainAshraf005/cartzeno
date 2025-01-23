"use client";
import React, { useEffect, useState } from "react";
import { useErrorHandler } from "@/hooks/use-error";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { UserRound } from "lucide-react";
import { useAppSelector } from "@/hooks/redux-hooks";
import Link from "next/link";

interface CategoryTypes {
  id: string;
  name: string;
}

const HeroSection = () => {
  const { handleError } = useErrorHandler();
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [categories, setCategories] = useState<CategoryTypes[]>();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const user = useAppSelector((state) => state.user.user);

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/category");
        if (response.data.success) setCategories(response.data.categories);
      } catch (error: unknown) {
        handleError(error);
      }
    })();
    if (isLoggedIn) setLoggedIn(true);
  }, [isLoggedIn]);

  return (
    <div className="grid sm:grid-cols-3 lg:grid-cols-4 w-full h-96 rounded-lg p-3">
      <div className="mr-3 hidden lg:block">
        <Table>
          <TableBody>
            {categories?.slice(0, 7).map((item, index) => (
              <TableRow className="border-none" key={item.id}>
                <TableCell
                  className={`py-4 ${
                    index === 0 && "bg-[#E5F1FF] font-semibold"
                  } cursor-pointer rounded-xl capitalize`}
                >
                  {item.name}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="col-span-2 grid group grid-cols-2 rounded-xl w-full cursor-pointer overflow-hidden bg-gradient-to-br from-red-600 via-rose-600 to-pink-600">
        <div className="flex flex-col justify-center pl-5">
          <div className="text-3xl text-zinc-100">
            Latest trending <br />
            <span className="font-extrabold">Electronic items</span>
          </div>
          <Button variant="outline" className="w-fit mt-3">
            Learn more
          </Button>
        </div>
        <div className="flex justify-end items-center">
          <div className="w-fit">
            <Image
              className="object-contain drop-shadow-2xl rotate-12 transition-all delay-75 duration-300 group-hover:rotate-0"
              src="/images/headphone.png"
              alt="laptop"
              width={250}
              height={250}
              placeholder="empty"
              priority
            />
          </div>
        </div>
      </div>
      <div className="flex-col gap-4 px-3 hidden sm:flex justify-center">
        <div className="w-full h-[250%] flex flex-col justify-around rounded-xl p-3 bg-[#E3F0FF]">
          <div className="flex w-full items-center gap-3 text-lg">
            <div>
              <UserRound className="text-xl" />
            </div>
            <p>
              Hi,{" "}
              <span className="capitalize">
                {loggedIn ? user?.fullName?.split(" ")[0] : "User"}
              </span>
              <br />
              let&apos;s get started
            </p>
          </div>
          <div className="flex flex-col gap-1">
            {loggedIn ? (
              <Button className="bg-custom-1 hover:bg-custom-2">Hello</Button>
            ) : (
              <Button asChild className="bg-custom-1 hover:bg-custom-2">
                <Link href={"/login"}>Login</Link>
              </Button>
            )}
          </div>
        </div>
        <div className="w-full h-full text-zinc-100 text-lg rounded-xl p-3 bg-[#F38332]">
          Get US $10 off with a new supplier
        </div>
        <div className="w-full h-full text-zinc-100 text-lg rounded-xl p-3 bg-[#55BDC3]">
          Send quotes with supplier preferences
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
