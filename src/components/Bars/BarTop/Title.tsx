import { compareVersions } from 'compare-versions'
import { Typography, Button, Stack, Tooltip } from '@mui/material'

import pkg from '../../../../package.json'

interface FrontendConfig {
  updateUrl: string
  releaseUrl: string
}

const Title = (
  pathname: string,
  latestTag: string,
  updateAvailable: boolean,
  virtuals: any,
  frConfig: FrontendConfig | null
) => {
  const t = window.localStorage.getItem('ledfx-theme')
  const newVerOnline =
    latestTag.replace('v', '').includes('-b') && pkg.version.includes('-b')
      ? compareVersions(latestTag.replace('v', '').split('-b')[1], pkg.version.split('-b')[1]) === 1
      : compareVersions(latestTag.replace('v', ''), pkg.version) === 1
  if (pathname === '/') {
    return (
      <Stack direction={'row'}>
        <Tooltip title={`LedFx v${pkg.version}`} placement="bottom">
          <Typography variant="h6" noWrap>
            LedFx
          </Typography>
        </Tooltip>
        {!process.env.MS_STORE &&
        newVerOnline &&
        frConfig?.updateUrl &&
        frConfig.releaseUrl &&
        window.location.origin !== 'https://ledfx.stream' ? (
          <Button
            color={t && ['DarkBw', 'LightBw'].includes(t) ? 'primary' : 'error'}
            variant="contained"
            onClick={() => frConfig && window.open(frConfig.releaseUrl)}
            sx={{ ml: 2 }}
          >
            New Update
          </Button>
        ) : null}
        {!process.env.MS_STORE &&
        updateAvailable &&
        window.location.origin !== 'https://ledfx.stream' ? (
          <Button
            color="error"
            variant="contained"
            onClick={() => window.open('https://github.com/LedFx/LedFx/releases/latest')}
            sx={{ ml: 2 }}
          >
            New Core Update
          </Button>
        ) : null}
      </Stack>
    )
  }
  if (pathname.split('/').length === 3 && pathname.split('/')[1] === 'device') {
    return virtuals[pathname.split('/')[2]]?.config.name
  }
  if (pathname === '/User') {
    return `LedFx Cloud ${localStorage.getItem('ledfx-cloud-username') !== 'YeonV' ? 'Free' : ''} User`
  }
  return pathname.split('/').pop()
}

export default Title
