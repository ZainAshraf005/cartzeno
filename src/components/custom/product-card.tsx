"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useErrorHandler } from "@/hooks/use-error";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import {  Trash } from "lucide-react";

interface ProductType {
  id: string;
  title: string;
  image: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category: Category;
}

interface Category {
  id: number | string;
  name: string;
  products?: [] | undefined;
}

interface ProductCardProps {
  product: ProductType;
  products?: ProductType[] | undefined;
  setProducts: Dispatch<SetStateAction<ProductType[]>>;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, setProducts }) => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const { toast } = useToast();
  const { handleError } = useErrorHandler();
  const pathName = usePathname();
  const handleDelete = async () => {
    try {
      const response = await axios.post("/api/products/delete", {
        id: product.id,
      });
      if (response.data.success) {
        toast({
          title: "product removed",
          description: "you can't undo it..",
        });
        setProducts((prev) => prev.filter((item) => item.id !== product.id));
      }
    } catch (error: unknown) {
      handleError(error);
    }
  };
  useEffect(() => {
    setIsAdmin(pathName.startsWith("/admin"));
  }, [pathName]);

  return (
    <div className=" w-full bg-white border p-2 border-gray-200 rounded-lg shadow-md overflow-hidden">
      <div className="relative w-full h-48">
        <Image
          src={product.image}
          alt={product.title}
          layout="fill"
          sizes="full"
          objectFit="contain"
          priority
        />
      </div>
      <div className="md:p-4">
        <h2 className="md:text-xl text-sm truncate capitalize">{product.title}</h2>
        <p className="text-gray-500 text-sm truncate">{product.description}</p>
        <div className="mt-2 flex  items-center justify-between">
          <span className="text-green-500 font-bold">${product.price}</span>
          <span
            className={`text-sm font-semibold ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {product.stock > 0 ? "In Stock" : "Out of Stock"}
          </span>
        </div>
        <div className="mt-2 flex md:flex-col md:gap-3 items-center justify-between ">
          <div className="flex ">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-5 h-5 ${
                    i < 4 ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.965h4.17c.969 0 1.372 1.24.588 1.81l-3.366 2.45 1.287 3.964c.3.921-.755 1.688-1.539 1.118L10 13.011l-3.366 2.449c-.783.569-1.838-.197-1.538-1.118l1.287-3.964-3.366-2.45c-.784-.57-.38-1.81.588-1.81h4.17l1.286-3.965z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-500">{4}/5</span>
          </div>
          {isAdmin && (
            <Button
              onClick={handleDelete}
              title="This will permanently delete the product"
              variant="destructive"
              size="icon"
              className="md:w-full"
            >
              <Trash />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
