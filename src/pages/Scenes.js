import React, { useEffect } from "react";
import useStore from "../utils/Api";

const Scenes = () => {
  const getScenes = useStore((state) => state.getScenes);
  const scenes = useStore((state) => state.scenes);
  useEffect(() => {
    getScenes();
  }, [getScenes]);
  return (
    <div>
      <h1>Scenes</h1>
      {scenes && Object.keys(scenes).map((s, i) => <div key={i}>{s}</div>)}
    </div>
  );
};

export default Scenes;
