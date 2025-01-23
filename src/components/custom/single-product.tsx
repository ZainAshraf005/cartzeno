import { ArrowLeft, HomeIcon, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";
import { useToast } from "@/hooks/use-toast";
import RecomendedSection from "./home/recomended-section";
import Footer from "./footer";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { addToCart } from "@/features/cart/cart-slice";

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

const calculateAverageRating = (reviews: Review[]): number => {
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  return reviews.length > 0 ? totalRating / reviews.length : 0;
};

export default function SingleProduct({
  product,
}: {
  product: ProductType | undefined;
}) {
  const dispatch = useAppDispatch()
  const { toast } = useToast();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const averageRating = product?.Review.length
    ? calculateAverageRating(product.Review)
    : 0;

  const handleBack = () => {
    router.back();
  };

  const addItem = () => {
    console.log('clicked')
    const productData = {
      id: product?.id,
      title: product?.title,
      image: product?.image,
      price: product?.price,
      stock: product?.stock,
    };
    dispatch(addToCart(productData))
    toast({
      title: "Add to Cart",
      description: `Added ${quantity} ${
        product?.title || "item"
      }(s) to cart.`,
    })
  };

  return (
    <div>
      <div className="container mx-auto flex gap-2 my-2 px-4">
        <Button onClick={handleBack} className="bg-custom-1 hover:bg-custom-2">
          <ArrowLeft /> go back
        </Button>
        <Button size={"icon"} variant={"outline"} asChild>
          <Link href={"/"}>
            <HomeIcon />
          </Link>
        </Button>
      </div>
      <div className="container mx-auto p-4">
        <Card className="rounded-b-none">
          <CardHeader>
            <CardTitle className="text-2xl capitalize font-bold text-gray-800">
              {product?.title || "Product Title"}
            </CardTitle>
            <p className="text-sm capitalize text-gray-500">
              Category: {product?.category.name || "Unknown"}
            </p>
          </CardHeader>

          <CardContent className="grid gap-6 md:grid-cols-2 sm:grid-cols-1">
            <div className="relative h-64 w-full rounded-lg overflow-hidden border border-gray-200">
              {product?.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image Available
                </div>
              )}
            </div>

            <div>
              <p className="text-lg text-gray-700">
                {product?.description || "No description available."}
              </p>
              <div className="flex items-center mt-4">
                <div className="flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: 5 }, (_, index) => (
                    <Star
                      key={index}
                      fill={
                        index < Math.round(averageRating) ? "#FACC15" : "none"
                      }
                      className="h-5 w-5"
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  ({product?.Review.length || 0} Reviews)
                </span>
              </div>

              <p className="mt-6 text-xl font-semibold text-gray-900">
                ${product?.price?.toFixed(2) || "0.00"}
              </p>

              <div className="mt-4 flex flex-col sm:flex-row items-center gap-4">
                <label htmlFor="quantity" className="text-sm text-gray-600">
                  Quantity:
                </label>
                <input
                  id="quantity"
                  type="number"
                  min="1"
                  max={product?.stock || 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-16 rounded border border-gray-300 p-1 text-center text-gray-700 focus:ring focus:ring-primary"
                />
              </div>

              <p className="mt-4 text-sm text-gray-500">
                Stock: {product?.stock || "Out of stock"}
              </p>
            </div>
          </CardContent>

          <CardFooter className="flex flex-col sm:flex-row items-center gap-4">
            <Button
              disabled={!product || quantity > (product.stock || 0)}
              onClick={addItem}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
              Add to Cart
            </Button>
            <Button
              disabled={!product || quantity > (product.stock || 0)}
              onClick={() =>
                toast({
                  title: "Place Order",
                  description: "Your order has been placed.",
                })
              }
              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white"
            >
              Place Order
            </Button>
          </CardFooter>
        </Card>
        <Card className="mb-7 border-t-transparent rounded-t-none">
          <CardContent>
            <RecomendedSection
              category={product?.category.name}
              title="related products"
            />
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}
