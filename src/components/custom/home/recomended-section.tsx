"use client";

import { useErrorHandler } from "@/hooks/use-error";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface ProductsType {
  id: string;
  title: string;
  description: string;
  image: string;
  price: string;
  category: { name: string };
}

const RecommendedSection = ({
  category,
  title = "Recommended Items", // Default title
}: {
  category?: string;
  title?: string;
}) => {
  const { handleError } = useErrorHandler();
  const [products, setProducts] = useState<ProductsType[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products/read");
        if (response.data.success) {
          const filteredProducts = category
            ? response.data.products.filter(
                (item: ProductsType) => item.category.name === category
              )
            : response.data.products;

          setProducts(filteredProducts);
        }
      } catch (error: unknown) {
        handleError(error);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <div  className="rounded-lg my-7 p-4">
      <h1 className="capitalize text-lg font-semibold">{title}</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 my-4">
        {products.length > 0 ? (
          products.slice(0, 10).map((product) => (
            <Link
              href={`/products/${product.title.trim().replaceAll(" ", "-")}`}
              key={product.id}
              className="border rounded-lg flex flex-col justify-between p-4 h-56"
            >
              <div className="relative w-full h-32">
                <Image
                  src={product.image}
                  fill
                  sizes="100%"
                  className="object-contain"
                  alt={product.title}
                />
              </div>
              <div className="mt-2">
                <h1 className="text-sm font-semibold">${product.price}</h1>
                <p className="text-zinc-500 text-sm truncate">
                  {product.title}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-center text-gray-500 col-span-full">
            No products found.
          </p>
        )}
      </div>
    </div>
  );
};

export default RecommendedSection;
