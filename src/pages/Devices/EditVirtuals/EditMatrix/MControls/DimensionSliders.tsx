import { Box, Slider, Stack, Typography } from '@mui/material'
import useStore from '../../../../../store/useStore'
import { useMatrixEditorContext } from '../MatrixEditorContext'

const DimensionSliders = () => {
  const virtual2dLimit = useStore((state) => state.ui.virtual2dLimit)
  const { rowN, colN, setRowNumber, setColNumber, saveMatrix } = useMatrixEditorContext()

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
            // saveMatrix writes rows and segments together from the resized
            // matrix, so both sliders persist through the same single path.
            onChangeCommitted={() => saveMatrix()}
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
            onChangeCommitted={() => saveMatrix()}
          />
        </Box>
        {colN}
      </Stack>
    </Stack>
  )
}
export default DimensionSliders
