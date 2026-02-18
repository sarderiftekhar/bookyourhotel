import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "ZZStay - Same Stays. Better Prices.",
    template: "%s | ZZStay",
  },
  description:
    "Search over 2 million hotels worldwide and find the best deals. Same stays, better prices.",
  keywords: ["hotels", "booking", "travel", "best prices", "hotel deals"],
  openGraph: {
    title: "ZZStay - Same Stays. Better Prices.",
    description: "Search over 2 million hotels worldwide and find the best deals.",
    type: "website",
    siteName: "ZZStay",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
