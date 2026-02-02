import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Accordion, AccordionSummary, Grid, Typography } from '@mui/material'
import { SettingsAccordion, useStyles } from './SettingsComponents'
import useStore from '../../store/useStore'
import AudioCard from './AudioCard'
import Webaudio from './Webaudio'
import ClientAudioCard from './ClientAudioCard'
import GeneralCard from './GeneralCard'
import SmartBar from '../../components/Dialogs/SmartBar'
import MidiCard from './MidiCard'
import AssetManager from '../../components/Dialogs/AssetManager/AssetManager'
import UIRow from './UIRow'
import BottomBarCard from './BottomBarCard'
import {
  AccountTree,
  Equalizer,
  Keyboard,
  QueueMusic,
  SettingsInputComponent,
  SportsEsports
} from '@mui/icons-material'
import Tile from '../../components/Tile'
import Uncategorized from './Uncategorized'

const SettingsNew = () => {
  const classes = useStyles()
  const navigate = useNavigate()
  const viewMode = useStore((state) => state.viewMode)
  const features = useStore((state) => state.features)
  const setSettingsExpanded = useStore((state) => state.ui.setSettingsExpanded)
  const setGamepadOpen = useStore((state) => state.setGamepadOpen)
  const setMidiOpen = useStore((state) => state.setMidiOpen)
  const setKeybinding = useStore((state) => state.ui.setKeybinding)
  const setSmartBarOpen = useStore((state) => state.ui.bars && state.ui.setSmartBarOpen)
  const setPgs = useStore((state) => state.ui.setPgs)
  const loc = useLocation()

  useEffect(() => {
    const quick = ['devices', 'scenes', 'uimode', 'effects', 'pixelgraphs']
    quick.forEach((q) => {
      if (loc.search.indexOf(q) > -1) {
        setSettingsExpanded(`panel${q}`)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc])

  return (
    <div className={classes.card} style={{ marginBottom: '3rem' }}>
      <UIRow />
      <Accordion disabled sx={{ backgroundColor: 'transparent !important' }}>
        <AccordionSummary aria-controls="panel3a-content" id="panel3a-header">
          <Typography>Config</Typography>
        </AccordionSummary>
      </Accordion>
      <SettingsAccordion title="General" accId="3" icon="Settings">
        <GeneralCard />
      </SettingsAccordion>
      <SettingsAccordion title="Audio" accId="1a" icon="Speaker">
        <>
          {features.webaudio && (
            <Webaudio style={{ position: 'absolute', right: '3.5rem', top: '0.3rem' }} />
          )}
          <ClientAudioCard />
          <AudioCard className={`${classes.audioCard} step-settings-one`} />
        </>
      </SettingsAccordion>

      {features.scenemidi && (
        <SettingsAccordion title="MIDI" accId="2b" icon="mdi:midi">
          <MidiCard />
        </SettingsAccordion>
      )}
      {viewMode !== 'user' && (
        <SettingsAccordion title="Features" accId="Features" icon="addTask">
          <Uncategorized />
        </SettingsAccordion>
      )}
      <Accordion disabled sx={{ backgroundColor: 'transparent !important' }}>
        <AccordionSummary aria-controls="panel3a-content" id="panel3a-header">
          <Typography>Tools</Typography>
        </AccordionSummary>
      </Accordion>
      <Grid container spacing={2} sx={{ my: 2 }}>
        <Tile component={<AssetManager variant="tile" />} />
        <Tile
          icon={<QueueMusic fontSize="large" />}
          text="Scene Playlists"
          onClick={() => navigate('/playlists')}
        />
        <Tile
          client
          beta
          icon={<AccountTree fontSize="large" />}
          text="YZ Flow"
          onClick={() => navigate('/YZflow')}
        />
        <Tile
          client
          beta
          icon={<SportsEsports fontSize="large" />}
          text="Gamepad"
          onClick={() => setGamepadOpen(true)}
        />
        <Tile
          client
          beta
          icon={<SettingsInputComponent fontSize="large" />}
          text="MIDI"
          onClick={() => setMidiOpen(true)}
        />
        <Tile
          client
          alpha
          icon={<Equalizer fontSize="large" />}
          text="Visualiser"
          onClick={() => navigate('/visualiser')}
        />
      </Grid>
      {viewMode !== 'user' && (
        <SettingsAccordion title="Bottom Bar Visibility" accId="corebetaa" icon="mdi:eye">
          <BottomBarCard />
        </SettingsAccordion>
      )}
      <Accordion disabled sx={{ backgroundColor: 'transparent !important' }}>
        <AccordionSummary aria-controls="panel3a-content" id="panel3a-header">
          <Typography>Widgets</Typography>
        </AccordionSummary>
      </Accordion>
      <Grid container spacing={2} sx={{ my: 2 }}>
        <Tile
          icon={<Keyboard fontSize="large" />}
          text="Keybindings"
          onClick={() => setKeybinding(true)}
        />
        <Tile
          icon={<Keyboard fontSize="large" />}
          text="Smartbar"
          onClick={() => setSmartBarOpen(true)}
        />
        <Tile
          client
          icon={<Keyboard fontSize="large" />}
          text="Pixel Graphs"
          onClick={() => setPgs(true)}
        />
      </Grid>

      {viewMode !== 'user' && <SmartBar direct maxWidth={540} />}
    </div>
  )
}

export default SettingsNew
