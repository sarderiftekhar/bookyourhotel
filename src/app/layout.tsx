import type { Metadata } from "next";
import { Playfair_Display, Ephesis } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const ephesis = Ephesis({
  variable: "--font-ephesis",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://bookyourhotel.online",
  ),
  title: {
    default: "BookYourHotel - Simple Booking, Perfect Stays.",
    template: "%s | BookYourHotel",
  },
  description:
    "Search over 2 million hotels worldwide and find the best deals. Simple booking, perfect stays. Best price guarantee with free cancellation.",
  keywords: [
    "hotels",
    "booking",
    "travel",
    "best prices",
    "hotel deals",
    "cheap hotels",
    "hotel comparison",
    "free cancellation",
  ],
  openGraph: {
    title: "BookYourHotel - Simple Booking, Perfect Stays.",
    description:
      "Search over 2 million hotels worldwide and find the best deals. Best price guarantee with free cancellation.",
    type: "website",
    siteName: "BookYourHotel",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BookYourHotel - Simple Booking, Perfect Stays.",
    description:
      "Search over 2 million hotels worldwide. Best price guarantee with free cancellation.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${playfair.variable} ${ephesis.variable} antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
