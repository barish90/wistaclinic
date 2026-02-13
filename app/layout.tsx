import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "WistaClinic - Premium Healthcare & Beauty Services",
  description: "Your premier destination for dental care, beauty treatments, weight loss solutions, and precision laboratory services in Istanbul, Turkey.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
