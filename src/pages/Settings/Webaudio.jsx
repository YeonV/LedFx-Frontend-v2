import { Button, Fab, TextField, Popover, FormControlLabel , Switch } from '@material-ui/core';
import { Check, Close } from '@material-ui/icons';
import { useState, useEffect } from 'react'
import BladeIcon from '../../components/Icons/BladeIcon';
import ws from "../../utils/Websocket";

const getMedia = async () => {
  try {
    return await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    })
  } catch (err) {
    console.log('Error:', err)
  }
}

const Webaudio = () => {
  const [webAud, setWebAud] = useState(false)
  const [wsReady, setWsReady] = useState(false)
  const [keep, setKeep] = useState(false)
  const [clientName, setClientName] = useState(new Date().getTime())
  const audioContext = webAud && new (window.AudioContext || window.webkitAudioContext)();
  const [anchorEl, setAnchorEl] = useState(null);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;


  let s
  useEffect(() => {
    webAud && navigator.mediaDevices && navigator.mediaDevices.getUserMedia && getMedia().then(stream => {
      s = stream
      if (!audioContext || audioContext.state === 'closed') {
        return
      }
      const source = audioContext.createMediaStreamSource(stream)
      const scriptNode = audioContext.createScriptProcessor(512, 1, 1);
      source.connect(scriptNode);
      scriptNode.connect(audioContext.destination);
      scriptNode.onaudioprocess = e => {
        if (wsReady) {
          if (webAud) {
            const sendWs = async () => {
              let i = 0
              const request = {
                data: e.inputBuffer.getChannelData(0),
                client: clientName,
                id: i,
                type: "audio_stream_data",
              };
              ws.ws.send(JSON.stringify(++request.id && request));
            };
            sendWs();
          }
        }
      };
    });
    return () => {   
      if (audioContext && !keep) {
        const sendWs = async () => {
          let i = 0
          const request = {
            client: clientName,
            id: i,
            type: "audio_stream_stop",
          };
          ws.ws.send(JSON.stringify(++request.id && request));
        };
        sendWs();
        s.getTracks().forEach(track => track.stop())
        audioContext.close()
      }
    }
  }, [audioContext])

  if (!wsReady) {
    if (ws && ws.ws && ws.ws.readyState === 1) {
      setWsReady(true)
    }
  }

  return (
    <>
    <Fab aria-describedby={id} size="large" color={webAud ? "inherit" : "secondary"} onClick={(e)=>{
      if (keep) {
        setKeep(false)
      }
      if (webAud) {
        setWebAud(false)        
      } else {

        handleClick(e)
      } 
       
      }} data-webaud={webAud}>
      <BladeIcon name={webAud ? "mdi:stop" : "mdi:music"} colorIndicator={webAud} />
    </Fab>
     <Popover
     id={id}
     open={open}
     anchorEl={anchorEl}
     onClose={handleClose}
     anchorOrigin={{
       vertical: "center",
       horizontal: 'right',
     }}
     transformOrigin={{
       vertical: "center",
       horizontal: 'left',
     }}
   >
     <div style={{ display: 'flex', margin: 20 }}>
        <TextField
          id="client-name"
          label="Name"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          variant="outlined"
        />
       <FormControlLabel
          value="top"
          control={<Switch checked={keep} onChange={(e) => setKeep(e.target.checked)} color="primary" />}
          label="Keep Open"
          labelPlacement="top"
        />
       <Button
         aria-describedby={id}
         variant="contained"
         color="primary"
         onClick={() => {           
           setWebAud(!webAud)
           if (wsReady) {
            if (webAud) {
              const sendWs = async () => {
                const request = {
                  client: clientName,
                  id: 1,
                  type: "audio_stream_start",
                };
                ws.ws.send(JSON.stringify(++request.id && request));
              };
              sendWs();
            }
          }
           setAnchorEl(null);
         }}
       >
         <Check />
       </Button>
       <Button
         aria-describedby={id}
         variant="contained"
         color="default"
         onClick={() => {
           setAnchorEl(null);
         }}
       >
         <Close />
       </Button>
     </div>
   </Popover>
   </>
  )
}

export default Webaudio
