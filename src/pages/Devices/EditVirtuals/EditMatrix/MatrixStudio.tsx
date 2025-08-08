import type { MatrixStudioProps } from '@yz-dev/matrix-studio'
import { forwardRef, useState } from 'react'
import { TransitionProps } from '@mui/material/transitions'
import { DynamicModule } from '@yz-dev/react-dynamic-module'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import IconButton from '@mui/material/IconButton'
import BladeIcon from '../../../../components/Icons/BladeIcon/BladeIcon'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const MatrixStudio = () => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleSaveAndClose = (e: any) => {
    console.log('Save clicked', e)
    setOpen(false)
  }

  return (
    <>
      <IconButton size="large" onClick={handleClickOpen}>
        <BladeIcon name="yz:logo2" />
      </IconButton>
      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        slots={{
          transition: Transition
        }}
      >
        <DynamicModule<MatrixStudioProps>
          import="MatrixStudio"
          from="YzMatrixStudio"
          src="/modules/yz-matrix-studio.js"
          defaultValue={[]}
          deviceList={[]}
          onSave={handleSaveAndClose}
        />
      </Dialog>
    </>
  )
}

export default MatrixStudio
