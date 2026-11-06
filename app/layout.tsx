import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hearth Focus — a little room to focus",
  description: "A quiet space for one intention and twenty-five minutes of focus.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
