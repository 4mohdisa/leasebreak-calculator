import type { Metadata } from "next"
import { LandlordIncomeCalculator } from "../calculators/landlord-income"

export const metadata: Metadata = {
  title: "Landlord's Income Breakdown | Property Financial Calculator",
  description: "Track and analyze your property's financial performance with our comprehensive income breakdown calculator. Calculate net income, expenses, and home loan interest deductions.",
  openGraph: {
    title: "Landlord's Income Breakdown | Property Financial Calculator",
    description: "Track and analyze your property's financial performance with our comprehensive income breakdown calculator. Calculate net income, expenses, and home loan interest deductions.",
  },
}

export default function LandlordIncomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Landlord Income Calculator Section */}
        <section className="w-full py-12 md:py-20">
          <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center mx-auto max-w-3xl space-y-8 text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Landlord&apos;s Income Breakdown
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Track and analyze your property&apos;s financial performance with our comprehensive income breakdown calculator.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left w-full">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">📊 Monthly Breakdown</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Get a detailed view of your monthly income and expenses, including rent, fees, utilities, and maintenance costs.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">💰 Net Income Analysis</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Calculate your actual returns after accounting for all expenses and deductions, including home loan interest.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">📥 Export Features</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Download your financial breakdown as a CSV file for record-keeping or further analysis in your preferred spreadsheet software.
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold">🔄 Real-time Updates</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    See how changes in expenses or income affect your bottom line with instant calculations and updates.
                  </p>
                </div>
              </div>
            </div>
            <LandlordIncomeCalculator />
          </div>
        </section>
      </main>
    </div>
  )
}
