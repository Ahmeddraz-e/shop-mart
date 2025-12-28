
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/ui/common/navbar";
import Footer from "@/components/ui/common/footer";
import AuthProvider from "@/providers/auth-provider";
import { ThemeProvider } from "@/providers/theme-provider";
import { CartProvider } from "@/providers/cart-provider";
import { Toaster } from "sonner";

import { WishlistProvider } from "@/providers/wishlist-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <WishlistProvider>
              <CartProvider>
                <Navbar />
                {children}
                <Toaster richColors />
                <Footer />
              </CartProvider>
            </WishlistProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
