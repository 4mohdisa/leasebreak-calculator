import type { Metadata, Viewport } from "next"
import localFont from "next/font/local"
import { Navbar } from "./components/navbar"
import { Footer } from "./components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/lib/redux/provider"
import "./globals.css"
import { GoogleAnalytics } from '@next/third-parties/google'
import { ContactSection } from "./components/contact-section"
import { generateCalculatorSchema, generateOrganizationSchema } from '@/lib/schema'

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  metadataBase: new URL('https://leasebreak-calculator.vercel.app'),
  title: {
    default: 'SACAT-Compliant Lease Break Calculator | South Australia',
    template: '%s | LeaseBreak Calculator SA'
  },
  description: 'Free calculator for estimating lease break costs in South Australia. SACAT-compliant calculations for reletting fees and advertising costs. Trusted by tenants and property managers.',
  keywords: ['lease break calculator', 'SACAT', 'South Australia', 'reletting fee', 'advertising costs', 'rental agreement', 'tenancy', 'break lease', 'rental bond', 'Adelaide'],
  authors: [{ name: 'LeaseBreak Calculator' }],
  creator: 'LeaseBreak Calculator',
  publisher: 'LeaseBreak Calculator',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-512x512.png',
    apple: '/icon-192x192.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: 'https://leasebreak-calculator.vercel.app',
    title: 'SACAT-Compliant Lease Break Calculator | South Australia',
    description: 'Free calculator for estimating lease break costs in South Australia. SACAT-compliant calculations for reletting fees and advertising costs. Trusted by tenants and property managers.',
    siteName: 'LeaseBreak Calculator SA',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'LeaseBreak Calculator SA'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SACAT-Compliant Lease Break Calculator | South Australia',
    description: 'Free calculator for estimating lease break costs in South Australia. SACAT-compliant calculations for reletting fees and advertising costs.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://leasebreak-calculator.vercel.app'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                generateCalculatorSchema(),
                generateOrganizationSchema()
              ].map(schema => ({ ...schema, '@context': undefined }))
            })
          }}
        />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}>
        <ReduxProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <div className="flex-1">
                {children}
              </div>
              <ContactSection />
              <Footer />
            </div>
          </ThemeProvider>
        </ReduxProvider>
        <GoogleAnalytics gaId="G-8P7J41FWCV" />
      </body>
    </html>
  )
}
