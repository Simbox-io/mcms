import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ThemeProvider } from "./providers";
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { ClerkProvider, auth } from '@clerk/nextjs'
import { dark } from '@clerk/themes'

const inter = Inter({ subsets: ["latin"] });
const ibmPlexSans = IBM_Plex_Sans({ weight: ['300', '400', '600'], subsets: ["latin"] });
const ibmPlexMono = IBM_Plex_Mono({ weight: ['300', '600'], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MCMS",
  description: "Modern CMS by Simbox.io",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <ClerkProvider  publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY} appearance={{baseTheme: dark}}>
    <html lang="en" className={ibmPlexSans.className}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
        <body className='flex flex-col justify-between h-screen text-zinc-900 dark:text-zinc-100 bg-zinc-100 dark:bg-zinc-900'>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="flex-grow overflow-auto">
              {children}
              <div id='portal-root' />
              <Analytics />
              <SpeedInsights />
            </main>
            <Footer />
          </ThemeProvider>
        </body>
    </html>
    </ClerkProvider>
  );
}
