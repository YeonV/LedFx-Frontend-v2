import React, { useEffect } from "react";
import useStore from "../utils/Api";

const Device = ({
  match: {
    params: { displayId },
  },
}) => {
  console.log(displayId);
  const getDisplays = useStore((state) => state.getDisplays);
  const displays = useStore((state) => state.displays);
  useEffect(() => {
    getDisplays();
  }, [getDisplays]);
  return (
    <div>
      <h1>{displays[displayId].config.name}</h1>
      {JSON.stringify(displays[displayId], null, 2)}
    </div>
  );
};

export default Device;
