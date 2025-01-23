import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const RequestSection = () => {
  return (
    <div
      id="message"
      style={{ backgroundImage: "url(/images/building.jpg)" }}
      className="border h-96 my-7 rounded-lg overflow-hidden"
    >
      <div className="w-[105%] bg-blue-950 md:pr-7 bg-opacity-85 h-full flex md:flex-row justify-center items-center md:px-5">
        <div className="text-white hidden md:block flex-1">
          <h1 className="text-4xl font-bold">
            An easy way to send requests to supplier
          </h1>
          <p className="mt-3 text-lg">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Illum
            consectetur necessitatibus consequuntur fuga.
          </p>
        </div>
        <div className="md:flex-1 flex items-center justify-center md:justify-end md:pr-7">
          <Card className="md:w-[350px] sm:w-[300px] w-[280px]">
            <CardHeader>
              <CardTitle>Send quote to supplier</CardTitle>
              <CardDescription>Tell what item you need</CardDescription>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">product description</Label>
                    <Textarea placeholder="tell us about the product you want"></Textarea>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button>Send</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RequestSection;
