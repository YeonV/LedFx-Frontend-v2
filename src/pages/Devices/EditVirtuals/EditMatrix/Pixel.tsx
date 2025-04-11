import { Box, Typography } from '@mui/material'
import { IMCell } from './M.utils'
import useStore from '../../../../store/useStore'

const Pixel = ({
  m,
  currentColIndex,
  classes,
  currentRowIndex,
  move,
  decodedPixels,
  colN,
  pixels,
  yzcolumn,
  selectedGroup,
  error,
  setCurrentCell,
  setCurrentDevice,
  setSelectedPixel,
  openContextMenu,
  isDragging
}: {
  m: IMCell[][]
  currentColIndex: number
  classes: any
  currentRowIndex: number
  move: boolean
  decodedPixels: any
  colN: number
  pixels: any
  yzcolumn: IMCell
  selectedGroup: string
  error: {
    row: number
    col: number
  }[]
  setCurrentCell: any
  setCurrentDevice: any
  setSelectedPixel: any
  openContextMenu: any
  isDragging: boolean
}) => {
  const devices = useStore((state) => state.devices)
  const mode = useStore((state) => state.config).transmission_mode
  if (error.length > 0) console.log(isDragging, error)
  return (
    <Box
      key={`col-${currentColIndex}`}
      sx={[
        {
          // border: error.find(
          //   (e: any) => e.row === currentRowIndex && e.col === currentColIndex
          // )
          //   ? '1px solid red'
          //   : '1px solid #000',
          backgroundColor:
            mode === 'compressed' && decodedPixels
              ? decodedPixels[currentRowIndex * colN + currentColIndex]
                ? `rgb(${Object.values(decodedPixels[currentRowIndex * colN + currentColIndex])})`
                : '#222'
              : pixels && pixels[0] && pixels[0].length
                ? `rgb(${pixels[0][currentRowIndex * colN + currentColIndex]},${pixels[1][currentRowIndex * colN + currentColIndex]},${pixels[2][currentRowIndex * colN + currentColIndex]})`
                : '#222'
        },
        isDragging
          ? {
              opacity: 0.3
            }
          : {
              opacity:
                move && yzcolumn?.group === selectedGroup
                  ? 1
                  : (move && yzcolumn?.group !== selectedGroup) ||
                      selectedGroup === ''
                    ? 0.9
                    : yzcolumn.deviceId !== ''
                      ? 1
                      : 0.3
            }
      ]}
      onContextMenu={(e) => {
        e.preventDefault()
        setCurrentCell([currentColIndex, currentRowIndex])
        setCurrentDevice(yzcolumn.deviceId !== '' ? yzcolumn.deviceId : '')
        setSelectedPixel(yzcolumn.pixel || 0)

        if (
          currentRowIndex > -1 &&
          currentColIndex > -1 &&
          m[currentRowIndex][currentColIndex]?.deviceId !== ''
        ) {
          // console.log(m[currentCell[1]][currentCell[0]].group)

          openContextMenu(e)
        }
        // setOpen(true)
      }}
    >
      {yzcolumn.deviceId !== '' && (
        <div className={classes.pixel}>
          <Typography variant="caption">
            {devices[yzcolumn.deviceId].config.name}
          </Typography>
          <Typography variant="caption">{yzcolumn.pixel}</Typography>
        </div>
      )}
    </Box>
  )
}

export default Pixel
