/* eslint-disable prettier/prettier */
import { Box, Button, Dialog, DialogActions, DialogContent, MenuItem, Select, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import useStore from '../../../../store/useStore'
import BladeFrame from '../../../../components/SchemaForm/components/BladeFrame'
import MWrapper from './MWrapper'
import MControls from './MControls'
import MFillSelector from './MFillSelector'
import useStyles from './M.styles'
import { transpose } from '../../../../utils/helpers'
import dir from './M.props'
import MDialogTitle from './MDialogTitle'
import MSwitch from './MSwitch'
import MSlider from './MSlider'

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
      const distance = selectedPixel[1] - selectedPixel[0]
      if (distance > maxRange) {
        setSelectedPixel([
          selectedPixel[0],
          selectedPixel[0] + maxRange
        ])}}
  }

  const assignPixels = () => {                                        
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
  }

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

  const clearPixel = () => {
    const updatedM = JSON.parse(JSON.stringify(m))
    const [col, row] = currentCell
    updatedM[row][col] = {
      deviceId: '',
      pixel: 0
    }
    setM(updatedM)
    closeClear()
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
  
  return (
    <MWrapper>
      <MControls
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
              <MDialogTitle currentCell={currentCell} m={m} />
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
                    <MSwitch group={group} setGroup={setGroup} />                    
                    {group && <MFillSelector direction={direction} onChange={handleDirectionChange} />}
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
                <Button onClick={()=> clearPixel()}>Clear</Button>
                <Button onClick={()=> assignPixels()}>Save</Button>
              </DialogActions>
            </Dialog>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </MWrapper>)}

export default EditMatrix
