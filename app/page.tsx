import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { AdvertisingFeeCalculator } from "./calculators/advertising-fee"
import { RelettingFeeCalculator } from "./calculators/reletting-fee"
import { Masthead } from "./components/masthead"
import { AboutSection } from "./components/about-section"
import { QASection } from "./components/qa-section"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Masthead />
      <main className="flex-grow">
        {/* Calculator Section */}
        <section 
          className="w-full py-12 md:py-20" 
          id="calculator"
        >
          <div className="container mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center mx-auto max-w-3xl space-y-8 text-center">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Lease Break Calculators
              </h2>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Use our calculators to estimate your reletting fee or advertising costs when breaking a lease.
              </p>
            </div>
            
            {/* Calculator Card */}
            <div className="mt-8 flex justify-center">
              <Card className="w-full max-w-3xl mx-auto">
                <CardContent className="p-6">
                  <Tabs defaultValue="reletting" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="reletting">Reletting Fee</TabsTrigger>
                      <TabsTrigger value="advertising">Advertising Fee</TabsTrigger>
                    </TabsList>
                    <div className="mt-6">
                      <TabsContent value="reletting" className="space-y-4">
                        <RelettingFeeCalculator />
                      </TabsContent>
                      <TabsContent value="advertising" className="space-y-4">
                        <AdvertisingFeeCalculator />
                      </TabsContent>
                    </div>
                  </Tabs>
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
      </main>
    </div>
  )
}