import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { styled } from '@mui/material/styles'
import { DeleteForever, Edit } from '@mui/icons-material'
import { useEffect } from 'react'
import { IconButton, Stack, Switch } from '@mui/material'
import useStore from '../../../store/useStore'
import Popover from '../../Popover/Popover'

const PREFIX = 'QLCTriggerTable'

const classes = {
  root: `${PREFIX}-root`,
}

const Root = styled('div')(({ theme }: any) => ({
  [`& .${classes.root}`]: {
    '&.MuiDataGrid-root .MuiDataGrid-footerContainer .MuiTablePagination-root':
      {
        color: theme.palette.text.secondary,
      },
    '&.MuiDataGrid-root .MuiButtonBase-root.MuiIconButton-root': {
      color: theme.palette.text.secondary,
    },
    '&.MuiDataGrid-root .MuiDataGrid-cell': {
      borderColor: '#333',
    },
    '&.MuiDataGrid-root .MuiDataGrid-cell:focus, &.MuiDataGrid-root .MuiDataGrid-cell:focus-within':
      {
        outline: 'none',
      },

    '& .currently_playing, .currently_playing.MuiDataGrid-row:hover, .currently_playing.MuiDataGrid-row.Mui-hovered':
      {
        backgroundColor: `${theme.palette.primary.main}20`,
        color: theme.palette.text.primary,
      },
    '& .activated, .activated.MuiDataGrid-row:hover, .activated.MuiDataGrid-row.Mui-hovered':
      {
        backgroundColor: `${theme.palette.primary.main}50`,
        color: theme.palette.text.primary,
      },
    '& .disabled.MuiDataGrid-row': {
      pointerEvents: 'none',
      color: '#666',
    },
    '& .disabled.MuiDataGrid-row .MuiIconButton-root': {
      pointerEvents: 'none',
      color: '#666',
    },
  },
}))

export default function QLCTriggerTable() {
  const integrations = useStore((state) => state.integrations)
  const getIntegrations = useStore((state) => state.getIntegrations)
  const getQLCWidgets = useStore((state) => state.getQLCWidgets)
  const qlcInfo = useStore((state) => state.qlc.qlcWidgets)
  const QLCTriggersList = useStore((state) => state.qlc.qlcTriggersList)
  const deleteQLCTrigger = useStore((state) => state.deleteQLCTrigger)
  const addToQLCTriggerList = useStore((state) => state.addToQLCTriggerList)
  const toggleQLCTrigger = useStore((state) => state.toggleQLCTrigger)

  useEffect(() => {
    getQLCWidgets()
  }, [])

  // Here we get the current triggers from list and set to global state
  useEffect(() => {
    const triggersNew: any = []
    let id = 1
    if (integrations?.qlc?.data) {
      const temp = integrations?.qlc?.data
      Object.keys(temp).map((key) => {
        const temp1 = temp[key]
        const sceneName = temp1[1].scene_name
        const sceneId = temp1[1].scene_name
        const triggerType = 'scene_activated'
        const enabled = true
        const qlc_id = temp1[3]
        const triggerName = temp1[1].scene_name
        const qlc_widgetType = temp1[3]
        const qlc_name = temp1[3]
        const qlc_value = temp1[3]

        const current_data = temp1[3]
        const arr_widgets: any = []
        const arr_values: any = []
        Object.entries(current_data)?.forEach(([k, v]) => {
          const other_data =
            qlcInfo && qlcInfo?.qlc_widgets?.find((widg: any) => widg[0] === k)
          const obj = { ID: '', Type: '', Name: '' }
          obj.ID = k
          obj.Type = other_data && other_data[1]
          obj.Name = other_data && other_data[2]
          arr_widgets.push(obj)
          arr_values.push(v)
        })
        const csv_widgets = JSON.stringify(arr_widgets)
        const csv_values = JSON.stringify(arr_values)

        if (temp1.constructor === Array) {
          triggersNew.push({
            id,
            triggerType,
            triggerName,
            sceneId,
            sceneName,
            enabled,
            trigger: `${triggerType}: ${sceneName}`,
            // qlc_string: `ID: ${qlc_id}, Type: ${qlc_widgetType}, Name: ${qlc_name}`,
            qlc_string: csv_widgets,
            qlc_value: csv_values,
            qlc_widgets: [
              {
                qlc_id: 34,
                qlc_widgetType: 'Button',
                qlc_name: 'Medium colour cycle (138 bpm)',
                qlc_value,
                qlc_string: `ID: ${qlc_id}, Type: ${qlc_widgetType}, Name: ${qlc_name}`,
              },
              {
                qlc_id: 32,
                qlc_widgetType: 'Button',
                qlc_name: 'Turn off back light',
                qlc_value,
                qlc_string: `ID: ${qlc_id}, Type: ${qlc_widgetType}, Name: ${qlc_name}`,
              },
            ],
          })
          id += 1
        }
        return triggersNew
      })
      addToQLCTriggerList(triggersNew, 'create')
      // console.log('QLC triggersNew', triggersNew);
    }
  }, [integrations])

  // const SceneSet =
  //   qlcInfo &&
  //   qlcInfo.event_types &&
  //   qlcInfo.event_types.scene_activated.event_filters.scene_name;
  // const QLCWidgets =
  //   qlcInfo &&
  //   qlcInfo.qlc_widgets &&
  //   qlcInfo.qlc_widgets.sort(
  //     (a: string[], b: string[]) => parseInt(a[0]) - parseInt(b[0])
  //   );
  // const qlcStuff: never[] = [];
  // const qlcID = {};
  // qlcInfo &&
  //   qlcInfo.qlc_widgets &&
  //   qlcInfo.qlc_widgets.map((a) => {
  //     qlcStuff[a[0]] = { id: a[0], Type: a[1], Name: a[2] };
  //     qlcID[a[0]] = a[1];
  //     // qlcType[a[0]] = (a[1]);
  //     return true;
  //   });
  // console.log('SceneSet', SceneSet);
  // console.log('QLCWidgets', QLCWidgets);
  // console.log('qlcStuff', qlcStuff);
  // console.log('qlcID', qlcID);

  // triggersNew.find((item: any) => item.id === params.row.id)?.activated}

  const deleteTriggerHandler = (paramsTemp: any) => {
    deleteQLCTrigger({
      data: {
        trigger_id: paramsTemp?.row?.trigger_id,
      },
    }).then(() => getIntegrations())
  }
  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'ID',
      width: 60,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'trigger',
      headerName: 'Trigger Event Type & Name (If This)',
      width: 350,
      headerAlign: 'center',
      align: 'center',
    },

    {
      field: 'qlc_string',
      headerName: 'QLC+ Widget (Do This)',
      width: 500,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'qlc_value',
      headerName: 'QLC+ Value',
      width: 150,
      headerAlign: 'center',
      align: 'center',
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params: any) => (
        <Stack direction="row" alignItems="center" spacing={0}>
          <Switch
            checked={params.row.enabled}
            color="primary"
            aria-label="Enable/Disable Trigger"
            onChange={() => {
              // console.log('params.row.enabled', params);
              toggleQLCTrigger('qlc', {
                enabled: !params.row.enabled,
              })
            }}
          />
          <IconButton
            aria-label="Edit"
            color="inherit"
            // eslint-disable-next-line no-console
            onClick={() => console.error('coming soon...')}
          >
            <Edit fontSize="inherit" />
          </IconButton>
          <Popover
            variant="text"
            color="inherit"
            icon={<DeleteForever />}
            style={{ minWidth: 40 }}
            onConfirm={() => {
              deleteTriggerHandler(params)
            }}
          />
        </Stack>
      ),
    },
  ]

  const rows = QLCTriggersList || [{ id: 1 }]

  return (
    <Root
      style={{
        display: 'flex',
        width: '100%',
      }}
    >
      <DataGrid
        className={classes.root}
        autoHeight
        // checkboxSelection
        disableRowSelectionOnClick
        sx={{
          boxShadow: 2,
          color: '#fff',
          border: 1,
          borderColor: '#666',
        }}
        columns={columns}
        rows={rows}
      />
    </Root>
  )
}
