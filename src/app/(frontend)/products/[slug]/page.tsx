import ProductPage from "@/components/custom/product-page";
import React from "react";

const Page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const slug = (await params).slug;

  return <ProductPage prodTitle={slug} />;
};

export default Page;
