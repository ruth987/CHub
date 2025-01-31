import Link from "next/link"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Cross } from 'lucide-react';


export function Navbar() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-transparent/30 backdrop-blur-sm">
      <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-white">
            Chris<span className="text-yellow-400 inline-flex w-6 h-6 mb-1"><Cross /></span>
            ian<span className="text-yellow-400">Hub</span>
          </span>
        </Link>

        {/* Navigation */}
        <NavigationMenu>
          <NavigationMenuList className="space-x-4">
            <NavigationMenuItem>
              <Link href="/bible-plans" className="text-white hover:text-yellow-400 transition mr-4">
                Bible Plans
              </Link>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <Link href="/community" className="text-white hover:text-yellow-400 transition">
                Community
              </Link>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger className="text-white bg-transparent hover:bg-white/10">
                Resources
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid gap-3 p-4 w-[200px]">
                  <Link href="/devotionals" className="block p-2 hover:bg-accent rounded-md">
                    Daily Devotionals
                  </Link>
                  <Link href="/posts" className="block p-2 hover:bg-accent rounded-md">
                    Ask Questions
                  </Link>
                  <Link href="/study-groups" className="block p-2 hover:bg-accent rounded-md">
                    Study Groups
                  </Link>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <Link href="/login" className="text-white hover:text-yellow-400 transition">
                Login
              </Link>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </div>
  )
}