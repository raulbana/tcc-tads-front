import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "./providers/ReactQueryProvider/ReactQueryProvider";
import ClientNavbarWrapper from "./components/Navbar/components/ClientNavbarWrapper";
import { UploadProvider } from "./contexts/UploadContext";
import { AuthProvider } from "./contexts/AuthContext";
import { DiaryProvider } from "./contexts/DiaryContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";

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
      <AuthProvider>
        <AccessibilityProvider>
          <UploadProvider>
            <DiaryProvider>
              <html lang="en">
                <body className={`${inter.variable} antialiased`}>
                  <ClientNavbarWrapper>{children}</ClientNavbarWrapper>
                </body>
              </html>
            </DiaryProvider>
          </UploadProvider>
        </AccessibilityProvider>
      </AuthProvider>
    </ReactQueryProvider>
  );
}
