"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useErrorHandler } from "@/hooks/use-error";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import Image from "next/image";
import {
  ChangeEvent,
  Dispatch,
  FormEvent,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import Loading from "./Loading";
import { FormSelect } from "../ui/form-select";
import { Textarea } from "../ui/textarea";

interface CategoryProps {
  id: number | string;
  name: string;
}

export function CreateProduct({
  categories,
  setRefresh,
  refresh,
}: {
  categories: CategoryProps[];
  setRefresh: Dispatch<SetStateAction<boolean>>;
  refresh: boolean;
}) {
  //   const [name, setName] = useState("");
  const [isOpen, setIsOpen] = useState(false); // New state for dialog
  const { handleError } = useErrorHandler();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    stock: "",
    categoryId: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file is an image
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file");
      return;
    }

    // Validate file size (e.g., 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setError(null);
    setImage(file);

    // Create preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    // Cleanup the URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryId: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate all fields are filled
      if (
        !image ||
        !formData.title ||
        !formData.price ||
        !formData.description ||
        !formData.stock ||
        !formData.categoryId
      ) {
        throw new Error("All fields are required");
      }

      // Create FormData object
      const submitFormData = new FormData();
      submitFormData.append("image", image);
      Object.entries(formData).forEach(([key, value]) => {
        submitFormData.append(key, value);
      });

      // Submit to API
      const response = await axios.post(
        "/api/products/create",
        submitFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (response.data.success) {
        toast({
          title: "product added",
          duration: 1000,
        });
        setFormData({
          title: "",
          price: "",
          description: "",
          stock: "",
          categoryId: "",
        });
        if (preview) {
          URL.revokeObjectURL(preview); // Release the preview URL
        }
        setPreview(null);
        setImage(null);
        setRefresh(!refresh);
        setIsOpen(false);
      }
    } catch (err: unknown) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Cleanup function to run when component unmounts
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, []); // Empty dependency array means this runs on unmount

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" onClick={() => setIsOpen(true)}>
          Create Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[50%] font-poppins">
        <DialogHeader>
          <DialogTitle>Add New Product</DialogTitle>
          <DialogDescription>
            Make sure the new product name doesn&apos;t match the previous one.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <form onSubmit={handleSubmit} className="  px-4 ">
            {error && (
              <div className="bg-red-50 text-red-500 p-3 rounded-md">
                {error}
              </div>
            )}

            <div className="">
              {/* Title */}
              <div>
                <Label>Title</Label>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="focus-visible:ring-0"
                />
              </div>

              {/* Price */}
              <div className="flex gap-2 mt-3 items-center">
                <div>
                  <Label>Price</Label>
                  <Input
                    type="number"
                    name="price"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="focus-visible:ring-0"
                  />
                </div>
                {/* Stock */}
                <div>
                  <Label>Stock</Label>
                  <Input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleInputChange}
                    className="focus-visible:ring-0"
                  />
                </div>
                {/* Category */}
                <div>
                  <Label>choose category</Label>
                  <FormSelect
                    label="Category"
                    array={categories}
                    value={formData.categoryId}
                    onValueChange={handleCategoryChange}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <Label>Description</Label>
                <Textarea
                  name="description"
                  placeholder="add description here"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  className="focus-visible:ring-0"
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label>Product Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="focus-visible:ring-0"
                />
                {preview && (
                  <div className="mt-2 relative w-40 h-40">
                    <Image
                      src={preview}
                      alt="Preview"
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                )}
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className={` w-full mt-3 bg-custom-1 hover:bg-custom-2 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? <Loading /> : "Create Product"}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
