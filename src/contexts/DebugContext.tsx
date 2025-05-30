import { createContext, useContext, ReactNode } from 'react';
import { sampleClaims } from '@/services/data/sample-claims';
import { samplePolicies } from '@/services/data/sample-policies';
import { sampleRoles, sampleRolePolicyAssignments, sampleRoleClaimsAssignments } from '@/services/data/sample-roles';
import { menuGroups } from '@/services/data/sample-menu-items';
import { sampleUsers } from '@/services/data/sample-users';
import { mockDataFields, mockFolders } from '@/services/data/sample-field-data';

interface DebugContextType {
  resetAll: () => void;
  resetClaims: () => void;
  resetDataDictionary: () => void;
  resetPolicies: () => void;
  resetRoles: () => void;
  resetUserNav: () => void;
  resetUsers: () => void;
  clearLocalStorage: () => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const DebugProvider = ({ children }: { children: ReactNode }) => {
  const resetClaims = () => {
    localStorage.setItem('loan-os-claims', JSON.stringify(sampleClaims));
  };

  const resetDataDictionary = () => {
    localStorage.setItem('loan-os-data-fields', JSON.stringify(mockDataFields));
    localStorage.setItem('loan-os-data-folders', JSON.stringify(mockFolders));
  };

  const resetPolicies = () => {
    localStorage.setItem('loan-os-policies', JSON.stringify(samplePolicies));
  };

  const resetRoles = () => {
    localStorage.setItem('loan-os-roles', JSON.stringify(sampleRoles));
    localStorage.setItem('loan-os-role-policy-assignments', JSON.stringify(sampleRolePolicyAssignments));
    localStorage.setItem('loan-os-role-claims-assignments', JSON.stringify(sampleRoleClaimsAssignments));
  };

  const resetUserNav = () => {
    localStorage.setItem('loan-os-user-nav', JSON.stringify(menuGroups));
  };

  const resetUsers = () => {
    localStorage.setItem('loan-os-users', JSON.stringify(sampleUsers));
  };

  const clearLocalStorage = () => {
    localStorage.clear();
  };

  const resetAll = () => {
    resetClaims();
    resetDataDictionary();
    resetPolicies();
    resetRoles();
    resetUserNav();
    resetUsers();
  };

  return (
    <DebugContext.Provider
      value={{
        resetAll,
        resetClaims,
        resetDataDictionary,
        resetPolicies,
        resetRoles,
        resetUserNav,
        resetUsers,
        clearLocalStorage,
      }}
    >
      {children}
    </DebugContext.Provider>
  );
};

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
}; 