interface NavItem {
  id: string;
  label: string;
  icon: string;
  type: "group" | "item" | "button";
  actionType: "none" | "form" | "action" | "url";
  actionValue: string;
  claims: string[];
  children: NavItem[];
  description?: string;
  visibilityLogic?: string;
}

export type { NavItem };