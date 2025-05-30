import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CollapsiblePanelProps {
  children: React.ReactNode
  side: "left" | "right"
  isCollapsed: boolean
  onToggle: () => void
  width?: number
}

export function CollapsiblePanel({ children, side, isCollapsed, onToggle, width = 320 }: CollapsiblePanelProps) {
  return (
    <div
      className={cn(
        "relative transition-all duration-200 ease-in-out",
        isCollapsed ? "w-0" : "w-80"
      )}
      style={{ width: isCollapsed ? 0 : width }}
    >
      <div
        className={cn(
          "absolute top-1/2 -translate-y-1/2 z-10",
          side === "left" ? "-right-3" : "-left-3"
        )}
      >
        <Button
          variant="outline"
          size="icon"
          className="h-6 w-6 rounded-full border bg-background"
          onClick={onToggle}
        >
          {side === "left" ? (
            isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
          ) : (
            isCollapsed ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
          )}
        </Button>
      </div>
      <div
        className={cn(
          "h-full transition-all duration-200 ease-in-out",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}
      >
        {children}
      </div>
    </div>
  )
} 