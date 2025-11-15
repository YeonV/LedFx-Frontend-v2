import { useCallback, useEffect, useState } from 'react'
import isElectron from 'is-electron'
import { CardMedia, SxProps } from '@mui/material'
import useStore from '../../store/useStore'
import useStyles from './Scenes.styles'
import BladeIcon from '../../components/Icons/BladeIcon/BladeIcon'

const SceneImage = ({ iconName, list, sx }: { iconName: string; list?: boolean; sx?: SxProps }) => {
  const classes = useStyles()
  const [imageData, setImageData] = useState(null)
  const getImage = useStore((state) => state.getImage)
  const fetchImage = useCallback(async (ic: string) => {
    const result = await getImage(ic.split('image:')[1]?.replaceAll('file:///', ''))
    if (result?.image) setImageData(result.image)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (iconName?.startsWith('image:')) {
      fetchImage(iconName)
    }
  }, [iconName, fetchImage])

  return iconName && iconName.startsWith('image:') ? (
    isElectron() ? (
      <CardMedia
        className={classes.media}
        image={iconName.split('image:')[1]}
        title="Contemplative Reptile"
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
          backgroundImage: `url("data:image/png;base64,${imageData}")`
        }}
        title="SceneImage"
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
