import { ArrowRight, Calculator, Shield, Clock, BarChartIcon as ChartBar, Scale, HelpCircle, DollarSign } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const features = [
  {
    title: "Official SACAT Formulas",
    description:
      "Uses the exact formulas prescribed by SACAT for both advertising costs and reletting fees, ensuring precise GST calculations and term adjustments.",
    icon: Shield,
  },
  {
    title: "Comprehensive Cost Calculations",
    description:
      "Automatically manages complex calculations including three-quarter term adjustments, GST additions, and maximum fee limits as per SACAT guidelines.",
    icon: Calculator,
  },
  {
    title: "Detailed Cost Breakdown",
    description:
      "Provides a transparent breakdown of all costs, including advertising fees, reletting charges, and rent liability periods based on your lease term.",
    icon: ChartBar,
  },
  {
    title: "Landlord’s Income Breakdown",
    description:
      "Track your rental income, expenses, and net returns with a detailed financial breakdown, including maintenance, insurance, and council levies.",
    icon: DollarSign,
  },
  {
    title: "Instant & Flexible Results",
    description:
      "Get immediate calculations for reletting and advertising fees. Choose between direct week input or date-based calculations for different lease terms.",
    icon: Clock,
  },
  {
    title: "Legal & Compliance Guidance",
    description:
      "Stay informed with compliance details, landlord obligations, and official SACAT resources to ensure proper adherence to rental laws.",
    icon: HelpCircle,
  },
]


export function AboutSection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32 bg-gray-50 dark:bg-[hsl(var(--background))]" id="about">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              About LeaseBreak Calculator
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              A precise, SACAT-compliant calculator for early lease termination costs in South Australia
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="h-full dark:bg-[hsl(var(--background))]">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <feature.icon className="h-6 w-6 text-primary" />
                  <span className="text-lg">{feature.title}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-16 flex flex-col items-center justify-center space-y-4 text-center">
          <p className="text-muted-foreground">
            For more information about early lease termination in South Australia
          </p>
          <Button asChild variant="outline" size="lg" className="group">
            <a
              href="https://www.sa.gov.au/topics/housing/renting-and-letting/renting-privately/ending-a-tenancy/Ending-a-fixed-term-lease-early"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center"
            >
              Visit SA.GOV.AU Official Guidelines
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}