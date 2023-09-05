import { Save } from '@mui/icons-material'
import { Box, Button, Slider, Stack } from '@mui/material'
import { Ledfx } from '../../../api/ledfx'
import Popover from '../../../components/Popover/Popover'

const EditMatrixControls = ({
  rowNumber,
  colNumber,
  setRowNumber,
  setColNumber,
  setMatrix,
  virtual,
  matrix
}: any) => {
  return (
    <>
      <Stack direction="row" width={500} justifyContent="space-between">
        Rows:
        <Box width={400}>
          <Slider
            min={1}
            max={50}
            value={rowNumber}
            onChange={(e, newRowNumber) =>
              typeof newRowNumber === 'number' && setRowNumber(newRowNumber)
            }
          />
        </Box>
        {rowNumber}
      </Stack>
      <Stack direction="row" width={500} justifyContent="space-between">
        Columns:
        <Box width={400}>
          <Slider
            min={1}
            max={50}
            value={colNumber}
            onChange={(e, newColNumber) =>
              typeof newColNumber === 'number' && setColNumber(newColNumber)
            }
          />
        </Box>
        {colNumber}
      </Stack>
      <Stack
        direction="row"
        width={500}
        justifyContent="flex-end"
        margin="1rem 0"
      >
        <Popover
          style={{ marginRight: 16 }}
          color="inherit"
          variant="outlined"
          onConfirm={() =>
            setMatrix(
              Array(rowNumber * colNumber).fill({
                deviceId: '',
                pixel: 0
              })
            )
          }
        />
        <Button
          onClick={() =>
            Ledfx('/api/virtuals', 'POST', {
              config: {
                ...virtual.config,
                rows: rowNumber
              },
              matrix,
              id: virtual.id
            })
          }
          startIcon={<Save />}
        >
          Save
        </Button>
      </Stack>
    </>
  )
}

export default EditMatrixControls
