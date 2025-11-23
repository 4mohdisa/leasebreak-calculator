import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Masthead } from "./components/masthead"
import { AboutSection } from "./components/about-section"
import { QASection } from "./components/qa-section"
import { AboutMeSection } from "./components/about-me-section"
import { BuyMeCoffee } from "./components/buy-me-coffee"
import { Calculator, DollarSign, ArrowRight } from "lucide-react"

export const metadata: Metadata = {
  title: "Home | SACAT-Compliant Lease Break Calculator for South Australia",
  description: "Calculate early lease termination costs in South Australia with our SACAT-compliant calculator. Get accurate estimates for reletting fees and advertising costs.",
  openGraph: {
    title: "Home | SACAT-Compliant Lease Break Calculator for South Australia",
    description: "Calculate early lease termination costs in South Australia with our SACAT-compliant calculator. Get accurate estimates for reletting fees and advertising costs.",
  },
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Masthead />
      <main className="flex-grow">
        {/* Calculator Options Section */}
        <section className="w-full py-12 md:py-20" id="calculators">
          <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center mx-auto max-w-3xl space-y-8 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Choose Your Calculator
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Select the calculator that best fits your needs
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {/* Lease Break Calculators Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <Calculator className="h-6 w-6 text-primary" />
                    <CardTitle>Lease Break Calculators</CardTitle>
                  </div>
                  <CardDescription>
                    Calculate reletting fees, advertising costs, and rent estimates for lease termination
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                    <li>✓ Reletting Fee Calculator</li>
                    <li>✓ Advertising Fee Calculator</li>
                    <li>✓ Rent Calculator</li>
                    <li>✓ SACAT-Compliant Formulas</li>
                  </ul>
                  <Link href="/calculators">
                    <Button className="w-full">
                      Go to Calculators
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Landlord Income Calculator Card */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-6 w-6 text-primary" />
                    <CardTitle>Landlord&apos;s Income Breakdown</CardTitle>
                  </div>
                  <CardDescription>
                    Track and analyze your property&apos;s financial performance with detailed income breakdown
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6 text-sm text-muted-foreground">
                    <li>✓ Monthly Income Tracking</li>
                    <li>✓ Expense Management</li>
                    <li>✓ Net Income Analysis</li>
                    <li>✓ CSV Export</li>
                  </ul>
                  <Link href="/landlord-income">
                    <Button className="w-full">
                      Go to Income Calculator
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* About and QA Sections */}
        <div className="flex flex-col items-center w-full">
          <AboutSection />
          <QASection />
        </div>

        <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
          <AboutMeSection />
        </div>
        <BuyMeCoffee />
      </main>
    </div>
  )
}