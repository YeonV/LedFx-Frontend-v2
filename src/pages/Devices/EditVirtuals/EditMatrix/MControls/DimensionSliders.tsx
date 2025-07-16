import { Box, Slider, Stack, Typography } from '@mui/material'
import { Ledfx } from '../../../../../api/ledfx'
import { processArray } from '../processMatrix'
import useStore from '../../../../../store/useStore'
import { useMatrixEditorContext } from '../MatrixEditorContext'

const DimensionSliders = ({ virtual }: { virtual: any }) => {
  const getVirtuals = useStore((state) => state.getVirtuals)
  const getDevices = useStore((state) => state.getDevices)
  const addVirtual = useStore((state) => state.addVirtual)
  const virtual2dLimit = useStore((state) => state.ui.virtual2dLimit)
  const { rowN, colN, setRowNumber, setColNumber, m } = useMatrixEditorContext()

  return (
    <Stack
      direction="column"
      justifyContent="flex-start"
      alignItems="flex-start"
      className="step-2d-virtual-three"
    >
      <Stack direction="row" width={400} justifyContent="space-between">
        <Typography width={100} variant="body1">
          Rows:
        </Typography>
        <Box width={250}>
          <Slider
            min={1}
            max={virtual2dLimit}
            value={rowN}
            onChange={(e, newRowNumber) =>
              typeof newRowNumber === 'number' && setRowNumber(newRowNumber)
            }
            onChangeCommitted={(e, newRowNumber) => {
              if (typeof newRowNumber === 'number') {
                addVirtual({
                  id: virtual.id,
                  config: { rows: newRowNumber }
                })
                  .then(() => {
                    getVirtuals()
                    getDevices()
                  })
                  .then(() => {
                    Ledfx(`/api/virtuals/${virtual.id}`, 'POST', {
                      segments: processArray(m.flat(), virtual.id)
                    }).then(() => {
                      getVirtuals()
                      getDevices()
                    })
                  })
              }
            }}
          />
        </Box>
        {rowN}
      </Stack>
      <Stack direction="row" width={400} justifyContent="space-between">
        <Typography width={100} variant="body1">
          Columns:
        </Typography>
        <Box width={250}>
          <Slider
            min={1}
            max={virtual2dLimit}
            value={colN}
            onChange={(e, newColNumber) =>
              typeof newColNumber === 'number' && setColNumber(newColNumber)
            }
            onChangeCommitted={() => {
              Ledfx(`/api/virtuals/${virtual.id}`, 'POST', {
                segments: processArray(m.flat(), virtual.id)
              }).then(() => {
                getVirtuals()
                getDevices()
              })
            }}
          />
        </Box>
        {colN}
      </Stack>
    </Stack>
  )
}
export default DimensionSliders
