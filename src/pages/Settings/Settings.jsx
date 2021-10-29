import { useState } from 'react';
import useStore from '../../utils/apiStore';
import { Accordion, AccordionSummary, Typography, AccordionDetails } from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';
import AudioCard from './AudioCard';
import WledCard from './WledCard';
import Webaudio from './Webaudio';
import ClientAudioCard from './ClientAudioCard';
import { useStyles } from './SettingsComponents'
import UICard from './UICard';
import GeneralCard from './GeneralCard';

const Settings = () => {

  const classes = useStyles();
  const features = useStore((state) => state.features);
  const [expanded, setExpanded] = useState(false);

  const handleExpanded = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    <>
      <div className={classes.card}>
        <Accordion expanded={expanded === 'panel3'} onChange={handleExpanded('panel3')}>
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

        <Accordion expanded={expanded === 'panel1'} onChange={handleExpanded('panel1')}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography>Audio Settings</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div>
              {features['webaudio'] &&
                <Webaudio style={{ position: 'absolute', right: '3.5rem', top: '0.3rem' }} />
              }
              <ClientAudioCard />
              <AudioCard className={`${classes.audioCard} step-settings-one`} />
            </div>
          </AccordionDetails>
        </Accordion>

        <Accordion expanded={expanded === 'panel2'} onChange={handleExpanded('panel2')}>
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

        {features['wled'] &&
          <Accordion expanded={expanded === 'panel4'} onChange={handleExpanded('panel4')}>
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
          </Accordion>}
      </div>
    </>
  );
};

export default Settings;
