"use client"

import { Claim, Policy, Role } from "@/types/authorization"
import { User } from "@/types/user"
import { generateId } from "@/utils/id"
import { createContext, useContext, type ReactNode } from "react"

// Import mock API providers
import {
    createClaim as mockCreateClaim,
    deleteClaim as mockDeleteClaim,
    getClaims as mockGetClaims,
    updateClaim as mockUpdateClaim
} from "@/services/mock-claims-api"
import {
    createPolicy as mockCreatePolicy,
    deletePolicy as mockDeletePolicy,
    getPolicies as mockGetPolicies,
    updatePolicy as mockUpdatePolicy
} from "@/services/mock-policies-api"
import {
    addClaimToRole as mockAddClaimToRole,
    addPolicyToRole as mockAddPolicyToRole,
    createRole as mockCreateRole,
    deleteRole as mockDeleteRole,
    getRoleClaims as mockGetRoleClaims,
    getRolePolicies as mockGetRolePolicies,
    getRoles as mockGetRoles,
    removeClaimFromRole as mockRemoveClaimFromRole,
    removePolicyFromRole as mockRemovePolicyFromRole,
    updateRole as mockUpdateRole
} from "@/services/mock-roles-api"
import { getUsers as mockGetUsers } from "@/services/mock-users-api"

interface PermissionContextType {
  claims: Claim[]
  policies: Policy[]
  roles: Role[]
  users: User[]

  // CRUD operations
  addClaim: (claim: Omit<Claim, "id" | "isSystem">) => string
  updateClaim: (id: string, claim: Partial<Claim>) => void
  deleteClaim: (id: string) => void

  addPolicy: (policy: Omit<Policy, "id">) => string
  updatePolicy: (id: string, policy: Partial<Policy>) => void
  deletePolicy: (id: string) => void

  addRole: (role: Omit<Role, "id">) => string
  updateRole: (id: string, role: Partial<Role>) => void
  deleteRole: (id: string) => void

  getRolePolicies: (roleId: string) => Policy[]
  getRoleClaims: (roleId: string) => Claim[]

  addClaimToRole: (roleId: string, claimId: string) => void
  removeClaimFromRole: (roleId: string, claimId: string) => void
  addPolicyToRole: (roleId: string, policyId: string) => void
  removePolicyFromRole: (roleId: string, policyId: string) => void

  getUserRoles: (userId: string) => Role[]
  getUserClaims: (userId: string) => Claim[]
  getUserPolicies: (userId: string) => Policy[]
}

const PermissionContext = createContext<PermissionContextType | undefined>(undefined)

export function PermissionProvider({ children }: { children: ReactNode }) {
  // Load data from mock APIs
  const claims = mockGetClaims()
  const policies = mockGetPolicies()
  const roles = mockGetRoles()
  const users = mockGetUsers()

  // CRUD operations for claims
  const addClaim = (claim: Omit<Claim, "id" | "isSystem">) => {
    const newClaim = mockCreateClaim({ ...claim, id: generateId("claim"), isSystem: false } as Claim)
    return newClaim.id
  }

  const updateClaim = (id: string, claim: Partial<Claim>) => {
    const existingClaim = claims.find((c) => c.id === id)
    if (existingClaim?.isSystem) {
      console.error("Cannot modify system-defined claim")
      return
    }
    mockUpdateClaim({ ...existingClaim, ...claim } as Claim)
  }

  const deleteClaim = (id: string) => {
    const existingClaim = claims.find((c) => c.id === id)
    if (existingClaim?.isSystem) {
      console.error("Cannot delete system-defined claim")
      return
    }
    mockDeleteClaim(id)
  }

  // CRUD operations for policies
  const addPolicy = (policy: Omit<Policy, "id">) => {
    const newPolicy = mockCreatePolicy({ ...policy, id: generateId("policy") } as Policy)
    return newPolicy.id
  }

  const updatePolicy = (id: string, policy: Partial<Policy>) => {
    const existingPolicy = policies.find((p) => p.id === id)
    if (!existingPolicy) return
    mockUpdatePolicy({ ...existingPolicy, ...policy } as Policy)
  }

  const deletePolicy = (id: string) => {
    mockDeletePolicy(id)
  }

  // CRUD operations for roles
  const addRole = (role: Omit<Role, "id">) => {
    const newRole = mockCreateRole({ ...role, id: generateId("role") } as Role)
    return newRole.id
  }

  const updateRole = (id: string, role: Partial<Role>) => {
    const existingRole = roles.find((r) => r.id === id)
    if (!existingRole) return
    mockUpdateRole({ ...existingRole, ...role } as Role)
  }

  const deleteRole = (id: string) => {
    mockDeleteRole(id)
  }

  const getRolePolicies = (roleId: string) => {
    return mockGetRolePolicies(roleId)
  }

  const getRoleClaims = (roleId: string) => {
    return mockGetRoleClaims(roleId)
  }

  const addClaimToRole = (roleId: string, claimId: string) => {
    const existingRole = roles.find((r) => r.id === roleId)
    const existingClaim = claims.find((c) => c.id === claimId)
    if (!existingRole || !existingClaim) return

    // Check if the assignment already exists
    const existingAssignments = mockGetRoleClaims(roleId)
    if (existingAssignments.some((c) => c.id === claimId)) return

    mockAddClaimToRole(roleId, claimId)
  }

  const removeClaimFromRole = (roleId: string, claimId: string) => {
    mockRemoveClaimFromRole(roleId, claimId)
  }

  const addPolicyToRole = (roleId: string, policyId: string) => {
    const existingRole = roles.find((r) => r.id === roleId)
    const existingPolicy = policies.find((p) => p.id === policyId)
    if (!existingRole || !existingPolicy) return

    // Check if the assignment already exists
    const existingAssignments = mockGetRolePolicies(roleId)
    if (existingAssignments.some((p) => p.id === policyId)) return

    mockAddPolicyToRole(roleId, policyId)
  }

  const removePolicyFromRole = (roleId: string, policyId: string) => {
    mockRemovePolicyFromRole(roleId, policyId)
  }

  const getUserRoles = (userId: string) => {
    const user = users.find(u => u.id === userId)
    if (!user) return []
    return roles.filter(role => user.permissions.roles.includes(role.id))
  }

  const getUserClaims = (userId: string) => {
    const userRoles = getUserRoles(userId)
    const roleClaims = userRoles.flatMap(role => getRoleClaims(role.id))
    return [...new Set(roleClaims)]
  }

  const getUserPolicies = (userId: string) => {
    const userRoles = getUserRoles(userId)
    const rolePolicies = userRoles.flatMap(role => getRolePolicies(role.id))
    return [...new Set(rolePolicies)]
  }

  const value = {
    claims,
    policies,
    roles,
    users,

    addClaim,
    updateClaim,
    deleteClaim,

    addPolicy,
    updatePolicy,
    deletePolicy,

    addRole,
    updateRole,
    deleteRole,

    getRolePolicies,
    getRoleClaims,

    addClaimToRole,
    removeClaimFromRole,
    addPolicyToRole,
    removePolicyFromRole,

    getUserRoles,
    getUserClaims,
    getUserPolicies
  }

  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>
}

export function usePermission() {
  const context = useContext(PermissionContext)
  if (context === undefined) {
    throw new Error("usePermission must be used within a PermissionProvider")
  }
  return context
}
