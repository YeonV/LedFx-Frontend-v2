import React from 'react';
import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useStore from './apiStore';

const ws = new WebSocket(`ws://${window.localStorage.getItem('ledfx-host')?.split('http://')[0].split(':')[0] || 'localhost:8888'}/api/websocket`);

export default ws;
export const WsContext = React.createContext(ws);

export const HandleWs = () => {
  const { pathname } = useLocation();
  const displays = useStore((state) => state.displays);
  const pixelGraphs = useStore((state) => state.pixelGraphs);
  const setPixelGraphs = useStore((state) => state.setPixelGraphs);
  const [wsReady, setWsReady] = useState(false)

  useLayoutEffect(() => {
    if (!(pathname.startsWith("/Devices") || pathname.startsWith("/device"))) {
      setPixelGraphs([]);
    }

  }, [pathname]);

  useEffect(() => {
    if (pixelGraphs.length > 0 && ws.readyState && ws.readyState === 1) {
      pixelGraphs.map((d,i) => {
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
        // console.log("Send");
        ws.send(JSON.stringify(++request.id && request));              
      };
      getWs();      
    })
    
    return () => {      
      pixelGraphs.map((d,i) => {  
        const removeGetWs = async () => {
          const request = {
            id: i,
            type: "unsubscribe_event",
            event_type: "visualisation_update",
          };          
          ws.send(JSON.stringify(++request.id && request));          
        };
        // console.log("Clean Up");
        removeGetWs();
      })
    }
  }
  }, [wsReady, pixelGraphs]);

  useEffect(() => {
    ws.onmessage = (event) => {
      if (JSON.parse(event.data).event_type === "visualisation_update") {
        document.dispatchEvent(
          new CustomEvent("YZ", { detail: {
            id: JSON.parse(event.data).vis_id,
            pixels: JSON.parse(event.data).pixels,
          } })
        );
      }
    };
    ws.onopen = () => {
      setWsReady(true)
    }
  }, [ws]);

  return null;
}