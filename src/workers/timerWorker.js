import { Ledfx } from "../api/ledfx.ts";

/* eslint-disable */
let timer = null;

self.onmessage = async function (e) {
  const { action, interval, scenePL, scenePLactiveIndex, scenePLrepeat, activateSceneUrl } = e.data;

  if (action === 'start') {
    if (timer === null) {
      timer = setInterval(async () => {
        let nextIndex = scenePLactiveIndex + 1;
        if (nextIndex >= scenePL.length) {
          if (scenePLrepeat) {
            nextIndex = 0;
          } else {
            self.postMessage({ action: 'stop' });
            return;
          }
        }

        const nextSceneId = scenePL[nextIndex];
        try {
          await await Ledfx('/api/scenes', 'PUT', {
                id: nextSceneId,
                action: 'activate'
              })
          self.postMessage({ action: 'sceneChanged', nextIndex });
        } catch (error) {
          console.error('Failed to activate scene:', error);
        }
      }, interval);
    }
  } else if (action === 'stop') {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;
    }
  }
};