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
    default: "مؤسسة كيان القمة للمظلات والديكورات",
    template: "%s | كيان القمة للمظلات والديكورات",
  },
  description:
    "مرحباً بك في مؤسسة كيان القمة، شريكك لتصميم وتنفيذ أرقى المظلات والديكورات الداخلية في المملكة.",
  keywords: [
    "مظلات",
    "مظلات كهربائية",
    "مظلات متحركة",
    "كيان القمة",
    "ديكورات",
    "ديكورات داخلية",
    "ساندوتش بانل",
    "واجهات زجاج",
    "كلادينج",
    "السعودية",
    "الرياض",
    "جدة",
    "الدمام",
  ],
  authors: [{ name: "مؤسسة كيان القمة للمظلات والديكورات" }],
  openGraph: {
    title: "مؤسسة كيان القمة للمظلات والديكورات",
    description:
      "مرحباً بك في مؤسسة كيان القمة، شريكك لتصميم وتنفيذ أرقى المظلات والديكورات الداخلية في المملكة.",
    siteName: "مؤسسة كيان القمة للمظلات والديكورات",
    type: "website",
    locale: "ar_SA",
  },
  twitter: {
    card: "summary_large_image",
    title: "مؤسسة كيان القمة للمظلات والديكورات",
    description:
      "مرحباً بك في مؤسسة كيان القمة، شريكك لتصميم وتنفيذ أرقى المظلات والديكورات الداخلية في المملكة.",
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
              "@type": "HomeAndConstructionBusiness",
              name: "مؤسسة كيان القمة للمظلات والديكورات",
              description:
                "مرحباً بك في مؤسسة كيان القمة، شريكك لتصميم وتنفيذ أرقى المظلات والديكورات الداخلية في المملكة.",
              areaServed: "المملكة العربية السعودية",
              serviceType: [
                "المظلات الكهربائية المتحركة",
                "تركيب ساندوتش بانل",
                "الديكورات الداخلية المتكاملة",
                "واجهات الزجاج والكلادينج",
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
