import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Linkme × OpenTable — Partnership Proposal",
  description: "Turning every restaurant's social media bio into a direct booking channel powered by OpenTable",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.className} antialiased scroll-smooth`}>
      <body className="bg-[#FAFAFA] text-[#111111] min-h-screen">{children}</body>
    </html>
  );
}
