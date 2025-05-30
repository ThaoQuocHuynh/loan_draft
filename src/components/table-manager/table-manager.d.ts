import { ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';

interface Column {
  field: string;
  headerName: string;
  sortable?: boolean;
  filter?: string;
  floatingFilter?: boolean;
  cellRenderer?: (params: ICellRendererParams) => React.ReactElement;
  valueFormatter?: (params: ValueFormatterParams) => string;
  width?: number;
  flex?: number;
  minWidth?: number;
}

interface RowData {
  id: number;
  name: string;
  status: 'Active' | 'Draft' | 'Pending Review';
  createdBy: string;
  lastModified: string;
  version: number;
  [key: string]: string | number | boolean | null;
}

interface TableManagerProps {
  columns: Column[];
  data: RowData[];
  onAdd?: () => void;
  onEdit?: (rowData: RowData) => void;
  onDelete?: (rowData: RowData) => void;
  onGroupBy?: (field: string) => void;
  defaultGroupBy?: string;
  title?: string;
  height?: string;
}

declare const TableManager: React.FC<TableManagerProps>;

export default TableManager; 