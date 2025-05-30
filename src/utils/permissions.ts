import { NavItem } from "@/types/navigation";

/**
 * Checks if the user has any of the required permissions
 * @param keys Array of permission keys to check
 * @param hasRole Function to check if user has a role
 * @param hasClaim Function to check if user has a claim
 * @param hasPolicy Function to check if user has a policy
 * @returns boolean indicating if user has any of the permissions
 */
export const allows = (
  keys: string[],
  hasRole: (role: string) => boolean,
  hasClaim: (claim: string) => boolean,
  hasPolicy: (policy: string) => boolean
): boolean => {
  // If no keys are provided, allow access by default
  if (!keys || keys.length === 0) {
    return true;
  }
  return keys.some(k => hasRole(k) || hasClaim(k) || hasPolicy(k));
};

/**
 * Checks if a navigation item is visible to the current user
 * @param item Navigation item to check visibility for
 * @param hasRole Function to check if user has a role
 * @param hasClaim Function to check if user has a claim
 * @param hasPolicy Function to check if user has a policy
 * @returns boolean indicating if the item is visible
 */
export const isItemVisible = (
  item: NavItem,
  hasRole: (role: string) => boolean,
  hasClaim: (claim: string) => boolean,
  hasPolicy: (policy: string) => boolean
): boolean => {
  // If the item has no claims, it's visible by default
  if (!item.claims || item.claims.length === 0) {
    return true;
  }

  // Check if the user has any of the required claims
  if (!allows(item.claims, hasRole, hasClaim, hasPolicy)) {
    return false;
  }

  // If the item has children, check if any of them are visible
  if (item.children && item.children.length > 0) {
    return item.children.some((child) => isItemVisible(child, hasRole, hasClaim, hasPolicy));
  }

  return true;
};

/**
 * Checks if a group has any visible items
 * @param items Array of navigation items to check
 * @param hasRole Function to check if user has a role
 * @param hasClaim Function to check if user has a claim
 * @param hasPolicy Function to check if user has a policy
 * @returns boolean indicating if any items are visible
 */
export const hasVisibleItems = (
  items: NavItem[] | undefined,
  hasRole: (role: string) => boolean,
  hasClaim: (claim: string) => boolean,
  hasPolicy: (policy: string) => boolean
): boolean => {
  if (!items) return false;
  return items.some(item => isItemVisible(item, hasRole, hasClaim, hasPolicy));
}; 