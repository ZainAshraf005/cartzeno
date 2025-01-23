"use client";

import { Button } from "@/components/ui/button";
import React from "react";

export default function Footer() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
      <div className="container mx-auto px-4">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">About Us</h2>
            <p className="text-sm">
              We are a platform dedicated to providing the best services for our
              users. Stay connected and explore more with us.
            </p>
          </div>

          {/* Links Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Quick Links
            </h2>
            <ul className="space-y-2 text-sm">
              <li>
                <div
                  className="hover:text-white transition duration-300 cursor-pointer"
                >
                  About
                </div>
              </li>
              <li>
                <div
                  className="hover:text-white transition duration-300 cursor-pointer"
                >
                  Services
                </div>
              </li>
              <li>
                <div
                  className="hover:text-white transition duration-300 cursor-pointer"
                >
                  Contact
                </div>
              </li>
              <li>
                <div
                  className="hover:text-white transition duration-300 cursor-pointer"
                >
                  Privacy Policy
                </div>
              </li>
            </ul>
          </div>

          {/* Subscribe Section */}
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">
              Stay Updated
            </h2>
            <p className="text-sm mb-4">
              Subscribe to our newsletter for the latest updates.
            </p>
            <form
              onSubmit={handleSubmit}
              className="flex items-center space-x-2"
            >
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md bg-gray-800 text-gray-300 placeholder-gray-500 border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              <Button
                type="submit"
                className="text-sm bg-custom-1 hover:bg-custom-2"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-700"></div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Cartzeno. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <div className="hover:text-white transition duration-300">
              Terms
            </div>
            <div className="hover:text-white transition duration-300">
              Privacy
            </div>
            <div className="hover:text-white transition duration-300">
              Support
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
