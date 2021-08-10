import { useState, useEffect } from 'react'

// async function streamMicrophoneAudioToSocket(ws) {
//     let stream;
//     const constraints = { video: false, audio: true };

//     try {
//       stream = await navigator.mediaDevices.getUserMedia(constraints);
//     } catch (error) {
//       throw new Error(`
//         MediaDevices.getUserMedia() threw an error. 
//         Stream did not open.
//         ${error.name} - 
//         ${error.message}
//       `);
//     }

//     const recorder = new MediaRecorder(stream);
//     console.log(recorder)
//     recorder.addEventListener('dataavailable', ({ data }) => {
//         console.log(data)
//       ws.send(data);
//     });
//     recorder.ondataavailable = ({ data }) => {
//         console.log(data)
//       ws.send(data);
//     };

//     recorder.start();
//     return recorder;
//   };



const Webaudio = () => {
    const audioContext = new AudioContext();
    const [webAud, setWebAud] = useState(false)
    const ws = new WebSocket(`${window.localStorage.getItem('ledfx-host') ? window.localStorage.getItem('ledfx-host').replace('https://', 'wss://').replace('http://', 'ws://') : 'ws://localhost:8888'}/api/websocket`);
    // get mic stream
    useEffect(() => {
        var source
        console.log("ey")
        if (webAud) {
            let thisLoop, lastLoop
            window.navigator.getUserMedia({ audio: true }, (stream) => {
                source = audioContext.createMediaStreamSource(stream);
                const scriptNode = audioContext.createScriptProcessor(512, 1, 1);
                source.connect(scriptNode);
                scriptNode.connect(audioContext.destination);
                // output to speaker
                // source.connect(audioContext.destination);

                // on process event
                scriptNode.onaudioprocess = (e) => {
                    // get mica data
                    // FPS TESTING
                    thisLoop = performance.now();
                    var fps = 1000 / (thisLoop - lastLoop);
                    lastLoop = thisLoop;
                    // console.log(fps, " fps:", e.inputBuffer.getChannelData(0))
                    console.log("sending", webAud)
                    ws.send(JSON.stringify(webAud));
                };
            }
                , console.log);
        } 
        return {
            if (source) {
                source.disconnect()
            }
            
        }
    }, [webAud])


    
    // const recorder = streamMicrophoneAudioToSocket(ws);      


    return (
        <div onClick={() => setWebAud(!webAud)}>
            WebAudio
        </div>
    )
}

export default Webaudio
