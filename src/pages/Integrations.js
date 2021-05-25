import React, { useEffect } from "react";
import useStore from "../utils/Api";

const Integrations = () => {
  const getIntegrations = useStore((state) => state.getIntegrations);
  const integrations = useStore((state) => state.integrations);
  useEffect(() => {
    getIntegrations();
  }, [getIntegrations]);
  return (
    <div>
      <h1>Integrations</h1>
      {integrations &&
        Object.keys(integrations).map((s, i) => <div key={i}>{s}</div>)}
    </div>
  );
};

export default Integrations;
