import type { Metadata } from "next"
import localFont from "next/font/local"
import { Navbar } from "./components/navbar"
import { Footer } from "./components/footer"
import { ThemeProvider } from "@/components/theme-provider"
import { ReduxProvider } from "@/lib/redux/provider"
import "./globals.css"

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

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export const metadata: Metadata = {
  title: {
    default: "LeaseBreak Calculator | SACAT-Compliant Lease Break Cost Calculator",
    template: "%s | LeaseBreak Calculator"
  },
  description: "Calculate your South Australian lease break costs and reletting fees accurately using SACAT-compliant formulas. Get instant estimates for advertising costs and maximum rent liability periods.",
  keywords: [
    "lease break calculator",
    "SACAT calculator",
    "reletting fee",
    "rental property",
    "lease termination",
    "South Australia",
    "tenancy calculator",
    "break lease costs",
    "advertising fees",
    "rent liability"
  ],
  authors: [{ name: "Mohammed Isa", url: "https://github.com/4mohdisa" }],
  creator: "Mohammed Isa",
  publisher: "Mohammed Isa",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://github.com/4mohdisa/leasebreak-calculator"),
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: "https://github.com/4mohdisa/leasebreak-calculator",
    title: "LeaseBreak Calculator | SACAT-Compliant Lease Break Cost Calculator",
    description: "Calculate your South Australian lease break costs and reletting fees accurately using SACAT-compliant formulas. Get instant estimates for advertising costs and maximum rent liability periods.",
    siteName: "LeaseBreak Calculator",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "LeaseBreak Calculator - SACAT-Compliant Lease Break Cost Calculator"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "LeaseBreak Calculator | SACAT-Compliant Lease Break Cost Calculator",
    description: "Calculate your South Australian lease break costs and reletting fees accurately using SACAT-compliant formulas.",
    creator: "@4mohdisa",
    images: ["/og-image.png"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "verification_token",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReduxProvider>
            <div className="relative flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
