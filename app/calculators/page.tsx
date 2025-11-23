import type { Metadata } from "next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { AdvertisingFeeCalculator } from "./advertising-fee"
import { RelettingFeeCalculator } from "./reletting-fee"
import { RentCalculator } from "./rent-calculator"

export const metadata: Metadata = {
  title: "Lease Break Calculators | SACAT-Compliant Calculator for South Australia",
  description: "Calculate reletting fees, advertising costs, and rent estimates for lease termination in South Australia. SACAT-compliant calculations.",
  openGraph: {
    title: "Lease Break Calculators | SACAT-Compliant Calculator for South Australia",
    description: "Calculate reletting fees, advertising costs, and rent estimates for lease termination in South Australia. SACAT-compliant calculations.",
  },
}

export default function CalculatorsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Calculator Section */}
        <section className="w-full py-12 md:py-20">
          <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center mx-auto max-w-3xl space-y-8 text-center">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Lease Break Calculators
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Use our calculators to estimate your reletting fee or advertising costs when breaking a lease.
              </p>
            </div>

            {/* Calculator Card */}
            <div className="mt-8 flex justify-center">
              <Card className="w-full max-w-3xl mx-auto">
                <CardContent className="p-6">
                  <Tabs defaultValue="reletting" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="reletting">Reletting Fee</TabsTrigger>
                      <TabsTrigger value="advertising">Advertising Fee</TabsTrigger>
                      <TabsTrigger value="rent">Rent Calculator</TabsTrigger>
                    </TabsList>
                    <div className="mt-6">
                      <TabsContent value="reletting" className="space-y-4">
                        <RelettingFeeCalculator />
                      </TabsContent>
                      <TabsContent value="advertising" className="space-y-4">
                        <AdvertisingFeeCalculator />
                      </TabsContent>
                      <TabsContent value="rent" className="space-y-4">
                        <RentCalculator />
                      </TabsContent>
                    </div>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
