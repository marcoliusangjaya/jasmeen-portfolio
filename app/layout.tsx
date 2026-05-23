import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/Nav";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Jasmeen — Portfolio",
  description: "Personal portfolio showcasing projects and work.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Nav />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
