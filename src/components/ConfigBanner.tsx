import { Alert, Link } from '@mui/material'
import useStore from '../store/useStore'

const TROUBLESHOOTING = 'https://docs.ledfx.app/en/latest/troubleshoot/trouble.html#safe-mode'

/** Persistent error while the backend reports config_error (safe mode, saves blocked). */
const ConfigBanner = () => {
  const configError = useStore((state) => state.configError)
  if (!configError) return null
  return (
    <Alert severity="error" sx={{ borderRadius: 0 }}>
      {configError} Settings are not being saved. See{' '}
      <Link href={TROUBLESHOOTING} target="_blank" rel="noreferrer">
        Troubleshooting
      </Link>
      .
    </Alert>
  )
}

export default ConfigBanner
