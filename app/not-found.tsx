import { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "Sorry, the page you're looking for doesn't exist.",
}

export default function NotFound() {
  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">404 - Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-lg text-muted-foreground">
            We can&apos;t find the page you&apos;re looking for.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/">
              <Button>
                Return Home
              </Button>
            </Link>
            <Link href="/#calculator">
              <Button variant="outline">
                Go to Calculator
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
