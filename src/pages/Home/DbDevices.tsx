import { useTheme, Stack, Chip, IconButton } from '@mui/material'
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
  Clear,
  DeleteForever,
  Edit,
  Fullscreen,
  Pause,
  PlayArrow,
  Settings,
  SyncProblem
} from '@mui/icons-material'
import BladeFrame from '../../components/SchemaForm/components/BladeFrame'
import useStore from '../../store/useStore'
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon'
import PixelGraph from '../../components/PixelGraph'

const DeviceActions = ({
  virtId,
  effect
}: {
  virtId: string
  effect?: boolean
}) => {
  const navigate = useNavigate()

  const virtuals = useStore((state) => state.virtuals)
  const updateVirtual = useStore((state) => state.updateVirtual)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getDevices = useStore((state) => state.getDevices)
  const clearEffect = useStore((state) => state.clearEffect)

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
      {effect && (
        <>
          <IconButton
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
            size="small"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              handleClearEffect()
            }}
          >
            <Clear />
          </IconButton>
          {virtuals[virtId]?.config.rows > 1 && (
            <IconButton
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
      )}
      <IconButton
        sx={{
          ml:
            (effect ? 3.2 : 11.8) +
            (virtuals[virtId]?.config.rows > 1 ? 0 : 4.2)
        }}
        size="small"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handlePlayPause()
        }}
      >
        <Edit />
      </IconButton>
      <IconButton
        size="small"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handlePlayPause()
        }}
      >
        <Settings />
      </IconButton>
      <IconButton
        size="small"
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          handlePlayPause()
        }}
      >
        <DeleteForever />
      </IconButton>
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
  const setPixelGraphs = useStore((state) => state.setPixelGraphs)
  const activateDevice = useStore((state) => state.activateDevice)
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
      width: 200,
      renderCell: (params: GridRenderCellParams) =>
        graphsMulti && (
          <div
            style={{
              opacity: fade ? 0.2 : 1,
              transitionDuration: fade
                ? `${virtuals[params.row.id].config.transition_time * 1000 || 1}s`
                : `${virtuals[params.row.id].config.transition_time * 1000 || 0}s`,
              width: '100%',
              transition: 'opacity'
            }}
          >
            <PixelGraph
              showMatrix={showMatrix}
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
            : 'Online'
          : virtuals[params.row.id]?.effect?.name
            ? `Effect: ${virtuals[params.row.id]?.effect?.name}`
            : 'Offline'
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 300, // eslint-disable-next-line
      renderCell: (params: GridRenderCellParams) => // eslint-disable-next-line
        devices[Object.keys(devices).find((d) => d === params.row.id) || '']?.online  // eslint-disable-next-line
          ? (virtuals[params.row.id]?.effect.name  // eslint-disable-next-line
            ? (<DeviceActions virtId={params.row.id} effect />)  // eslint-disable-next-line
            : (<DeviceActions virtId={params.row.id} />))  // eslint-disable-next-line
          : virtuals[params.row.id]?.effect.name  // eslint-disable-next-line
            ? (<DeviceActions virtId={params.row.id} effect />) 
            : (<ReconnectButton onClick={() => activateDevice(params.row.id)} />)
    }
  ]

  const rows: any = Object.values(virtuals).map((v: any) => ({
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
            '&.MuiDataGrid-root .MuiDataGrid-cell:focus-within': {
              outline: 'none !important'
            }
          }}
        />
      </Stack>
    </BladeFrame>
  )
}

export default DbDevices
