import { FC, ReactNode } from 'react';
import { UserProvider } from './contexts/UserContext';
import { PermissionProvider } from './contexts/PermissionContext';
import { DebugProvider } from './contexts/DebugContext';
import { DataDictionaryProvider } from './contexts/DataDictionaryContext';

export const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => (
  <DebugProvider>
    <PermissionProvider>
      <DataDictionaryProvider>
        <UserProvider>      
          {children}
        </UserProvider>
      </DataDictionaryProvider>
    </PermissionProvider>
  </DebugProvider>
);