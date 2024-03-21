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
import { getServerSession } from "next-auth";
import authOptions from './api/auth/[...nextauth]/options';
import { headers } from 'next/headers';
import { User } from '@/lib/prisma'
import StopImpersonationButton from "@/components/base/StopImpersonationButton";

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

  const session = await getServerSession(authOptions);
  const user = session?.user as User
  const isImpersonated = ((headers().get('X-Impersonated-User') === 'true') || (user?.isImpersonated === true)) || false;

  const handleEndImpersonation = async () => {
    try {
      const response = await fetch('/api/end-impersonation', {
        method: 'POST',
      });
      if (response.ok) {
        // Refresh the page to apply the original session
        window.location.reload();
      } else {
        console.error('Error ending impersonation:', response.statusText);
      }
    } catch (error) {
      console.error('Error ending impersonation:', error);
    }
  };

  return (
    <html lang="en" className={ibmPlexSans.className} suppressHydrationWarning >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <Script src="https://simbox-mcms.statuspage.io/embed/script.js" />
      <body className='flex flex-col justify-between h-screen text-gray-900 dark:text-gray-100 bg-gray-100 dark:bg-gray-900'>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem enableColorScheme >
          <Providers>
            <Header />
            {isImpersonated && <div className="bg-red-500 text-white p-2 flex justify-between">Impersonating User {user.username} <StopImpersonationButton/></div>}
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
