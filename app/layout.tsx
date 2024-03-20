import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/base/Header";
import Footer from "@/components/base/Footer";
import Providers from "./providers";
import { Analytics } from "@vercel/analytics/react"
import Script from "next/script";
import { ThemeProvider } from "./providers";
import { SpeedInsights } from "@vercel/speed-insights/next"

const inter = Inter({ subsets: ["latin"] });
const ibmPlexSans = IBM_Plex_Sans({ weight: ['300', '400', '600'], subsets: ["latin"] });
const ibmPlexMono = IBM_Plex_Mono({ weight: ['300', '600'], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MCMS",
  description: "Modern CMS by Simbox.io",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" className={ibmPlexSans.className} suppressHydrationWarning >
      <head>
      <meta name="viewport" content="width=device-width, initial-scale=1"/>
      </head>
      <Script src="https://simbox-mcms.statuspage.io/embed/script.js" />
      <body className='flex flex-col justify-between h-screen bg-white dark:bg-gray-900'>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem enableColorScheme >
          <Providers>
            <Header />
            <main className="flex-grow overflow-auto">
              {children}
              <Analytics />
              <SpeedInsights />
            </main>
            <Footer />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
