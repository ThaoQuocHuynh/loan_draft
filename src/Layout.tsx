import { Outlet } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import Sidebar from '@/components/Sidebar';
import { NavigationProvider } from './contexts/NavigationContext';

function Layout() {
  return (
    <NavigationProvider>
      <SidebarProvider>
        <div className="flex w-full h-full">
          <Sidebar />
          <main className="w-full h-full p-4">
            <Outlet />
          </main>
        </div>
      </SidebarProvider>
    </NavigationProvider>
  );
}

export { Layout };
