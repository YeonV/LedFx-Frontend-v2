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
        backgroundImage: image ? `url("data:image/png;base64,${image}")` : 'none',
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
