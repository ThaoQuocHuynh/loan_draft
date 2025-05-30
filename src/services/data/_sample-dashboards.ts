import { v4 as uuidv4 } from "uuid"
import { RoleDashboardConfig } from "@/types/views"


export const initialRoleDashboards: RoleDashboardConfig[] = [
  {
    id: "system-admin-dashboard",
    roleKey: "system_administrator",
    views: [
      {
        id: "testing",
        name: "Testing",
        views: [
          {
            id: "sidebar-manager",
            name: "Sidebar Manager",
            icon: "LayoutDashboard",
            order: 0,
            filters: [],
            path: "/sidebar-manager",
            components: [
              {
                id: uuidv4(),
                definitionId: "sidebarManager",
                title: "Sidebar Manager", 
                position: { x: 0, y: 0, w: 12, h: 4 },
                config: {},
              },
            ],
          },
          {
            id: "view-manager",
            name: "View Manager Component",
            icon: "LayoutDashboard",
            order: 0,
            filters: [],
            path: "/dashboard-editor/view-manager",
            components: [
              {
                id: uuidv4(),
                definitionId: "viewManager",
                title: "View Manager",
                position: { x: 0, y: 0, w: 12, h: 4 },
                config: {},
              },
            ],
          },
        ],
      },
      {
        
        id: "system-configuration",
        name: "System Configuration",
        views: [
          {
            id: "user-navigation",
            name: "User Navigation",
            icon: "LayoutDashboard",
            order: 0,
            filters: [],
            path: "/user-navigation",
            components: [
              {
                id: uuidv4(),
                definitionId: "userNavigation",
                title: "User Navigation",
                position: { x: 0, y: 0, w: 12, h: 4 },
                config: {},
              },
            ],
          },
          {
            id: "dashboard-editor",
            name: "Dashboard Editor",
            icon: "LayoutDashboard",
            order: 0,
            filters: [],
            path: "/dashboard-editor",
            components: [
              {
                id: uuidv4(),
                definitionId: "dashboardEditor",
                title: "Dashboard Editor",
                position: { x: 0, y: 0, w: 12, h: 4 },
                config: {},
              },
            ],
          },
          {
            id: "dashboard-templates",
            name: "Dashboard Templates",
            icon: "PanelLeft",
            order: 1,
            filters: [],
            path: "/dashboard-editor/dashboard-templates",
            components: [
              {
                id: uuidv4(),
                definitionId: "dashboardTemplates",
                title: "Dashboard Templates",
                position: { x: 0, y: 0, w: 12, h: 4 },
                config: {},
              },
            ],
          },
          {
            id: "form-editor",
            name: "Form Editor",
            icon: "FileText",
            order: 2,
            filters: [],
            path: "/dashboard-editor/form-editor",
            components: [
              {
                id: uuidv4(),
                definitionId: "formEditor",
                title: "Form Editor",
                position: { x: 0, y: 0, w: 12, h: 4 },
                config: {},
              },
            ],
          },
          {
            id: "data-dictionary",
            name: "Data Dictionary",
            icon: "FileText",
            order: 3,
            filters: [],
            path: "/dashboard-editor/data-dictionary",
            components: [
              {
                id: uuidv4(),
                definitionId: "dataDictionary",
                title: "Data Dictionary",
                position: { x: 0, y: 0, w: 12, h: 4 },
                config: {},
              },
            ],
          },
          {
            id: "workflows",
            name: "Workflows",
            icon: "Workflow",
            order: 3,
            path: "#",
            filters: [
              {
                id: "interactive-workflows",
                name: "Interactive Workflows",
                icon: "MousePointerClick",
                order: 0,
                path: "/interactive-editor",
                data: { type: "interactive" },
              },
              {
                id: "automated-workflows",
                name: "Automated Workflows",
                icon: "GitBranch",
                order: 1,
                path: "/automated-workflows",
                data: { type: "automated" },
              },
            ],
            components: [
              {
                id: uuidv4(),
                definitionId: "workflows",
                title: "Workflow Management",
                position: { x: 0, y: 0, w: 12, h: 4 },
                config: {},
              },
            ],
          },
          {
            id: "system-settings",
            name: "System Settings",
            icon: "Settings",
            order: 4,
            filters: [],
            path: "/system-settings",
            components: [
              {
                id: uuidv4(),
                definitionId: "systemSettings",
                title: "System Settings",
                position: { x: 0, y: 0, w: 12, h: 4 },
                config: {},
              },
            ],
          },
        ],
      },
      {
        id: "system-admin",
        name: "System Admin",
        views: [
          {
            id: "user-management",
            name: "User Management",
            icon: "Users",
            order: 0,
            filters: [],
            path: "/user-management",
            components: [
              {
                id: uuidv4(),
                definitionId: "userManagement",
                title: "User Management",
                position: { x: 0, y: 0, w: 12, h: 4 },
                config: {},
              },
            ],
          },
          {
            id: "permissions",
            name: "Permissions",
            icon: "KeyRound",
            order: 1,
            path: "#",
            filters: [
              {
                id: "role-settings",
                name: "Role Settings",
                icon: "VenetianMask",
                order: 0,
                path: "/permissions/roles",
                data: { type: "roles" },
              },
              {
                id: "claim-settings",
                name: "Claim Settings",
                icon: "Handshake",
                order: 1,
                path: "/permissions/claims",
                data: { type: "claims" },
              },
              {
                id: "policy-settings",
                name: "Policy Settings",
                icon: "FileKey2",
                order: 2,
                path: "/permissions/policies",
                data: { type: "policies" },
              },
            ],
            components: [
              {
                id: uuidv4(),
                definitionId: "permissions",
                title: "Permissions Management",
                position: { x: 0, y: 0, w: 12, h: 4 },
                config: {},
              },
            ],
          },
        ],
      },
    ],

  },
  {
    id: "lender-dashboard",
    roleKey: "lender_user",
    views: [
      {
        id: "lender-group-1",
        name: "Lending",
        views: [
          {
            id: "main",
            name: "Home",
            icon: "Home",
            order: 0,
            filters: [],
            components: [
              {
                id: uuidv4(),
                definitionId: "loanQueue",
                title: "Loan Queue",
                position: { x: 0, y: 0, w: 6, h: 4 },
                config: {
                  showAmount: true,
                  showStatus: true,
                  sortBy: "submittedDate",
                  sortDirection: "asc",
                  statusFilter: ["submitted", "under_review", "needs_information"],
                },              
              },
              {
                id: uuidv4(),
                definitionId: "taskList",
                title: "My Tasks",
                position: { x: 6, y: 0, w: 3, h: 4 },
                config: {
                  showDueDate: true,
                  showDescription: true,
                  statusFilter: ["pending", "in_progress", "blocked"],
                  sortBy: "dueDate",
                },
              },
            ],
          },
          {
            id: "review",
            name: "Loan Queue",
            icon: "Inbox",
            order: 1,
            filters: [
              {
                id: "new-applications",
                name: "New Applications",
                icon: "Upload",
                order: 0,
                data: { type: "pending_reviews" },
              },
              {
                id: "in-progress",
                name: "In Progress",
                icon: "ListChecks",
                order: 0,
                data: { type: "in_progress" },
              },
              {
                id: "completed",
                name: "Completed",
                icon: "CircleCheck",
                order: 0,
                data: { type: "completed" },
              },
            ],
            components: [
              {
                id: uuidv4(),
                definitionId: "loanQueue",
                title: "Pending Reviews",
                position: { x: 0, y: 0, w: 9, h: 4 },
                config: {
                  showAmount: true,
                  showStatus: true,
                  sortBy: "submittedDate",
                  sortDirection: "asc",
                  statusFilter: ["submitted", "under_review"],
                },
              },
              {
                id: uuidv4(),
                definitionId: "taskList",
                title: "Review Tasks",
                position: { x: 0, y: 4, w: 9, h: 3 },
                config: {
                  showDueDate: true,
                  showDescription: true,
                  statusFilter: ["pending", "in_progress"],
                  sortBy: "dueDate",
                },
              },
            ],
          },
        ],
      },
      {
        id: "lender-group-2",
        name: "Tools",
        views: [
          {
            id: "checklist",
            name: "Checklist",
            icon: "CheckSquare",
            order: 0,
            filters: [],
            components: [],
          },
          {
            id: "reports",
            name: "Reports",
            icon: "FileText",
            order: 1,
            filters: [],
            components: [],
          },
        ],
      },
    ],
  },
  {
    id: "auditor-dashboard",
    roleKey: "auditor",
    views: [
      {
        id: "auditor-group-1",
        name: "Auditing",
        views: [
          {
            id: "main",
            name: "Main Dashboard",
            icon: "Home",
            order: 0,
            filters: [],
            components: [
              {
                id: uuidv4(),
                definitionId: "loanQueue",
                title: "Loans to Audit",
                position: { x: 0, y: 0, w: 6, h: 4 },
                config: {
                  showAmount: true,
                  showStatus: true,
                  sortBy: "submittedDate",
                  sortDirection: "asc",
                  statusFilter: ["approved"],
                },
              },
              {
                id: uuidv4(),
                definitionId: "taskList",
                title: "Audit Tasks",
                position: { x: 6, y: 0, w: 3, h: 4 },
                config: {
                  showDueDate: true,
                  showDescription: true,
                  statusFilter: ["pending", "in_progress"],
                  sortBy: "dueDate",
                },
              },
            ],
          },
          {
            id: "compliance",
            name: "Compliance",
            icon: "FileText",
            order: 1,
            filters: [],
            components: [
              {
                id: uuidv4(),
                definitionId: "loanQueue",
                title: "Compliance Review",
                position: { x: 0, y: 0, w: 9, h: 4 },
                config: {
                  showAmount: true,
                  showStatus: true,
                  sortBy: "submittedDate",
                  sortDirection: "desc",
                  statusFilter: ["approved", "funded"],
                },
              },
              {
                id: uuidv4(),
                definitionId: "taskList",
                title: "Compliance Tasks",
                position: { x: 0, y: 4, w: 9, h: 3 },
                config: {
                  showDueDate: true,
                  showDescription: true,
                  statusFilter: ["pending", "in_progress", "blocked"],
                  sortBy: "dueDate",
                },
              },
            ],
          },
          {
            id: "analytics",
            name: "Analytics",
            icon: "BarChart",
            order: 2,
            filters: [],
            components: [
              {
                id: uuidv4(),
                definitionId: "analytics",
                title: "Compliance Metrics",
                position: { x: 0, y: 0, w: 9, h: 5 },
                config: {
                  metrics: ["approval_rate", "processing_time", "volume"],
                  timeRange: "quarter",
                  chartType: "line",
                },
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "loan-officer-dashboard",
    roleKey: "loan_officer",
    views: [
      {
        id: "officer-group-1",
        name: "Loan Management",
        views: [
          {
            id: "main",
            name: "Main Dashboard",
            icon: "Home",
            order: 0,
            filters: [],
            components: [
              {
                id: uuidv4(),
                definitionId: "loanQueue",
                title: "All Loans",
                position: { x: 0, y: 0, w: 6, h: 4 },
                config: {
                  showAmount: true,
                  showStatus: true,
                  sortBy: "submittedDate",
                  sortDirection: "desc",
                  statusFilter: ["submitted", "under_review", "needs_information", "approved", "rejected"],
                },
              },
              {
                id: uuidv4(),
                definitionId: "analytics",
                title: "Performance Metrics",
                position: { x: 0, y: 4, w: 9, h: 4 },
                config: {
                  metrics: ["approval_rate", "processing_time", "volume"],
                  timeRange: "month",
                  chartType: "bar",
                },
              },
            ],
          },
          {
            id: "analytics",
            name: "Analytics",
            icon: "BarChart",
            order: 1,
            filters: [],
            components: [
              {
                id: uuidv4(),
                definitionId: "analytics",
                title: "Loan Performance",
                position: { x: 0, y: 0, w: 9, h: 5 },
                config: {
                  metrics: ["approval_rate", "processing_time", "volume", "conversion", "funding_time"],
                  timeRange: "quarter",
                  chartType: "line",
                },
              },
            ],
          },
        ],
      },
    ],
  },
]