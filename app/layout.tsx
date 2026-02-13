import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Waynex Logistics - Admin Dashboard",
  description: "Admin dashboard for Waynex Logistics management",
  icons: {
    icon: "/forsvg.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>
        {children}
      </body>
    </html>
  );
}
