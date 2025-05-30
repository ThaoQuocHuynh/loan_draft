'use client';

import { useState } from 'react';
import { ChevronsUpDown, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Claim } from '@/types/authorization';
import { ClaimsTree } from './ClaimsTree';

interface ClaimsSelectProps {
  claims: Claim[];
  selectedClaimIds: string[];
  onSelectionChange: (selectedClaimIds: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function ClaimsSelect({
  claims,
  selectedClaimIds,
  onSelectionChange,
  placeholder = 'Select claims...',
  className,
}: ClaimsSelectProps) {
  const [open, setOpen] = useState(false);

  // Get selected claims
  const selectedClaims = claims.filter(claim => selectedClaimIds.includes(claim.id));

  // Handle claim selection/deselection
  const handleClaimChange = (claimId: string, checked: boolean) => {
    // Get all descendant claim IDs
    const getAllDescendantIds = (parentId: string): string[] => {
      const directChildren = claims.filter(c => c.parentId === parentId);
      const childIds = directChildren.map(c => c.id);
      const descendantIds = directChildren.flatMap(c => getAllDescendantIds(c.id));
      return [...childIds, ...descendantIds];
    };

    if (checked) {
      // Select this claim and all its descendants
      const descendantIds = getAllDescendantIds(claimId);
      onSelectionChange([...new Set([...selectedClaimIds, claimId, ...descendantIds])]);
    } else {
      // Deselect this claim and all its descendants
      const descendantIds = getAllDescendantIds(claimId);
      onSelectionChange(
        selectedClaimIds.filter(id => id !== claimId && !descendantIds.includes(id))
      );
    }
  };

  // Remove a single claim
  const removeClaim = (claimId: string) => {
    onSelectionChange(selectedClaimIds.filter(id => id !== claimId));
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between"
          >
            <div className="flex flex-wrap gap-1">
              {selectedClaims.length > 0 ? (
                selectedClaims.map(claim => (
                  <Badge key={claim.id} variant="secondary" className="mr-1">
                    {claim.name}
                    <button
                      className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          removeClaim(claim.id);
                        }
                      }}
                      onMouseDown={e => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        removeClaim(claim.id);
                      }}
                    >
                      <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                    </button>
                  </Badge>
                ))
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command className="rounded-lg border shadow-md">
            <CommandInput placeholder="Search claims..." className="h-9" />
            <CommandList className="max-h-[300px] overflow-y-auto">
              <CommandEmpty>No claims found.</CommandEmpty>
              <CommandGroup className="p-0">
                <div className="p-2">
                  <ClaimsTree
                    claims={claims}
                    selectedClaimIds={selectedClaimIds}
                    onClaimChange={handleClaimChange}
                    className="overflow-hidden"
                  />
                </div>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
