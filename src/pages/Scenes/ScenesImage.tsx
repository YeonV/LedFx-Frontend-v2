import { SxProps } from '@mui/material'
import useStyles from './Scenes.styles'
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon'
import { getImageUrl } from '../../utils/imageUrl'

const SceneImage = ({
  iconName,
  list,
  thumbnail,
  sx,
  title
}: {
  iconName: string
  list?: boolean
  thumbnail?: boolean
  sx?: SxProps
  title?: string
}) => {
  const classes = useStyles()

  const imagePath = iconName?.startsWith('image:') ? iconName.split('image:')[1] : null

  return iconName && iconName.startsWith('image:') ? (
    <img
      className={classes.media}
      style={{
        height: (sx as any)?.height || 140,
        width: (sx as any)?.width || '100%',
        maxWidth: 'calc(100% - 2px)',
        objectFit: 'cover'
      }}
      src={getImageUrl(imagePath!, thumbnail)}
      alt={title || ''}
      title={title || ''}
    />
  ) : (
    <BladeIcon
      scene
      className={list ? classes.iconMediaList : classes.iconMedia}
      name={iconName}
      list={list}
      sx={{ ...sx }}
    />
  )
}

export default SceneImage
