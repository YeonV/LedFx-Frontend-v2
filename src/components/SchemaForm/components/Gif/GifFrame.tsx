/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import type { FC } from 'react'
import { useTheme } from '@mui/material'

interface GifFrameProps {
  onClick?: () => void | undefined
  image: string
  selected?: boolean | undefined
}

const GifFrame: FC<GifFrameProps> = ({
  image,
  onClick = undefined,
  selected = undefined
}: GifFrameProps) => {
  const theme = useTheme()

  return (
    <div
      style={{
        height: onClick === undefined ? 292 : 300,
        width: `min(100% - 32px, ${onClick === undefined ? 292 : 300}px)`,
        minWidth: onClick === undefined ? 292 : 300,
        maxWidth: onClick === undefined ? 292 : 300,
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url("data:image/png;base64,${image}")`,
        border: onClick === undefined ? 0 : '4px solid',
        cursor: onClick === undefined ? 'default' : 'pointer',
        borderColor: selected ? theme.palette.primary.main : '#9999',
        opacity: onClick === undefined ? 0.5 : 1
      }}
      onClick={onClick}
    />
  )
}


export default GifFrame
