"use client";
import { DeleteProfile } from "@/components/custom/delete-profile";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/hooks/redux-hooks";
import { ArrowLeftIcon, HomeIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface User {
  fullName: string;
  email: string;
}



const Page = () => {
  const [currentUser, setCurrentUser] = useState<User | null>();
  const [cart, setCart] = useState<number>(0);
  const user = useAppSelector((state) => state.user.user);
  const reduxCart = useAppSelector((state) => state.cart.items);
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  useEffect(() => {
    setCurrentUser(user);
    setCart(reduxCart.length);
  }, []);

  return (
    <div>
      
      <div className="p-4 flex gap-3">
        <Button onClick={goBack} className="bg-custom-1 hover:bg-custom-2">
          <ArrowLeftIcon/>
          go back
        </Button>
        <Button asChild variant={"outline"} size={"icon"}>
          <Link href={"/"}>
          <HomeIcon />
          </Link>
        </Button>
      </div>
      <div className="sm:container w-full sm:mx-auto py-7 px-2 sm:px-7 flex justify-center  h-screen items-center">
        <div className="border text-center rounded-xl w-full sm:w-[80%] h-96">
          <div className=" p-3 bg-rose-700 text-white">
            Personal Information
          </div>
          <div className="flex border w-full p-4">
            <div className="flex-1">Name: </div>
            <div className="flex-1 border-l">{currentUser?.fullName}</div>
          </div>
          <div className="flex border w-full p-4">
            <div className="flex-1">Email: </div>
            <div className="flex-1 border-l">{currentUser?.email}</div>
          </div>
          <div className="flex border w-full p-4">
            <div className="flex-1">Cart Items: </div>
            <div className="flex-1 border-l">{cart}</div>
          </div>

          <div className="flex border w-full p-4">
            <div className="flex-1">Password: </div>
            <div className="flex-1 border-l">********</div>
          </div>
          <div className="flex gap-3 justify-center w-full p-4">
            <DeleteProfile />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
