"use client";
import { CreateProduct } from "@/components/custom/create-product";
import ProductCard from "@/components/custom/product-card";
import { useErrorHandler } from "@/hooks/use-error";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Category {
  id: number | string;
  name: string;
  products?: [];
}

interface Product {
  id: string;
  title: string;
  image: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category: Category;
}

export default function Page() {
  const { handleError } = useErrorHandler();
  const [refresh, setRefresh] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get("/api/products/read");
        const response = await axios.get("/api/category");

        if (res.data.success && response.data.success) {
          setCategories(response.data.categories);
          setProducts(res.data.products);
        }
      } catch (error: unknown) {
        handleError(error);
      }
    })();

    // Only re-fetch when `refresh` changes, not `products`
  }, [refresh]);

  // Filter products based on both category and search query
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      !activeCategory || product.categoryId === activeCategory;
    const matchesSearch =
      searchQuery.trim() === "" ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full ">
      <div className=" bg-white  w-full mx-auto overflow-x-hidden  shadow-sm">
        <div className="flex flex-col gap-4">
          {/* Search Bar */}
          <div className="p-2">
            <Input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus-visible:ring-0"
            />
          </div>

          {/* Categories */}

          <div className="flex md:flex-wrap gap-3 overflow-x-auto p-2 w-[96vw] md:w-full scrollbar-hide">
            <Button
              className={cn(
                " border cursor-pointer transition-colors",
                !activeCategory
                  ? "bg-custom-1 text-white hover:bg-custom-1"
                  : "hover:bg-gray-100 bg-white text-zinc-800"
              )}
              onClick={() => setActiveCategory(null)}
            >
              All
            </Button>
            {categories.map((category) => (
              <Button
                className={cn(
                  "border cursor-pointer transition-colors",
                  activeCategory === category.id
                    ? "bg-custom-1 text-white hover:bg-custom-1"
                    : "hover:bg-gray-100 bg-white text-zinc-800"
                )}
                key={category.id}
                onClick={() => setActiveCategory(category.id.toString())}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <CreateProduct
            refresh={refresh}
            setRefresh={setRefresh}
            categories={categories}
          />
          {/* Show results count */}
          <p className="text-sm text-gray-500">
            {filteredProducts.length}{" "}
            {filteredProducts.length === 1 ? "product" : "products"} found
          </p>
        </div>

        <div className=" w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4 ">
          {filteredProducts.length === 0 ? (
            <div className="w-full text-center text-gray-500 py-8">
              {searchQuery
                ? `No products found matching "${searchQuery}"`
                : "No products found in this category"}
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Link
                href={`/products/${product.title.trim().replaceAll(" ", "-")}`}
                className="hello"
                key={product.id}
              >
                <ProductCard
                  product={product}
                  products={products}
                  setProducts={setProducts}
                />
              </Link>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
