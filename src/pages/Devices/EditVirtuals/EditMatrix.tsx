/* eslint-disable no-plusplus */
/* eslint-disable prettier/prettier */
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Slider,
  Stack,
  Switch,
  Typography
} from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import { Save } from '@mui/icons-material'
import useStore from '../../../store/useStore'
import BladeFrame from '../../../components/SchemaForm/components/BladeFrame'
import Popover from '../../../components/Popover/Popover'
import { Ledfx } from '../../../api/ledfx'

const EditMatrix = ({ virtual }: any) => {
  const devices = useStore((state) => state.devices)

  const [rowNumber, setRowNumber] = useState(5)
  const [colNumber, setColNumber] = useState(5)
  const [currentCell, setCurrentCell] = useState([-1, -1])
  const [open, setOpen] = useState(false)
  const [group, setGroup] = useState(false)
  const [selectedPixel, setSelectedPixel] = useState<number | number[]>(0)
  const [direction, setDirection] = useState<'right' | 'left' | 'top' | 'bottom'>('right')
  const [mode, setMode] = useState<'linear' | 'snake'>('linear')
  const [matrix, setMatrix] = useState(
    Array(rowNumber * colNumber).fill({
      deviceId: '',
      pixel: 0
    })
  )
  const [currentDevice, setCurrentDevice] = useState('')

  const closeClear = () => {
    setOpen(false)
    setCurrentDevice('')
    setSelectedPixel(0)
    setGroup(false)
  }

  const deviceRef = useRef()

  useEffect(() => {
    if (group) {
      if (typeof selectedPixel === 'number') {
        setSelectedPixel([selectedPixel, selectedPixel + 1])
      }
    } else if (typeof selectedPixel !== 'number') {
      setSelectedPixel(selectedPixel[0])
    }
  }, [group])

  useEffect(() => {
    setMatrix(
      Array(rowNumber * colNumber).fill({
        deviceId: '',
        pixel: 0
      })
    )
  }, [rowNumber, colNumber])

  const handleSliderChange = (
    e: Event,
    newPixelRange: number | number[],
    activeThumb: number
  ) => {
    if (typeof newPixelRange !== 'number') {
      const [col, row] = currentCell;
      let maxRange = 0;
  
      if (direction === 'right') {
        maxRange = colNumber * rowNumber - (row * colNumber + col - 1);
      } else if (direction === 'left') {
        maxRange = row * colNumber + col + 1;
      } else if (direction === 'bottom') {
        maxRange = colNumber * rowNumber - (colNumber * col  + row);
      } else if (direction === 'top') {
        maxRange = (rowNumber * col) + row + 1
      }
  
      const distance = newPixelRange[1] - newPixelRange[0];
  
      let adjustedLeftThumb = newPixelRange[0];
      let adjustedRightThumb = newPixelRange[1];
  
      if (distance > maxRange) {
        if (activeThumb === 0) {
          adjustedRightThumb = adjustedLeftThumb + maxRange;
        } else {
          adjustedLeftThumb = adjustedRightThumb - maxRange;
        }
      }
  
      const updatedSelectedPixel =
        direction === 'top'
          ? [adjustedRightThumb, adjustedLeftThumb]
          : [adjustedLeftThumb, adjustedRightThumb];
  
      setSelectedPixel(updatedSelectedPixel);
    } else {
      setSelectedPixel(newPixelRange);
    }
  };
  
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        maxHeight: '80vh'
      }}
    >
      <Alert severity="info" sx={{ width: 500, marginBottom: 2 }}>
        <strong>Concept Draft</strong>
        <ul style={{ padding: '0 1rem' }}>
          <li>Use Mousewheel to Zoom</li>
          <li>Use left-click with drag&drop to move around</li>
          <li>Use right-click to assign Pixels</li>
        </ul>
      </Alert>
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
      <TransformWrapper
        centerZoomedOut
        initialScale={
          colNumber * 100 < window.innerWidth ||
          rowNumber * 100 < window.innerHeight * 0.8
            ? 1
            : 0.1
        }
        minScale={0.1}
      >
        <TransformComponent>
          <div
            style={{
              width: colNumber * 100,
              height: rowNumber * 100,
              background: '#111',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                height: '100%',
                width: '100%'
              }}
            >
              {matrix.map((d, i) => (
                <Box
                  key={i}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setCurrentCell([i % colNumber, Math.floor(i / colNumber)])
                    setCurrentDevice(d.deviceId !== '' ? d.deviceId : '')
                    setSelectedPixel(d.pixel || 0)
                    setOpen(true)
                  }}
                  sx={{
                    cursor: 'copy',
                    border: '1px solid #666',
                    background: '#111',
                    width: 100,
                    height: 100,
                    '&:hover': {
                      background: '#999'
                    }
                  }}
                >
                  {d.deviceId !== '' && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        height: '98px',
                        background: '#444',
                        width: '98px',
                        border: '5px solid #111',
                        boxSizing: 'border-box',
                        padding: '8px',
                        borderRadius: '10px'
                      }}
                    >
                      <Typography variant="caption">
                        {devices[d.deviceId].config.name}
                      </Typography>
                      <Typography variant="caption">{d.pixel}</Typography>
                    </div>
                  )}
                </Box>
              ))}
            </div>
            <Dialog
              onClose={() => closeClear()}
              open={open}
              PaperProps={{ sx: { width: '100%', maxWidth: 320 } }}
            >
              <DialogTitle>
                <div
                  style={{
                    display: 'flex',
                    width: '100%',
                    justifyContent: 'space-between'
                  }}
                >
                  {matrix[currentCell[1] * colNumber + currentCell[0]]
                    ?.deviceId !== ''
                    ? 'Edit'
                    : 'Assign'}{' '}
                  Pixel
                  <Typography variant="caption" align="right">
                    Row: {currentCell[1] + 1}
                    <br />
                    Column: {currentCell[0] + 1}
                  </Typography>
                </div>
              </DialogTitle>
              <DialogContent>
                <BladeFrame
                  title="Device"
                  full={false}
                  style={{ marginBottom: '1rem' }}
                >
                  <Select
                    value={currentDevice}
                    onChange={(e) => setCurrentDevice(e.target.value || '')}
                    inputRef={deviceRef}
                    variant="standard"
                    fullWidth
                  >
                    {devices &&
                      Object.keys(devices).map((d: any, i: number) => (
                        <MenuItem value={devices[d].id} key={i}>
                          {devices[d].config.name}
                        </MenuItem>
                      ))}
                  </Select>
                </BladeFrame>
                {currentDevice && (
                  <>
                    <BladeFrame
                      title={`Pixel${group ? 's' : ''}`}
                      full={false}
                      style={{ marginBottom: '1rem' }}
                    >
                      <Slider
                        marks={[
                          { value: 0, label: '0' },
                          {
                            value: devices[currentDevice].config.pixel_count,
                            label: devices[currentDevice].config.pixel_count
                          }
                        ]}
                        valueLabelDisplay="auto"
                        min={0}
                        max={devices[currentDevice].config.pixel_count}
                        value={selectedPixel}
                        onChange={handleSliderChange}
                      />
                    </BladeFrame>
                    {matrix[currentCell[1] * colNumber + currentCell[0]]
                      .deviceId === '' && (
                      <BladeFrame
                        title="Group"
                        style={{
                          justifyContent: 'space-between',
                          paddingRight: 2,
                          marginBottom: '1rem'
                        }}
                      >
                        <Typography>Assign multiple</Typography>
                        <Switch
                          checked={group}
                          onClick={() => setGroup(!group)}
                        />
                      </BladeFrame>
                    )}
                    {group && (
                      <>
                        <BladeFrame
                          title="Fill Direction"
                          full={false}
                          style={{ marginBottom: '1rem' }}
                        >

                          <Select
                            value={direction}
                            onChange={(e) => {
                              setDirection(e.target.value as 'right' | 'left' | 'top' | 'bottom')
                              if (typeof selectedPixel !== 'number') {
                                const [col, row] = currentCell
                                const maxRange =
                                  e.target.value === 'right'
                                    ? colNumber * rowNumber -
                                      (row * colNumber + col - 1)
                                    : e.target.value === 'left'
                                      ? row * colNumber + col + 1
                                      : e.target.value === 'bottom'
                                        ? colNumber * rowNumber - (colNumber * col  + row)
                                        : (rowNumber * col) + row + 1
                                const distance =
                                  selectedPixel[1] - selectedPixel[0]
                                if (distance > maxRange) {
                                  setSelectedPixel([
                                    selectedPixel[0],
                                    selectedPixel[0] + maxRange
                                  ])
                                }
                              }
                            }}
                            variant="standard"
                            fullWidth
                          >
                            <MenuItem value="right">To Right</MenuItem>
                            <MenuItem value="bottom">To Bottom</MenuItem>
                            <MenuItem value="left">To Left</MenuItem>
                            <MenuItem value="top">To Top</MenuItem>
                          </Select>
                        </BladeFrame>
                        <BladeFrame
                          title="Mode"
                          full={false}
                          style={{ marginBottom: '1rem' }}
                        >
                          <Select
                            value={mode}
                            onChange={(e) => setMode(e.target.value as 'linear' | 'snake')}
                            variant="standard"
                            fullWidth
                          >
                            <MenuItem value="linear">Linear</MenuItem>
                            <MenuItem value="snake">Snake</MenuItem>
                          </Select>
                        </BladeFrame>
                      </>
                    )}
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    const updatedMatrix = [...matrix]
                    const [col, row] = currentCell
                    if (typeof selectedPixel === 'number') {
                      updatedMatrix[row * colNumber + col] = {
                        deviceId: '',
                        pixel: 0
                      }
                    }
                    setMatrix(updatedMatrix)
                    closeClear()
                  }}
                >
                  Clear
                </Button>
                <Button
                  onClick={() => {
                    const updatedMatrix = [...matrix]
                    const [col, row] = currentCell
                    if (typeof selectedPixel === 'number') {
                      updatedMatrix[row * colNumber + col] = {
                        deviceId: currentDevice,
                        pixel: selectedPixel
                      }
                    } else {
                      for (
                        let index = 0;
                        index < selectedPixel[1] - selectedPixel[0];
                        index++
                      ) {
                        if (direction === 'right') {
                          updatedMatrix[row * colNumber + col + index] = {
                            deviceId: currentDevice,
                            pixel: selectedPixel[0] + index
                          }
                        } else if (direction === 'bottom') {
                          updatedMatrix[
                            ((row + index) % rowNumber) * colNumber +
                              col +
                              Math.floor(index / rowNumber)
                          ] = {
                            deviceId: currentDevice,
                            pixel: selectedPixel[0] + index
                          }
                        } else if (direction === 'left') {
                          updatedMatrix[row * colNumber + col - index] = {
                            deviceId: currentDevice,
                            pixel: selectedPixel[0] + index
                          }
                        } else if (direction === 'top') {
                          updatedMatrix[
                            ((row - index) % rowNumber) * colNumber +
                              row + 
                              Math.floor(index / rowNumber)
                          ] = {
                            deviceId: currentDevice,
                            pixel: selectedPixel[0] + index
                          }
                        }
                      }
                    }
                    setMatrix(updatedMatrix)
                    closeClear()
                  }}
                >
                  Save
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default EditMatrix
