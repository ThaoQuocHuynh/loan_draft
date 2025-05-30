import { ReactNode } from "react"

interface ToolbarProps {
  name: string
  description: string
  children: ReactNode
}

function Toolbar({ name, description, children }: ToolbarProps) {  
  return (
    <>
      <div className="flex items-center justify-between border rounded-md p-2 bg-background">
        <div>
          <h1 className="text-xl font-bold">{name}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <div className="flex items-center gap-2">        
          {children}
        </div>
      </div>
    </>
  )
}

export { Toolbar }
