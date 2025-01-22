import { Metadata, Viewport } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Terms of service for the LeaseBreak Calculator. Understand your rights and responsibilities when using our SACAT-compliant lease break cost calculator.',
  openGraph: {
    title: 'Terms of Service | LeaseBreak Calculator SA',
    description: 'Terms of service for the LeaseBreak Calculator. Understand your rights and responsibilities when using our calculator.',
  },
}

export default function TermsOfService() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-6">Terms of Service</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-6">Last updated: January 23, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the LeaseBreak Calculator, you agree to be bound by these Terms
              of Service. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Calculator Usage</h2>
            <p>
              The LeaseBreak Calculator is designed to provide estimates for lease break costs based
              on South Australian Civil and Administrative Tribunal (SACAT) guidelines. However:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>All calculations are estimates only and should not be considered legal advice</li>
              <li>Results may vary depending on specific circumstances and legal interpretations</li>
              <li>Users should verify all calculations with relevant authorities or legal professionals</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. Disclaimer of Warranties</h2>
            <p>
              The calculator is provided &rdquo;as is&rdquo; without any warranties of any kind, either express
              or implied. We do not warrant that
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>The calculator will be error-free or uninterrupted</li>
              <li>Calculations will be 100% accurate in all circumstances</li>
              <li>The service will meet your specific requirements</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Limitation of Liability</h2>
            <p>
              We shall not be liable for any direct, indirect, incidental, special, consequential,
              or punitive damages resulting from:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Use or inability to use the calculator</li>
              <li>Any decisions made based on calculator results</li>
              <li>Errors, mistakes, or inaccuracies in calculations</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. User Responsibilities</h2>
            <p>As a user of the &quot;LeaseBreak Calculator&quot;, you agree to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate information for calculations</li>
              <li>Use the calculator for its intended purpose</li>
              <li>Not attempt to manipulate or exploit the calculator</li>
              <li>Seek professional advice for important decisions</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Your continued use of the calculator after changes indicates
              acceptance of the modified terms.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
            <p>
              These terms are governed by and construed in accordance with the laws of South
              Australia. Any disputes shall be subject to the exclusive jurisdiction of the courts
              of South Australia.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
            <p>
              For questions about these Terms of Service, please contact us through the About
              section of our website.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
