import { useState, useEffect } from 'react'
import { Dialog, DialogTitle, DialogContent, IconButton, Box, useTheme } from '@mui/material'
import { Close, PermMedia } from '@mui/icons-material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import useStore from '../../store/useStore'
import Popover from '../Popover/Popover'
import SceneImage from '../../pages/Scenes/ScenesImage'

const AssetManager = () => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const assets = useStore((state) => state.assets)
  const getAssets = useStore((state) => state.getAssets)
  const deleteAsset = useStore((state) => state.deleteAsset)

  useEffect(() => {
    if (open) {
      getAssets()
    }
  }, [open, getAssets])

  const columns: GridColDef[] = [
    {
      field: 'preview',
      headerName: 'Preview',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <SceneImage
          iconName={`image:file:///${params.row.path}`}
          sx={{
            width: 60,
            height: 60,
            objectFit: 'cover',
            borderRadius: 1
          }}
        />
      ),
      sortable: false,
      filterable: false
    },
    {
      field: 'filename',
      headerName: 'Filename',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 150
    },
    {
      field: 'size',
      headerName: 'Size',
      width: 120,
      valueFormatter: (value: number) => `${(value / 1024).toFixed(2)} KB`
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Popover
          type="iconbutton"
          variant="text"
          color="inherit"
          onConfirm={() => deleteAsset(params.row.filename)}
          text={`Delete ${params.row.filename}?`}
        />
      )
    }
  ]

  return (
    <>
      <IconButton
        color="inherit"
        onClick={() => setOpen(true)}
        sx={{
          color: theme.palette.mode === 'light' ? '#000' : '#fff',
          '&:hover': {
            color: theme.palette.primary.main
          }
        }}
      >
        <PermMedia />
      </IconButton>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.default
          }
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          Asset Manager
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ height: 'calc(100vh - 100px)', width: '100%' }}>
            <DataGrid
              rows={assets}
              columns={columns}
              rowHeight={80}
              disableRowSelectionOnClick
              sx={{
                '& .MuiDataGrid-cell': {
                  display: 'flex',
                  alignItems: 'center'
                }
              }}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AssetManager
