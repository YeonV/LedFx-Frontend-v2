import { useTheme, Stack, Chip, IconButton, Typography } from '@mui/material'
import {
  DataGrid,
  GridColDef,
  GridEventListener,
  GridRenderCellParams
  // GridRenderCellParams,
} from '@mui/x-data-grid'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  DeleteForever,
  Edit,
  Fullscreen,
  GridOff,
  GridOn,
  Pause,
  PlayArrow,
  Settings,
  Stop,
  SyncProblem
} from '@mui/icons-material'
import BladeFrame from '../../components/SchemaForm/components/BladeFrame'
import useStore from '../../store/useStore'
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon'
import PixelGraph from '../../components/PixelGraph'
import Popover from '../../components/Popover/Popover'

const DeviceActions = ({
  virtId,
  effect
}: {
  virtId: string
  effect?: boolean
}) => {
  const navigate = useNavigate()
  const virtuals = useStore((state) => state.virtuals)
  const lastEffect = virtuals[virtId]?.last_effect
  const updateVirtual = useStore((state) => state.updateVirtual)
  const deleteVirtual = useStore((state) => state.deleteVirtual)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getDevices = useStore((state) => state.getDevices)
  const clearEffect = useStore((state) => state.clearEffect)
  const setDialogOpenAddVirtual = useStore(
    (state) => state.setDialogOpenAddVirtual
  )
  const setDialogOpenAddDevice = useStore(
    (state) => state.setDialogOpenAddDevice
  )

  const handleEditVirtual = () => {
    setDialogOpenAddVirtual(true, virtId)
  }
  const handlePlayPause = () => {
    if (virtId && virtuals[virtId])
      updateVirtual(virtId, !virtuals[virtId].active).then(() => getVirtuals())
  }
  const handleClearEffect = () => {
    clearEffect(virtId).then(() => {
      setTimeout(() => {
        getVirtuals()
        getDevices()
      }, virtuals[virtId].config.transition_time * 1000)
    })
  }

  return (
    <>
      {effect ? (
        <>
          <IconButton
            sx={{ pt: 0.25 }}
            size="small"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handlePlayPause()
            }}
          >
            {virtuals[virtId]?.active ? <Pause /> : <PlayArrow />}
          </IconButton>
          <IconButton
            sx={{ pt: 0.25 }}
            size="small"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleClearEffect()
            }}
          >
            <Stop />
          </IconButton>
          {virtuals[virtId]?.config.rows > 1 && (
            <IconButton
              sx={{ pt: 0.25 }}
              size="small"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                navigate(`/graph/${virtId}`)
              }}
            >
              <Fullscreen />
            </IconButton>
          )}
        </>
      ) : (
        <span style={{ width: 24, flex: '0 0 24px' }}>
          {lastEffect && (
            <>
              <IconButton
                sx={{ pt: 0.25 }}
                size="small"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handlePlayPause()
                }}
              >
                <PlayArrow />
              </IconButton>
            </>
          )}
        </span>
      )}
      <IconButton
        sx={{
          ml:
            (effect ? 3.2 : 11.8) +
            (virtuals[virtId]?.config.rows > 1 ? 0 : 4.2) +
            (!effect && virtuals[virtId]?.config.rows > 1 ? 4.2 : 0)
        }}
        size="small"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setDialogOpenAddDevice(true, virtuals[virtId]?.is_device)
        }}
      >
        <Edit />
      </IconButton>
      <IconButton
        size="small"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handleEditVirtual()
        }}
      >
        <Settings />
      </IconButton>
      <Popover
        type="iconbutton"
        icon={<DeleteForever />}
        color={'inherit'}
        onConfirm={(e) => {
          e.preventDefault()
          e.stopPropagation()
          deleteVirtual(virtId).then(() => {
            getVirtuals()
          })
        }}
      />
    </>
  )
}

const ReconnectButton = ({ onClick }: { onClick: () => void }) => (
  <IconButton
    size="small"
    onClick={(e) => {
      e.preventDefault()
      onClick()
    }}
  >
    <SyncProblem />
  </IconButton>
)

const DbDevices = () => {
  const theme = useTheme()
  const navigate = useNavigate()
  const devices = useStore((state) => state.devices)
  const virtuals = useStore((state) => state.virtuals)
  const graphs = useStore((state) => state.graphs)
  const graphsMulti = useStore((state) => state.graphsMulti)
  const [fade] = useState(false)
  const showMatrix = useStore((state) => state.showMatrix)
  const [matrix, setMatrix] = useState(showMatrix)
  const paused = useStore((state) => state.paused)
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)
  const schemas = useStore((state) => state.schemas)
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
  const activateDevice = useStore((state) => state.activateDevice)
  const clearEffect = useStore((state) => state.clearEffect)
  const togglePause = useStore((state) => state.togglePause)
  const getVirtuals = useStore((state) => state.getVirtuals)

  const clearAllEffects = async () => {
    await Promise.all(Object.keys(virtuals).map((v) => clearEffect(v)))
  }

  useEffect(() => {
    if (graphs && graphsMulti) {
      setPixelGraphs(Object.keys(virtuals))
    }
  }, [graphs, graphsMulti, setPixelGraphs, virtuals])

  const handleEvent: GridEventListener<'rowClick'> = (params) =>
    navigate(`/device/${params.row.id}`)

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 70 },
    {
      field: 'icon_name',
      headerName: '',
      width: 50,
      display: 'flex',
      align: 'center',
      renderCell: (params: GridRenderCellParams) => (
        <BladeIcon name={params.value} />
      )
    },
    {
      field: 'name',
      headerName: 'Name',
      width: 220

      // renderCell: (params: GridRenderCellParams<string>) => (
      //   <Link
      //     component={RouterLink}
      //     color="inherit"
      //     style={{ textDecoration: 'none' }}
      //     to={`/device/${params.row.id}`}
      //   >
      //     <Typography>{params.value}</Typography>
      //   </Link>
      // ),
    },
    {
      field: 'PixelGraph',
      headerName: 'Graph',
      renderHeader: () => (
        <Stack
          direction={'row'}
          spacing={2}
          alignItems={'center'}
          style={{ width: 200 }}
        >
          <Typography>Graph</Typography>
          {Object.keys(virtuals).some((v) => virtuals[v].config.rows > 1) && (
            <IconButton
              size="small"
              onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                setMatrix(!matrix)
              }}
            >
              {matrix ? <GridOff /> : <GridOn />}
            </IconButton>
          )}
        </Stack>
      ),
      width: 200,
      renderCell: (params: GridRenderCellParams) =>
        graphsMulti && (
          <div
            style={{
              paddingTop: virtuals[params.row.id].config.rows > 1 ? 0 : '7px',
              opacity: fade ? 0.2 : 1,
              transitionDuration: fade
                ? `${virtuals[params.row.id].config.transition_time * 1000 || 1}s`
                : `${virtuals[params.row.id].config.transition_time * 1000 || 0}s`,
              width: '100%',
              transition: 'opacity'
            }}
          >
            <PixelGraph
              db
              showMatrix={matrix && showMatrix}
              intGraphs={graphs && graphsMulti}
              active
              virtId={params.row.id || ''}
              className="step-devices-seven"
            />
          </div>
        )
    },
    {
      field: 'is_device',
      headerName: 'Type',
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <Chip label={params.row.is_device ? 'Device' : 'Virtual'} />
      )
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 200,
      align: 'left',
      renderCell: (params: GridRenderCellParams) =>
        devices[Object.keys(devices).find((d) => d === params.row.id) || '']
          ?.online
          ? virtuals[params.row.id]?.effect?.name
            ? `Effect: ${virtuals[params.row.id]?.effect?.name}`
            : `${virtuals[params.row.id]?.last_effect ? `Last Effect: ${schemas.effects[virtuals[params.row.id]?.last_effect as string].name}` : 'Online'}`
          : virtuals[params.row.id]?.effect?.name
            ? `Effect: ${virtuals[params.row.id]?.effect?.name}`
            : params.row.is_device
              ? 'Offline'
              : virtuals[params.row.id]?.active
                ? 'Active'
                : 'Inactive'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      renderHeader: () => (
        <Stack direction={'row'} alignItems={'center'} style={{ width: 400 }}>
          <Stack direction={'row'} alignItems={'center'} style={{ width: 135 }}>
            <IconButton
              size="small"
              onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                await togglePause()
                getVirtuals()
              }}
            >
              {paused ? <PlayArrow /> : <Pause />}
            </IconButton>
            <IconButton
              size="small"
              onClick={async (e) => {
                e.preventDefault()
                e.stopPropagation()
                await clearAllEffects()
                getVirtuals()
              }}
            >
              <Stop />
            </IconButton>
          </Stack>
          Actions
        </Stack>
      ),
      width: 400,
      renderCell: (params: GridRenderCellParams) =>
        devices[Object.keys(devices).find((d) => d === params.row.id) || '']
          ?.online ? (
          virtuals[params.row.id]?.effect.name ? (
            <DeviceActions virtId={params.row.id} effect />
          ) : (
            <DeviceActions virtId={params.row.id} />
          )
        ) : virtuals[params.row.id]?.effect.name ? (
          <DeviceActions virtId={params.row.id} effect />
        ) : params.row.is_device ? (
          <ReconnectButton onClick={() => activateDevice(params.row.id)} />
        ) : null
    }
  ]

  const rows: any = Object.values(virtuals)
    .filter((v) => {
      const vs = Object.keys(virtuals)
      const virt = vs
        .filter((v) =>
          showComplex
            ? v
            : !(
                v.endsWith('-mask') ||
                v.endsWith('-foreground') ||
                v.endsWith('-background')
              )
        )
        .filter((v) => (showGaps ? v : !v.startsWith('gap-')))
        .find((key) => virtuals[key].id === v.id)
      return virt !== undefined
    })
    .map((v: any) => ({
      ...v,
      ...v.config
    }))

  return (
    <BladeFrame
      labelStyle={{
        background: theme.palette.background.default,
        color: theme.palette.primary.main
      }}
      style={{
        borderColor: theme.palette.primary.main,
        padding: 20,
        minWidth: 450
      }}
      title="Entities"
    >
      <Stack width="100%" height="100%" maxHeight="75vh" minHeight="100%">
        <DataGrid
          onRowClick={handleEvent}
          rowHeight={50}
          columns={columns}
          hideFooter
          // headerHeight={1}
          pageSizeOptions={[100]}
          disableRowSelectionOnClick
          rows={rows}
          initialState={{
            // pagination: {
            //   pageSize: 100,
            // },
            sorting: {
              sortModel: [{ field: 'name', sort: 'asc' }]
            },
            columns: {
              columnVisibilityModel: {
                id: false
              }
            }
          }}
          sx={{
            borderColor: 'transparent',
            '& .MuiDataGrid-row': {
              backgroundColor:
                theme.palette.mode === 'light'
                  ? theme.palette.background.default + '90'
                  : ''
            },
            '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
              outline: 'none !important'
            },
            '& .MuiDataGrid-row:hover': {
              cursor: 'pointer'
            }
          }}
        />
      </Stack>
    </BladeFrame>
  )
}

export default DbDevices
