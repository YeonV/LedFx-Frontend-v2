import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SettingsAccordion, useStyles } from './SettingsComponents';
import useStore from '../../store/useStore';
import AudioCard from './AudioCard';
import WledCard from './WledCard';
import Webaudio from './Webaudio';
import ClientAudioCard from './ClientAudioCard';
import UICard from './UICard';
import GeneralCard from './GeneralCard';
import DashboardCard from './DashboardCard';
import AlphaFeatures from './AlphaFeatures';
import BetaFeatures from './BetaFeatures';
import ExpertFeatures from './ExpertFeatures';

const Settings = () => {
  const classes = useStyles();
  const viewMode = useStore((state) => state.viewMode);
  const features = useStore((state) => state.features);
  const showFeatures = useStore((state) => state.showFeatures);
  const setSettingsExpanded = useStore((state) => state.ui.setSettingsExpanded);
  const loc = useLocation();

  useEffect(() => {
    if (loc.search.indexOf('ui') > -1) {
      setSettingsExpanded('panel2');
    }
  }, [loc]);

  return (
    <div className={classes.card} style={{ marginBottom: '3rem' }}>
      <SettingsAccordion title="General" accId="3">
        <GeneralCard />
      </SettingsAccordion>
      <SettingsAccordion title="Audio Settings" accId="1a">
        <>
          {features.webaudio && (
            <Webaudio
              style={{ position: 'absolute', right: '3.5rem', top: '0.3rem' }}
            />
          )}
          <ClientAudioCard />
          <AudioCard className={`${classes.audioCard} step-settings-one`} />
        </>
      </SettingsAccordion>
      <SettingsAccordion title="UI Settings" accId="2a">
        <UICard />
      </SettingsAccordion>
      {viewMode !== 'user' && (
        <SettingsAccordion title="Expert Features" accId="2y3">
          <ExpertFeatures />
        </SettingsAccordion>
      )}
      {viewMode !== 'user' && features.beta && (
        <SettingsAccordion title="Beta Features" accId="2y2">
          <BetaFeatures />
        </SettingsAccordion>
      )}
      {viewMode !== 'user' && features.alpha && showFeatures.alpha && (
        <SettingsAccordion title="Alpha Features" accId="2y1">
          <AlphaFeatures />
        </SettingsAccordion>
      )}
      {showFeatures.dashboard && (
        <SettingsAccordion title="Dashboard Settings" accId="1db">
          <DashboardCard />
        </SettingsAccordion>
      )}
      {features.wled && (
        <SettingsAccordion title="WLED Settings" accId="4">
          <div>
            <WledCard className={`${classes.card} step-settings-five`} />
          </div>
        </SettingsAccordion>
      )}
    </div>
  );
};

export default Settings;
