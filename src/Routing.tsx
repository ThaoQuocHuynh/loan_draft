// pages
import { Navigate, createBrowserRouter } from 'react-router-dom';
import SidebarManager from '@/pages/UserNavigation';
import { ClaimsPageEditor, PoliciesPageEditor, RolesPageEditor } from '@/pages/chris-permissions';
import { DashboardEditor, DashboardManager } from '@/pages/dashboard-editor';
import { DataDictionary } from '@/pages/data-dictionary';
import { WorkflowEditor, WorkflowManager } from '@/pages/interactive-editor';
import { UserManager } from '@/pages/users';
import { Layout } from './Layout';
import FormBuilderPage from './pages/FormBuilder';
import FormRendererWrapper from './pages/FormBuilder/FormRenderer';
import FormManager from './pages/FormBuilder/form-manager';

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/',
          // element: <DashboardEditor />,
          element: <Navigate to="/form-manager" replace={true} />,
        },
        {
          path: '/dashboard-editor/:id',
          element: <DashboardEditor />,
        },
        {
          path: '/dashboard-manager',
          element: <DashboardManager />,
        },
        {
          path: '/form-rerenderer',
          element: <FormRendererWrapper />,
        },
        {
          path: '/sidebar-manager',
          element: <SidebarManager />,
        },
        {
          path: '/interactive-editor',
          element: <WorkflowEditor />,
        },
        {
          path: '/interactive-workflows',
          element: <WorkflowManager />,
        },
        {
          path: '/permissions/roles',
          element: <RolesPageEditor />,
        },
        {
          path: '/permissions/claims',
          element: <ClaimsPageEditor />,
        },
        {
          path: '/permissions/policies',
          element: <PoliciesPageEditor />,
        },
        {
          path: '/users',
          element: <UserManager />,
        },
        {
          path: '/data-dictionary',
          element: <DataDictionary />,
        },
        {
          path: '/form-builder',
          element: <FormBuilderPage />,
        },
        {
          path: '/form-manager',
          element: <FormManager />,
        },
      ],
    },
  ],
  { basename: '/loan_draft' }
);

export { router };
