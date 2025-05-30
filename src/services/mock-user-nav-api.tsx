import { NavItem } from "@/types/navigation";
import { menuGroups } from "@/services/data/sample-menu-items";

const STORAGE_KEY = 'loan-os-user-nav';

// Initialize navigation tree from localStorage or use menu groups if none exist
let userNavTree: NavItem[] = (() => {
    const storedNav = localStorage.getItem(STORAGE_KEY);
    if (storedNav) {
        return JSON.parse(storedNav);
    }
    // Store initial menu groups
    localStorage.setItem(STORAGE_KEY, JSON.stringify(menuGroups));
    return structuredClone(menuGroups);
})();

// Error class for navigation API errors
export class NavigationApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NavigationApiError';
  }
}

/**
 * Retrieves the current user navigation tree
 * @returns The current navigation tree
 * @throws NavigationApiError if the navigation tree is not initialized
 */
function getUserNavTree(): NavItem[] {
  if (!userNavTree) {
    throw new NavigationApiError('Navigation tree is not initialized');
  }
  return structuredClone(userNavTree); // Return a deep copy to prevent direct mutations
}

/**
 * Replaces the current navigation tree with a new one
 * @param navTree The new navigation tree to set
 * @throws NavigationApiError if the provided navigation tree is invalid
 */
function replaceUserNavTree(navTree: NavItem[]): void {
  if (!Array.isArray(navTree)) {
    throw new NavigationApiError('Invalid navigation tree format');
  }
  userNavTree = structuredClone(navTree); // Store a deep copy to prevent external mutations
  // Update localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userNavTree));
}

/**
 * Resets the navigation tree to the default menu groups
 */
function resetUserNavTree(): void {
  userNavTree = structuredClone(menuGroups);
  // Update localStorage
  localStorage.setItem(STORAGE_KEY, JSON.stringify(userNavTree));
}

export { 
  getUserNavTree,
  replaceUserNavTree,
  resetUserNavTree
};