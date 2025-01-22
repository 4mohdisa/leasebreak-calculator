import { Metadata, Viewport } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy policy for the LeaseBreak Calculator. Learn how we handle your data and protect your privacy when using our SACAT-compliant lease break cost calculator.',
  openGraph: {
    title: 'Privacy Policy | LeaseBreak Calculator SA',
    description: 'Privacy policy for the LeaseBreak Calculator. Learn how we handle your data and protect your privacy.',
  },
}

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-6">Privacy Policy</CardTitle>
        </CardHeader>
        <CardContent className="prose dark:prose-invert max-w-none">
          <p className="text-lg mb-6">Last updated: January 23, 2025</p>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to the LeaseBreak Calculator Privacy Policy. This policy describes how we collect,
              use, and protect your personal information when you use our calculator service.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <p>We collect the following types of information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Calculator inputs (lease terms, dates, and financial information)</li>
              <li>Usage statistics (how you interact with our calculators)</li>
              <li>Technical information (browser type, device information)</li>
            </ul>
            <p>We do not collect or store any personally identifiable information.</p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use the collected information to:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Provide accurate lease break calculations</li>
              <li>Improve our calculator functionality</li>
              <li>Analyze usage patterns to enhance user experience</li>
              <li>Fix technical issues and optimize performance</li>
            </ul>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">4. Data Storage and Security</h2>
            <p>
              All calculations are performed client-side in your browser. We do not store your
              calculation data on our servers. Any persistent data is stored locally on your device
              using standard web storage technologies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">5. Analytics and Cookies</h2>
            <p>
              We use Google Analytics to understand how users interact with our calculators. This
              service may use cookies to collect anonymous usage data. You can opt out of analytics
              tracking through your browser settings.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">6. Third-Party Services</h2>
            <p>
              Our calculator may use third-party services for:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Analytics (Google Analytics)</li>
              <li>Content delivery networks (CDN)</li>
              <li>Error tracking and monitoring</li>
            </ul>
            <p>
              These services may collect anonymous usage data according to their own privacy policies.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">7. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through the About
              section of our website.
            </p>
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
