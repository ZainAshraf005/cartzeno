"use client";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface ProductsArr {
  id: string | number;
  title: string;
  image: string;
  price: string;
  category: { name: string };
}

const CategorySection = ({
  category,
  image,
}: {
  category: string;
  image: string;
}) => {
  const [products, setProducts] = useState<ProductsArr[]>();
  useEffect(() => {
    (async () => {
      const response = await axios.get("/api/products/read");
      if (response.data.success) {
        setProducts(
          response.data.products.filter(
            (e: ProductsArr) => e.category.name === category
          )
        );
      }
    })();
  }, []);
  return (
    <div className="rounded-lg border my-14 flex flex-col md:flex-row px-3 py-4">
      <div
        style={{ backgroundImage: `url(/images/${image})` }}
        className=" bg-no-repeat bg-cover bg-center md:bg-top rounded-lg p-2 h-40 mb-4 md:mb-0 md:h-72 "
      >
        <div className="bg-zinc-200 rounded-lg px-2 text-nowrap overflow-ellipsis overflow-hidden">
          {category}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 ">
        {Array.isArray(products) &&
          products?.slice(0, 8).map((product, index) => (
            <Link
              href={`/products/${product.title.trim().replaceAll(" ", "-")}`}
              key={product.id}
              className={`flex ${index < 4 ? "border-t-0" : "border-b-0"} ${
                (index === 0 || index === 4) && "border-l-0"
              } ${
                (index === 3 || index === 7) && "border-r-0"
              } gap-2 border p-3 justify-between`}
            >
              <div className="text-xs">
                <h1 className="font-semibold txt-[.6rem] capitalize">
                  {product.title.split(" ").slice(0, 3).join(" ")}
                </h1>
                <p className="text-[.6rem] sm:text-xs ">
                  starting from <br />{" "}
                  <span className="text-yellow-500">usd</span>
                  {` ${product.price}`}
                </p>
              </div>
              <div className="flex justify-end items-end">
                <Image
                  src={product.image}
                  width={70}
                  height={70}
                  alt="product img"
                  className="w-auto h-auto"
                />
              </div>
            </Link>
          ))}
      </div>
    </div>
  );
};

export default CategorySection;
