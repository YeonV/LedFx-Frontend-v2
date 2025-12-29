import isElectron from 'is-electron'
import { CardMedia, SxProps } from '@mui/material'
import useStyles from './Scenes.styles'
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon'

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

  const getImageUrl = (path: string) => {
    const baseURL = window.localStorage.getItem('ledfx-host') || window.location.origin
    // Only strip file:/// for user assets, keep builtin:// and http(s):// as-is
    const cleanPath = path.startsWith('file:///') ? path.replace('file:///', '') : path
    const endpoint = thumbnail ? 'thumbnail' : 'download'
    return `${baseURL}/api/assets/${endpoint}?path=${encodeURIComponent(cleanPath)}`
  }

  const imagePath = iconName?.startsWith('image:') ? iconName.split('image:')[1] : null

  return iconName && iconName.startsWith('image:') ? (
    isElectron() ? (
      <CardMedia
        className={classes.media}
        image={imagePath!}
        title={title || ''}
        sx={{ width: '100%', height: '100%', ...sx }}
      />
    ) : (
      <div
        className={classes.media}
        style={{
          height: (sx as any)?.height || 140,
          width: (sx as any)?.width || '100%',
          maxWidth: 'calc(100% - 2px)',
          backgroundSize: 'cover',
          backgroundImage: `url("${getImageUrl(imagePath!)}")`
        }}
        title={title || ''}
      />
    )
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
