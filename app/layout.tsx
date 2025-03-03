import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { AuthProvider } from "@/components/auth-provider";
import { ToastContextProvider } from "@/components/ui/use-toast"; // Import Toast Context

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MovieDB - Your Movie Database",
  description: "Discover and explore movies from around the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ToastContextProvider>
              {" "}
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </ToastContextProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
