"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "What happens when I break a fixed-term lease early?",
    answer:
      "When you end a fixed-term lease early, you are responsible for certain costs unless the landlord agrees not to claim them. These costs typically include: 1) Loss of rent (subject to maximum timeframes), 2) Advertising costs, and 3) Reletting fees charged to the landlord by the agent. Any agreement by the landlord not to claim these costs must be in writing.",
  },
  {
    question: "How is the advertising fee calculated?",
    answer:
      "The advertising fee follows SACAT's formula: Total advertising costs × remaining weeks until lease end ÷ (¾ of the total lease term in weeks). For example, in a 2-year lease (104 weeks), with 12 weeks remaining and $87 advertising cost, the calculation would be: ($87 × 12) ÷ (78 weeks) = $13.38. This applies to all advertising costs, including those placed before you move out.",
  },
  {
    question: "How is the reletting fee calculated?",
    answer:
      "The reletting fee is calculated using SACAT's formula and includes GST. The maximum fee is two weeks' rent (including GST) multiplied by the remaining weeks, divided by ¾ of the total lease term. For example, with a $110/week rent (including GST), 12 weeks remaining in a one-year lease: ($110 × 2 × 12) ÷ (39 weeks) = $67.69.",
  },
  {
    question: "What are the maximum rent payment requirements?",
    answer:
      "If less than 24 months remain on your lease, you won't pay more than one month's rent. For leases with more than 24 months remaining, you'll pay one month's rent for each 12-month period remaining, calculated from your leaving date. The maximum total rent payment is capped at 6 months, regardless of the remaining lease term. This is separate from reletting and advertising fees.",
  },
  {
    question: "What is the landlord's responsibility when I break the lease?",
    answer:
      "The landlord must try to relet the property as soon as possible (known as 'mitigating the loss'). You can verify this by checking if: 1) The property is being advertised appropriately, 2) It's being shown to prospective tenants, 3) The rent amount is reasonable for the current market, and 4) The asking rent isn't unnecessarily high, which could delay finding a new tenant.",
  },
  {
    question: "Can I end a lease early due to hardship?",
    answer:
      "You can apply to SACAT to end the tenancy if continuing it will cause 'undue hardship'. However, it's important to note that financial difficulties alone generally don't qualify as undue hardship. Each case is assessed individually by SACAT.",
  },
]

export function QASection() {
  return (
    <section className="w-full py-16 md:py-24 lg:py-32" id="faq">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12 md:mb-16">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
              Essential information about breaking a lease early in South Australia
            </p>
          </div>
        </div>
        
        <div className="flex justify-center w-full">
          <div className="w-full max-w-3xl">
            <Accordion type="single" collapsible className="border-2 rounded-lg">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left px-6">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground px-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  )
}