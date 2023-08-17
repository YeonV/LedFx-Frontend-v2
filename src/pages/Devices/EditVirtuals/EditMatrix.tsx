import {
  Box,
  Dialog,
  DialogContent,
  MenuItem,
  Select,
  Slider
} from '@mui/material'
import { useState } from 'react'
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch'
import useStore from '../../../store/useStore'

const EditMatrix = () => {
  const devices = useStore((state) => state.devices)

  const [rowNumber, setRowNumber] = useState(10)
  const [colNumber, setColNumber] = useState(5)
  //   const [width, setWidth] = useState(500)
  //   const [height, setHeight] = useState(500)
  const [open, setOpen] = useState(false)

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
      <Slider
        value={rowNumber}
        onChange={(e, newRowNumber) =>
          typeof newRowNumber === 'number' && setRowNumber(newRowNumber)
        }
      />
      <Slider
        value={colNumber}
        onChange={(e, newColNumber) =>
          typeof newColNumber === 'number' && setColNumber(newColNumber)
        }
      />
      <TransformWrapper
        centerZoomedOut
        initialScale={
          colNumber * 100 < window.innerWidth ||
          rowNumber * 100 < window.innerHeight * 0.8
            ? 1
            : 0.1
        }
        minScale={false ? 1 : 0.1}
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
              {Array(rowNumber * colNumber)
                .fill('a')
                .map((d, i) => (
                  <Box
                    key={i}
                    onContextMenu={(e) => {
                      e.preventDefault()
                      setOpen(true)
                    }}
                    sx={{
                      cursor: 'copy',
                      border: '1px solid #fff',
                      background: '#333',
                      width: 100,
                      height: 100,
                      '&:hover': {
                        background: '#999'
                      }
                      //   width: `min(${width / colNumber}px, ${
                      //     height / rowNumber
                      //   }px)`,
                      //   height: `min(${width / colNumber}px, ${
                      //     height / rowNumber
                      //   }px)`
                    }}
                  />
                ))}
            </div>
            <Dialog onClose={() => setOpen(false)} open={open}>
              <DialogContent>
                <Select>
                  {devices &&
                    Object.keys(devices).map((d: any, i: number) => (
                      <MenuItem key={i}>{devices[d].config.name}</MenuItem>
                    ))}
                </Select>
              </DialogContent>
            </Dialog>
          </div>
        </TransformComponent>
      </TransformWrapper>
    </div>
  )
}

export default EditMatrix
