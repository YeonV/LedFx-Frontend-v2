import useStore from '../../store/useStore';
import { useStyles, SettingsSwitch } from './SettingsComponents';

const DashboardCard = () => {
  const classes = useStyles();
  const features = useStore((state) => state.features);
  const setFeatures = useStore((state) => state.setFeatures);

  return (
    <div style={{ width: '100%' }}>
      <div className={`${classes.settingsRow} step-settings-x `}>
        <label>Replace Home with Dashboard</label>
        <SettingsSwitch
          checked={features.dashboard}
          onChange={() => setFeatures('dashboard', !features.dashboard)}
        />
      </div>
    </div>
  );
};

export default DashboardCard;
