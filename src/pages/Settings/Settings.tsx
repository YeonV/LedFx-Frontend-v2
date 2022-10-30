import { useEffect } from 'react';
import {
  Accordion,
  AccordionSummary,
  Typography,
  AccordionDetails,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';
import useStore from '../../store/useStore';
import AudioCard from './AudioCard';
import WledCard from './WledCard';
import Webaudio from './Webaudio';
import ClientAudioCard from './ClientAudioCard';
import { useStyles } from './SettingsComponents';
import UICard from './UICard';
import GeneralCard from './GeneralCard';
import DashboardCard from './DashboardCard';

const Settings = () => {
  const classes = useStyles();
  const features = useStore((state) => state.features);
  const showFeatures = useStore((state) => state.showFeatures);
  const settingsExpanded = useStore((state) => state.ui.settingsExpanded);
  const setSettingsExpanded = useStore((state) => state.ui.setSettingsExpanded);
  const loc = useLocation();

  const handleExpanded = (panel: any, _event: any, isExpanded: any) => {
    setSettingsExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    if (loc.search.indexOf('ui') > -1) {
      setSettingsExpanded('panel2');
    }
  }, [loc]);

  return (
    <div className={classes.card}>
      <Accordion
        expanded={settingsExpanded === 'all' || settingsExpanded === 'panel3'}
        onChange={(event, isExpanded) =>
          handleExpanded('panel3', event, isExpanded)
        }
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography>General</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <GeneralCard />
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={settingsExpanded === 'all' || settingsExpanded === 'panel1'}
        onChange={(event, isExpanded) =>
          handleExpanded('panel1', event, isExpanded)
        }
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Audio Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div>
            {features.webaudio && (
              <Webaudio
                style={{ position: 'absolute', right: '3.5rem', top: '0.3rem' }}
              />
            )}
            <ClientAudioCard />
            <AudioCard className={`${classes.audioCard} step-settings-one`} />
          </div>
        </AccordionDetails>
      </Accordion>

      <Accordion
        expanded={settingsExpanded === 'all' || settingsExpanded === 'panel2'}
        onChange={(event, isExpanded) =>
          handleExpanded('panel2', event, isExpanded)
        }
      >
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography>UI Settings</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <UICard />
        </AccordionDetails>
      </Accordion>

      {showFeatures.dashboard && (
        <Accordion
          expanded={
            settingsExpanded === 'all' || settingsExpanded === 'paneldb'
          }
          onChange={(event, isExpanded) =>
            handleExpanded('paneldb', event, isExpanded)
          }
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="paneldb-content"
            id="paneldb-header"
          >
            <Typography>Dashboard Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <DashboardCard />
          </AccordionDetails>
        </Accordion>
      )}

      {features.wled && (
        <Accordion
          expanded={settingsExpanded === 'all' || settingsExpanded === 'panel4'}
          onChange={(event, isExpanded) =>
            handleExpanded('panel4', event, isExpanded)
          }
        >
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel4a-content"
            id="panel4a-header"
          >
            <Typography>WLED Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              <WledCard className={`${classes.card} step-settings-five`} />
            </div>
          </AccordionDetails>
        </Accordion>
      )}
    </div>
  );
};

export default Settings;
