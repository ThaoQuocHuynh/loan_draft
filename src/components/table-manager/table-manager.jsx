import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
import { AgGridReact } from 'ag-grid-react';
import { MoreVertical } from 'lucide-react';
import React, { useCallback, useMemo, useState } from 'react';

export default function TableManager({
  columns,
  data,
  onAdd,
  onEdit,
  onDelete,
  onGroupBy,
  defaultGroupBy,
  title,
  height = '100%',
}) {
  const [gridApi, setGridApi] = useState(null);
  const [columnApi, setColumnApi] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);

  const defaultColDef = useMemo(() => ({
    sortable: true,
    filter: true,
    resizable: true,
    flex: 1,
    minWidth: 100,
  }), []);

  const onGridReady = useCallback((params) => {
    setGridApi(params.api);
    setColumnApi(params.columnApi);
    
    if (defaultGroupBy) {
      params.columnApi.setRowGroupColumns([defaultGroupBy]);
    }
  }, [defaultGroupBy]);

  const handleEdit = (rowData) => {
    if (onEdit) {
      onEdit(rowData);
    }
  };

  const handleDelete = (rowData) => {
    if (onDelete) {
      onDelete(rowData);
    }
  };

  const handleGroupBy = (field) => {
    if (columnApi) {
      columnApi.setRowGroupColumns([field]);
    }
    if (onGroupBy) {
      onGroupBy(field);
    }
  };

  const actionColumn = {
    headerName: 'Actions',
    field: 'actions',
    sortable: false,
    filter: false,
    width: 100,
    cellRenderer: (params) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEdit(params.data)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleDelete(params.data)}>
            Delete
          </DropdownMenuItem>
          {columns.map((column) => (
            <DropdownMenuItem
              key={column.field}
              onClick={() => handleGroupBy(column.field)}
            >
              Group by {column.headerName}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  };

  const allColumns = useMemo(() => [...columns, actionColumn], [columns]);

  return (
    <div
    // className="ag-theme-alpine"
    style={{ 
      height: height,
      width: '100%',
      display: 'flex',
      flexDirection: 'column'
    }}
  >
    <AgGridReact
      columnDefs={allColumns}
      rowData={data}
      defaultColDef={defaultColDef}
      onGridReady={onGridReady}
      enableRangeSelection={true}
      rowSelection="single"
      animateRows={true}
      enableCellTextSelection={true}
      suppressRowClickSelection={true}
      domLayout="normal"
      style={{ flex: 1 }}
    />
  </div>
  );
}

