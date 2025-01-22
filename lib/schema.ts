export function generateCalculatorSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "LeaseBreak Calculator SA",
    "applicationCategory": "FinanceApplication",
    "operatingSystem": "Any",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "AUD"
    },
    "description": "Free calculator for estimating lease break costs in South Australia. SACAT-compliant calculations for reletting fees and advertising costs.",
    "browserRequirements": "Requires JavaScript. Requires HTML5.",
    "softwareVersion": "1.0.0",
    "author": {
      "@type": "Organization",
      "name": "LeaseBreak Calculator",
      "url": "https://leasebreak-calculator.vercel.app"
    }
  }
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "LeaseBreak Calculator",
    "url": "https://leasebreak-calculator.vercel.app",
    "logo": "https://leasebreak-calculator.vercel.app/icon-512x512.png",
    "sameAs": [
      "https://github.com/4mohdisa/leasebreak-calculator"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "url": "https://leasebreak-calculator.vercel.app/#contact"
    }
  }
}
