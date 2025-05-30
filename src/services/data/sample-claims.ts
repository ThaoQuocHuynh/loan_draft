import { Claim } from "@/types/authorization";

export const sampleClaims: Claim[] = [
  // System-level claims
  {
    id: "system-root",
    name: "System Root",
    key: "system",
    description: "Root claim for system-level permissions",
    parentId: null,
    isSystem: true
  },
  {
    id: "read-all",
    name: "Read All",
    key: "read:all",
    description: "Permission to read all resources",
    parentId: "system-root",
    isSystem: true
  },
  {
    id: "write-all",
    name: "Write All",
    key: "write:all",
    description: "Permission to write to all resources",
    parentId: "system-root",
    isSystem: true
  },

  // Admin claims
  {
    id: "admin-root",
    name: "Admin Root",
    key: "admin",
    description: "Root claim for administrative permissions",
    parentId: "system-root",
    isSystem: true
  },
  {
    id: "admin-system",
    name: "System Administration",
    key: "admin:system",
    description: "Full system administration access",
    parentId: "admin-root",
    isSystem: true
  },
  {
    id: "admin-dashboard",
    name: "Dashboard Administration",
    key: "admin:dashboard",
    description: "Access to administrative dashboard",
    parentId: "admin-root",
    isSystem: true
  },
  {
    id: "admin-forms",
    name: "Forms Administration",
    key: "admin:forms",
    description: "Access to form management",
    parentId: "admin-root",
    isSystem: true
  },
  {
    id: "admin-workflows",
    name: "Workflows Administration",
    key: "admin:workflows",
    description: "Access to workflow management",
    parentId: "admin-root",
    isSystem: true
  },
  {
    id: "admin-workflows-interactive",
    name: "Interactive Workflows",
    key: "admin:workflows:interactive",
    description: "Access to interactive workflow management",
    parentId: "admin-workflows",
    isSystem: true
  },
  {
    id: "admin-workflows-automated",
    name: "Automated Workflows",
    key: "admin:workflows:automated",
    description: "Access to automated workflow management",
    parentId: "admin-workflows",
    isSystem: true
  },
  {
    id: "admin-settings",
    name: "Settings Administration",
    key: "admin:settings",
    description: "Access to system settings",
    parentId: "admin-root",
    isSystem: true
  },
  {
    id: "admin-users",
    name: "Users Administration",
    key: "admin:users",
    description: "Access to user management",
    parentId: "admin-root",
    isSystem: true
  },
  {
    id: "admin-users-view",
    name: "View Users",
    key: "admin:users:view",
    description: "Permission to view user information",
    parentId: "admin-users",
    isSystem: true
  },
  {
    id: "admin-users-create",
    name: "Create Users",
    key: "admin:users:create",
    description: "Permission to create new users",
    parentId: "admin-users",
    isSystem: true
  },
  {
    id: "admin-roles",
    name: "Roles Administration",
    key: "admin:roles",
    description: "Access to role management",
    parentId: "admin-root",
    isSystem: true
  },
  {
    id: "admin-debug",
    name: "Debug Access",
    key: "admin:debug",
    description: "Access to debugging tools",
    parentId: "admin-root",
    isSystem: true
  },

  // View claims
  {
    id: "view-applications",
    name: "View Applications",
    key: "view:applications",
    description: "Permission to view loan applications",
    parentId: "system-root",
    isSystem: true
  },
  {
    id: "view-checklist",
    name: "View Checklist",
    key: "view:checklist",
    description: "Permission to view checklists",
    parentId: "system-root",
    isSystem: true
  },
  {
    id: "view-reports",
    name: "View Reports",
    key: "view:reports",
    description: "Permission to view reports",
    parentId: "system-root",
    isSystem: true
  },
  {
    id: "view-reports-performance",
    name: "View Performance Reports",
    key: "view:reports:performance",
    description: "Permission to view performance reports",
    parentId: "view-reports",
    isSystem: true
  },
  {
    id: "view-reports-activity",
    name: "View Activity Reports",
    key: "view:reports:activity",
    description: "Permission to view activity reports",
    parentId: "view-reports",
    isSystem: true
  },
  {
    id: "view-settings",
    name: "View Settings",
    key: "view:settings",
    description: "Permission to view system settings",
    parentId: "system-root",
    isSystem: true
  }
];
