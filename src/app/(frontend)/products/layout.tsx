import { Metadata } from "next";

export const metadata: Metadata = {
  title: "products - Cartzeno",
  description: "Generated by create next app",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="font-poppins">{children}</div>
    </>
  );
}
