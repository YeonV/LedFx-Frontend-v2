import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Slider from '@mui/material/Slider'
import useStore from '../../store/useStore'
import BladeFrame from '../../components/SchemaForm/components/BladeFrame'
import { enumOptions } from '../../components/SchemaForm/fields'

const TransitionCard = ({ virtual, style }: any) => {
  const schemas = useStore(
    (state) => state.schemas.virtuals && state.schemas.virtuals.schema.properties
  )
  const addVirtual = useStore((state) => state.addVirtual)
  const transition_mode = virtual && virtual.config && virtual.config.transition_mode
  const transition_time = virtual && virtual.config && virtual.config.transition_time

  const handleSetTransition = (virtId: string, config: any) =>
    addVirtual({
      id: virtId,
      config
    })

  const onSliderChange = (_e: any, newValue: number | number[]) =>
    handleSetTransition(virtual.id, {
      transition_time: newValue
    })

  const time = schemas?.transition_time
  const marks = [
    { value: time?.minimum ?? 0, label: `${time?.minimum ?? 0}s` },
    { value: time?.maximum ?? 5, label: `${time?.maximum ?? 5}s` }
  ]

  return (
    <Card variant="outlined" className="step-device-two" style={style}>
      <CardHeader title="Transitions" subheader="Seamlessly blend between effects" />
      <CardContent
        sx={{
          display: 'flex',
          alignItems: 'center',
          width: '100%',
          padding: '0 1rem 0.4rem 0.9rem !important'
        }}
      >
        <FormControl sx={{ marginRight: '0.5rem', flex: 1 }}>
          <BladeFrame title="Duration">
            <Slider
              defaultValue={transition_time ?? time?.default}
              onChangeCommitted={onSliderChange}
              aria-labelledby="discrete-slider"
              step={0.1}
              min={time?.minimum}
              max={time?.maximum}
              marks={marks}
              style={{ color: '#aaa' }}
              valueLabelDisplay="auto"
            />
          </BladeFrame>
        </FormControl>
        <BladeFrame
          title="Mode"
          style={{
            flexGrow: 0,
            flexBasis: '180px',
            minWidth: '180px',
            minHeight: '72px'
          }}
        >
          <Select
            fullWidth
            defaultValue={transition_mode || schemas?.transition_mode?.default}
            onChange={(e) => {
              handleSetTransition(virtual.id, {
                transition_mode: e.target.value
              })
            }}
          >
            {enumOptions(schemas?.transition_mode)?.map((mode, i) => (
              <MenuItem key={i} value={mode.value as string}>
                {mode.label}
              </MenuItem>
            ))}
          </Select>
        </BladeFrame>
      </CardContent>
    </Card>
  )
}

export default TransitionCard
