"use client";
import { useErrorHandler } from "@/hooks/use-error";
import axios from "axios";
import { useEffect, useState } from "react";

interface DataType {
  users: number;
  products: number;
  orders: number;
}

export default function Page() {
  const { handleError } = useErrorHandler();
  const [data, setData] = useState<DataType>();
  useEffect(() => {
    const getAnalytics = async () => {
      try {
        const response = await axios.get("/api/analytics");
        if (response.data.success) {
          setData(response.data.data);
        }
      } catch (error: unknown) {
        handleError(error);
      }
    };
    getAnalytics();
  }, []);
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video text-muted-foreground flex capitalize items-end rounded-xl text-4xl p-5 dark:bg-muted/50 bg-muted">
          total users : {data?.users}
        </div>
        <div className="aspect-video text-muted-foreground flex capitalize items-end rounded-xl text-4xl p-5 dark:bg-muted/50 bg-muted">
          products : {data?.products}
        </div>
        <div className="aspect-video text-muted-foreground flex capitalize items-end rounded-xl text-4xl p-5 dark:bg-muted/50 bg-muted">
          orders : {data?.orders}
        </div>
      </div>
      <div className="min-h-[100vh] text-zinc-500 flex justify-center items-center flex-1 rounded-xl dark:bg-muted/50 bg-muted md:min-h-min">
        <p>Analytics are not available yet.</p>
      </div>
    </div>
  );
}
