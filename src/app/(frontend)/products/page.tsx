"use client";
import { AppSide } from "@/components/custom/app-side";

import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useErrorHandler } from "@/hooks/use-error";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface ProductType {
  id: string;
  title: string;
  image: string;
  description: string;
  price: number;
  category: { name: string };
}

interface FilterType {
  category: string;
  minPrice: number;
  maxPrice: number;
}

const Page = () => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [filterData, setFilterData] = useState<FilterType>();
  const [searchValue, setSearchValue] = useState<string>("");
  const { handleError } = useErrorHandler();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/products/read");
        if (response.data.success) setProducts(response.data.products);
      } catch (error: unknown) {
        handleError(error);
      }
    })();
  }, []);

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.title
      .toLowerCase()
      .includes(searchValue.toLowerCase());
    const matchesCategory =
      !filterData?.category ||
      filterData.category.toLowerCase() === "all" ||
      product.category.name.toLowerCase() === filterData.category.toLowerCase();
    const matchesPrice =
      (!filterData?.minPrice || product.price >= filterData.minPrice) &&
      (!filterData?.maxPrice || product.price <= filterData.maxPrice);

    return matchesSearch && matchesCategory && matchesPrice;
  });

  return (
    <div>
      <div className="flex mx-auto">
        <SidebarProvider>
          <AppSide setFilterData={setFilterData} />
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              
            </header>
            <div className="p-4">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search products..."
                className="w-full p-2 mb-4 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="w-full grid lg:grid-cols-2 gap-4">
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <Link
                      href={`/products/${product.title
                        .trim()
                        .replaceAll(" ", "-")}`}
                      key={product.id}
                      className="border h-40 rounded-lg flex"
                    >
                      <div className="border-r w-44 relative">
                        <Image
                          src={product.image}
                          alt="product image"
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          className="object-contain"
                          priority
                        />
                      </div>
                      <div className="p-3 w-full flex flex-col justify-between">
                        <div>
                          <h1 className="font-semibold capitalize">
                            {product.title}
                          </h1>
                          <p className="w-full text-sm h-20 overflow-hidden text-ellipsis">
                            {product.description}
                          </p>
                        </div>
                        <div className="flex justify-between">
                          <div>price: ${product.price}</div>
                          <div>rating: 5/4</div>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-gray-500 col-span-2">
                    No products match your search or filter criteria.
                  </p>
                )}
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default Page;
