import type { Metadata } from "next";
import { Inter_Tight, Cairo, JetBrains_Mono, Playfair_Display } from "next/font/google";
import { Providers } from "@/components/providers";
import { LanguageProvider } from "@/components/language-context";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://educore.ai/#organization",
  "name": "EduCore Hub",
  "alternateName": "محرك EduCore",
  "url": "https://educore.ai",
  "logo": "https://educore.ai/logo.png",
  "description": "Evidence-Based Hiring Platform backed by Verifiable Agentic Audits. منصة توظيف مدعومة بعمليات تدقيق وكيل قابلة للتحقق.",
  "foundingDate": "2024",
  "foundingLocation": {
    "@type": "Place",
    "name": "Saudi Arabia",
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 24.7,
      "longitude": 46.68,
    },
  },
  "areaServed": [
    { "@type": "Country", "name": "Saudi Arabia" },
    { "@type": "Country", "name": "United Arab Emirates" },
    { "@type": "Country", "name": "Egypt" },
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "customer service",
    "availableLanguage": ["Arabic", "English"],
  },
  "sameAs": [
    "https://twitter.com/educore",
    "https://linkedin.com/company/educore",
  ],
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://educore.ai/#webpage",
  "name": "EduCore Hub — Autonomous Recruitment Engine",
  "description": "Evidence- Based Hiring Platform backed by Verifiable Agentic Audits",
  "url": "https://educore.ai",
  "inLanguage": ["ar-SA", "en-US"],
  "isPartOf": {
    "@type": "WebSite",
    "@id": "https://educore.ai/#website",
    "name": "EduCore Hub",
    "url": "https://educore.ai",
    "publisher": { "@id": "https://educore.ai/#organization" },
  },
  "about": { "@id": "https://educore.ai/#organization" },
  "breadcrumb": {
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "الرئيسية", "item": "https://educore.ai" },
      { "@type": "ListItem", "position": 2, "name": "الوظائف المتاحة", "item": "https://educore.ai/#jobs" },
    ],
  },
};

export const metadata: Metadata = {
  metadataBase: new URL("https://educore.ai"),
  title: {
    default: "EduCore Hub — Autonomous Recruitment Engine | محرك التوظيف الذاتي",
    template: "%s | EduCore Hub",
  },
  description: "EduCore: Evidence-Based Hiring Platform backed by Verifiable Agentic Audits. منصة توظيف مدعومة بعمليات تدقيق وكيل قابلة للتحقق — أسرع وأدق في التوظيف.",
  keywords: ["التوظيف", "محرك التوظيف الذكي", "تحليل السير الذاتية", "AI recruitment", "hiring platform", "أفضل منصة توظيف", "تقييم المرشحين", "candidate screening", "ATS", "HR tech", "التوظيف في السعودية", "البحث عن عمل", "وظائف"],
  authors: [{ name: "EduCore Team" }],
  creator: "EduCore",
  publisher: "EduCore",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-video-preview": -1, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "ar_SA",
    alternateLocale: "en_US",
    url: "https://educore.ai",
    siteName: "EduCore Hub | محرك EduCore",
    title: "EduCore Hub — Autonomous Recruitment Engine",
    description: "Evidence-Based Hiring Platform backed by Verifiable Agentic Audits",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "EduCore Hub - Autonomous Recruitment Engine" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "EduCore Hub — Autonomous Recruitment Engine",
    description: "Evidence-Based Hiring Platform backed by Verifiable Agentic Audits",
    images: ["/twitter-image.png"],
    creator: "@educore",
  },
  alternates: {
    canonical: "https://educore.ai",
    languages: { "ar-SA": "https://educore.ai", "en-US": "https://educore.ai/en" },
  },
  verification: { google: "GOOGLE_VERIFICATION_TOKEN", yandex: "YANDEX_VERIFICATION_TOKEN" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${interTight.variable} ${playfairDisplay.variable} ${jetbrainsMono.variable} h-full antialiased dark`} style={{ colorScheme: "dark" }}>
      <head>
        <meta name="geo.region" content="SA" />
        <meta name="geo.placename" content="Riyadh, Saudi Arabia" />
        <meta name="geo.position" content="24.7;46.68" />
        <meta name="ICBM" content="24.7, 46.68" />
        <meta name="geo.country" content="SA" />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }} />
        <Providers>
          <LanguageProvider>{children}</LanguageProvider>
        </Providers>
      </body>
    </html>
  );
}