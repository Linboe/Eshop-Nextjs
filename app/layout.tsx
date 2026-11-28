import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cozy Co",
  description: "Thoughtful furniture and objects for the home",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#fffdf8] text-[#34251b]">
        <header className="border-b border-[#34251b]/10 bg-[#fffdf8]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
            <Link href="/" className="font-serif text-2xl font-bold tracking-tight">
              Cozy Co
            </Link>
            <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm md:flex">
              <Link href="/products?category=lighting">Lighting</Link>
              <Link href="/products?category=furniture">Furniture</Link>
              <Link href="/products?category=textiles">Textiles</Link>
              <Link href="/products?category=decor">Decor</Link>
              <Link href="/products?category=tableware">Tableware</Link>
            </nav>
            <div className="flex items-center gap-4 text-sm">
              <Link href="/cart" aria-label="Cart">Cart (0)</Link>
              <Link
                href="/login"
                className="rounded-full bg-[#665441] px-5 py-2 text-white"
              >
                Log in
              </Link>
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <footer className="border-t border-[#34251b]/10 bg-[#fffdf8]">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-sm">
            <Link href="/" className="font-serif text-lg font-bold">Cozy Co</Link>
            <p className="text-xs text-[#34251b]/55">© Cozy Co. Student project.</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
