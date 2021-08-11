import { useState, useEffect } from 'react'
import ws from "../../utils/Websocket";

const Webaudio = () => {
  const [webAud, setWebAud] = useState(false)
  const audioContext = webAud && new AudioContext();
  const [wsReady, setWsReady] = useState(false)

  useEffect(() => {
    audioContext && window.navigator.getUserMedia({ audio: true }, (stream) => {
      const source = audioContext.createMediaStreamSource(stream);
      const scriptNode = audioContext.createScriptProcessor(512, 1, 1);
      source.connect(scriptNode);
      scriptNode.connect(audioContext.destination);
      scriptNode.onaudioprocess = e => {
        console.log(webAud) /* this one is NOT correct */
        if (wsReady) {
          if (!webAud) { 
            source.disconnect()
          } else {
            const sendWs = async () => {
              let i = 0
              const request = {
                data: e.inputBuffer.getChannelData(0),
                event_type: "web_audio",
                id: i,
                type: "audio_data",
              };
              ws.ws.send(JSON.stringify(++request.id && request));
            };
            sendWs();
          }
        }
      };
    }, console.log);    
  }, [audioContext, webAud])

  if (!wsReady) {
    if (ws && ws.ws && ws.ws.readyState === 1) {
      setWsReady(true)
    }
  }

  return (
    <div onClick={() => console.log(webAud) /* this one is correct */ || setWebAud(!webAud)}>
      WebAudio
    </div>
  )
}

export default Webaudio
