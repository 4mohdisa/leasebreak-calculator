import Link from "next/link"
import { X, Github, Linkedin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="w-full border-t-2 border-border/40 bg-background/95 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center space-y-6 text-center">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">LeaseCalc</span>
          </Link>

          <nav className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            <Link href="/about" className="hover:underline">
              About
            </Link>
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
          </nav>

          <div className="flex flex-col items-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Built by{" "}
              <a
                href="https://isaxcode.com"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                isaxcode.com
              </a>
            </p>
            <p className="text-sm text-muted-foreground">
              The source code is available on{" "}
              <a
                href="https://github.com/4mohdisa/leasebreak-calculator"
                target="_blank"
                rel="noreferrer"
                className="font-medium underline underline-offset-4 hover:text-primary"
              >
                GitHub
              </a>
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <a href="https://twitter.com/4mohdisa" target="_blank" rel="noreferrer" aria-label="Twitter">
                <X className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://github.com/4mohdisa" target="_blank" rel="noreferrer" aria-label="GitHub">
                <Github className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="https://linkedin.com/in/4mohdisa" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <Linkedin className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>

        <Separator className="my-6" />

        <div className="text-center text-sm text-muted-foreground">
          {new Date().getFullYear()} LeaseCalc. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
