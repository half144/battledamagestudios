import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { CartAuthProvider } from "@/components/providers/cart-auth-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { preloadStripeProducts } from "@/lib/stripe";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Battle Damage Studios - Epic Anime Gaming Experience",
  description:
    "Join millions of players in the ultimate anime gaming experience",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  preloadStripeProducts();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          <AuthProvider>
            <CartAuthProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <Toaster position="top-right" richColors closeButton />
            </CartAuthProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
