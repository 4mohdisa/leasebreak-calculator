import { Mail } from "lucide-react"

export function ContactSection() {
  return (
    <section id="contact" className="w-full py-16 md:py-24 border-t border-border/40">
      <div className="container flex flex-col items-center text-center max-w-3xl mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
        <p className="text-muted-foreground mb-6">
          Have suggestions for improvements or noticed any errors? Feel free to reach out.
        </p>
        <a
          href="mailto:mohdisa233@gmail.com"
          className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
        >
          <Mail className="h-4 w-4" />
          mohdisa233@gmail.com
        </a>
      </div>
    </section>
  )
}
