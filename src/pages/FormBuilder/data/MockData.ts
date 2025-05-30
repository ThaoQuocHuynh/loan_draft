import type { FormElement, FormMetadata, FormVersion } from '../types/FormTypes';

export const mockFormElements: FormElement[] = [
  {
    id: "element-1",
    type: "text",
    properties: {
      label: "Full Name",
      required: true,
      name: "fullName",
      placeholder: "Enter your full name",
      width: "full",
      gridPosition: {
        x: 0,
        y: 0,
        w: 12,
        h: 1,
      },
    },
  },
  {
    id: "element-2",
    type: "text",
    properties: {
      label: "Email Address",
      required: true,
      name: "email",
      placeholder: "Enter your email address",
      validationType: "email",
      validationMessage: "Please enter a valid email address",
      width: "full",
      gridPosition: {
        x: 6,
        y: 0,
        w: 12,
        h: 1,
      },
    },
  },
  {
    id: "element-3",
    type: "select",
    properties: {
      label: "Account Type",
      required: true,
      name: "accountType",
      options: ["Personal", "Business", "Enterprise"],
      width: "full",
      gridPosition: {
        x: 0,
        y: 1,
        w: 12,
        h: 1,
      },
    },
  },
  {
    id: "element-4",
    type: "divider",
  },
  // {
  //   id: "borrower-summary",
  //   type: "repeatable",
  //   properties: {
  //     name: "borrowerSummary",
  //     addButton: {
  //       label: "Click here to Add / Update more borrowers",
  //     },
  //     width: 100,
  //     height: 100,
  //     gridPosition: {
  //       x: 0,
  //       y: 0,
  //       w: 100,
  //       h: 100,
  //     },
  //   },
  //   elements: [
  //     {
  //       id: "borrower-1-summary",
  //       type: "label",
  //       properties: {
  //         text: "Borrower 1 Summary",
  //       },
  //     },
  //     {
  //       id: "borrower-1-first-name",
  //       type: "text",
  //       properties: {
  //         label: "First Name",
  //         required: true,
  //         name: "firstName",
  //       },
  //     },
  //     {
  //       id: "borrower-1-last-name",
  //       type: "text",
  //       properties: {
  //         label: "Last Name",
  //         required: true,
  //         name: "lastName",
  //       },
  //     },
  //     {
  //       id: "borrower-1-social-security-number",
  //       type: "number",
  //       properties: {
  //         label: "Social Security Number",
  //         required: true,
  //         name: "socialSecurityNumber",
  //       },
  //     },

  //     {
  //       id: "borrower-1-current-home-address",
  //       type: "text",
  //       properties: {
  //         label: "Current Home Address",
  //         required: true,
  //         name: "currentHomeAddress",
  //       },
  //     },

  //     {
  //       id: "borrower-1-current-home-city",
  //       type: "text",
  //       properties: {
  //         label: "Current Home City",
  //         required: true,
  //         name: "currentHomeCity",
  //       },
  //     },

  //     {
  //       id: "borrower-1-current-home-state",
  //       type: "select",
  //       properties: {
  //         label: "Current Home State",
  //         required: true,
  //         name: "currentHomeState",
  //         options: ["Option1"],
  //       },
  //     },

  //     {
  //       id: "borrower-1-current-home-zip",
  //       type: "text",
  //       properties: {
  //         label: "Current Home Zip",
  //         required: true,
  //         name: "currentHomeZip",
  //       },
  //     },

  //     {
  //       id: "borrower-1-email",
  //       type: "text",
  //       properties: {
  //         label: "Email",
  //         required: true,
  //         name: "email",
  //       },
  //     },
  //     {
  //       id: "borrower-1-total-monthly-income",
  //       type: "text",
  //       properties: {
  //         label: "Total Monthly Income",
  //         required: true,
  //         name: "totalMonthlyIncome",
  //       },
  //     },
  //     {
  //       id: "borrower-1-home-phone",
  //       type: "text",
  //       properties: {
  //         label: "Home Income",
  //         required: true,
  //         name: "homeIncome",
  //       },
  //     },
  //     {
  //       id: "borrower-1-work-phone",
  //       type: "text",
  //       properties: {
  //         label: "Work Phone",
  //         required: true,
  //         name: "workPhone",
  //       },
  //     },
  //     {
  //       id: "borrower-1-cell-phone",
  //       type: "text",
  //       properties: {
  //         label: "Cell Phone",
  //         required: true,
  //         name: "cellPhone",
  //       },
  //     },
  //     {
  //       id: "borrower-1-citizenship-status",
  //       type: "select",
  //       properties: {
  //         name: "citizenshipStatus",
  //         label: "Citizenship status",
  //         required: true,
  //         options: ["Option 1"],
  //       },
  //     },
  //   ],
  // },
  /**
   * Property Summary
   */
  // {
  //   id: "property-summary",
  //   type: "panel",
  //   properties: {
  //     name: "propertySummary",
  //     label: "Property Summary",
  //     collapsible: false,
  //   },
  //   elements: [
  //     {
  //       id: "property-address",
  //       type: "text",
  //       properties: {
  //         label: "Property Address",
  //         name: "propertyAddress",
  //       },
  //     },
  //     {
  //       id: "property-city",
  //       type: "text",
  //       properties: {
  //         label: "Property City",
  //         name: "propertyCity",
  //       },
  //     },
  //     {
  //       id: "property-state",
  //       type: "text",
  //       properties: {
  //         label: "Property State",
  //         name: "propertyState",
  //       },
  //     },
  //     {
  //       id: "property-zip",
  //       type: "text",
  //       properties: {
  //         label: "Property Zip",
  //         name: "propertyZip",
  //       },
  //     },
  //     {
  //       id: "property-county",
  //       type: "select",
  //       properties: {
  //         label: "Property County",
  //         name: "propertyCounty",
  //         options: [],
  //       },
  //     },
  //     {
  //       id: "property-type",
  //       type: "select",
  //       properties: {
  //         label: "Property Type",
  //         name: "propertyType",
  //         options: [],
  //       },
  //     },
  //     {
  //       id: "occupancy-type",
  //       type: "select",
  //       properties: {
  //         label: "Occupancy Type",
  //         name: "occupancyType",
  //         options: [],
  //       },
  //     },
  //   ],
  // },
  // /**
  //  * Status Summary
  //  */
  // {
  //   id: "status-summary",
  //   type: "panel",
  //   properties: {
  //     name: "statusSummary",
  //     label: "Status Summary",
  //   },
  //   elements: [
  //     {
  //       id: "lender",
  //       type: "select",
  //       properties: {
  //         label: "Lender",
  //         name: "Lender",
  //         options: [],
  //       },
  //     },
  //     {
  //       id: "milestone",
  //       type: "text",
  //       properties: {
  //         label: "Milestone",
  //         name: "milestone",
  //         readonly: true,
  //       },
  //     },
  //     {
  //       id: "closedFileDeliveryDate",
  //       type: "text",
  //       properties: {
  //         label: "Closed File Delivery Date",
  //         name: "closedFileDeliveryDate",
  //         readonly: true,
  //       },
  //     },
  //   ],
  // },
  // /**
  //  * Subordinate Mortgages
  //  */
  // {
  //   id: "subordinate-mortgages",
  //   type: "tableInput",
  //   properties: {
  //     name: "subordinateMortgages",
  //     label: "Subordinate Mortgages",
  //     addButton: {
  //       label: "Click here to add more mortgages",
  //     },
  //     deleteItemButton: {
  //       label: "Delete item",
  //     },
  //   },
  //   elements: [
  //     {
  //       id: "creditor-name",
  //       type: "number",
  //       properties: {
  //         label: "Creditor Name",
  //         name: "creditorName",
  //       },
  //     },
  //     {
  //       id: "lient-position",
  //       type: "select",
  //       properties: {
  //         label: "Lient Position",
  //         name: "lientPosition",
  //         options: [],
  //       },
  //     },
  //     {
  //       id: "monthly-payment",
  //       type: "number",
  //       properties: {
  //         label: "Monthly Payment",
  //         name: "monthlyPayment",
  //       },
  //     },
  //     {
  //       id: "credit-limit",
  //       type: "number",
  //       properties: {
  //         label: "Credit Limit",
  //         name: "creditLimit",
  //       },
  //     },
  //     {
  //       id: "funds-source-type",
  //       type: "select",
  //       properties: {
  //         label: "Funds Source Type",
  //         name: "fundsSourceType",
  //         options: [],
  //       },
  //     },
  //     {
  //       id: "repayment-structure",
  //       type: "select",
  //       properties: {
  //         label: "Repayment Structure",
  //         name: "repaymentStructure",
  //         options: [],
  //       },
  //     },
  //   ],
  // },
];

export const mockFormState = {
  id: "form-1",
  name: "Loan Reservation Details",
  description: "Collect customer information for account setup",
  elements: [],
  lastModified: new Date().toISOString(),
  submitButtonText: "Submit",
  successMessage: "Form submitted successfully!",
  enableProgressBar: false,
  layout: "standard",
  theme: "default",
  accessControl: "public",
  enableVersioning: true,
  enableChangeLogging: true,
  enableDataMapping: true,
};

export const mockFormVersions: FormVersion[] = [
  {
    id: "version-1",
    formId: "form-1",
    versionNumber: 1,
    timestamp: "2024-03-15T10:30:00Z",
    notes: "Initial form creation",
    publishedBy: "John Doe",
    formData: mockFormState,
    changes: [
      { type: "Create", description: "Initial form structure created" },
      { type: "Add", description: "Added customer information fields" },
    ],
  },
];

export const mockFormData = [
  {
    id: 1,
    name: "Loan Application Form",
    status: "Active" as const,
    createdBy: "John Doe",
    lastModified: "2024-03-20T10:30:00",
    version: 2.1,
  },
  {
    id: 2,
    name: "Income Verification Form",
    status: "Active" as const,
    createdBy: "Jane Smith",
    lastModified: "2024-03-19T15:45:00",
    version: 1.0,
  },
  {
    id: 3,
    name: "Property Assessment Form",
    status: "Draft" as const,
    createdBy: "Mike Johnson",
    lastModified: "2024-03-18T09:15:00",
    version: 0.5,
  },
  {
    id: 4,
    name: "Credit Check Authorization",
    status: "Active" as const,
    createdBy: "Sarah Wilson",
    lastModified: "2024-03-17T14:20:00",
    version: 1.2,
  },
  {
    id: 5,
    name: "Employment Verification",
    status: "Pending Review" as const,
    createdBy: "David Brown",
    lastModified: "2024-03-16T11:10:00",
    version: 1.5,
  },
];
