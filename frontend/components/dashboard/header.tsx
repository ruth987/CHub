import { Bell, User, BookOpen, Settings, LogOut, Heart, Hand } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import { useLogout } from "@/hooks/auth"

interface HeaderProps {
  username: string
}

export function DashboardHeader({ username }: HeaderProps) {
  const router = useRouter()

  const { mutate: logout } = useLogout()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {username.charAt(0).toUpperCase() + username.slice(1)}!</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-white" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-500 text-xs flex items-center justify-center text-black">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="cursor-pointer">
              <Avatar>
                <AvatarImage src="/avatars/default.jpg" alt="Profile" />
                <AvatarFallback>{username?.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-gray-800 border-gray-700 text-white">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuGroup>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                onClick={() => router.push('/profile')}
              >
                <User className="mr-2 h-4 w-4 text-yellow-500" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                onClick={() => router.push('/bible-plans')}
              >
                <BookOpen className="mr-2 h-4 w-4 text-yellow-500" />
                <span>Bible Plans</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                onClick={() => router.push('/prayer-requests')}
              >
                <Hand className="mr-2 h-4 w-4 text-yellow-500" />
                <span>Prayer Requests</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            
            <DropdownMenuSeparator className="bg-gray-700" />
            {/* <DropdownMenuGroup>
              <DropdownMenuItem 
                className="cursor-pointer hover:bg-gray-700 focus:bg-gray-700"
                onClick={() => router.push('/settings')}
              >
                <Settings className="mr-2 h-4 w-4 text-yellow-500" />
                <span>Settings</span>
              </DropdownMenuItem>
            </DropdownMenuGroup> */}
            
            <DropdownMenuSeparator className="bg-gray-700" />
            <DropdownMenuItem 
              className="cursor-pointer text-red-400 hover:bg-gray-700 focus:bg-gray-700"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}