import { ClaimAssignment, PolicyAssignment, Role } from "@/types/authorization";

export const sampleRoles: Role[] = [
  {
    id: "role1",
    name: "System Administrator",
    key: "system_administrator",
    type: "internal",
    description: "System administrator with full access",
  },
  {
    id: "role2",
    name: "Loan Officer",
    key: "loan_officer",
    type: "internal",
    description: "Loan officer with limited access",
  },
  {
    id: "role3",
    name: "Lender User",
    key: "lender_user",
    type: "external",
    description: "Lender user with limited access",
  },
  {
    id: "role4",
    name: "Lender Admin",
    key: "lender_admin",
    type: "external",
    description: "Lender admin with limited access",
  },
  {
    id: "role5",
    name: "Auditor",
    key: "auditor",
    type: "internal",
    description: "Auditor user with limited access",
  },
  {
    id: "role6",
    name: "Purchaser",
    key: "purchaser",
    type: "internal",
    description: "Purchasing user with limited access",
  },
  {
    id: "role7",
    name: "Underwriter",
    key: "underwriter",
    type: "internal",
    description: "Underwriting user with limited access",
  },
  {
    id: "role8",
    name: "Appraiser",
    key: "appraiser",
    type: "internal",
    description: "Appraiser user with limited access",
  },
  {
    id: "role9",
    name: "Borrower",
    key: "borrower",
    type: "external",
    description: "Borrower user with limited access",
  }
]

export const sampleRolePolicyAssignments: PolicyAssignment[] = [
  {
    id: "assignment1",
    targetType: "role",
    targetId: "role1", // System Administrator
    policyId: "policy1",
  },
  {
    id: "assignment2",
    targetType: "role",
    targetId: "role2", // Loan Officer
    policyId: "policy2",
  },
  {
    id: "assignment3",
    targetType: "role",
    targetId: "role7", // Underwriter
    policyId: "policy2",
  },
  {
    id: "assignment4",
    targetType: "role",
    targetId: "role3", // Lender User
    policyId: "policy3",
  },
  {
    id: "assignment5",
    targetType: "role",
    targetId: "role4", // Lender Admin
    policyId: "policy3",
  },
  {
    id: "assignment6",
    targetType: "role",
    targetId: "role5", // Auditor
    policyId: "policy4",
  },
  {
    id: "assignment7",
    targetType: "role",
    targetId: "role9", // Borrower
    policyId: "policy5",
  }
]

export const sampleRoleClaimsAssignments: ClaimAssignment[] = [
  // System Administrator - Full access
  { id: "claim-assignment-1-1", targetType: "role", targetId: "role1", claimId: "system-root" },
  { id: "claim-assignment-1-2", targetType: "role", targetId: "role1", claimId: "read-all" },
  { id: "claim-assignment-1-3", targetType: "role", targetId: "role1", claimId: "write-all" },
  { id: "claim-assignment-1-4", targetType: "role", targetId: "role1", claimId: "admin-root" },
  { id: "claim-assignment-1-5", targetType: "role", targetId: "role1", claimId: "admin-system" },
  { id: "claim-assignment-1-6", targetType: "role", targetId: "role1", claimId: "admin-dashboard" },
  { id: "claim-assignment-1-7", targetType: "role", targetId: "role1", claimId: "admin-forms" },
  { id: "claim-assignment-1-8", targetType: "role", targetId: "role1", claimId: "admin-workflows" },
  { id: "claim-assignment-1-9", targetType: "role", targetId: "role1", claimId: "admin-workflows-interactive" },
  { id: "claim-assignment-1-10", targetType: "role", targetId: "role1", claimId: "admin-workflows-automated" },
  { id: "claim-assignment-1-11", targetType: "role", targetId: "role1", claimId: "admin-settings" },
  { id: "claim-assignment-1-12", targetType: "role", targetId: "role1", claimId: "admin-users" },
  { id: "claim-assignment-1-13", targetType: "role", targetId: "role1", claimId: "admin-users-view" },
  { id: "claim-assignment-1-14", targetType: "role", targetId: "role1", claimId: "admin-users-create" },
  { id: "claim-assignment-1-15", targetType: "role", targetId: "role1", claimId: "admin-roles" },
  { id: "claim-assignment-1-16", targetType: "role", targetId: "role1", claimId: "admin-debug" },
  { id: "claim-assignment-1-17", targetType: "role", targetId: "role1", claimId: "view-applications" },
  { id: "claim-assignment-1-18", targetType: "role", targetId: "role1", claimId: "view-checklist" },
  { id: "claim-assignment-1-19", targetType: "role", targetId: "role1", claimId: "view-reports" },
  { id: "claim-assignment-1-20", targetType: "role", targetId: "role1", claimId: "view-reports-performance" },
  { id: "claim-assignment-1-21", targetType: "role", targetId: "role1", claimId: "view-reports-activity" },
  { id: "claim-assignment-1-22", targetType: "role", targetId: "role1", claimId: "view-settings" },

  // Loan Officer - Access to applications and basic admin
  { id: "claim-assignment-2-1", targetType: "role", targetId: "role2", claimId: "view-applications" },
  { id: "claim-assignment-2-2", targetType: "role", targetId: "role2", claimId: "view-checklist" },
  { id: "claim-assignment-2-3", targetType: "role", targetId: "role2", claimId: "view-reports" },
  { id: "claim-assignment-2-4", targetType: "role", targetId: "role2", claimId: "view-reports-performance" },
  { id: "claim-assignment-2-5", targetType: "role", targetId: "role2", claimId: "view-reports-activity" },
  { id: "claim-assignment-2-6", targetType: "role", targetId: "role2", claimId: "admin-forms" },
  { id: "claim-assignment-2-7", targetType: "role", targetId: "role2", claimId: "admin-workflows-interactive" },

  // Lender User - Limited view access
  { id: "claim-assignment-3-1", targetType: "role", targetId: "role3", claimId: "view-applications" },
  { id: "claim-assignment-3-2", targetType: "role", targetId: "role3", claimId: "view-checklist" },
  { id: "claim-assignment-3-3", targetType: "role", targetId: "role3", claimId: "view-reports" },
  { id: "claim-assignment-3-4", targetType: "role", targetId: "role3", claimId: "view-reports-performance" },

  // Lender Admin - More extensive lender access
  { id: "claim-assignment-4-1", targetType: "role", targetId: "role4", claimId: "view-applications" },
  { id: "claim-assignment-4-2", targetType: "role", targetId: "role4", claimId: "view-checklist" },
  { id: "claim-assignment-4-3", targetType: "role", targetId: "role4", claimId: "view-reports" },
  { id: "claim-assignment-4-4", targetType: "role", targetId: "role4", claimId: "view-reports-performance" },
  { id: "claim-assignment-4-5", targetType: "role", targetId: "role4", claimId: "view-reports-activity" },
  { id: "claim-assignment-4-6", targetType: "role", targetId: "role4", claimId: "admin-forms" },
  { id: "claim-assignment-4-7", targetType: "role", targetId: "role4", claimId: "admin-workflows-interactive" },

  // Auditor - Access to reports and audit tools
  { id: "claim-assignment-5-1", targetType: "role", targetId: "role5", claimId: "view-applications" },
  { id: "claim-assignment-5-2", targetType: "role", targetId: "role5", claimId: "view-checklist" },
  { id: "claim-assignment-5-3", targetType: "role", targetId: "role5", claimId: "view-reports" },
  { id: "claim-assignment-5-4", targetType: "role", targetId: "role5", claimId: "view-reports-performance" },
  { id: "claim-assignment-5-5", targetType: "role", targetId: "role5", claimId: "view-reports-activity" },
  { id: "claim-assignment-5-6", targetType: "role", targetId: "role5", claimId: "admin-debug" },

  // Purchaser - Access to applications and reports
  { id: "claim-assignment-6-1", targetType: "role", targetId: "role6", claimId: "view-applications" },
  { id: "claim-assignment-6-2", targetType: "role", targetId: "role6", claimId: "view-checklist" },
  { id: "claim-assignment-6-3", targetType: "role", targetId: "role6", claimId: "view-reports" },
  { id: "claim-assignment-6-4", targetType: "role", targetId: "role6", claimId: "view-reports-performance" },

  // Underwriter - Access to applications and underwriting tools
  { id: "claim-assignment-7-1", targetType: "role", targetId: "role7", claimId: "view-applications" },
  { id: "claim-assignment-7-2", targetType: "role", targetId: "role7", claimId: "view-checklist" },
  { id: "claim-assignment-7-3", targetType: "role", targetId: "role7", claimId: "view-reports" },
  { id: "claim-assignment-7-4", targetType: "role", targetId: "role7", claimId: "view-reports-performance" },
  { id: "claim-assignment-7-5", targetType: "role", targetId: "role7", claimId: "admin-forms" },
  { id: "claim-assignment-7-6", targetType: "role", targetId: "role7", claimId: "admin-workflows-interactive" },

  // Appraiser - Access to applications and appraisal tools
  { id: "claim-assignment-8-1", targetType: "role", targetId: "role8", claimId: "view-applications" },
  { id: "claim-assignment-8-2", targetType: "role", targetId: "role8", claimId: "view-checklist" },
  { id: "claim-assignment-8-3", targetType: "role", targetId: "role8", claimId: "admin-forms" },

  // Borrower - Limited access to their own data
  { id: "claim-assignment-9-1", targetType: "role", targetId: "role9", claimId: "view-applications" },
  { id: "claim-assignment-9-2", targetType: "role", targetId: "role9", claimId: "view-checklist" }
]