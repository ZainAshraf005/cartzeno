"use client";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import Loading from "../custom/Loading";
import { useToast } from "@/hooks/use-toast";
import { signupSchema } from "@/schemas/user-schema";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useErrorHandler } from "@/hooks/use-error";

export function SignupForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [loading, setLoading] = useState(false);
  const { handleError } = useErrorHandler();
  const first = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { toast } = useToast();
  const [user, setUser] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    e.preventDefault();
    console.log(user);
    try {
      const result = signupSchema.parse(user);
      if (!result) {
        return toast({
          variant: "destructive",
          title: "Login",
          description: "Invalid email or password",
          duration: 3000,
        });
      }
      const { email, password, fullName } = result;
      const res = await axios.post("/api/auth/signup", {
        email,
        password,
        fullName,
      });
      if (res.data.success) {
        setUser({ email: "", password: "", fullName: "" });

        toast({
          variant: "success",
          title: "user created successfully",
          description: "You are redirecting to login page",
          duration: 2000,
        });
        setLoading(false);
        router.push("/login");
      }
    } catch (error: unknown) {
      setLoading(false);
      handleError(error);
    }
  };

  useEffect(() => {
    if (first.current) first.current.focus();
  }, []);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl text-nblue">
            Welcome to Cartzeno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    ref={first}
                    value={user.fullName}
                    onChange={(e) =>
                      setUser({ ...user, fullName: e.target.value })
                    }
                    type="name"
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email}
                    onChange={(e) =>
                      setUser({ ...user, email: e.target.value })
                    }
                    type="email"
                    placeholder="m@example.com"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="password">Password</Label>

                  <Input
                    id="password"
                    placeholder="password"
                    value={user.password}
                    onChange={(e) =>
                      setUser({ ...user, password: e.target.value })
                    }
                    type="password"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirm Password</Label>

                  <Input
                    id="confirm-password"
                    placeholder="confirm password"
                    value={user.password}
                    type="text"
                    readOnly
                  />
                </div>
                <Button type="submit" className="w-full bg-nblue">
                  {loading ? <Loading /> : "Register"}
                </Button>
              </div>
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline underline-offset-4">
                  Login
                </Link>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  );
}
