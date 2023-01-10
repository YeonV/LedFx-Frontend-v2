import useStore from '../../store/useStore';
import { SettingsRow } from './SettingsComponents';

const AlphaFeatures = () => {
  const setFeatures = useStore((state) => state.setFeatures);
  const showFeatures = useStore((state) => state.showFeatures);
  const features = useStore((state) => state.features);

  return (
    <>
      <SettingsRow
        title="LedFx Cloud"
        checked={features.cloud}
        onChange={() => setFeatures('cloud', !features.cloud)}
      />
      <SettingsRow
        title="WebAudio"
        checked={features.webaudio}
        onChange={() => setFeatures('webaudio', !features.webaudio)}
      />
      {showFeatures.wled && (
        <SettingsRow
          title="WLED Integration"
          checked={features.wled}
          onChange={() => setFeatures('wled', !features.wled)}
        />
      )}

      {showFeatures.effectfilter && (
        <SettingsRow
          title="Effect Filter"
          checked={features.effectfilter}
          onChange={() => setFeatures('effectfilter', !features.effectfilter)}
        />
      )}
    </>
  );
};

export default AlphaFeatures;
