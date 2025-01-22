import { Coffee } from "lucide-react"
import { Button } from "@/components/ui/button"

export function BuyMeCoffee() {
  return (
    <section id="support" className="w-full py-16 md:py-24 border-t border-border/40 bg-muted/50">
      <div className="container flex flex-col items-center text-center max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Support My Work</h2>
        <p className="text-muted-foreground mb-6 max-w-2xl">
          If you find my tools helpful and would like to see more free resources like this, 
          consider buying me a coffee! All my services are free to use, and your support helps 
          me continue creating useful tools for the community.
        </p>
        <Button
          asChild
          className="bg-[#FFDD00] text-black hover:bg-[#FFDD00]/90 font-medium"
        >
          <a
            href="https://www.buymeacoffee.com/4mohdisa"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2"
          >
            <Coffee className="h-4 w-4" />
            Buy me a coffee
          </a>
        </Button>
      </div>
    </section>
  )
}
