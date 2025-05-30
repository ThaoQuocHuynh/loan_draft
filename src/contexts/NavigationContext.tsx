import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NavItem } from '@/types/navigation';
import { getUserNavTree, replaceUserNavTree, resetUserNavTree, NavigationApiError } from '@/services/mock-user-nav-api';

interface NavigationContextType {
  navTree: NavItem[];
  isLoading: boolean;
  error: NavigationApiError | null;
  updateNavTree: (newNavTree: NavItem[]) => Promise<void>;
  resetNavTree: () => Promise<void>;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [navTree, setNavTree] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<NavigationApiError | null>(null);

  useEffect(() => {
    loadNavTree();
  }, []);

  const loadNavTree = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const tree = getUserNavTree();
      setNavTree(tree);
    } catch (err) {
      setError(err instanceof NavigationApiError ? err : new NavigationApiError('Failed to load navigation tree'));
    } finally {
      setIsLoading(false);
    }
  };

  const updateNavTree = async (newNavTree: NavItem[]) => {
    try {
      setIsLoading(true);
      setError(null);
      replaceUserNavTree(newNavTree);
      setNavTree(newNavTree);
    } catch (err) {
      setError(err instanceof NavigationApiError ? err : new NavigationApiError('Failed to update navigation tree'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const resetNavTree = async () => {
    try {
      setIsLoading(true);
      setError(null);
      resetUserNavTree();
      const tree = getUserNavTree();
      setNavTree(tree);
    } catch (err) {
      setError(err instanceof NavigationApiError ? err : new NavigationApiError('Failed to reset navigation tree'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <NavigationContext.Provider
      value={{
        navTree,
        isLoading,
        error,
        updateNavTree,
        resetNavTree,
      }}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}
