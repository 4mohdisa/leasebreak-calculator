"use client"

import * as React from "react"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"

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
