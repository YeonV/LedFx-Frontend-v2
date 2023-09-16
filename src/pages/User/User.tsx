/* eslint-disable no-self-assign */
/* eslint-disable no-alert */
import { Badge, Box, Divider, Stack, TextField, Tooltip } from '@mui/material'
import {
  AccessTime,
  GitHub,
  CloudDownload,
  CloudUpload
} from '@mui/icons-material'
import axios from 'axios'
import { useEffect, useState } from 'react'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import Typography from '@mui/material/Typography'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import useStore from '../../store/useStore'
import Popover from '../../components/Popover/Popover'

const User = () => {
  const [expanded, setExpanded] = useState<string | false>(false)
  const [cloudEffects, setCloudEffects] = useState<any>([])
  const [cloudConfigs, setCloudConfigs] = useState<any>([])
  const [configName, setConfigName] = useState('')

  const getFullConfig = useStore((state) => state.getFullConfig)
  const isLogged = useStore((state) => state.isLogged)
  const importSystemConfig = useStore((state) => state.importSystemConfig)

  const userName = localStorage.getItem('username')

  const cloud = axios.create({
    baseURL: 'https://strapi.yeonv.com'
  })

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
    }
  const getCloudPresets = async () => {
    const response = await cloud.get('presets', {
      headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
    })
    if (response.status !== 200) {
      alert('No Access')
      return
    }
    const res = await response.data
    const cEffects = {} as any
    res.forEach((p: { effect: { Name: string } }) => {
      if (!cEffects[p.effect.Name]) cEffects[p.effect.Name] = []
      cEffects[p.effect.Name].push(p)
    })
    setCloudEffects(cEffects)
  }

  const getCloudConfigs = async () => {
    const response = await cloud.get(
      `configs?user.username=${localStorage.getItem('username')}`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem('jwt')}` }
      }
    )
    if (response.status !== 200) {
      alert('No Access')
      return
    }
    const res = await response.data
    setCloudConfigs(res)
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const deleteCloudConfig = async (name: string, date: any) => {
    const existing = await cloud.get(
      `configs?user.username=${localStorage.getItem(
        'username'
      )}&Name=${name}&Date=${date}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      }
    )
    const exists = await existing.data
    if (exists.length && exists.length > 0) {
      cloud.delete(`configs/${exists[0].id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt')}`
        }
      })
    }
  }

  useEffect(() => {
    getCloudPresets()
  }, [])

  useEffect(() => {
    getCloudConfigs()
  }, [])

  const filteredCloudEffects = {} as any

  Object.keys(cloudEffects).forEach((effectGroup) => {
    const filteredEffects = cloudEffects[effectGroup].filter((effect: any) => {
      return effect.user && effect.user.username === userName
    })

    if (filteredEffects.length > 0) {
      filteredCloudEffects[effectGroup] = filteredEffects
    }
  })

  return (
    <Box
      alignItems="center"
      justifyContent="center"
      sx={{ marginBottom: '5rem' }}
    >
      <Stack
        alignItems="center"
        direction="column"
        gap={2}
        maxWidth={300}
        margin="0 auto"
      >
        <GitHub sx={{ fontSize: 'min(25vw, 25vh, 200px)' }} />
        <Typography variant="h5">{userName}</Typography>
        {isLogged ? (
          <Badge
            sx={{ paddingTop: 2 }}
            badgeContent={
              localStorage.getItem('ledfx-cloud-role') === 'authenticated'
                ? 'logged in'
                : localStorage.getItem('ledfx-cloud-role')
            }
            color="primary"
          />
        ) : (
          'Logged out'
        )}
        <div style={{ width: 300 }}>
          <Accordion
            expanded={expanded === 'panel0'}
            onChange={handleChange('panel0')}
          >
            <AccordionSummary
              expandIcon={<>&nbsp;</>}
              aria-controls="panel0bh-content"
              id="panel0bh-header"
              sx={{ pointerEvents: 'none' }}
            >
              <Typography sx={{ width: '60%', flexShrink: 0 }}>User</Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  textAlign: 'right',
                  flexGrow: 1
                }}
              >
                {userName || ''}
              </Typography>
            </AccordionSummary>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel01'}
            onChange={handleChange('panel01')}
          >
            <AccordionSummary
              expandIcon={<>&nbsp;</>}
              aria-controls="panel01bh-content"
              id="panel01bh-header"
              sx={{ pointerEvents: 'none' }}
            >
              <Typography sx={{ width: '60%', flexShrink: 0 }}>Role</Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  textAlign: 'right',
                  flexGrow: 1
                }}
              >
                {localStorage.getItem('ledfx-cloud-role') === 'authenticated'
                  ? 'logged in'
                  : localStorage.getItem('ledfx-cloud-role')}
              </Typography>
            </AccordionSummary>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel1'}
            onChange={handleChange('panel1')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: '60%', flexShrink: 0 }}>
                Cloud-Presets
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  textAlign: 'right',
                  flexGrow: 1,
                  paddingRight: 2
                }}
              >
                {Object.keys(filteredCloudEffects)
                  .map((effect) => filteredCloudEffects[effect].length)
                  .reduce((a, b) => a + b, 0)}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                {Object.keys(filteredCloudEffects)
                  .map((effect) => filteredCloudEffects[effect].length)
                  .reduce((a, b) => a + b, 0) === 0
                  ? 'No CloudPresets yet.'
                  : 'Manage your CloudPresets in Device-view'}
              </Typography>
            </AccordionDetails>
          </Accordion>
          <Accordion
            expanded={expanded === 'panel2'}
            onChange={handleChange('panel2')}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2bh-content"
              id="panel2bh-header"
            >
              <Typography sx={{ width: '60%', flexShrink: 0 }}>
                Cloud-Configs
              </Typography>
              <Typography
                sx={{
                  color: 'text.secondary',
                  textAlign: 'right',
                  flexGrow: 1,
                  paddingRight: 2
                }}
              >
                {cloudConfigs.length}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography>Upload current config</Typography>
                <Popover
                  icon={<CloudUpload />}
                  type="iconbutton"
                  color="inherit"
                  confirmDisabled={configName === ''}
                  onConfirm={() => {
                    getFullConfig().then((c: any) =>
                      cloud
                        .post(
                          'configs',
                          {
                            Name: configName,
                            Date: +new Date(),
                            config: c,
                            user: localStorage.getItem('ledfx-cloud-userid')
                          },
                          {
                            headers: {
                              Authorization: `Bearer ${localStorage.getItem(
                                'jwt'
                              )}`
                            }
                          }
                        )
                        .then(() => getCloudConfigs())
                    )
                  }}
                  content={
                    <TextField
                      value={configName}
                      onChange={(e) => setConfigName(e.target.value)}
                      placeholder="Enter Config Name"
                    />
                  }
                />
              </Stack>
              {cloudConfigs.length > 0 &&
                cloudConfigs.map((c: any) => (
                  <>
                    <Divider />
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography>{c.Name}</Typography>

                      <Stack direction="row" alignItems="center">
                        <Popover
                          type="iconbutton"
                          color="inherit"
                          onConfirm={() =>
                            deleteCloudConfig(c.Name, c.Date).then(() =>
                              setTimeout(() => {
                                getCloudConfigs()
                              }, 200)
                            )
                          }
                        />
                        <Tooltip title="Load Config">
                          <Popover
                            onConfirm={() => {
                              importSystemConfig(c.config).then(() => {
                                window.location.href = window.location.href
                              })
                            }}
                            content={
                              <Stack>
                                <Typography
                                  sx={{ padding: '0.5rem 1rem 0 1rem' }}
                                >
                                  overwrite current config?
                                </Typography>
                                <Typography
                                  color="text.disabled"
                                  sx={{ padding: '0 1rem 0.5rem 1rem' }}
                                >
                                  LedFx will restart after
                                </Typography>
                              </Stack>
                            }
                            type="iconbutton"
                            color="inherit"
                            icon={<CloudDownload />}
                          />
                        </Tooltip>

                        <Tooltip
                          title={`Config from ${new Intl.DateTimeFormat(
                            'en-GB',
                            {
                              dateStyle: 'medium',
                              timeStyle: 'medium'
                            }
                          )
                            .format(new Date(c.Date))
                            .split(',')
                            .join(' at ')}`}
                        >
                          <AccessTime sx={{ marginLeft: 1 }} />
                        </Tooltip>
                      </Stack>
                    </Stack>
                  </>
                ))}
            </AccordionDetails>
          </Accordion>
        </div>
      </Stack>
    </Box>
  )
}

export default User
