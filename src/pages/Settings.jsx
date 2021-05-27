import { useEffect } from "react";
import useStore from "../utils/apiStore";

const Settings = () => {
  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const config = useStore((state) => state.config);

  useEffect(() => {
    getSystemConfig();

  }, [getSystemConfig]);

  return (
    <div>
      <h1>Settings</h1>
      {config && Object.keys(config).map((s, i) => <div key={i}>{s}</div>)}
    </div>
  );
};

export default Settings;
