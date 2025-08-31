import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./providers/ReactQueryProvider/ReactQueryProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "DailyIU",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ReactQueryProvider>
      <html lang="en">
        <body className={`${inter.variable} antialiased`}>{children}</body>
      </html>
    </ReactQueryProvider>
  );
}
