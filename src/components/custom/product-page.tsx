"use client";
import { useErrorHandler } from "@/hooks/use-error";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SingleProduct from "./single-product";

interface ProductType {
  id: string;
  title: string;
  image: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  category: { name: string };
  Review: Review[];
}

interface Review {
  rating: number;
}

interface ProductApiResponse {
  success: boolean;
  product: ProductType;
}

const ProductPage = ({ prodTitle }: { prodTitle: string }) => {
  const [product, setProduct] = useState<ProductType | undefined>();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.post<ProductApiResponse>("/api/products", {
          title: prodTitle.replace(/-/g, " "),
        });
        if (response.data.success) setProduct(response.data.product);
      } catch (error: unknown) {
        handleError(error);
      }
    })();
  }, [prodTitle]);

  return (
    <div>
      <SingleProduct product={product} />
    </div>
  );
};

export default ProductPage;
