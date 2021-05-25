import React, { useEffect } from "react";
import useStore from "../utils/Api";

const Devices = () => {
  const getDisplays = useStore((state) => state.getDisplays);
  const displays = useStore((state) => state.displays);
  useEffect(() => {
    getDisplays();
  }, [getDisplays]);
  return (
    <div>
      <h1>Devices</h1>
      {displays && Object.keys(displays).map((s, i) => <div key={i}>{s}</div>)}
    </div>
  );
};

export default Devices;
