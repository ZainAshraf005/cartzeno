import { ZodError } from "zod";
import { useToast } from "./use-toast";
import { AxiosError } from "axios";

export const useErrorHandler = () => {
  const { toast } = useToast();
  const handleError = (error: unknown) => {
    if (error instanceof ZodError)
      toast({
        variant: "destructive",
        title: "validation failed",
        description: error.errors[0].message,
        duration: 3000,
      });
    else if (error instanceof AxiosError)
      toast({
        variant: "destructive",
        title: error.response?.data.message,
        description: "enter a valid input",
        duration: 3000,
      });
    else if (error instanceof Error)
      toast({
        variant: "destructive",
        title: "Error From Server",
        description: error.message,
        duration: 3000,
      });
    else
      toast({
        variant: "destructive",
        title: "SERVER ERROR",
        description: "An unknown error occurred",
        duration: 3000,
      });
  };
  return { handleError };
};
