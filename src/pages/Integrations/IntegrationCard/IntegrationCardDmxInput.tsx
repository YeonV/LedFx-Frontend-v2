import { useState } from 'react'
import Card from '@mui/material/Card'
import Button from '@mui/material/Button'
import EditIcon from '@mui/icons-material/Edit'
import SettingsIcon from '@mui/icons-material/Settings'
import Collapse from '@mui/material/Collapse'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import IconButton from '@mui/material/IconButton'
import {
  CardActions,
  CardHeader,
  Switch,
  Link,
  useTheme,
  Avatar,
  Box,
  Tooltip
} from '@mui/material'
import { QuestionMark, PauseCircle } from '@mui/icons-material'
import Popover from '../../../components/Popover/Popover'
import useStore from '../../../store/useStore'
import useIntegrationCardStyles from './IntegrationCard.styles'
import DmxInputScreen from '../DmxInput/DmxInputScreen/DmxInputScreen'

const IntegrationCardDmxInput = ({ integration }: any) => {
  const classes = useIntegrationCardStyles()
  const theme = useTheme()
  const getIntegrations = useStore((state) => state.getIntegrations)
  const integrations = useStore((state) => state.integrations)
  const deleteIntegration = useStore((state) => state.deleteIntegration)
  const toggleIntegration = useStore((state) => state.toggleIntegration)
  const setDialogOpenAddIntegration = useStore((state) => state.setDialogOpenAddIntegration)
  const setDmxInputPause = useStore((state) => state.setDmxInputPause)

  const [expanded, setExpanded] = useState(false)
  const variant = 'outlined'
  const color = 'inherit'

  const integrationId = integrations[integration]?.id
  const dmxPaused = Boolean(integrations[integration]?.data?.paused)

  const handleExpandClick = () => setExpanded(!expanded)

  const handleDeleteDevice = (integ: string) => {
    deleteIntegration(integrations[integ].id).then(() => getIntegrations())
  }

  const handleEditIntegration = (integ: any) => {
    setDialogOpenAddIntegration(true, integ)
  }

  const handleActivateIntegration = (integ: any) => {
    toggleIntegration({ id: integ.id }).then(() => getIntegrations())
  }

  const handleTogglePause = () => {
    if (integrationId) {
      setDmxInputPause(integrationId, !dmxPaused)
    }
  }

  return integrations[integration]?.config ? (
    <Card className={classes.integrationCardPortrait}>
      <CardHeader
        title={integrations[integration].config.name}
        subheader={`Current Status: ${
          integrations[integration].status === 3
            ? 'Connecting...'
            : integrations[integration].status === 2
              ? 'Disconnecting'
              : integrations[integration].status === 1
                ? 'Listening'
                : integrations[integration].status === 0
                  ? 'Disconnected'
                  : 'Unknown'
        }`}
        action={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title={dmxPaused ? 'Resume DMX Input' : 'Pause DMX Input'}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PauseCircle
                  fontSize="small"
                  sx={{
                    opacity: dmxPaused ? 1 : 0.4,
                    color: dmxPaused ? 'warning.main' : 'inherit'
                  }}
                />
                <Switch
                  slotProps={{ input: { 'aria-label': 'Pause DMX', role: 'switch' } }}
                  checked={dmxPaused}
                  onClick={handleTogglePause}
                />
              </Box>
            </Tooltip>
            <Switch
              slotProps={{ input: { 'aria-label': 'status', role: 'switch' } }}
              checked={integrations[integration].active}
              onClick={() => handleActivateIntegration(integrations[integration])}
            />
          </Box>
        }
        avatar={
          <Avatar aria-label="dmx" sx={{ width: 56, height: 56, color: '#fff' }}>
            DMX
          </Avatar>
        }
      />

      <CardActions style={{ alignSelf: 'flex-end' }}>
        <div className={classes.integrationCardContainer}>
          <IconButton
            sx={[
              {
                display: 'none',
                marginLeft: 'auto',
                transition: theme.transitions.create('transform', {
                  duration: theme.transitions.duration.shortest
                }),
                '@media (max-width: 580px)': {
                  display: 'block'
                }
              },
              expanded ? { transform: 'rotate(180deg)' } : { transform: 'rotate(0deg)' }
            ]}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
          <div className={classes.buttonBar}>
            <Popover
              variant={variant}
              color={color}
              onConfirm={() => handleDeleteDevice(integration)}
              className={classes.editButton}
            />
            <Button
              variant={variant}
              size="small"
              color={color}
              className={classes.editButton}
              onClick={() => handleEditIntegration(integration)}
            >
              <EditIcon />
            </Button>
            {integrations[integration].status !== 1 && (
              <Link
                target="_blank"
                href="https://ledfx.readthedocs.io/en/latest/howto/soundswitch_dmx.html"
                color={color}
              >
                <Button variant={variant} size="small" color={color} className={classes.editButton}>
                  <QuestionMark />
                </Button>
              </Link>
            )}
            <DmxInputScreen
              integrationId={integrations[integration].id}
              icon={<SettingsIcon />}
              variant={variant}
              color={color}
              className={classes.editButton}
              disabled={integrations[integration].status !== 1}
            />
          </div>
        </div>

        <Collapse in={expanded} timeout="auto" unmountOnExit className={classes.buttonBarMobile}>
          <div className={classes.buttonBarMobileWrapper}>
            <Popover
              variant={variant}
              color={color}
              onConfirm={() => handleDeleteDevice(integration)}
              className={classes.editButton}
            />
            <Button
              variant={variant}
              size="small"
              color={color}
              className={classes.editButtonMobile}
              onClick={() => handleEditIntegration(integration)}
            >
              <EditIcon />
            </Button>
          </div>
        </Collapse>
      </CardActions>
    </Card>
  ) : null
}

export default IntegrationCardDmxInput
