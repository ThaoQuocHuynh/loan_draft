import type { DataField, Folder } from "@/types/data-field"

// Generate mock folders for the data dictionary with multiple root folders
export const mockFolders: Folder[] = [
  // Root level folders
  {
    id: "customer_folder",
    name: "Customer Data",
    parentId: null,
    isExpanded: true,
  },
  {
    id: "product_folder",
    name: "Product Data",
    parentId: null,
    isExpanded: true,
  },
  {
    id: "order_folder",
    name: "Order Data",
    parentId: null,
    isExpanded: true,
  },
  {
    id: "system_folder",
    name: "System Data",
    parentId: null,
    isExpanded: true,
  },

  // Customer subfolders
  {
    id: "customer_personal",
    name: "Personal Information",
    parentId: "customer_folder",
    isExpanded: true,
  },
  {
    id: "customer_account",
    name: "Account Information",
    parentId: "customer_folder",
    isExpanded: true,
  },
  {
    id: "customer_preferences",
    name: "Preferences",
    parentId: "customer_folder",
    isExpanded: true,
  },
  {
    id: "customer_address",
    name: "Addresses",
    parentId: "customer_folder",
    isExpanded: true,
  },

  // Order subfolders
  {
    id: "order_details",
    name: "Order Details",
    parentId: "order_folder",
    isExpanded: true,
  },
  {
    id: "order_payment",
    name: "Payment Information",
    parentId: "order_folder",
    isExpanded: true,
  },

  // Product subfolders
  {
    id: "product_details",
    name: "Product Details",
    parentId: "product_folder",
    isExpanded: true,
  },
  {
    id: "product_inventory",
    name: "Inventory",
    parentId: "product_folder",
    isExpanded: true,
  },
]

// Generate mock data for the data dictionary
export const mockDataFields: DataField[] = [
  {
    id: "1",
    canonicalName: "Customer ID",
    systemName: "customer_id",
    dataType: "string",
    isSystemRequired: true,
    folderId: "customer_folder",
  },
  {
    id: "2",
    canonicalName: "First Name",
    systemName: "first_name",
    dataType: "string",
    isSystemRequired: true,
    folderId: "customer_personal",
  },
  {
    id: "3",
    canonicalName: "Last Name",
    systemName: "last_name",
    dataType: "string",
    isSystemRequired: true,
    folderId: "customer_personal",
  },
  {
    id: "4",
    canonicalName: "Email Address",
    systemName: "email",
    dataType: "email",
    isSystemRequired: true,
    folderId: "customer_personal",
  },
  {
    id: "5",
    canonicalName: "Phone Number",
    systemName: "phone",
    dataType: "phone",
    isSystemRequired: false,
    folderId: "customer_personal",
  },
  {
    id: "6",
    canonicalName: "Date of Birth",
    systemName: "date_of_birth",
    dataType: "date",
    isSystemRequired: false,
    folderId: "customer_personal",
  },
  {
    id: "7",
    canonicalName: "Account Creation Date",
    systemName: "account_creation_date",
    dataType: "datetime",
    isSystemRequired: true,
    folderId: "customer_account",
  },
  {
    id: "8",
    canonicalName: "Account Balance",
    systemName: "account_balance",
    dataType: "number",
    isSystemRequired: false,
    folderId: "customer_account",
  },
  {
    id: "9",
    canonicalName: "Is Active",
    systemName: "is_active",
    dataType: "boolean",
    isSystemRequired: true,
    folderId: "customer_account",
  },
  {
    id: "10",
    canonicalName: "Shipping Address",
    systemName: "shipping_address",
    dataType: "object",
    isSystemRequired: false,
    folderId: "customer_address",
  },
  {
    id: "11",
    canonicalName: "Billing Address",
    systemName: "billing_address",
    dataType: "object",
    isSystemRequired: false,
    folderId: "customer_address",
  },
  {
    id: "12",
    canonicalName: "Order History",
    systemName: "order_history",
    dataType: "array",
    isSystemRequired: false,
    folderId: "customer_account",
  },
  {
    id: "13",
    canonicalName: "Preferred Payment Method",
    systemName: "preferred_payment_method",
    dataType: "string",
    isSystemRequired: false,
    folderId: "customer_preferences",
  },
  {
    id: "14",
    canonicalName: "Customer Preferences",
    systemName: "customer_preferences",
    dataType: "json",
    isSystemRequired: false,
    folderId: "customer_preferences",
  },
  {
    id: "15",
    canonicalName: "Loyalty Points",
    systemName: "loyalty_points",
    dataType: "number",
    isSystemRequired: false,
    folderId: "customer_account",
  },
  {
    id: "16",
    canonicalName: "Referral Source",
    systemName: "referral_source",
    dataType: "string",
    isSystemRequired: false,
    folderId: "customer_account",
  },
  {
    id: "17",
    canonicalName: "Marketing Opt-In",
    systemName: "marketing_opt_in",
    dataType: "boolean",
    isSystemRequired: true,
    folderId: "customer_preferences",
  },
  {
    id: "18",
    canonicalName: "Last Login Date",
    systemName: "last_login_date",
    dataType: "datetime",
    isSystemRequired: true,
    folderId: "customer_account",
  },
  {
    id: "19",
    canonicalName: "Account Type",
    systemName: "account_type",
    dataType: "string",
    isSystemRequired: true,
    folderId: "customer_account",
  },
  {
    id: "20",
    canonicalName: "Profile Picture URL",
    systemName: "profile_picture_url",
    dataType: "url",
    isSystemRequired: false,
    folderId: "customer_personal",
  },
  {
    id: "21",
    canonicalName: "Password Hash",
    systemName: "password_hash",
    dataType: "string",
    isSystemRequired: true,
    folderId: "system_folder",
  },
  {
    id: "22",
    canonicalName: "Security Question",
    systemName: "security_question",
    dataType: "string",
    isSystemRequired: false,
    folderId: "customer_account",
  },
  {
    id: "23",
    canonicalName: "Security Answer",
    systemName: "security_answer",
    dataType: "string",
    isSystemRequired: false,
    folderId: "customer_account",
  },
  {
    id: "24",
    canonicalName: "Two-Factor Authentication Enabled",
    systemName: "two_factor_auth_enabled",
    dataType: "boolean",
    isSystemRequired: true,
    folderId: "customer_account",
  },
  {
    id: "25",
    canonicalName: "Account Status",
    systemName: "account_status",
    dataType: "string",
    isSystemRequired: true,
    folderId: "customer_account",
  },
  {
    id: "26",
    canonicalName: "Order ID",
    systemName: "order_id",
    dataType: "string",
    isSystemRequired: true,
    folderId: "order_folder",
  },
  {
    id: "27",
    canonicalName: "Order Date",
    systemName: "order_date",
    dataType: "datetime",
    isSystemRequired: true,
    folderId: "order_details",
  },
  {
    id: "28",
    canonicalName: "Order Total",
    systemName: "order_total",
    dataType: "number",
    isSystemRequired: true,
    folderId: "order_details",
  },
  {
    id: "29",
    canonicalName: "Payment Method",
    systemName: "payment_method",
    dataType: "string",
    isSystemRequired: true,
    folderId: "order_payment",
  },
  {
    id: "30",
    canonicalName: "Payment Status",
    systemName: "payment_status",
    dataType: "string",
    isSystemRequired: true,
    folderId: "order_payment",
  },
  {
    id: "31",
    canonicalName: "Product ID",
    systemName: "product_id",
    dataType: "string",
    isSystemRequired: true,
    folderId: "product_folder",
  },
  {
    id: "32",
    canonicalName: "Product Name",
    systemName: "product_name",
    dataType: "string",
    isSystemRequired: true,
    folderId: "product_details",
  },
  {
    id: "33",
    canonicalName: "Product Description",
    systemName: "product_description",
    dataType: "string",
    isSystemRequired: false,
    folderId: "product_details",
  },
  {
    id: "34",
    canonicalName: "Product Price",
    systemName: "product_price",
    dataType: "number",
    isSystemRequired: true,
    folderId: "product_details",
  },
  {
    id: "35",
    canonicalName: "Stock Level",
    systemName: "stock_level",
    dataType: "number",
    isSystemRequired: true,
    folderId: "product_inventory",
  },
]

// Generate more mock data to simulate thousands of fields
for (let i = 36; i <= 100; i++) {
  const folderIds = mockFolders.map((folder) => folder.id)
  const randomFolderId = folderIds[Math.floor(Math.random() * folderIds.length)]

  mockDataFields.push({
    id: i.toString(),
    canonicalName: `Custom Field ${i}`,
    systemName: `custom_field_${i}`,
    dataType: ["string", "number", "boolean", "date", "object"][Math.floor(Math.random() * 5)],
    isSystemRequired: false,
    folderId: randomFolderId,
  })
}

// Helper function to build folder tree with multiple root folders
export function buildFolderTree(folders: Folder[], fields: DataField[]): Folder[] {
  // Create a map of all folders
  const folderMap: Record<string, Folder> = {}

  // Initialize all folders with empty children and fields arrays
  folders.forEach((folder) => {
    folderMap[folder.id] = {
      ...folder,
      children: [],
      fields: [],
    }
  })

  // Assign fields to their folders
  fields.forEach((field) => {
    if (folderMap[field.folderId]) {
      folderMap[field.folderId].fields = folderMap[field.folderId].fields || []
      folderMap[field.folderId].fields?.push(field)
    }
  })

  // Build the tree structure
  const rootFolders: Folder[] = []

  folders.forEach((folder) => {
    if (folder.parentId === null) {
      rootFolders.push(folderMap[folder.id])
    } else if (folderMap[folder.parentId]) {
      folderMap[folder.parentId].children = folderMap[folder.parentId].children || []
      folderMap[folder.parentId].children?.push(folderMap[folder.id])
    }
  })

  return rootFolders
}
