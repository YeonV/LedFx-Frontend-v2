import { Button, Fab, TextField, Popover, FormControlLabel, Switch } from '@material-ui/core';
import { Check, Close } from '@material-ui/icons';
import { useState, useEffect } from 'react'
import BladeIcon from '../../components/Icons/BladeIcon';
import ws from "../../utils/Websocket";
import useStore from '../../utils/apiStore';

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
  // const [webAud, setWebAud] = useState(false)
  const webAud = useStore((state) => state.webAud)
  const setWebAud = useStore((state) => state.setWebAud)
  const [wsReady, setWsReady] = useState(false)
  const [keep, setKeep] = useState(false)
  const webAudName = useStore((state) => state.webAudName)
  const setWebAudName = useStore((state) => state.setWebAudName)

  const audioContext = webAud && new (window.AudioContext || window.webkitAudioContext)();
  const [anchorEl, setAnchorEl] = useState(null);
  

  const getSchemas = useStore((state) => state.getSchemas)


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
                client: webAudName,
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
        // const sendWs = async () => {
        //   let i = 0
        //   const request = {
        //     client: webAudName,
        //     id: i,
        //     type: "audio_stream_stop",
        //   };
        //   ws.ws.send(JSON.stringify(++request.id && request));
        // };
        // sendWs();
        // s?.getTracks().forEach(track => track.stop())
        // audioContext.close()
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
      <Fab aria-describedby={id} size="large" color={webAud ? "inherit" : "secondary"} onClick={(e) => {
        if (keep) {
          setKeep(false)
        }
        if (webAud) {
          if (audioContext) {
            s.getTracks().forEach(track => track.stop())
            audioContext.close()
          }
          const sendWs = async () => {
            let i = 0
            const request = {
              client: webAudName,
              id: i,
              type: "audio_stream_stop",
            };
            ws.ws.send(JSON.stringify(++request.id && request));
          };
          sendWs().then(() => getSchemas());
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
            value={webAudName}
            onChange={(e) => setWebAudName(e.target.value)}
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
              console.log(webAud, wsReady)

              if (!webAud) {
                if (wsReady) {
                  const sendWs = async () => {
                    const request = {
                      client: webAudName,
                      id: 1,
                      type: "audio_stream_start",
                    };
                    ws.ws.send(JSON.stringify(++request.id && request));
                  };
                  console.log("YZ4")
                  sendWs()
                  setTimeout(()=>{
                    getSchemas()
                  },1000)
                  
                }
              } 

              setAnchorEl(null);
              setWebAud(true)
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
