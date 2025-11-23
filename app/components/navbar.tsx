"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { ThemeToggle } from "@/components/theme-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import React from "react"
import { Menu } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()

  const closeMenu = () => setIsOpen(false)

  const MenuItems = () => (
    <>
      <NavigationMenuItem>
        <Link
          href="/"
          onClick={closeMenu}
          className={cn(
            "py-2 px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-sm",
            pathname === "/" && "bg-accent text-accent-foreground"
          )}
        >
          Home
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link
          href="/calculators"
          onClick={closeMenu}
          className={cn(
            "py-2 px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-sm",
            pathname === "/calculators" && "bg-accent text-accent-foreground"
          )}
        >
          Lease Calculators
        </Link>
      </NavigationMenuItem>
      <NavigationMenuItem>
        <Link
          href="/landlord-income"
          onClick={closeMenu}
          className={cn(
            "py-2 px-4 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-sm",
            pathname === "/landlord-income" && "bg-accent text-accent-foreground"
          )}
        >
          Landlord Income
        </Link>
      </NavigationMenuItem>
    </>
  )

  return (
    <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between py-4 px-2">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold">LeaseCal</span>
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
                    <span className="text-2xl font-bold">LeaseCal</span>
                  </div>
                  <NavigationMenu className="mt-6">
                    <NavigationMenuList className="flex flex-col space-y-2">
                      <MenuItems />
                    </NavigationMenuList>
                  </NavigationMenu>
                  <div className="mt-auto border-t py-4">
                    <p className="text-sm text-muted-foreground">
                      &copy; {new Date().getFullYear()} LeaseCal
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
