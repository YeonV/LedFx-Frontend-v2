/* eslint-disable prettier/prettier */
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, ListSubheader, MenuItem, Select, Slider, Switch, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import useStore from '../../../store/useStore'
import BladeFrame from '../../../components/SchemaForm/components/BladeFrame'
import EditMatrixWrapper from './EditMatrixWrapper'
import EditMatrixControls from './EditMatrixControls'
import useStyles from './EditMatrix.styles'
import right from '../../../assets/right.svg'
import rightSnake from '../../../assets/right-snake.svg'
import rightFlip from '../../../assets/right-flip.svg'
import rightSnakeFlip from '../../../assets/right-snake-flip.svg'
import bottom from '../../../assets/bottom.svg'
import bottomFlip from '../../../assets/bottom-flip.svg'
import bottomSnake from '../../../assets/bottom-snake.svg'
import bottomSnakeFlip from '../../../assets/bottom-snake-flip.svg'
import left from '../../../assets/left.svg'
import leftSnake from '../../../assets/left-snake.svg'
import leftFlip from '../../../assets/left-flip.svg'
import leftSnakeFlip from '../../../assets/left-snake-flip.svg'
import top from '../../../assets/top.svg'
import topSnake from '../../../assets/top-snake.svg'
import topFlip from '../../../assets/top-flip.svg'
import topSnakeFlip from '../../../assets/top-snake-flip.svg'
import { transpose } from '../../../utils/helpers'
import dir from './EditMatrix.props'

const EditMatrix = ({ virtual }: any) => {
  const classes = useStyles()
  const deviceRef = useRef()
  const devices = useStore((state) => state.devices)
  const [currentDevice, setCurrentDevice] = useState('')
  const [rowNumber, setRowNumber] = useState(4)
  const [colNumber, setColNumber] = useState(6)
  const [currentCell, setCurrentCell] = useState([-1, -1])
  const [open, setOpen] = useState(false)
  const [group, setGroup] = useState(false)
  const [selectedPixel, setSelectedPixel] = useState<number | number[]>(0)
  const [direction, setDirection] = useState<typeof dir[number]>('right')
  const [m, setM] = useState(Array(rowNumber).fill(Array(colNumber).fill({deviceId: '',pixel: 0})))

  const closeClear = () => {
    setOpen(false)
    setCurrentDevice('')
    setSelectedPixel(0)
    setGroup(false)
  }
  const handleDirectionChange = (d: typeof dir[number]) => {
    setDirection(d)
    if (typeof selectedPixel !== 'number') {
      const [col, row] = currentCell
      const maxRange =
          d.includes('right')
            ? d.includes('flip')
              ? row * colNumber + colNumber - col
              : colNumber * rowNumber - (row * colNumber + col)
            : d.includes('left')
              ? d.includes('flip') 
                ? (rowNumber - row - 1) * colNumber + col + 1
                : row * colNumber + col + 1
              : d.includes('bottom')
                ? d.includes('flip') 
                  ? (rowNumber * col) + (rowNumber - row)
                  : colNumber * rowNumber - (rowNumber * col  + (rowNumber - row - 1))
                : d.includes('flip') 
                  ? colNumber * rowNumber - (rowNumber * col  + (rowNumber - row - 1))
                  : (rowNumber * col) + row + 1
      const distance =
          selectedPixel[1] - selectedPixel[0]
      if (distance > maxRange) {
        setSelectedPixel([
          selectedPixel[0],
          selectedPixel[0] + maxRange
        ])}}
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

  
      if (direction.includes('right')) {
        maxRange = colNumber * rowNumber - (row * colNumber + col)
        if (direction.includes('flip')) {
          maxRange = row * colNumber + colNumber - col
        }
      } else if (direction.includes('left')) {
        maxRange = row * colNumber + col + 1
        if (direction.includes('flip')) {
          maxRange = (rowNumber - row - 1) * colNumber + col + 1
        }
      } else if (direction.includes('bottom')) {
        // maxRange = colNumber * rowNumber - (rowNumber * col  + row)
        maxRange = colNumber * rowNumber - (rowNumber * col  + (rowNumber - row - 1))
        if (direction.includes('flip')) {
          maxRange = (rowNumber * col) + (rowNumber - row)
        }
      } else if (direction.includes('top')) {
        maxRange = (rowNumber * col) + row + 1
        if (direction.includes('flip')) {
          maxRange = colNumber * rowNumber - (rowNumber * col  + (rowNumber - row - 1))
        }
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
                  {currentCell[1] >= 0 && currentCell[0] >=0 && m[currentCell[1]][currentCell[0]]
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
                      <BladeFrame
                        title="Fill Direction"
                        full={false}
                        style={{ marginBottom: '1rem' }}
                      >
                        <Select
                          value={direction}
                          variant="standard"
                          fullWidth
                          MenuProps={{
                            PaperProps: {
                              style: {
                                maxHeight: 300,
                              },
                            },
                          }}
                          onChange={(e) => handleDirectionChange(e.target.value)}>
                          <ListSubheader>Right</ListSubheader>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="right">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                              Linear<Chip size='small' label="Down" variant="outlined" />
                              </div>
                              <img width="30px" src={right} alt="rightSnake" /></div>
                          </MenuItem>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="right-flip">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                              Linear<Chip size='small' label="Up" variant="outlined" />                                
                              </div>
                              <img width="30px" src={rightFlip} alt="rightFlip" /></div>
                          </MenuItem>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="right-snake">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                Snake<Chip size='small' label="Down" variant="outlined" />
                              </div>
                              <img width="30px" src={rightSnake} alt="rightSnake" /></div>
                          </MenuItem>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="right-snake-flip">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                Snake<Chip size='small' label="Up" variant="outlined" />
                              </div>
                              <img width="30px" src={rightSnakeFlip} alt="rightSnakeFlip" /></div>
                          </MenuItem>
                          <ListSubheader>Down</ListSubheader>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="bottom">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                Linear<Chip size='small' label="Right" variant="outlined" />
                              </div>
                              <img width="30px" src={bottom} alt="bottomSnake" /></div>
                          </MenuItem>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="bottom-flip">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                Linear<Chip size='small' label="Left" variant="outlined" />
                              </div>
                              <img width="30px" src={bottomFlip} alt="bottomSnakeFlip" /></div>
                          </MenuItem>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="bottom-snake">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                Snake<Chip size='small' label="Right" variant="outlined" />
                              </div>
                              <img width="30px" src={bottomSnake} alt="bottomSnake" /></div>
                          </MenuItem>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="bottom-snake-flip">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                Snake<Chip size='small' label="Left" variant="outlined" />
                              </div>
                              <img width="30px" src={bottomSnakeFlip} alt="bottomSnakeFlip" /></div>
                          </MenuItem>
                          <ListSubheader>Left</ListSubheader>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="left-flip">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                Linear<Chip size='small' label="Down" variant="outlined" />
                              </div>
                              <img width="30px" src={leftFlip} alt="leftFlip" /></div>
                          </MenuItem>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="left">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                Linear<Chip size='small' label="Up" variant="outlined" />
                              </div>
                              <img width="30px" src={left} alt="left" /></div>
                          </MenuItem>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="left-snake">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                Snake<Chip size='small' label="Up" variant="outlined" />
                              </div>
                              <img width="30px" src={leftSnake} alt="leftSnake" /></div>
                          </MenuItem>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="left-snake-flip">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                Snake<Chip size='small' label="Down" variant="outlined" />
                              </div>
                              <img width="30px" src={leftSnakeFlip} alt="leftSnakeFlip" /></div>
                          </MenuItem>
                          <ListSubheader>Up</ListSubheader>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="top">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                Linear<Chip size='small' label="Left" variant="outlined" />
                              </div>
                              <img width="30px" src={top} alt="top" /></div>
                          </MenuItem>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="top-flip">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                Linear<Chip size='small' label="Right" variant="outlined" />
                              </div>
                              <img width="30px" src={topFlip} alt="topFlip" /></div>
                          </MenuItem>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="top-snake">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                Snake<Chip size='small' label="Left" variant="outlined" />
                              </div>
                              <img width="30px" src={topSnake} alt="topSnake" /></div>
                          </MenuItem>
                          <MenuItem sx={{justifyContent: 'space-between'}} value="top-snake-flip">
                            <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                              <div>
                                Snake<Chip size='small' label="Right" variant="outlined" />
                              </div>
                              <img width="30px" src={topSnakeFlip} alt="topSnakeFlip" /></div>
                          </MenuItem>
                        </Select>
                      </BladeFrame>
                    )}

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
                  </>
                )}
              </DialogContent>
              <DialogActions>
                <Button
                  onClick={() => {
                    const updatedM = JSON.parse(JSON.stringify(m))
                    const [col, row] = currentCell
                    updatedM[row][col] = {
                      deviceId: '',
                      pixel: 0
                    }
                    setM(updatedM)
                    closeClear()
                  }}>
                  Clear
                </Button>
                <Button
                  onClick={() => {
                                        
                    let updatedM = JSON.parse(JSON.stringify(m))
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
                        index+=1
                      ) {
                        if (direction.includes('right')) {
                          if (direction.includes('flip')) {
                            updatedM[row - Math.floor((index + col) / colNumber)][((index + col) % colNumber)] = {
                              deviceId: currentDevice,
                              pixel: Math.min(selectedPixel[0], selectedPixel[1]) + index
                            }} else {
                            updatedM[row + Math.floor((index + col) / colNumber)][((index + col) % colNumber)] = {
                              deviceId: currentDevice,
                              pixel: Math.min(selectedPixel[0], selectedPixel[1]) + index
                            }
                          }
                        } else if (direction.includes('bottom')) {
                          if (direction.includes('flip')) {
                            updatedM[(index + row) % rowNumber][col - Math.floor((index + row) / rowNumber)] = {
                              deviceId: currentDevice,
                              pixel: Math.min(selectedPixel[0], selectedPixel[1]) + index
                            }} else {
                            updatedM[(index + row) % rowNumber][col + Math.floor((index + row) / rowNumber)] = {
                              deviceId: currentDevice,
                              pixel: Math.min(selectedPixel[0], selectedPixel[1]) + index
                            }
                          }
                        }
                        else if (direction.includes('left')) {
                          if (direction.includes('flip')) {                           
                            updatedM[row + Math.abs(Math.floor((col - index) / colNumber))][(colNumber + ((col - index)) % colNumber) % colNumber] = {
                              deviceId: currentDevice,
                              pixel: Math.min(selectedPixel[0], selectedPixel[1]) + index
                            }} else {
                            updatedM[row - Math.abs(Math.floor((col - index) / colNumber))][(colNumber + ((col - index)) % colNumber) % colNumber] = {
                              deviceId: currentDevice,
                              pixel: Math.min(selectedPixel[0], selectedPixel[1]) + index
                            };
                          }
                        } else if (direction.includes('top')) {
                          if (direction.includes('flip')) {                           
                            updatedM[(rowNumber + ((row - index)) % rowNumber) % rowNumber][col + Math.abs(Math.floor((row - index) / rowNumber))] = {
                              deviceId: currentDevice,
                              pixel: Math.min(selectedPixel[0], selectedPixel[1]) + index
                            }
                          } else {
                            updatedM[(rowNumber + ((row - index)) % rowNumber) % rowNumber][col - Math.abs(Math.floor((row - index) / rowNumber))] = {
                              deviceId: currentDevice,
                              pixel: Math.min(selectedPixel[0], selectedPixel[1]) + index
                            };
                          }
                        }
                      }
                    }

                    if (direction.includes('right-snake')) {

                      if (direction.includes('flip')) {
                        for (let i = row; i >= 0; i-=1) {
                          const currentRow = [...updatedM[i]];
                          if ((i + row) % 2 === 1) updatedM[i] = currentRow.reverse()
                        }
                      } else {
                        for (let i = row; i < rowNumber; i+=1) {
                          const currentRow = [...updatedM[i]];
                          if ((i + row) % 2 === 1) updatedM[i] = currentRow.reverse()
                        }
                      }
                    }
                    if (direction.includes('bottom-snake')) {
                      if (direction.includes('flip')) {
                        const mat = JSON.parse(JSON.stringify(updatedM))
                        const temp = transpose(mat)
                        for (let i = col; i >= 0; i-=1) {
                          const currentCol = [...temp[i]];
                          if ((i + col) % 2 === 1) temp[i] = currentCol.reverse()
                        } 
                        updatedM = transpose(temp)  
                      } else {
                        const mat = JSON.parse(JSON.stringify(updatedM))
                        const temp = transpose(mat)
                        for (let i = col; i < colNumber; i+=1) {
                          const currentCol = [...temp[i]];
                          if ((i + col) % 2 === 1) temp[i] = currentCol.reverse()
                        } 
                        updatedM = transpose(temp)  
                      }


                                       
                    }
                    if (direction.includes('left-snake')) {
                      if (direction.includes('flip')) {
                        for (let i = row; i < rowNumber; i+=1) {
                          const currentRow = [...updatedM[i]];
                          if ((i + row) % 2 === 1) updatedM[i] = currentRow.reverse();
                        }
                      } else {
                        for (let i = row; i >= 0; i-=1) {
                          const currentRow = [...updatedM[i]];
                          if ((i + row) % 2 === 1) updatedM[i] = currentRow.reverse();
                        }
                      }                        
                    }
                    if (direction.includes('top-snake')) {
                      
                      if (direction.includes('flip')) {
                        const mat = JSON.parse(JSON.stringify(updatedM))
                        const temp = transpose(mat)
                        for (let i = col; i < colNumber; i+=1) {
                          const currentCol = [...temp[i]];
                          if ((i + col) % 2 === 1) temp[i] = currentCol.reverse()
                        } 
                        updatedM = transpose(temp)
                      } else {
                        const mat = JSON.parse(JSON.stringify(updatedM))
                        const temp = transpose(mat)
                        for (let i = col; i >= 0; i-=1) {
                          const currentCol = [...temp[i]];
                          if ((i + col) % 2 === 1) temp[i] = currentCol.reverse()
                        } 
                        updatedM = transpose(temp)
                      }
                      
                    }
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
