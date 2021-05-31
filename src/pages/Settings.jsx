import { useEffect } from 'react';
import useStore from '../utils/apiStore';

const Settings:React.FC = ():JSX.Element => {
  const getSystemConfig = useStore((state:any) => state.getSystemConfig);
  const config = useStore((state:any) => state.config);

  useEffect(() => {
    getSystemConfig();
  }, [getSystemConfig]);

  return (
    <div>
      <h1>Settings</h1>
      {config && Object.keys(config).map((s) => <div key={s}>{s}</div>)}
    </div>
  );
};

export default Settings;
