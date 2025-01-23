"use client";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

import * as React from "react";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useErrorHandler } from "@/hooks/use-error";
import axios from "axios";

interface CategoryType {
  id: string;
  name: string;
  products: [];
}

interface FilterType {
  category: string;
  minPrice: number;
  maxPrice: number;
}

interface AppSideProps extends React.ComponentProps<typeof Sidebar> {
  setFilterData: React.Dispatch<React.SetStateAction<FilterType | undefined>>;
}

export function AppSide({ setFilterData, ...props }: AppSideProps) {
  const { handleError } = useErrorHandler();
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const category = categories.filter((item) => item.id === selectedCategory);
    setFilterData({
      category: category[0].name,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
  };

  // Data structure for navigation
  const data = {
    navMain: [
      {
        title: "Categories",
        items: categories.map((cat) => ({
          title: cat.name,
          url: `/categories/${cat.id}`,
          id: cat.id,
          products: cat?.products?.length,
        })),
      },
    ],
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("/api/category");
        if (response.data.success) {
          const fetchedCategories = response.data.categories.map(
            (cat: CategoryType) => ({
              ...cat,
              name: cat.name || "Untitled",
            })
          );
          setCategories([{ name: "All", id: "0" }, ...fetchedCategories]);
          // Set the first category as default if there are categories and no selection
          if (fetchedCategories.length > 0 && !selectedCategory) {
            setSelectedCategory("0");
          }
        }
      } catch (error: unknown) {
        setCategories([]);
        handleError(error);
        console.error("Failed to fetch categories:", error);
      }
    })();
  }, [selectedCategory]);

  const handleCategoryChange = (value: string) => {
    const category = categories.filter((item) => item.id === value);
    setFilterData({
      category: category[0].name,
      minPrice: priceRange.min,
      maxPrice: priceRange.max,
    });
    setSelectedCategory(value);
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Link href="/">
          <Button className="bg-custom-1">home page</Button>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((section, sectionIndex) => (
          <SidebarGroup
          
            className="h-[27rem] scrollbar-hide overflow-auto"
            key={`${sectionIndex}-${section.title}`}
          >
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              {section.title === "Categories" && (
                <RadioGroup
                  value={selectedCategory}
                  onValueChange={handleCategoryChange}
                  className="space-y-1 flex flex-col gap-2"
                >
                  {section.items.map((item) => (
                    <SidebarMenuButton key={item.id} asChild>
                      <Label
                        htmlFor={item.id}
                        className="cursor-pointer relative border"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-zinc-400 text-xs">
                            {item.products}
                          </span>
                          <RadioGroupItem
                            value={item.id} // Changed from item.title to item.id
                            id={item.id}
                          />
                          <div>{item.title} </div>
                        </div>
                      </Label>
                    </SidebarMenuButton>
                  ))}
                </RadioGroup>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        <SidebarGroup>
          <SidebarGroupLabel>Price</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <form onSubmit={(e) => handleSubmit(e)}>
                  <div className="flex gap-2 mb-3 justify-between">
                    <Input
                      type="number"
                      placeholder="min"
                      value={priceRange.min}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          min: Number(e.target.value),
                        }))
                      }
                    />
                    <Input
                      type="number"
                      placeholder="max"
                      value={priceRange.max}
                      onChange={(e) =>
                        setPriceRange((prev) => ({
                          ...prev,
                          max: Number(e.target.value),
                        }))
                      }
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-custom-1 hover:bg-custom-2"
                  >
                    apply
                  </Button>
                </form>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
