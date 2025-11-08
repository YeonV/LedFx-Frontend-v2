import { forwardRef, useState } from 'react'
import { TransitionProps } from '@mui/material/transitions'
import { useDynamicModule } from '@yz-dev/react-dynamic-module'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import IconButton from '@mui/material/IconButton'
import BladeIcon from '../../../../components/Icons/BladeIcon/BladeIcon'
import { IDevice, IMCell, MatrixStudioProps } from './M.utils'

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

const MatrixStudioButton = ({
  defaultValue,
  deviceList,
  handleSave
}: {
  defaultValue?: IMCell[][] | undefined
  deviceList?: IDevice[] | undefined
  // eslint-disable-next-line no-unused-vars
  handleSave?: (data: any) => void
}) => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }
  const handleSaveAndClose = (e: any) => {
    // console.log('Save clicked', e)
    if (handleSave) {
      handleSave(e)
    }
    setOpen(false)
  }

  const { status, as: MatrixStudio } = useDynamicModule<MatrixStudioProps>({
    src: '/modules/yz-matrix-studio.js',
    from: 'YzMatrixStudio',
    import: 'MatrixStudio'
  })

  if (!MatrixStudio || status !== 'available') {
    return null
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
        <MatrixStudio
          defaultValue={defaultValue}
          deviceList={deviceList}
          onSave={handleSaveAndClose}
        />
      </Dialog>
    </>
  )
}

export default MatrixStudioButton
