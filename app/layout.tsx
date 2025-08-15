import { MapProvider } from "@/contexts/map-context";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { GoogleAnalytics } from '@next/third-parties/google'

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
      <GoogleAnalytics gaId="G-TJG963W5HP" />
      <body className={inter.className}>
        <MapProvider>
          {children}
        </MapProvider>
      </body>
    </html>
  );
}



{/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-TJG963W5HP"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-TJG963W5HP');
</script> */}