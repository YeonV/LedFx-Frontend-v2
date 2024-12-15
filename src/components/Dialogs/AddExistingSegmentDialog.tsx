/* eslint-disable @/indent */
import React from 'react'
import { styled } from '@mui/material/styles'
import {
  Button,
  DialogTitle,
  DialogContent,
  DialogActions,
  Dialog,
  MenuItem,
  Select
} from '@mui/material'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import useStore from '../../store/useStore'
import BladeFrame from '../SchemaForm/components/BladeFrame'
import { SubdirectoryArrowRight } from '@mui/icons-material'

const PREFIX = '_AddSegmentDialog'

const classes = {
  root: `${PREFIX}-root`,
  paper: `${PREFIX}-paper`
}

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    margin: '1rem',
    backgroundColor: theme.palette.background.paper
  },

  [`& .${classes.paper}`]: {
    width: '80%',
    maxHeight: 435
  }
}))

interface ConfirmationDialogRawProps {
  onClose(..._args: unknown[]): unknown
  open: boolean
  value: string
  config?: any
  classes?: any
  id?: string
  keepMounted?: boolean
  deviceList?: any
}

function ConfirmationDialogRaw(props: ConfirmationDialogRawProps) {
  const { onClose, value: valueProp, open, ...other } = props
  const [value, setValue] = React.useState(valueProp)
  const virtuals = useStore((state) => state.virtuals) || {}
  const showComplex = useStore((state) => state.showComplex)
  const showGaps = useStore((state) => state.showGaps)

  const handleCancel = () => {
    onClose()
  }

  const handleOk = () => {
    onClose(value)
  }

  const handleChange = (event: any) => {
    setValue(event.target.value)
  }

  const virtualKeys = Object.keys(virtuals)
    .filter((v) =>
      showComplex
        ? v
        : !(
            v.endsWith('-mask') ||
            v.endsWith('-foreground') ||
            v.endsWith('-background')
          )
    )
    .filter((v) => (showGaps ? v : !v.startsWith('gap-')))
    .filter((v) => virtuals[v].segments.length === 1)

  const segments = virtualKeys.reduce((acc: any, v) => {
    acc[virtuals[v].config.name] = virtuals[v].segments.flat()
    return acc
  }, {})

  // console.log(segments)
  return (
    <Dialog
      disableEscapeKeyDown
      maxWidth="xs"
      aria-labelledby="confirmation-dialog-title"
      open={open}
      {...other}
    >
      <DialogTitle id="confirmation-dialog-title">Select a segment</DialogTitle>
      <DialogContent dividers>
        <BladeFrame full>
          <Select
            value={value}
            style={{ width: '100%' }}
            onChange={handleChange}
          >
            {Object.keys(segments).map((v) => {
              const k = virtualKeys.find((vi) => virtuals[vi].config.name === v)
              return (
                <MenuItem value={JSON.stringify({ [v]: segments[v] })} key={v}>
                  {k && virtuals[k].is_device ? (
                    ''
                  ) : (
                    <SubdirectoryArrowRight color="disabled" sx={{ mr: 1 }} />
                  )}
                  {v}
                </MenuItem>
              )
            })}
          </Select>
        </BladeFrame>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleCancel} color="primary">
          Cancel
        </Button>
        <Button onClick={handleOk} color="primary">
          Ok
        </Button>
      </DialogActions>
    </Dialog>
  )
}

function AddExistingSegmentDialog({
  virtual,
  config = {}
}: {
  virtual: any
  config?: any
}) {
  const [open, setOpen] = React.useState(false)
  const deviceList = useStore((state) => state.devices) || {}
  const virtuals = useStore((state) => state.virtuals) || {}
  const updateSegments = useStore((state) => state.updateSegments)
  const getVirtuals = useStore((state) => state.getVirtuals)
  const highlightSegment = useStore((state) => state.highlightSegment)
  const setEffect = useStore((state) => state.setEffect)

  const handleClickListItem = () => {
    setOpen(true)
  }

  const handleClose = (newValue: string) => {
    setOpen(false)
    if (!newValue) {
      return
    }
    const [name, segments] = Object.entries(JSON.parse(newValue))[0] as [
      string,
      [string, number, number, boolean]
    ]
    // console.log(name)
    // console.log(segments)
    if (name && segments) {
      const deviceKey = Object.keys(deviceList).find(
        (d) => deviceList[d].id === segments[0]
      )
      const device = deviceKey ? deviceList[deviceKey] : undefined
      // console.log(device)
      const temp = [...virtual.segments, segments]
      const test = temp.filter((t) => t.length === 4)

      updateSegments(virtual.id, test).then(() => {
        getVirtuals()
        if (
          device &&
          virtual.active === false &&
          virtual.segments.length === 0
        ) {
          if (
            device.active_virtuals &&
            device.active_virtuals[0] &&
            virtuals &&
            virtuals[device.active_virtuals[0]] &&
            virtuals[device.active_virtuals[0]].effect
          ) {
            setEffect(
              virtual.id,
              virtuals[device.active_virtuals[0]].effect.type,
              virtuals[device.active_virtuals[0]].effect.config,
              true
            )
          } else {
            setEffect(virtual.id, 'rainbow', {}, true)
          }
        }
        if (device) {
          highlightSegment(
            virtual.id,
            device.id,
            segments[1],
            segments[2],
            false
          )
        }
      })
    }
  }

  return (
    <Root className={classes.root}>
      {deviceList && Object.keys(deviceList).length > 0 ? (
        <>
          <Button
            variant="contained"
            color="primary"
            aria-label="Add"
            endIcon={<AddCircleIcon />}
            onClick={handleClickListItem}
            role="listitem"
          >
            ADD EXISTING SEGMENT
          </Button>

          <ConfirmationDialogRaw
            classes={{
              paper: classes.paper
            }}
            config={config}
            id="ringtone-menu"
            keepMounted
            open={open}
            onClose={handleClose}
            value=""
            // value={deviceList[0].id}
            deviceList={deviceList}
          />
        </>
      ) : null}
    </Root>
  )
}

export default AddExistingSegmentDialog
