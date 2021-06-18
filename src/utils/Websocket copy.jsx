import React from 'react';
import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useStore from './apiStore';
import Sockette from 'sockette';


// const ws = new WebSocket(`${window.location.protocol === 'https' ? 'wss' : 'ws'}://${window.localStorage.getItem('ledfx-host')?.split('https://')[0].split('http://')[0] || 'localhost:8888'}/api/websocket`);
// const ws = new WebSocket(`${(window.localStorage.getItem('ledfx-host') && window.localStorage.getItem('ledfx-host').startsWith('https')) ? 'wss' : 'ws'}://${window.localStorage.getItem('ledfx-host')?.split('https://')[0].split('http://')[0].split(':')[0] || 'localhost:8888'}/api/websocket`);
// const ws = new WebSocket(`wss://${window.localStorage.getItem('ledfx-host')?.split('https://')[0].split('http://')[0].split(':')[0] || 'localhost:8888'}/api/websocket`);
// const ws = new WebSocket(`${window.localStorage.getItem('ledfx-ws') ? window.localStorage.getItem('ledfx-ws') : 'ws://localhost:8888'}/api/websocket`, (window.localStorage.getItem('ledfx-ws') && window.localStorage.getItem('ledfx-ws').startsWith('wss')) ? 'https' : 'http');
// const ws = new WebSocket(`wss://127.0.0.1/api/websocket`, 'wss');
function createSocket() {
const _ws = new Sockette(`${window.localStorage.getItem('ledfx-ws') ? window.localStorage.getItem('ledfx-ws') : 'ws://localhost:8888'}/api/websocket`, {
  timeout: 5e3,
  maxAttempts: 10,
  onopen: e => {
    console.log('Connected!', e)
    _ws.ws = e.target;
    // const request = {
    //   event_filter: {
    //     vis_id: "144",
    //     is_device: true,
    //   },
    //   event_type: "visualisation_update",
    //   id: 2,
    //   type: "subscribe_event",
    // };
    // // console.log("Send");
    // ws.send(JSON.stringify(++request.id && request));    
  },
  onmessage: (event) => {
    if (JSON.parse(event.data).event_type === "visualisation_update") {
      document.dispatchEvent(
        new CustomEvent("YZ", {
          detail: {
            id: JSON.parse(event.data).vis_id,
            pixels: JSON.parse(event.data).pixels,
          }
        })
      );
    }
  },
  onreconnect: e => console.log('Reconnecting...', e),
  onmaximum: e => console.log('Stop Attempting!', e),
  onclose: e => console.log('Closed!', e),
  onerror: e => console.log('Error:', e)
});
return _ws
}
const ws = createSocket();
export default ws;
export const WsContext = React.createContext(ws);

export const HandleWs = () => {
  const { pathname } = useLocation();
  const displays = useStore((state) => state.displays);
  const pixelGraphs = useStore((state) => state.pixelGraphs);
  const setPixelGraphs = useStore((state) => state.setPixelGraphs);
  const graphs = useStore((state) => state.graphs);
  const [wsReady, setWsReady] = useState(false)
  
  


  useLayoutEffect(() => {
    if (!(pathname.startsWith("/Devices") || pathname.startsWith("/device"))) {
      setPixelGraphs([]);
    }
  }, [pathname]);

  useLayoutEffect(() => {
    if (!graphs) {
      setPixelGraphs([]);
    }
  }, [graphs]);

  useEffect(() => {
    
    if (pixelGraphs.length > 0) {
      pixelGraphs.map((d, i) => {
        const getWs = async () => {
          const request = {
            event_filter: {
              vis_id: d,
              is_device: !!displays[d].is_device,
            },
            event_type: "visualisation_update",
            id: i,
            type: "subscribe_event",
          };
          console.log("Send");
          ws.send(JSON.stringify(++request.id && request));
        };
        getWs();
      })

      return () => {
        pixelGraphs.map((d, i) => {
          const removeGetWs = async () => {
            const request = {
              id: i,
              type: "unsubscribe_event",
              event_type: "visualisation_update",
            };
            ws.send(JSON.stringify(++request.id && request));
          };
          console.log("Clean Up");
          removeGetWs();
        })
      }
    }
  }, [ pixelGraphs]);

  // useEffect(() => {
  //   ws.onmessage = (event) => {
  //     console.log("YZ")
  //     if (JSON.parse(event.data).event_type === "visualisation_update") {
  //       document.dispatchEvent(
  //         new CustomEvent("YZ", { detail: {
  //           id: JSON.parse(event.data).vis_id,
  //           pixels: JSON.parse(event.data).pixels,
  //         } })
  //       );
  //     }
  //   };
  //   ws.onopen = () => {
  //     setWsReady(true)
  //   }
  // }, [ws]);

  // useEffect(() => {

  //   setTimeout(()=>{
  //     setWsReady(true)
  //   }, 1000)
  // }, []);


  // console.log(wsReady)
  // if (!wsReady) {
  //   if (ws.ws) {
  //     console.log("NOWWW")
  //     setWsReady(true)
  //   }
  // }
  

  return null;
}