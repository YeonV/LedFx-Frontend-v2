import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Select
} from '@mui/material'
import MDialogTitle from './MDialogTitle'
import BladeFrame from '../../../../components/SchemaForm/components/BladeFrame'
import MSwitch from './MSwitch'
import MFillSelector from './MFillSelector'
import MSlider from './MSlider'
import assignPixels from './Actions/assignPixels'
import { IDir } from './M.utils'
import useStore from '../../../../store/useStore'

const AssignPixelDialog = ({
  open,
  closeClear,
  currentCell,
  m,
  currentDevice,
  setCurrentDevice,
  deviceRef,
  group,
  setGroup,
  direction,
  handleDirectionChange,
  selectedPixel,
  handleSliderChange,
  rowN,
  colN,
  setM,
  pixelGroups,
  setPixelGroups,
  clearPixel
}: {
  open: boolean
  closeClear: any
  currentCell: [number, number]
  m: any
  currentDevice: string
  setCurrentDevice: any
  deviceRef: any
  group: boolean
  setGroup: any
  direction: IDir
  handleDirectionChange: any
  selectedPixel: number | number[]
  handleSliderChange: any
  rowN: number
  colN: number
  setM: any
  pixelGroups: any
  setPixelGroups: any
  clearPixel: any
}) => {
  const devices = useStore((state) => state.devices)
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)

  return (
    <Dialog
      onClose={() => closeClear()}
      open={open}
      PaperProps={{ sx: { width: '100%', maxWidth: 320 } }}
    >
      <MDialogTitle currentCell={currentCell} m={m} />
      <DialogContent>
        <BladeFrame title="Device" style={{ marginBottom: '1rem' }}>
          <Select
            value={currentDevice}
            onChange={(e) => setCurrentDevice(e.target.value || '')}
            inputRef={deviceRef}
            variant="standard"
            fullWidth
          >
            {devices &&
              Object.keys(devices)
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
                .map((d: any, i: number) => (
                  <MenuItem value={devices[d].id} key={i}>
                    {devices[d].config.name}
                  </MenuItem>
                ))}
          </Select>
        </BladeFrame>
        {currentDevice && (
          <>
            <MSwitch group={group} setGroup={setGroup} />
            {group && (
              <MFillSelector
                direction={direction}
                onChange={handleDirectionChange}
              />
            )}
            <MSlider
              group={group}
              devices={devices}
              currentDevice={currentDevice}
              selectedPixel={selectedPixel}
              handleSliderChange={handleSliderChange}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={() => clearPixel()}>Clear</Button>
        <Button
          onClick={() =>
            assignPixels({
              m,
              rowN,
              colN,
              currentCell,
              currentDevice,
              selectedPixel,
              direction,
              setM,
              closeClear,
              pixelGroups,
              setPixelGroups
            })
          }
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssignPixelDialog
