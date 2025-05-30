import { Policy } from "@/types/authorization";

export const samplePolicies: Policy[] = [
    {
      id: "policy1",
      name: "AdminAccess",
      description: "Grants administrative access to the system",
      conditions: JSON.stringify({
        type: "AND",
        conditions: [
          { claim: "Department", operator: "equals", value: "IT" },
          {
            type: "OR",
            conditions: [
              { claim: "Role", operator: "equals", value: "Administrator" },
              { claim: "Role", operator: "equals", value: "SuperAdmin" },
            ],
          },
        ],
      }),
    },
    {
      id: "policy2",
      name: "LoanManagement",
      description: "Grants access to loan management features",
      conditions: JSON.stringify({
        type: "OR",
        conditions: [
          { claim: "Role", operator: "equals", value: "Loan Officer" },
          { claim: "Role", operator: "equals", value: "Underwriter" },
        ],
      }),
    },
    {
      id: "policy3",
      name: "LenderAccess",
      description: "Grants access to lender-specific features",
      conditions: JSON.stringify({
        type: "OR",
        conditions: [
          { claim: "Role", operator: "equals", value: "Lender User" },
          { claim: "Role", operator: "equals", value: "Lender Admin" },
        ],
      }),
    },
    {
      id: "policy4",
      name: "AuditAccess",
      description: "Grants access to audit and compliance features",
      conditions: JSON.stringify({
        type: "AND",
        conditions: [
          { claim: "Role", operator: "equals", value: "Auditor" },
          { claim: "Department", operator: "equals", value: "Compliance" },
        ],
      }),
    },
    {
      id: "policy5",
      name: "BorrowerAccess",
      description: "Grants access to borrower-specific features",
      conditions: JSON.stringify({
        type: "AND",
        conditions: [
          { claim: "Role", operator: "equals", value: "Borrower" },
          { claim: "Status", operator: "equals", value: "Active" },
        ],
      }),
    }
]

