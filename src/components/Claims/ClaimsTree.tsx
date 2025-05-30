"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChevronDown, ChevronRight, ShieldAlert } from "lucide-react"
import { Claim } from "@/types/authorization"

interface ClaimsTreeProps {
  claims: Claim[]
  selectedClaimIds: string[]
  onClaimChange: (claimId: string, checked: boolean) => void
  className?: string
}

export function ClaimsTree({ claims, selectedClaimIds, onClaimChange, className = "" }: ClaimsTreeProps) {
  const [expandedClaims, setExpandedClaims] = useState<Record<string, boolean>>({})

  // Get root level claims (no parent)
  const getRootClaims = () => {
    return claims.filter((claim) => claim.parentId === null)
  }

  // Get child claims for a parent
  const getChildClaims = (parentId: string) => {
    return claims.filter((claim) => claim.parentId === parentId)
  }

  // Toggle expanded state for a claim group
  const toggleClaimGroup = (id: string) => {
    setExpandedClaims((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Render a claim item with its children
  const renderClaimItem = (claim: Claim, level = 0) => {
    const children = getChildClaims(claim.id)
    const hasChildClaims = children.length > 0
    const isExpanded = expandedClaims[claim.id] || false

    return (
      <div key={claim.id}>
        <div className="flex items-center py-2" style={{ paddingLeft: level > 0 ? `${level * 20}px` : "0" }}>
          {hasChildClaims && (
            <button
              type="button"
              className="mr-1 h-4 w-4 flex items-center justify-center rounded-sm hover:bg-accent"
              onClick={() => toggleClaimGroup(claim.id)}
            >
              {isExpanded ? (
                <ChevronDown className="h-3 w-3" />
              ) : (
                <ChevronRight className="h-3 w-3" />
              )}
            </button>
          )}
          {!hasChildClaims && <div className="w-4" />}
          <Checkbox
            id={`claim-${claim.id}`}
            checked={selectedClaimIds.includes(claim.id)}
            onCheckedChange={(checked) => onClaimChange(claim.id, checked === true)}
          />
          <Label htmlFor={`claim-${claim.id}`} className="ml-2 cursor-pointer flex items-center">
            {claim.name}
            <span className="ml-2 text-xs text-muted-foreground">({claim.key})</span>
            {claim.isSystem && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="ml-2 bg-amber-50 text-amber-700 border-amber-200">
                      <ShieldAlert className="h-3 w-3 mr-1" />
                      System
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>System-defined claim</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </Label>
        </div>

        {hasChildClaims && isExpanded && (
          <div className="pl-4">
            {children.map((child) => renderClaimItem(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className={className}>
      {getRootClaims().map((claim) => renderClaimItem(claim))}
    </div>
  )
} 