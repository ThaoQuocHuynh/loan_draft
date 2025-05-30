import { createContext, useContext, useState, type ReactNode } from 'react';

interface Position {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Component {
  id: string;
  definitionId: string;
  title: string;
  position: Position;
}

interface View {
  id: string;
  name: string;
  components: Component[];
}

interface DashboardConfig {
  id: string;
  name: string;
  views: View[];
}

interface AdminDashboardContextType {
  currentView: View | null;
  currentDashboardConfig: DashboardConfig | null;
  setPreviewMode: (mode: boolean) => void;
}

const AdminDashboardContext = createContext<AdminDashboardContextType | undefined>(undefined);

export function AdminDashboardProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<View | null>(null);
  const [currentDashboardConfig, setCurrentDashboardConfig] = useState<DashboardConfig | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const setPreviewMode = (mode: boolean) => {
    setIsPreviewMode(mode);
  };

  return (
    <AdminDashboardContext.Provider
      value={{
        currentView,
        currentDashboardConfig,
        setPreviewMode,
      }}
    >
      {children}
    </AdminDashboardContext.Provider>
  );
}

export function useAdminDashboard() {
  const context = useContext(AdminDashboardContext);
  if (!context) {
    throw new Error('useAdminDashboard must be used within an AdminDashboardProvider');
  }
  return context;
} 