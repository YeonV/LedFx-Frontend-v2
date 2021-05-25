import React, { useEffect } from "react";
import useStore from "../utils/Api";

const Settings = () => {
  const getSystemConfig = useStore((state) => state.getSystemConfig);
  const getSchemas = useStore((state) => state.getSchemas);
  const config = useStore((state) => state.config);
  const schemas = useStore((state) => state.schemas);
  console.log(schemas);
  useEffect(() => {
    getSystemConfig();
    getSchemas();
  }, [getSystemConfig, getSchemas]);
  return (
    <div>
      <h1>Settings</h1>
      {config && Object.keys(config).map((s, i) => <div key={i}>{s}</div>)}
    </div>
  );
};

export default Settings;
