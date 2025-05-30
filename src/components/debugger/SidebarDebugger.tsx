"use client"

import { useUser } from "@/contexts/UserContext"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

export function SidebarDebugger() {
  const { currentUser, switchUser } = useUser()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-full justify-start">
          <div className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            <span>{currentUser?.name || "Select User"}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Switch User</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Admin</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => switchUser("admin-1")}>Admin User (System Administrator)</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>Internal Users</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => switchUser("underwriter-1")}>Alex Johnson (Underwriter)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchUser("auditor-1")}>Sam Williams (Auditor)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchUser("pipeline-manager-1")}>
          Taylor Smith (Pipeline Manager)
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>External Users</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => switchUser("lender-1")}>Jordan Lee (Mortgage Lender)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
