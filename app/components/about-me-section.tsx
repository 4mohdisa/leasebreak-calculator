import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AboutMeSection() {
  return (
    <section id="about" className="w-full py-16 md:py-24 border-t border-border/40">
      <div className="container px-4">
        <div className="grid gap-8 md:grid-cols-2 items-center max-w-5xl mx-auto">
          <div className="relative aspect-square overflow-hidden rounded-xl">
            <Image
              src="/IMG.jpeg"
              alt="Mohammed Isa"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col space-y-4">
            <h2 className="text-2xl font-semibold">About Me</h2>
            <p className="text-muted-foreground">
              Hi, I&apos;m Mohammed Isa, currently pursuing a Bachelor of IT in Adelaide. I have a 
              passion for technology and innovation, always eager to explore new opportunities and 
              contribute to impactful projects. I&apos;m driven by a desire to solve problems and 
              stay ahead in the ever-evolving tech landscape.
            </p>
            <p className="text-muted-foreground">
              Currently working as a Property Manager at <a href="https://www.wemark.com.au/company/our-team/mohammed-isa" className="text-primary">Wemark Real Estate</a> , bringing practical
              industry experience to this calculator.
            </p>
            <div className="pt-4">
              <Button asChild>
                <a href="https://isaxcode.com" target="_blank" rel="noreferrer">
                  Read More About Me
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
