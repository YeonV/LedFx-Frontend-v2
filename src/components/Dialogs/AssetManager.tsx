import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  useTheme,
  Tabs,
  Tab
} from '@mui/material'
import { Close, PermMedia, Refresh } from '@mui/icons-material'
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import useStore from '../../store/useStore'
import Popover from '../Popover/Popover'
import SceneImage from '../../pages/Scenes/ScenesImage'

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`manager-tabpanel-${index}`}
      aria-labelledby={`manager-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ height: '100%' }}>{children}</Box>}
    </div>
  )
}

function a11yProps(index: number) {
  return {
    id: `manager-tab-${index}`,
    'aria-controls': `manager-tabpanel-${index}`
  }
}

const AssetManager = () => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const assets = useStore((state) => state.assets)
  const assetsFixed = useStore((state) => state.assetsFixed)
  const getAssets = useStore((state) => state.getAssets)
  const getAssetsFixed = useStore((state) => state.getAssetsFixed)
  const deleteAsset = useStore((state) => state.deleteAsset)
  const cacheStats = useStore((state) => state.cacheStats)
  const getCacheStats = useStore((state) => state.getCacheStats)
  const clearCache = useStore((state) => state.clearCache)
  const refreshCacheImage = useStore((state) => state.refreshCacheImage)

  useEffect(() => {
    if (open) {
      if (tabValue === 0) {
        getAssets()
      } else if (tabValue === 1) {
        getAssetsFixed()
      } else {
        getCacheStats()
      }
    }
  }, [open, tabValue, getAssets, getAssetsFixed, getCacheStats])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const assetColumns: GridColDef[] = [
    {
      field: 'preview',
      headerName: 'Preview',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <SceneImage
          thumbnail={!params.row.is_animated}
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
      field: 'path',
      headerName: 'Path',
      flex: 1,
      minWidth: 200
    },
    {
      field: 'format',
      headerName: 'Format',
      width: 150
    },
    {
      field: 'size',
      headerName: 'Size',
      width: 120,
      valueFormatter: (value: number) => `${(value / 1024).toFixed(2)} KB`
    },
    {
      field: 'dimensions',
      headerName: 'Dimensions',
      width: 120,
      valueGetter: (value, row) => `${row.width}x${row.height}`
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
          onConfirm={() => deleteAsset(params.row.path)}
          text={`Delete ${params.row.filename}?`}
        />
      )
    }
  ]

  const fixedAssetColumns: GridColDef[] = [
    {
      field: 'preview',
      headerName: 'Preview',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <SceneImage
          iconName={`image:builtin://${params.row.path}`}
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
      field: 'path',
      headerName: 'Path',
      flex: 1,
      minWidth: 250
    },
    {
      field: 'format',
      headerName: 'Format',
      width: 100
    },
    {
      field: 'size',
      headerName: 'Size',
      width: 120,
      valueFormatter: (value: number) => `${(value / 1024).toFixed(2)} KB`
    },
    {
      field: 'dimensions',
      headerName: 'Dimensions',
      width: 120,
      valueGetter: (value, row) => `${row.width}x${row.height}`
    },
    {
      field: 'n_frames',
      headerName: 'Frames',
      width: 100
    },
    {
      field: 'is_animated',
      headerName: 'Animated',
      width: 100,
      valueFormatter: (value: boolean) => (value ? 'Yes' : 'No')
    },
    {
      field: 'modified',
      headerName: 'Modified',
      width: 180,
      valueFormatter: (value: string) => new Date(value).toLocaleString()
    }
  ]

  const cacheColumns: GridColDef[] = [
    {
      field: 'preview',
      headerName: 'Preview',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <SceneImage
          thumbnail
          iconName={`image:${params.row.url}`}
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
      field: 'url',
      headerName: 'URL',
      flex: 1,
      minWidth: 300
    },
    {
      field: 'content_type',
      headerName: 'Type',
      width: 150
    },
    {
      field: 'file_size',
      headerName: 'Size',
      width: 120,
      valueFormatter: (value: number) => `${(value / 1024).toFixed(2)} KB`
    },
    {
      field: 'access_count',
      headerName: 'Access Count',
      width: 120
    },
    {
      field: 'last_accessed',
      headerName: 'Last Accessed',
      width: 180,
      valueFormatter: (value: string) => new Date(value).toLocaleString()
    },
    {
      field: 'cached_at',
      headerName: 'Cached At',
      width: 180,
      valueFormatter: (value: string) => new Date(value).toLocaleString()
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Popover
            type="iconbutton"
            variant="text"
            color="inherit"
            onConfirm={() => refreshCacheImage(params.row.url)}
            text={'Refresh cache for this image?'}
            icon={<Refresh />}
          />
          <Popover
            type="iconbutton"
            variant="text"
            color="inherit"
            onConfirm={() => clearCache(params.row.url)}
            text={'Clear cache for this image?'}
          />
        </Box>
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
          Asset & Cache Manager
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              height: 'calc(100vh - 100px)',
              width: '100%',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="asset and cache manager tabs"
              >
                <Tab label="User Assets" {...a11yProps(0)} />
                <Tab label="Built-in Assets" {...a11yProps(1)} />
                <Tab label="Cache" {...a11yProps(2)} />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Box sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
                <DataGrid
                  rows={assets}
                  columns={assetColumns}
                  getRowId={(row) => row.filename || row.path}
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
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Box sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
                <DataGrid
                  rows={assetsFixed}
                  columns={fixedAssetColumns}
                  getRowId={(row) => row.path}
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
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Box sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
                <DataGrid
                  rows={cacheStats?.entries || []}
                  columns={cacheColumns}
                  getRowId={(row) => row.url || row.path}
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
            </TabPanel>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AssetManager
