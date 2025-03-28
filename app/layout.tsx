import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { SupabaseProvider } from "@/components/providers/supabase-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={true}
          disableTransitionOnChange
        >
          <SupabaseProvider>
            <Header />
            <main>{children}</main>
            <Footer />
          </SupabaseProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
