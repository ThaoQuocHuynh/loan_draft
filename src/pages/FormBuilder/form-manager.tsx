import { useNavigate } from 'react-router-dom';
import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Topbar from '@/components/Topbar';
import TableManager from '@/components/table-manager/table-manager';

interface FormData {
  id: number;
  name: string;
  status: 'Active' | 'Draft' | 'Pending Review';
  createdBy: string;
  lastModified: string;
  version: number;
  [key: string]: string | number | boolean | null;
}

const mockColumns = [
  {
    headerName: 'Form Name',
    field: 'name',
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: 'Status',
    field: 'status',
    filter: 'agSetColumnFilter',
    floatingFilter: true,
    cellRenderer: (params: ICellRendererParams<FormData>) => (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${
          params.value === 'Active'
            ? 'bg-green-100 text-green-800'
            : params.value === 'Draft'
              ? 'bg-gray-100 text-gray-800'
              : 'bg-yellow-100 text-yellow-800'
        }`}
      >
        {params.value}
      </span>
    ),
  },
  {
    headerName: 'Created By',
    field: 'createdBy',
    filter: 'agTextColumnFilter',
    floatingFilter: true,
  },
  {
    headerName: 'Last Modified',
    field: 'lastModified',
    filter: 'agDateColumnFilter',
    floatingFilter: true,
    valueFormatter: (params: ValueFormatterParams<FormData>) => {
      return new Date(params.value).toLocaleDateString();
    },
  },
  {
    headerName: 'Version',
    field: 'version',
    filter: 'agNumberColumnFilter',
    floatingFilter: true,
  },
];

const mockData: FormData[] = [
  {
    id: 1,
    name: 'Loan Application Form',
    status: 'Active',
    createdBy: 'John Doe',
    lastModified: '2024-03-20T10:30:00',
    version: 2.1,
  },
  {
    id: 2,
    name: 'Income Verification Form',
    status: 'Active',
    createdBy: 'Jane Smith',
    lastModified: '2024-03-19T15:45:00',
    version: 1.0,
  },
  {
    id: 3,
    name: 'Property Assessment Form',
    status: 'Draft',
    createdBy: 'Mike Johnson',
    lastModified: '2024-03-18T09:15:00',
    version: 0.5,
  },
  {
    id: 4,
    name: 'Credit Check Authorization',
    status: 'Active',
    createdBy: 'Sarah Wilson',
    lastModified: '2024-03-17T14:20:00',
    version: 1.2,
  },
  {
    id: 5,
    name: 'Employment Verification',
    status: 'Pending Review',
    createdBy: 'David Brown',
    lastModified: '2024-03-16T11:10:00',
    version: 1.5,
  },
];

export default function FormManager() {
  const navigate = useNavigate();
  const handleAdd = () => {
    console.log('Add new form');
  };

  const handleEdit = (rowData: FormData) => {
    console.log('Edit form:', rowData);
  };

  const handleDelete = (rowData: FormData) => {
    console.log('Delete form:', rowData);
  };

  const handleGroupBy = (field: string) => {
    console.log('Group by:', field);
  };

  const handleCreateFrom = () => {
    navigate('/form-builder');
  };

  return (
    <div className="flex flex-col h-full">
      <Topbar name="Form Manager" description="Manage form builders for your application.">
        <Button onClick={handleCreateFrom}>
          <Plus className="h-4 w-4" />
          Create Form
        </Button>
      </Topbar>
      <TableManager
        columns={mockColumns}
        data={mockData}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onGroupBy={handleGroupBy}
        defaultGroupBy="status"
        title="Form Manager"
        height="100%"
      />
    </div>
  );
}
