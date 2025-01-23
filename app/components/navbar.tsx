"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useSmoothScroll } from "@/app/hooks/use-smooth-scroll"
import { useActiveSection } from "@/app/hooks/use-active-section"
import { cn } from "@/lib/utils"
import React from "react"
import { Menu } from "lucide-react"

const SECTIONS = ["leasebreakcalculator", "about", "support", "contact"]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const scrollToSection = useSmoothScroll()
  const activeSection = useActiveSection(SECTIONS)

  const closeMenu = () => setIsOpen(false)

  const MenuItems = () => (
    <>
      <NavigationMenuItem>
        <a
          href="#leasebreakcalculator"
          onClick={(e) => {
            scrollToSection(e, "leasebreakcalculator")
            closeMenu()
          }}
          className={cn(
            "py-2 px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-sm",
            activeSection === "leasebreakcalculator" && "bg-accent text-accent-foreground"
          )}
        >
          Calculators
        </a>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <a
          href="#about"
          onClick={(e) => {
            scrollToSection(e, "about")
            closeMenu()
          }}
          className={cn(
            "py-2 px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-sm",
            activeSection === "about" && "bg-accent text-accent-foreground"
          )}
        >
          About
        </a>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <a
          href="#support"
          onClick={(e) => {
            scrollToSection(e, "support")
            closeMenu()
          }}
          className={cn(
            "py-2 px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-sm",
            activeSection === "support" && "bg-accent text-accent-foreground"
          )}
        >
          Support
        </a>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <a
          href="#contact"
          onClick={(e) => {
            scrollToSection(e, "contact")
            closeMenu()
          }}
          className={cn(
            "py-2 px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-sm",
            activeSection === "contact" && "bg-accent text-accent-foreground"
          )}
        >
          Contact
        </a>
      </NavigationMenuItem>
    </>
  )

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between py-4 px-2">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">LeaseCalc</span>
        </Link>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block">
            <NavigationMenu>
              <NavigationMenuList className="flex items-center space-x-4">
                <MenuItems />
              </NavigationMenuList>
            </NavigationMenu>
          </div>
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col h-full">
                  <div className="border-b py-4">
                    <span className="text-2xl font-bold">LeaseCalc</span>
                  </div>
                  <NavigationMenu className="mt-6">
                    <NavigationMenuList className="flex flex-col space-y-2">
                      <MenuItems />
                    </NavigationMenuList>
                  </NavigationMenu>
                  <div className="mt-auto border-t py-4">
                    <p className="text-sm text-muted-foreground">
                      &copy; {new Date().getFullYear()} LeaseCalc
                    </p>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </div>
  )
}
