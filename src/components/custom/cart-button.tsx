import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useAppSelector, useAppDispatch } from "@/hooks/redux-hooks";
import { clearCart, removeFromCart } from "@/features/cart/cart-slice";

interface ProductType {
  id: string;
  title: string;
  image: string;
  price: number;
  stock: number;
}

interface CartItem extends ProductType {
  quantity: number;
}

export default function CartButton() {
  const dispatch = useAppDispatch();
  const reduxCart = useAppSelector((state) => state.cart.items) as CartItem[];
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const removeFromCartHandler = (id: string) => {
    dispatch(removeFromCart(id)); // dispatch remove action
  };

  const clearCartHandler = () => {
    dispatch(clearCart()); // dispatch clear action
  };

  return (
    <div>
      <ShoppingCart onClick={() => setIsDialogOpen(true)} className="w-5 h-5 cursor-pointer" />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Shopping Cart</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {reduxCart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div>
                <ul className="space-y-2">
                  {reduxCart.map((item) => (
                    <li
                      key={item.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <Image
                          src={item.image}
                          alt={item.title}
                          width={100}
                          height={100}
                          className="w-16 h-16 rounded object-cover"
                        />
                        <div>
                          <p className="font-semibold">{item.title}</p>
                          <p className="text-sm text-gray-500">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="space-x-2">
                        <Button
                          variant="destructive"
                          onClick={() => removeFromCartHandler(item.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4">
                  <p className="font-semibold text-lg">
                    Total: $
                    {reduxCart
                      .reduce(
                        (total, item) => total + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </p>
                  <div className="mt-2 space-x-2">
                    <Button variant="secondary" onClick={clearCartHandler}>
                      Clear Cart
                    </Button>
                    <Button onClick={() => setIsDialogOpen(false)}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
