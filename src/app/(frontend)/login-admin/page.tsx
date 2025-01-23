"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { CopyIcon } from "lucide-react";
import { useErrorHandler } from "@/hooks/use-error";

export default function Page() {
  const [password, setPassword] = useState("");
  const { handleError } = useErrorHandler();
  const router = useRouter();
  const { toast } = useToast();
  const adminPassword = "ECOM_ADMIN";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password === adminPassword) {
      document.cookie = "admin-auth=authenticated; path=/";
      router.push("/admin");
    } else {
      toast({
        title: "Invalid Password",
        description: "you are redirecting to home page",
        duration: 3000,
      });
      router.push("/");
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText("ECOM_ADMIN");
      toast({
        description: "password copied, now just paste",
      });
    } catch (error: unknown) {
      handleError(error);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-96 p-6 rounded border shadow-md"
      >
        <h2 className="text-xl font-bold mb-4">Admin Login</h2>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
          className="border p-2 w-full mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Login
        </button>
      </form>
      <div className="bg-white text-sm w-96 p-4 uppercase">
        make sure to use it fairly <br /> With great power comes great responsibility.
        <div>
          <div
            onClick={handleCopy}
            className="flex gap-3 text-sm text-green-700 cursor-pointer items-center "
          >
            <div>click to copy the password</div>
            <div>
              <CopyIcon className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
