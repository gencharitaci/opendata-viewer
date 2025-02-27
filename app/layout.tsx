import { MapProvider } from "@/contexts/map-context";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { GoogleTagManager } from '@next/third-parties/google'


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mecklenburg County Open Data Viewer",
  description: "Mecklenburg County Open Data Viewer Application",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <GoogleTagManager gtmId="G-S5SFKCKKQW" />
      <body className={inter.className}>
        <MapProvider>
          {children}
        </MapProvider>
      </body>
    </html>
  );
}
