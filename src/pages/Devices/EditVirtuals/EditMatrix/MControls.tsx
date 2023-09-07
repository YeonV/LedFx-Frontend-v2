import {
  Rotate90DegreesCw,
  Save,
  SwapHoriz,
  SwapVert
} from '@mui/icons-material'
import { Box, Button, Slider, Stack } from '@mui/material'
import { Ledfx } from '../../../../api/ledfx'
import Popover from '../../../../components/Popover/Popover'
import { transpose } from '../../../../utils/helpers'

const MControls = ({
  rowNumber,
  colNumber,
  setRowNumber,
  setColNumber,
  virtual,
  m,
  setM
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
        justifyContent="space-between"
        margin="1rem 0"
      >
        <Stack direction="row" justifyContent="flex-start">
          <Button style={{ marginRight: 8 }} onClick={() => setM(transpose(m))}>
            <Rotate90DegreesCw />
          </Button>
          <Button
            style={{ marginRight: 8 }}
            onClick={() => {
              const toReverse = JSON.parse(JSON.stringify(m))
              setM(toReverse.reverse())
            }}
          >
            <SwapVert />
          </Button>
          <Button
            style={{ marginRight: 32 }}
            onClick={() => {
              const toReverse = JSON.parse(JSON.stringify(m))
              for (let index = 0; index < toReverse.length; index += 1) {
                toReverse[index] = toReverse[index].reverse()
              }
              setM(toReverse)
            }}
          >
            <SwapHoriz />
          </Button>
        </Stack>
        <Stack direction="row" justifyContent="flex-start">
          <Popover
            style={{ marginRight: 8 }}
            color="inherit"
            variant="outlined"
            onConfirm={() => {
              setM(
                Array(rowNumber).fill(
                  Array(colNumber).fill({ deviceId: '', pixel: 0 })
                )
              )
            }}
          />

          <Button
            onClick={() =>
              Ledfx('/api/virtuals', 'POST', {
                config: {
                  ...virtual.config,
                  rows: rowNumber
                },
                matrix: m,
                id: virtual.id
              })
            }
            startIcon={<Save />}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </>
  )
}

export default MControls
