import { Button, Stack, Typography } from '@mui/material'

const getOS = () => {
  const platform = navigator.platform.toLowerCase()
  if (platform.includes('mac')) return 'mac'
  if (platform.includes('win')) return 'windows'
  return 'other'
}

const KeybindingComponent = ({ singleKey }: { singleKey: string }) => {
  const os = getOS()

  const renderKey = (singleKey: string) => {
    if (os === 'mac') {
      if (singleKey === 'alt') return 'opt'
      if (singleKey === 'meta') return 'command'
    } else if (os === 'windows') {
      if (singleKey === 'meta') return 'win'
    }
    return singleKey
  }

  return <>{singleKey === 'y' ? <>{renderKey('y/z')}</> : renderKey(singleKey)}</>
}

export const keyButtons = (text: string) => (
  <Stack direction={'row'} spacing={1}>
    {text.split('+').map((singleKey, index) => (
      <Button key={index} color="primary" variant="outlined">
        <KeybindingComponent singleKey={singleKey} />
      </Button>
    ))}
  </Stack>
)

export const KeysRow = ({ keys, description }: { keys: string; description: string }) => {
  const match = description.match(/(.*?)(\s*\(.*?\))/)
  const mainText = match ? match[1] : description
  const bracketText = match ? match[2] : ''
  console.log(bracketText)
  return (
    <Stack direction={'row'} alignItems={'center'} justifyContent={'space-between'}>
      <Stack direction={'row'} alignItems={'center'}>
        <Typography>{mainText}</Typography>
        {bracketText && (
          <Typography variant="caption" color="textDisabled" ml={1}>
            {bracketText}
          </Typography>
        )}
      </Stack>
      {keyButtons(keys)}
    </Stack>
  )
}
