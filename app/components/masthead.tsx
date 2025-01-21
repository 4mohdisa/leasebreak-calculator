import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Masthead() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 xl:py-48 bg-background">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center max-w-4xl mx-auto text-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Early Lease Termination Calculator
            </h1>
            <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl">
              Accurately calculate your lease break costs using official SACAT formulas.
              Get instant estimates for advertising and reletting fees in South Australia.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-8 md:mt-12">
            <Button size="lg" asChild>
              <a href="#calculator" className="text-lg">
                Calculate Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <a 
                href="https://www.sa.gov.au/topics/housing/renting-and-letting/renting-privately/ending-a-tenancy/Ending-a-fixed-term-lease-early" 
                target="_blank" 
                rel="noreferrer"
                className="text-lg"
              >
                SACAT Guidelines
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 md:mt-24 w-full">
            <div className="flex flex-col justify-center space-y-3 rounded-lg border-2 p-6 bg-card">
              <h3 className="text-xl font-bold">Reletting Fee Calculator</h3>
              <p className="text-muted-foreground">
                Calculate your reletting fee based on weekly rent, GST, and remaining lease term using SACAT&apos;s official formula
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-3 rounded-lg border-2 p-6 bg-card">
              <h3 className="text-xl font-bold">Advertising Cost Calculator</h3>
              <p className="text-muted-foreground">
                Determine your share of advertising costs based on your remaining lease term and total advertising expenses
              </p>
            </div>
            <div className="flex flex-col justify-center space-y-3 rounded-lg border-2 p-6 bg-card">
              <h3 className="text-xl font-bold">SACAT Compliance</h3>
              <p className="text-muted-foreground">
                All calculations follow the South Australian Civil and Administrative Tribunal&apos;s prescribed formulas and guidelines
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}