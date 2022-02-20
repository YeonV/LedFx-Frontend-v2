import React from 'react';
import { useEffect, useLayoutEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import useStore from './apiStore';
import Sockette from 'sockette';
import isElectron from 'is-electron';

function createSocket() {
  
  if (!!window.localStorage.getItem('ledfx-newbase')) {
    const _wsNew = new Sockette(`${(window.localStorage.getItem('ledfx-host') || (isElectron() ? 'http://localhost:8080' : window.location.href.split('/#')[0])).replace('https://', 'wss://').replace('http://', 'ws://')}/ws`, {
      timeout: 5e3,
      maxAttempts: 10,
      onopen: e => {
        console.log('NEW BASE Connected!', e)
        // document.dispatchEvent(
        //   new CustomEvent("disconnected", {
        //     detail: {
        //       isDisconnected: false
        //     }
        //   })
        // );
        _wsNew.ws = e.target;
      },
      onmessage: (event) => {
        console.log('NEW BASE MSG!', event)
        if (JSON.parse(event.data).type) {

          document.dispatchEvent(
            new CustomEvent("YZNEW", { detail: JSON.parse(event.data) })
          );
        }
      },
      // onreconnect: e => console.log('Reconnecting...', e),
      // onmaximum: e => console.log('Stop Attempting!', e),
      onclose: e => {
        console.log('NEW BASE Closed!', e)
        // document.dispatchEvent(
        //   new CustomEvent("disconnected", {
        //     detail: {
        //       isDisconnected: true
        //     }
        //   })
        // );
      },
      // onerror: e => console.log('Error:', e)
    });
    return _wsNew
  }
  return
}
const wsNew = !!window.localStorage.getItem('ledfx-newbase') && createSocket();
export default wsNew;
export const WsContextNew = React.createContext(wsNew);

export const HandleWsNew = () => {
  const { pathname } = useLocation();
  const [wsReady, setWsReady] = useState(false)

  useLayoutEffect(() => {
    if (!wsReady) {
      if (wsNew && wsNew.ws) {
        setWsReady(true)
      }
    }
  }, [pathname]);


  useEffect(() => {
    if (wsReady) {
      const getWs = async () => {
        const request = {
          message: "frontend connected",
          id: 1,
          type: "success",
        };
        wsNew.send(JSON.stringify(++request.id && request));
      };
      getWs();

      return () => {
        const removeGetWs = async () => {
          const request = {
            id: 2,
            type: "unsubscribe_event",
            event_type: "visualisation_update",
          };
          wsNew.send(JSON.stringify(++request.id && request));
        };
        removeGetWs();
      }
    }
  }, [wsReady]);

  useEffect(() => {
    if (!wsReady) {
      if (wsNew && wsNew.ws) {
        setWsReady(true)
      }
    }
  }, [wsReady, wsNew]);


  return null;
}