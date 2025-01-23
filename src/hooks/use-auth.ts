import axios from "axios";
import { useErrorHandler } from "./use-error";
import { useToast } from "./use-toast";
import { useRouter } from "next/navigation";
import { useAppDispatch } from "./redux-hooks";
import { clearAuthUser } from "@/features/user/user-slice";

export const useAuth = () => {
  const { handleError } = useErrorHandler();
  const dispatch = useAppDispatch();
  const { toast } = useToast();
  const router = useRouter();
  const logoutUser = async () => {
    try {
      const response = await axios.get("/api/auth/signout");
      if (response.data.success) {
        toast({
          title: "Logged Out",
          description: "You have been logged out",
          duration: 2000,
        });
        document.cookie = "admin-auth= ; path=/";
        dispatch(clearAuthUser());
        router.push("/");
      }
    } catch (error: unknown) {
      handleError(error);
    }
  };
  return { logoutUser };
};
