import { Box } from '@mui/material'
import { DataGrid, gridClasses, GridColDef } from '@mui/x-data-grid'

const AssetDataGrid = ({
  rows,
  columns,
  type
}: {
  rows: any[]
  columns: GridColDef[]
  type: 'user' | 'builtin' | 'cache'
}) => {
  const storedURL = window.localStorage.getItem('ledfx-host')

  const handleRowClick = (params: any, type: 'user' | 'builtin' | 'cache') => {
    let requestPath = ''
    switch (type) {
      case 'user':
        requestPath = params.row.path
        break
      case 'builtin':
        requestPath = 'builtin://' + params.row.path
        break
      case 'cache':
        requestPath = params.row.url
        break
    }
    window.open(
      storedURL + '/api/assets/download?path=' + encodeURIComponent(requestPath),
      '_blank'
    )
  }
  return (
    <Box sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={columns}
        getRowId={(row) => row.filename || row.path || row.url}
        rowHeight={80}
        disableRowSelectionOnClick
        onRowClick={(params) => handleRowClick(params, type)}
        sx={{
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center'
          },
          [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
            outline: 'transparent'
          },
          [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {
            outline: 'none'
          }
        }}
      />
    </Box>
  )
}
export default AssetDataGrid
