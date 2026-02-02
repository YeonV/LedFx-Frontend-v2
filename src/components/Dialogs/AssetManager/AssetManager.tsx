import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  useTheme,
  Tabs,
  Tab,
  Button,
  BottomNavigationAction
} from '@mui/material'
import { Close, PermMedia, Refresh } from '@mui/icons-material'
import { GridColDef, GridRenderCellParams } from '@mui/x-data-grid'
import isElectron from 'is-electron'
import useStore from '../../../store/useStore'
import Popover from '../../Popover/Popover'
import SceneImage from '../../../pages/Scenes/ScenesImage'
import { a11yProps, TabPanel } from './AssetManager.components'
import AssetDataGrid from './AssetDataGrid'

const AssetManager = ({
  variant = 'iconbutton'
}: {
  variant?: 'button' | 'iconbutton' | 'navitem' | 'tile'
}) => {
  const theme = useTheme()
  const [open, setOpen] = useState(false)
  const [tabValue, setTabValue] = useState(0)
  const assets = useStore((state) => state.assets)
  const platform = useStore((state) => state.platform)
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
          thumbnail
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
      field: 'n_frames',
      headerName: 'Frames',
      width: 100
    },
    {
      field: 'modified',
      headerName: 'Modified',
      width: 180,
      valueFormatter: (value: string) => new Date(value).toLocaleString()
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
          thumbnail
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
      field: 'format',
      headerName: 'Format',
      width: 100
    },
    {
      field: 'file_size',
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
            onConfirm={async () => {
              await clearCache(params.row.url)
              await getCacheStats()
            }}
            text={'Clear cache for this image?'}
          />
        </Box>
      )
    }
  ]

  return (
    <>
      {variant === 'iconbutton' && (
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
      )}
      {variant === 'button' && (
        <Button startIcon={<PermMedia />} onClick={() => setOpen(true)}>
          Asset Manager
        </Button>
      )}
      {variant === 'navitem' && (
        <BottomNavigationAction
          label="Assets"
          value="/AssetManager"
          icon={<PermMedia />}
          onClick={() => setOpen(true)}
          sx={{
            color: open ? theme.palette.primary.main : 'inherit',
            pt: 0,
            '& .MuiBottomNavigationAction-label': {
              opacity: 1
            }
          }}
        />
      )}
      {variant === 'tile' && (
        <Button
          variant="outlined"
          onClick={() => setOpen(true)}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
            gap: 1,
            width: '100%',
            height: '100%'
          }}
        >
          <PermMedia fontSize="large" />
          Asset Manager
        </Button>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth={false}
        fullScreen
        PaperProps={{
          sx: {
            bgcolor: theme.palette.background.default,
            paddingTop: isElectron() && platform !== 'darwin' ? '32px' : 0
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
              <AssetDataGrid rows={assets} columns={assetColumns} type="user" />
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <AssetDataGrid rows={assetsFixed} columns={fixedAssetColumns} type="builtin" />
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <AssetDataGrid rows={cacheStats?.entries || []} columns={cacheColumns} type="cache" />
            </TabPanel>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default AssetManager
