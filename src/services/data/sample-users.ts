import { User } from "@/types/user";

export const sampleUsers: User[] = [
  {
    id: "1",
    name: "System Administrator",
    email: "admin@loanos.com",
    type: "admin",
    permissions: {
      roles: ["system_administrator", "admin"],
      claims: [
        "read:all",
        "write:all",
        "admin:system",
        "admin:dashboard",
        "admin:forms",
        "admin:workflows",
        "admin:workflows:interactive",
        "admin:workflows:automated",
        "admin:settings",
        "admin:users",
        "admin:users:view",
        "admin:users:create",
        "admin:roles",
        "admin:debug",
        "view:applications",
        "view:checklist",
        "view:reports",
        "view:reports:performance",
        "view:reports:activity",
        "view:settings",
        "admin"
      ],
      policies: ["admin-policy"]
    }
  },
  {
    id: "2",
    name: "Loan Officer",
    email: "loan.officer@loanos.com",
    type: "internal",    
    permissions: {
      roles: ["loan_officer", "user"],
      claims: [
        "view:applications",
        "view:checklist",
        "view:reports",
        "view:reports:performance"
      ],
      policies: ["loan-officer-policy"]
    }
  },
  {
    id: "3",
    name: "Underwriter",
    email: "underwriter@loanos.com",
    type: "internal",
    permissions: {
      roles: ["underwriter"],
      claims: [
        "view:applications",
        "view:checklist",
        "view:reports",
        "view:reports:performance",
        "view:reports:activity"
      ],
      policies: ["underwriter-policy"]
    }
  },
  {
    id: "4",
    name: "Auditor",
    email: "auditor@loanos.com",
    type: "internal",
    permissions: {
      roles: ["auditor"],
      claims: [
        "view:applications",
        "view:reports",
        "view:reports:activity"
      ],
      policies: ["auditor-policy"]
    }
  },
  {
    id: "5",
    name: "Mortgage Lender",
    email: "lender@example.com",
    type: "external",
    permissions: {
      roles: ["lender_user"],
      claims: [
        "view:applications"
      ],
      policies: ["lender-policy"]
    }
  },
  {
    id: "6",
    name: "Borrower",
    email: "borrower@example.com",
    type: "external",
    permissions: {
      roles: ["borrower"],
      claims: [
        "view:applications"
      ],
      policies: ["borrower-policy"]
    }
  },
  {
    id: "7",
    name: "Appraiser",
    email: "appraiser@example.com",
    type: "external",
    permissions: {
      roles: ["appraiser"],
      claims: [
        "view:applications"
      ],
      policies: ["appraiser-policy"]
    }
  }
]; 
