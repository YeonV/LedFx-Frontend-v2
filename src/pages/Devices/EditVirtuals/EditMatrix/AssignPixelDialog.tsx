import { Button, Dialog, DialogActions, DialogContent, MenuItem, Select } from '@mui/material'
import MDialogTitle from './MDialogTitle'
import BladeFrame from '../../../../components/SchemaForm/components/BladeFrame'
import MSwitch from './MSwitch'
import MFillSelector from './MFillSelector'
import MSlider from './MSlider'
import useStore from '../../../../store/useStore'
import { useMatrixEditorContext } from './MatrixEditorContext'
import { useAssignPixelDialog } from './useAssignPixelDialog'

// Define the type for the props, which is the return type of our hook
type AssignPixelDialogApi = ReturnType<typeof useAssignPixelDialog>

interface AssignPixelDialogProps {
  dialogApi: AssignPixelDialogApi
}

const AssignPixelDialog = ({ dialogApi }: AssignPixelDialogProps) => {
  // Destructure the API object passed in via props
  const {
    isOpen,
    closeDialog,
    currentCell,
    currentDevice,
    setCurrentDevice,
    deviceRef,
    isGroupMode,
    setIsGroupMode,
    direction,
    handleDirectionChange,
    selectedPixel,
    handleSliderChange,
    save,
    handleClear
  } = dialogApi

  // These are for populating the device list, they can stay here.
  const devices = useStore((state) => state.devices)
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)
  const { m } = useMatrixEditorContext() // Get matrix for the title

  if (!isOpen) return null // Render nothing if the dialog is not open

  return (
    <Dialog
      onClose={closeDialog}
      open={isOpen}
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
                .map((d: any) => (
                  <MenuItem value={devices[d].id} key={devices[d].id}>
                    {devices[d].config.name}
                  </MenuItem>
                ))}
          </Select>
        </BladeFrame>
        {currentDevice && (
          <>
            <MSwitch group={isGroupMode} setGroup={setIsGroupMode} />
            {isGroupMode && (
              <MFillSelector direction={direction} onChange={handleDirectionChange} />
            )}
            <MSlider
              group={isGroupMode}
              devices={devices}
              currentDevice={currentDevice}
              selectedPixel={selectedPixel}
              handleSliderChange={handleSliderChange}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear}>Clear</Button>
        <Button onClick={save}>Save</Button>
      </DialogActions>
    </Dialog>
  )
}

export default AssignPixelDialog
