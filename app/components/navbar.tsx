"use client"

import * as React from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"

import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

const calculators: { title: string; href: string; description: string }[] = [
  {
    title: "Reletting Fee",
    href: "/calculators/reletting-fee",
    description: "Calculate the reletting fee for breaking your lease early.",
  },
  {
    title: "Break Lease Cost",
    href: "/calculators/break-lease",
    description: "Estimate the total cost of breaking your lease agreement.",
  },
]

export function Navbar() {
  return (
    <div className="border-b-2">
      <div className="container mx-auto flex items-center justify-between py-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">LeaseCalc</span>
        </Link>
        <div className="flex items-center space-x-4">
          <NavigationMenu>
            <NavigationMenuList className="flex items-center space-x-4">
              <NavigationMenuItem>
                <Link href="/" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/about" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    About
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <ThemeToggle />
        </div>
      </div>
    </div>
  )
}
