"use client";
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
import { Button } from "./ui/button";

// This is sample data.
const data = {
  versions: ["1.0.1", "1.1.0-alpha", "2.0.0-beta1"],
  navMain: [
    {
      title: "Features",
      items: [
        { title: "Analytics", url: "/admin", isActive: true },
        { title: "Users", url: "/admin/users" },
        { title: "Products", url: "/admin/products" },
        { title: "Categories", url: "/admin/categories" },
        { title: "Orders", url: "/admin/orders" },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Track the active path (initial state set to empty string to avoid SSR issues)
  const [activePath, setActivePath] = useState<string>("");

  // Ensure this effect only runs on the client
  useEffect(() => {
    if (typeof window !== "undefined") {
      setActivePath(window.location.pathname);

      const handleRouteChange = () => {
        setActivePath(window.location.pathname);
      };

      window.addEventListener("popstate", handleRouteChange);
      return () => {
        window.removeEventListener("popstate", handleRouteChange);
      };
    }
  }, []);

  // Function to handle click and update the active path
  const handleLinkClick = (url: string) => {
    setActivePath(url); // Update the active path manually
    if (typeof window !== "undefined") {
      window.history.pushState(null, "", url); // Update URL without page reload
    }
  };

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <Button asChild className="bg-custom-1">
          <Link href={"/"}>home page</Link>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => {
                  const isActive = activePath === subItem.url;
                  return (
                    <SidebarMenuItem key={subItem.title}>
                      <SidebarMenuButton
                        asChild
                        onClick={() => {
                          handleLinkClick(subItem.url); // Update the active state
                        }}
                        className={
                          isActive
                            ? "bg-custom-1 hover:bg-custom-1 hover:text-zinc-50 text-zinc-50"
                            : ""
                        } // Apply active styles
                      >
                        <Link href={subItem.url}>
                          <div>{subItem.title}</div>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
