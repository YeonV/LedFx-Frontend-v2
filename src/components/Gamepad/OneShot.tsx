import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Stack,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'
import { useState } from 'react'
import ReactGPicker from 'react-gcolor-picker'
import { Edit } from '@mui/icons-material'
import useStore from '../../store/useStore'
import BladeIcon from '../Icons/BladeIcon/BladeIcon'
import SliderInput from '../SchemaForm/components/Number/SliderInput'

const OneShot = ({
  setPayload,
  defaultColor,
  defaultRamp,
  defaultHold,
  defaultFate,
  size
}: any) => {
  const [color, setColor] = useState(defaultColor || '#fff')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [ramp, setRamp] = useState(defaultRamp || 10)
  const [hold, setHold] = useState(defaultHold || 200)
  const [fade, setFade] = useState(defaultFate || 2000)
  const [holdType, setHoldType] = useState('press')

  const handleChange = (event: React.MouseEvent<HTMLElement>, newHoldType: string) => {
    setHoldType(newHoldType)
  }
  const colors = useStore((state) => state.colors)
  const handleClose = () => {
    setDialogOpen(false)
  }
  const handleSave = () => {
    setPayload({ color, ramp, hold, fade, holdType })
    setDialogOpen(false)
  }

  const defaultColors: any = {}
  Object.entries(colors.gradients.builtin).forEach(([k, g]) => {
    defaultColors[k] = g
  })
  Object.entries(colors.gradients.user).forEach(([k, g]) => {
    defaultColors[k] = g
  })
  Object.entries(colors.colors.builtin).forEach(([k, g]) => {
    defaultColors[k] = g
  })
  Object.entries(colors.colors.user).forEach(([k, g]) => {
    defaultColors[k] = g
  })
  return (
    <>
      {defaultColor ? (
        <Box
          onClick={() => setDialogOpen(true)}
          sx={[
            {
              display: 'block',
              borderRadius: '4px',
              justifyContent: 'space-between',
              backgroundColor: defaultColor,
              cursor: 'pointer'
            },
            size === 'large'
              ? {
                  width: '64px'
                }
              : {
                  width: '2rem'
                },
            size === 'large'
              ? {
                  height: '32px'
                }
              : {
                  height: '1rem'
                }
          ]}
        />
      ) : (
        <Button variant="text" onClick={() => setDialogOpen(true)}>
          <Edit />
        </Button>
      )}
      <Dialog open={dialogOpen} onClose={handleClose} fullWidth>
        <DialogTitle alignItems="center" display="flex">
          <BladeIcon name="mdi:pistol" style={{ marginRight: 16 }} /> One Shot
        </DialogTitle>
        <DialogContent>
          <Stack
            direction="row"
            alignItems="flex-start"
            justifyContent="space-between"
            spacing={1}
            mb={3}
          >
            <FormControl>
              <ReactGPicker
                colorBoardHeight={150}
                debounce
                debounceMS={300}
                format="hex"
                gradient={false}
                solid
                onChange={(c) => {
                  return setColor(c)
                }}
                popupWidth={288}
                showAlpha={false}
                value={color}
                defaultColors={Object.values(defaultColors)}
              />
            </FormControl>
            <Stack sx={{ width: '40%', alignSelf: 'stretch' }} justifyContent={'space-between'}>
              <Box
                sx={{
                  display: 'block',
                  marginTop: '1rem',
                  borderRadius: '0.5rem',
                  width: '100%',
                  height: '5rem',
                  justifyContent: 'space-between',
                  backgroundColor: color
                }}
              />
              <Stack direction={'column'} alignItems={'center'} justifyContent={'space-between'}>
                <label>Hold after</label>
                <ToggleButtonGroup
                  fullWidth
                  color="primary"
                  value={holdType}
                  exclusive
                  onChange={handleChange}
                  aria-label="Platform"
                >
                  <ToggleButton value="press">Press</ToggleButton>
                  <ToggleButton value="release">Release</ToggleButton>
                </ToggleButtonGroup>
              </Stack>
            </Stack>
          </Stack>
          <SliderInput title="Ramp" value={ramp} setValue={setRamp} />
          <SliderInput title="Hold" value={hold} setValue={setHold} />
          <SliderInput title="Fade" value={fade} setValue={setFade} />
          {/* <code
            style={{
              display: 'block',
              margin: '1rem 0',
              padding: '1rem',
              background: '#333',
              color: '#ffffff'
            }}
          >
            {`{"color":"${color}","ramp":${ramp},"hold":${hold},"fade":${fade}}`}
          </code> */}
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSave}>Save</Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </>
  )
}
export default OneShot
