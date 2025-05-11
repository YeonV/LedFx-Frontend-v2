import { InfoRounded } from '@mui/icons-material'
import { Box, ClickAwayListener, Tooltip as MuiTooltip, TooltipProps } from '@mui/material'
import { useState } from 'react'

const Tooltip = (props: TooltipProps) => {
  const [open, setOpen] = useState(false)
  const handleTooltipClose = () => {
    setOpen(false)
  }
  const handleTooltipOpen = () => {
    setOpen(true)
  }

  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Box sx={{ pr: 0.5, pl: 1, display: 'flex' }}>
        <MuiTooltip
          //   slotProps={{ popper: { disablePortal: true } }}
          onClose={handleTooltipClose}
          open={open}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          {...props}
        >
          {/* <IconButton onClick={handleTooltipOpen}> */}
          <InfoRounded sx={{ cursor: 'pointer' }} onClick={handleTooltipOpen} fontSize="small" />
          {/* </IconButton> */}
        </MuiTooltip>
      </Box>
    </ClickAwayListener>
  )
}

export default Tooltip
