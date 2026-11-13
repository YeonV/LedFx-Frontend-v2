import { Button, Card, CardActions, CardContent, Chip, Stack, Typography } from '@mui/material'
import { Download, LibraryMusic, Memory } from '@mui/icons-material'
import {
  ANDROID_EXTRAS,
  useAndroidExtrasUrls,
  useNowPlayingAddonInstalled,
  useRootAudioActive
} from './androidExtras'

const ExtraTile = ({
  icon,
  title,
  body,
  guide,
  status,
  href,
  download
}: {
  icon: React.ReactNode
  title: string
  body: string
  guide: string | [string, string][]
  status: string | null
  href: string
  download: string
}) => (
  <Card
    variant="outlined"
    sx={{ flex: { xs: 'none', sm: 1 }, display: 'flex', flexDirection: 'column' }}
  >
    <CardContent sx={{ flexGrow: 1 }}>
      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        {icon}
        <Typography variant="h6">{title}</Typography>
        {status && <Chip size="small" color="success" label={status} />}
      </Stack>
      <Typography variant="body2" mb={1}>
        {body}
      </Typography>
      {typeof guide === 'string' ? (
        <Typography variant="caption" color="text.secondary">
          {guide}
        </Typography>
      ) : (
        guide.map(([label, text]) => (
          <Typography key={label} variant="caption" color="text.secondary" display="block">
            <b>{label}</b> {text}
          </Typography>
        ))
      )}
    </CardContent>
    <CardActions>
      <Button href={href} target="_blank" rel="noreferrer" startIcon={<Download />} fullWidth>
        {download}
      </Button>
    </CardActions>
  </Card>
)

const AndroidExtrasStep = () => {
  const urls = useAndroidExtrasUrls()
  const addonInstalled = useNowPlayingAddonInstalled()
  const rootActive = useRootAudioActive()
  const { addon, rootModule } = ANDROID_EXTRAS
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={2}
      sx={{ px: 2, pt: 2, maxWidth: 800, marginX: 'auto' }}
    >
      <ExtraTile
        icon={<LibraryMusic />}
        title={addon.title}
        body={addon.body}
        guide={addon.guideLines}
        status={addonInstalled ? addon.installed : null}
        href={urls.addon}
        download={addon.download}
      />
      <ExtraTile
        icon={<Memory />}
        title={rootModule.title}
        body={rootModule.body}
        guide={rootModule.guide}
        status={rootActive ? rootModule.active : null}
        href={urls.rootModule}
        download={rootModule.download}
      />
    </Stack>
  )
}

export default AndroidExtrasStep
