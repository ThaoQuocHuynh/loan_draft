interface SecuredProps {
  /** Who may see it at all */
  view?: string[];
  /** Who may modify it; others get it disabled/read‑only */
  edit?: string[];
  children: React.ReactElement<{ disabled?: boolean }>;
}

type RoleType = "internal" | "external" | "admin"

// Types
interface Claim {
  id: string
  name: string
  key: string
  description: string
  parentId: string | null
  isSystem: boolean // Flag to indicate if this is a system claim
}

interface Policy {
  id: string
  name: string
  description: string
  conditions: string // JSON string of conditions
}

interface Role {
  id: string
  name: string
  key: string
  type: RoleType
  description: string
  claims?: Claim[]
  policies?: Policy[]
}


interface ClaimAssignment {
  id: string
  targetType: "role" | "user"
  targetId: string
  claimId: string
  value?: string | number | boolean | Date
}

interface PolicyAssignment {
  id: string
  targetType: "role" | "user"
  targetId: string
  policyId: string
}

interface RoleAssignment {
  id: string
  userId: string
  roleId: string
}

export type { Role, Claim, Policy, RoleType, ClaimAssignment, PolicyAssignment, RoleAssignment }
export type { SecuredProps }
