"use client";
import React, { useEffect, useState } from "react";
import { UserRound, LogOut, ShoppingBasket, UserRoundPen } from "lucide-react";

import { Button } from "../ui/button";
import { useAppSelector } from "@/hooks/redux-hooks";
import Loading from "./Loading";
import { useRouter } from "next/navigation";
import CartButton from "./cart-button";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const login = useAppSelector((state) => state.user.isLoggedIn);

  const { logoutUser } = useAuth();
  const handleLogout = async () => {
    await logoutUser();
  };

  const handleLogin = () => {
    setLoading(true);
    router.push("/login");
    setLoading(false);
  };
  const handleSignup = () => {
    setLoading(true);
    router.push("/register");
    setLoading(false);
  };

  useEffect(() => {
    setIsLoggedIn(login);
  }, [login]);

  return (
    <div className="w-full border-b flex justify-center bg-white shadow-sm">
      <div className="w-[95%] lg:w-[85%] px-3 py-4 flex flex-wrap md:flex-nowrap items-center justify-between">
        {/* Logo Section */}
        <div className="flex gap-2 text-custom-1">
          <div className="w-6 h-6 flex items-center">
            <Image
              width={100}
              alt="icon"
              src={"/images/icon.png"}
              height={100}
            />
          </div>
          <span className="font-semibold text-lg">Cartzeno</span>
        </div>

        {/* Actions Section */}
        <div className="flex gap-4 items-center mt-4 md:mt-0">
          {isLoggedIn ? (
            <div className="flex gap-6 text-xs">
              <Link
                href={"/profile"}
                className="flex cursor-pointer flex-col items-center gap-1 text-zinc-500"
              >
                <UserRound className="w-5 h-5" /> Profile
              </Link>
              <Link
                href={"/products"}
                className="flex cursor-pointer flex-col items-center gap-1 text-zinc-500"
              >
                <ShoppingBasket className="w-5 h-5" />
                Products
              </Link>
              <Link
                href="/admin"
                className="flex cursor-pointer flex-col items-center gap-1 text-zinc-500"
              >
                <UserRoundPen className="w-5 h-5" /> Admin
              </Link>
              <div
                onClick={handleLogout}
                className="flex cursor-pointer flex-col items-center gap-1 text-zinc-500"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </div>
              <div className="flex cursor-pointer flex-col items-center gap-1 text-zinc-500">
                <CartButton /> My cart
              </div>
            </div>
          ) : (
            <div className="flex gap-3">
              <Button
                className="bg-custom-1 hover:bg-custom-2 text-sm px-4 py-2"
                size={"lg"}
                onClick={handleLogin}
              >
                {loading ? <Loading /> : "Login"}
              </Button>
              <Button variant={"outline"} size={"lg"} onClick={handleSignup}>
                {loading ? <Loading /> : "Signup"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
