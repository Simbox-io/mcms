import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });
const ibmPlexSans = IBM_Plex_Sans({ weight: ['300', '400', '600'], subsets: ["latin"] });
const ibmPlexMono = IBM_Plex_Mono({ weight: ['300', '600'], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MCMS",
  description: "Mirlok's CMS by Simbox.io",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={ibmPlexSans.className}>
      <Providers>
      <body className='flex flex-col justify-between h-screen dark:bg-gray-700'>
      <Header />
          <main className="flex-grow overflow-auto">
            {children}
        </main>
        <Footer />
      </body>
      </Providers>
    </html>
  );
}
