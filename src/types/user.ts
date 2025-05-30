
import { ReactNode } from 'react';

export type UserType = "internal" | "external" | "admin"

interface UserPermissions {
  roles: string[];
  claims: string[];
  policies: string[];
}

interface User {
  id: string
  name: string
  email: string
  type: UserType
  permissions: UserPermissions
}

export type {
  User,
  UserPermissions
};


