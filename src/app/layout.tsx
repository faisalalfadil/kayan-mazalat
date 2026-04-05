import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "كيان القمة | توريد وتركيب الساندوتش بانل في السعودية",
    template: "%s | كيان القمة",
  },
  description:
    "كيان القمة - شركة متخصصة في توريد وتركيب الساندوتش بانل والعزل الحراري في المملكة العربية السعودية. هناجر، مستودعات، مباني صناعية.",
  keywords: [
    "ساندوتش بانل",
    "كيان القمة",
    "عزل حراري",
    "هناجر",
    "مستودعات",
    "مباني صناعية",
    "توريد ساندوتش بانل",
    "تركيب ساندوتش بانل",
    "السعودية",
    "الرياض",
    "جدة",
    "الدمام",
  ],
  authors: [{ name: "كيان القمة" }],
  openGraph: {
    title: "كيان القمة | توريد وتركيب الساندوتش بانل",
    description:
      "شركة متخصصة في توريد وتركيب الساندوتش بانل والعزل الحراري في المملكة العربية السعودية",
    siteName: "كيان القمة",
    type: "website",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "كيان القمة | توريد وتركيب الساندوتش بانل",
    description:
      "شركة متخصصة في توريد وتركيب الساندوتش بانل والعزل الحراري في المملكة العربية السعودية",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ConstructionCompany",
              name: "كيان القمة",
              description:
                "شركة متخصصة في توريد وتركيب الساندوتش بانل والعزل الحراري في المملكة العربية السعودية",
              areaServed: "المملكة العربية السعودية",
              serviceType: [
                "توريد وتركيب ساندوتش بانل",
                "عزل حراري",
                "بناء هناجر",
                "بناء مستودعات",
              ],
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
