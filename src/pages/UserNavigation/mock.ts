import { NavItem } from '@/types/navigation';

// Mock data for roles and users
export const roles = [
  {
    id: 'admin',
    name: 'Administrator',
    claims: ['admin', 'view:dashboard', 'manage:users', 'view:users', 'manage:roles'],
  },
  { id: 'manager', name: 'Manager', claims: ['view:dashboard', 'manage:users', 'view:users'] },
  { id: 'user', name: 'Regular User', claims: ['view:dashboard', 'view:users'] },
  { id: 'guest', name: 'Guest', claims: [] },
];

export const users = [
  {
    id: 'user1',
    name: 'John Admin',
    roles: ['admin'],
    claims: ['admin', 'view:dashboard', 'manage:users', 'view:users', 'manage:roles'],
  },
  {
    id: 'user2',
    name: 'Sarah Manager',
    roles: ['manager'],
    claims: ['view:dashboard', 'manage:users', 'view:users'],
  },
  { id: 'user3', name: 'Mike User', roles: ['user'], claims: ['view:dashboard', 'view:users'] },
  { id: 'user4', name: 'Guest User', roles: ['guest'], claims: [] },
];

// Mock data for available claims
export const availableClaims = [
  { id: 'view:dashboard', name: 'View Dashboard' },
  { id: 'manage:users', name: 'Manage Users' },
  { id: 'view:users', name: 'View Users' },
  { id: 'manage:roles', name: 'Manage Roles' },
  { id: 'admin', name: 'Administrator' },
];

// Mock data for action types
export const actionTypes: { id: NavItem['actionType']; name: string }[] = [
  { id: 'none', name: 'None (Group)' },
  { id: 'form', name: 'Open Form' },
  { id: 'action', name: 'Execute Action' },
  { id: 'url', name: 'External URL' },
];

// Mock data for available forms
export const availableForms = [
  { id: 'dashboard', name: 'Dashboard' },
  { id: 'user-list', name: 'User List' },
  { id: 'user-roles', name: 'User Roles' },
  { id: 'settings', name: 'Settings' },
];

// Mock data for available actions
export const availableActions = [
  { id: 'export-users', name: 'Export Users' },
  { id: 'generate-report', name: 'Generate Report' },
  { id: 'sync-data', name: 'Sync Data' },
];
