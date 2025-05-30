"use client"
import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { User } from "@/types/user"
import {
  getUsers as apiGetUsers,
  getUser as apiGetUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
  addUser as apiAddUser,
  addClaimToUser as apiAddClaimToUser,
  addRoleToUser as apiAddRoleToUser,
  addPolicyToUser as apiAddPolicyToUser,
  removeClaimFromUser as apiRemoveClaimFromUser,
  removeRoleFromUser as apiRemoveRoleFromUser,
  removePolicyFromUser as apiRemovePolicyFromUser
} from "@/services/mock-users-api"

interface UserContextType {
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  switchUser: (userId: string) => void
  hasPermission: (permission: string) => boolean
  hasClaim: (claim: string) => boolean
  hasRole: (role: string) => boolean
  hasPolicy: (policy: string) => boolean

  addClaimToUser: (userId: string, claimKey: string) => void
  addRoleToUser: (userId: string, roleKey: string) => void
  addPolicyToUser: (userId: string, policyKey: string) => void
  removeClaimFromUser: (userId: string, claimKey: string) => void
  removeRoleFromUser: (userId: string, roleKey: string) => void
  removePolicyFromUser: (userId: string, policyKey: string) => void

  users: User[]
  getUsers: () => User[]
  getUser: (userId: string) => User | null
  addUser: (user: User) => void
  updateUser: (user: User) => void
  deleteUser: (userId: string) => void
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [users, setUsers] = useState<User[]>([])

  // Initialize with users from the API
  useEffect(() => {
    const initialUsers = apiGetUsers()
    setUsers(initialUsers)
    if (initialUsers.length > 0) {
      setCurrentUser(initialUsers[0]) // First user is admin
    }
  }, [])

  const switchUser = (userId: string) => {    
    const user = apiGetUser(userId)    
    if (user) {
      setCurrentUser(user)
    }
  }

  const hasPermission = (permission: string) => {
    if (!currentUser?.permissions) return false
    return (
      currentUser.permissions.claims.includes(permission) ||
      currentUser.permissions.policies.includes(permission)
    )
  }

  const hasClaim = (claim: string) => {
    return currentUser?.permissions.claims.includes(claim) || false
  }

  const hasRole = (role: string) => {
    return currentUser?.permissions.roles.includes(role) || false
  }

  const hasPolicy = (policy: string) => {
    return currentUser?.permissions.policies.includes(policy) || false
  }

  const addClaimToUser = (userId: string, claimKey: string) => {
    apiAddClaimToUser(userId, claimKey)
    // Update local state
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, permissions: { ...user.permissions, claims: [...user.permissions.claims, claimKey] } }
          : user
      )
    )
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, permissions: { ...prev.permissions, claims: [...prev.permissions.claims, claimKey] } } : null)
    }
  }

  const addRoleToUser = (userId: string, roleKey: string) => {
    apiAddRoleToUser(userId, roleKey)
    // Update local state
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, permissions: { ...user.permissions, roles: [...user.permissions.roles, roleKey] } }
          : user
      )
    )
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, permissions: { ...prev.permissions, roles: [...prev.permissions.roles, roleKey] } } : null)
    }
  }

  const addPolicyToUser = (userId: string, policyKey: string) => {
    apiAddPolicyToUser(userId, policyKey)
    // Update local state
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, permissions: { ...user.permissions, policies: [...user.permissions.policies, policyKey] } }
          : user
      )
    )
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, permissions: { ...prev.permissions, policies: [...prev.permissions.policies, policyKey] } } : null)
    }
  }

  const removeClaimFromUser = (userId: string, claimKey: string) => {
    apiRemoveClaimFromUser(userId, claimKey)
    // Update local state
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, permissions: { ...user.permissions, claims: user.permissions.claims.filter(c => c !== claimKey) } }
          : user
      )
    )
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, permissions: { ...prev.permissions, claims: prev.permissions.claims.filter(c => c !== claimKey) } } : null)
    }
  }

  const removeRoleFromUser = (userId: string, roleKey: string) => {
    apiRemoveRoleFromUser(userId, roleKey)
    // Update local state
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, permissions: { ...user.permissions, roles: user.permissions.roles.filter(r => r !== roleKey) } }
          : user
      )
    )
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, permissions: { ...prev.permissions, roles: prev.permissions.roles.filter(r => r !== roleKey) } } : null)
    }
  }

  const removePolicyFromUser = (userId: string, policyKey: string) => {
    apiRemovePolicyFromUser(userId, policyKey)
    // Update local state
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId 
          ? { ...user, permissions: { ...user.permissions, policies: user.permissions.policies.filter(p => p !== policyKey) } }
          : user
      )
    )
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, permissions: { ...prev.permissions, policies: prev.permissions.policies.filter(p => p !== policyKey) } } : null)
    }
  }

  const getUsers = () => {
    return users
  }

  const getUser = (userId: string) => {
    return users.find(user => user.id === userId) || null
  }

  const addUser = (user: User) => {
    apiAddUser(user)
    setUsers(prevUsers => [...prevUsers, user])
  }

  const updateUser = (user: User) => {
    apiUpdateUser(user)
    setUsers(prevUsers => 
      prevUsers.map(u => u.id === user.id ? user : u)
    )
    if (currentUser?.id === user.id) {
      setCurrentUser(user)
    }
  }

  const deleteUser = (userId: string) => {
    apiDeleteUser(userId)
    setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
    if (currentUser?.id === userId) {
      setCurrentUser(null)
    }
  }

  return (
    <UserContext.Provider 
      value={{ 
        currentUser, 
        setCurrentUser, 
        switchUser, 
        hasPermission,
        hasClaim,
        hasRole,
        hasPolicy,
        addClaimToUser,
        addRoleToUser,
        addPolicyToUser,
        removeClaimFromUser,
        removeRoleFromUser,
        removePolicyFromUser,
        users,
        getUsers,
        getUser,
        addUser,
        updateUser,
        deleteUser
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider")
  }
  return context
}
