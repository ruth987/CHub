import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HeaderProps {
  username: string
}

export function DashboardHeader({ username }: HeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome back, {username}!</p>
      </div>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-white" />
          <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-yellow-500 text-xs flex items-center justify-center text-black">
            3
          </span>
        </Button>
        <Avatar>
          <AvatarImage src="/avatars/default.jpg" alt="Profile" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}