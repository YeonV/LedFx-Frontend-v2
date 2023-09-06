/* eslint-disable no-plusplus */
/* eslint-disable prettier/prettier */
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, MenuItem, Select, Slider, Switch, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import useStore from '../../../store/useStore'
import BladeFrame from '../../../components/SchemaForm/components/BladeFrame'
import EditMatrixWrapper from './EditMatrixWrapper'
import EditMatrixControls from './EditMatrixControls'
import useStyles from './EditMatrix.styles'

const EditMatrix = ({ virtual }: any) => {
  const classes = useStyles()
  const deviceRef = useRef()
  const devices = useStore((state) => state.devices)
  const [currentDevice, setCurrentDevice] = useState('')
  const [rowNumber, setRowNumber] = useState(5)
  const [colNumber, setColNumber] = useState(5)
  const [currentCell, setCurrentCell] = useState([-1, -1])
  const [open, setOpen] = useState(false)
  const [group, setGroup] = useState(false)
  const [selectedPixel, setSelectedPixel] = useState<number | number[]>(0)
  const [direction, setDirection] = useState<'right' | 'left' | 'top' | 'bottom'>('right')
  const [mode, setMode] = useState<'linear' | 'snake'>('linear')
  // const [matrix, setMatrix] = useState(Array(rowNumber * colNumber).fill({deviceId: '', pixel: 0})) // [{},{}]
  const [m, setM] = useState(Array(rowNumber).fill(Array(colNumber).fill({deviceId: '',pixel: 0}))) // [[{},{}],[{},{}]]

  const closeClear = () => {
    setOpen(false)
    setCurrentDevice('')
    setSelectedPixel(0)
    setGroup(false)
  }

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
    // setMatrix(
    //   Array(rowNumber * colNumber).fill({
    //     deviceId: '',
    //     pixel: 0
    //   })
    // )
    setM(Array(rowNumber).fill(Array(colNumber).fill({deviceId: '',pixel: 0})))
  }, [rowNumber, colNumber])

  const handleSliderChange = (
    e: Event,
    newPixelRange: number | number[],
    activeThumb: number
  ) => {
    if (typeof newPixelRange !== 'number') {
      const [col, row] = currentCell
      let maxRange = 0
  
      if (direction === 'right') {
        maxRange = colNumber * rowNumber - (row * colNumber + col)
      } else if (direction === 'left') {
        maxRange = row * colNumber + col + 1
      } else if (direction === 'bottom') {
        maxRange = colNumber * rowNumber - (rowNumber * col  + row)
      } else if (direction === 'top') {
        maxRange = (rowNumber * col) + row + 1
      }
  
      const distance = newPixelRange[1] - newPixelRange[0]  
      let adjustedLeftThumb = newPixelRange[0]
      let adjustedRightThumb = newPixelRange[1]
      if (distance > maxRange) {
        if (activeThumb === 0) {
          adjustedRightThumb = adjustedLeftThumb + maxRange
        } else {
          adjustedLeftThumb = adjustedRightThumb - maxRange
        }
      }  
      const updatedSelectedPixel =
        direction === 'top'
          ? [adjustedRightThumb, adjustedLeftThumb]
          : [adjustedLeftThumb, adjustedRightThumb]
  
      setSelectedPixel(updatedSelectedPixel)
    } else {
      setSelectedPixel(newPixelRange)
    }
  }  
  return (
    <EditMatrixWrapper>
      <EditMatrixControls
        rowNumber={rowNumber}
        colNumber={colNumber}
        setRowNumber={setRowNumber}
        setColNumber={setColNumber}
        virtual={virtual}
        m={m}
        setM={setM} />
      <TransformWrapper
        centerZoomedOut
        minScale={0.1}
        initialScale={
          colNumber * 100 < window.innerWidth ||
          rowNumber * 100 < window.innerHeight * 0.8
            ? 1
            : 0.1
        }>
        <TransformComponent>
          <div className={classes.gridCellContainer}
            style={{ width: colNumber * 100, height: rowNumber * 100 }}>
            <div style={{ display: 'flex', flexDirection: 'column'}}>
              {m.map((yzrow, currentRowIndex) => <div key={`row-${currentRowIndex}`} style={{ display: 'flex'}}>
                {yzrow.map((yzcolumn: any, currentColIndex: number) => <Box
                  key={`col-${currentColIndex}`}
                  className={classes.gridCell}
                  onContextMenu={(e) => {
                    e.preventDefault()
                    setCurrentCell([currentColIndex, currentRowIndex])
                    setCurrentDevice(yzcolumn.deviceId !== '' ? yzcolumn.deviceId : '')
                    setSelectedPixel(yzcolumn.pixel || 0)
                    setOpen(true)
                  }}>
                  {yzcolumn.deviceId !== '' && (
                    <div className={classes.pixel}>
                      <Typography variant="caption">
                        {devices[yzcolumn.deviceId].config.name}
                      </Typography>
                      <Typography variant="caption">{yzcolumn.pixel}</Typography>
                    </div>
                  )}
                </Box>)}
              </div>)}
            </div>
            <Dialog
              onClose={() => closeClear()}
              open={open}
              PaperProps={{ sx: { width: '100%', maxWidth: 320 } }}>
              <DialogTitle>
                <div className={classes.centered}>
                  {/* {matrix[currentCell[1] * colNumber + currentCell[0]]
                    ?.deviceId !== ''
                    ? 'Edit'
                    : 'Assign'}{' '} */}
                  Pixel
                  <Typography variant="caption" align="right">
                    Row: {currentCell[1] + 1}
                    <br />
                    Column: {currentCell[0] + 1}
                  </Typography>
                </div>
              </DialogTitle>
              <DialogContent>
                <BladeFrame title="Device" full={false} style={{ marginBottom: '1rem' }}>
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
                    <BladeFrame title={`Pixel${group ? 's' : ''}`} full={false} style={{ marginBottom: '1rem' }}>
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
                    {/* )} */}
                    {group && (
                      <>
                        <BladeFrame
                          title="Fill Direction"
                          full={false}
                          style={{ marginBottom: '1rem' }}
                        >
                          <Select
                            value={direction}
                            variant="standard"
                            fullWidth
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
                                        ? colNumber * rowNumber - (rowNumber * col  + row)
                                        : (rowNumber * col) + row + 1
                                const distance =
                                  selectedPixel[1] - selectedPixel[0]
                                if (distance > maxRange) {
                                  setSelectedPixel([
                                    selectedPixel[0],
                                    selectedPixel[0] + maxRange
                                  ])}}}}>
                            <MenuItem value="right">To Right</MenuItem>
                            <MenuItem value="bottom">To Bottom</MenuItem>
                            <MenuItem value="left">To Left</MenuItem>
                            <MenuItem value="top">To Top</MenuItem>
                          </Select>
                        </BladeFrame>
                        <BladeFrame title="Mode" full={false} style={{ marginBottom: '1rem' }}>
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
                    const updatedM = JSON.parse(JSON.stringify(m))
                    const [col, row] = currentCell
                    if (typeof selectedPixel === 'number') {
                      updatedM[row][col] = {
                        deviceId: '',
                        pixel: 0
                      }
                    }
                    closeClear()
                  }}>
                  Clear
                </Button>
                <Button
                  onClick={() => {
                                        
                    const updatedM = JSON.parse(JSON.stringify(m))
                    const [col, row] = currentCell
                    if (typeof selectedPixel === 'number') {
                      updatedM[row][col] = {
                        deviceId: currentDevice,
                        pixel: selectedPixel
                      }
                    } else {
                      for (
                        let index = 0;
                        index < Math.abs(selectedPixel[1] - selectedPixel[0]);
                        index++
                      ) {
                        if (direction === 'right') {
                          if (mode === 'snake') {
                            updatedM[row + Math.floor((index + col) / colNumber)][((index + col) % colNumber)] = {
                              deviceId: currentDevice,
                              pixel: selectedPixel[0] + index
                            }
                          }
                          if (mode === 'linear') {
                            updatedM[row + Math.floor((index + col) / colNumber)][((index + col) % colNumber)] = {
                              deviceId: currentDevice,
                              pixel: selectedPixel[0] + index
                            }
                          }
                        } else if (direction === 'bottom') {
                          updatedM[(index+row) % rowNumber][col + Math.floor((index + row)/rowNumber)] = {
                            deviceId: currentDevice,
                            pixel: selectedPixel[0] + index
                          }
                        } else if (direction === 'left') {
                          updatedM[row - Math.abs(Math.floor((col - index)/colNumber))][(colNumber + ((col - index)) % colNumber) % colNumber] = {
                            deviceId: currentDevice,
                            pixel: selectedPixel[0] + index
                          }
                        } else if (direction === 'top') {
                          updatedM[(rowNumber + ((row - index)) % rowNumber) % rowNumber][col - Math.abs(Math.floor((row - index)/rowNumber))] = {
                            deviceId: currentDevice,
                            pixel: selectedPixel[0] + index
                          }}}}
                    setM(updatedM)
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
    </EditMatrixWrapper>)}

export default EditMatrix
