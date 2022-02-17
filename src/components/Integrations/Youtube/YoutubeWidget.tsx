import { Button, Fab, IconButton, Input, Typography } from '@material-ui/core';
import { QueueMusic } from '@material-ui/icons';
import { useState } from 'react';
// import ChangeYoutubeURLDialog from './ChangeYoutubeURLDialog';
import BladeIcon from '../../Icons/BladeIcon/BladeIcon';

const YoutubeWidget = ({
  youtubeEnabled,
  setYoutubeEnabled,
  youtubeExpanded,
  setYoutubeExpanded,
  youtubeURL,
  setYoutubeURL,
}: any) => {
  async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
      method: 'POST', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors', // no-cors, *cors, same-origin
      cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
      credentials: 'same-origin', // include, *same-origin, omit
      headers: {
        'Content-Type': 'application/json',
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      redirect: 'follow', // manual, *follow, error
      referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
      body: JSON.stringify(data), // body data type must match "Content-Type" header
    });
    if (response) {
      return response.json(); // parses JSON response into native JavaScript objects
    }
    return { status: 'fail' };
  }

  const [state, setState] = useState({
    Artist: '',
    Title: '',
    Creator: '',
    Duration: 0,
    SampleRate: 0,
    Size: 0,
  });

  return (
    <>
      <Fab
        size="small"
        color="secondary"
        onClick={() => setYoutubeEnabled(!youtubeEnabled)}
        style={{
          position: 'fixed',
          bottom: youtubeEnabled ? (youtubeExpanded ? 413 : 193) : 115,
          right: 10,
          zIndex: 4,
        }}
      >
        <BladeIcon
          name="mdi:youtube"
          style={{
            marginLeft: '50%',
            marginTop: '50%',
            transform: 'translate(-43%, -43%)',
            display: 'flex',
          }}
        />
      </Fab>
      {youtubeEnabled && (
        <>
          <div
            style={{
              position: 'fixed',
              display: 'flex',
              bottom: youtubeExpanded ? 308 : 88,
              right: 36,
              zIndex: 2,
            }}
          >
            {/* <ChangeYoutubeURLDialog
              youtubeURL={youtubeURL}
              setYoutubeURL={setYoutubeURL}
            /> */}
            <IconButton onClick={() => setYoutubeExpanded(!youtubeExpanded)}>
              <QueueMusic />
            </IconButton>
          </div>
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              width: '100%',
              height: youtubeEnabled ? (youtubeExpanded ? 300 : 80) : 0,
            }}
          >
            <div style={{ display: 'flex' }}>
              <div>
                <div style={{ width: '300px' }}>
                  <Input
                    value={youtubeURL}
                    onChange={setYoutubeURL}
                    style={{ width: '100%' }}
                  />
                </div>
                <Button
                  onClick={async () => {
                    await postData('http://localhost:8080/set/input/youtube', {
                      verbose: true,
                    }).then((data) => {
                      // eslint-disable-next-line no-console
                      if (data) console.log(data);
                    });
                  }}
                >
                  <BladeIcon name="mdi:youtube" />
                </Button>
                <Button
                  onClick={async () => {
                    await postData('http://localhost:8080/add/output/local', {
                      verbose: true,
                    }).then((data) => {
                      // eslint-disable-next-line no-console
                      if (data) console.log(data);
                    });
                  }}
                >
                  <BladeIcon name="mdi:music-note" />
                </Button>
                <Button
                  onClick={async () => {
                    // eslint-disable-next-line no-console
                    console.log('WTF');
                    await postData('http://localhost:8080/ctl/youtube', {
                      action: 'download',
                      url: youtubeURL,
                    }).then((data) => {
                      if (data) {
                        const {
                          Artist,
                          Creator,
                          Duration,
                          SampleRate,
                          Size,
                          Title,
                        } = data;
                        setState({
                          Artist,
                          Title,
                          Creator,
                          Duration,
                          SampleRate,
                          Size,
                        });
                      }
                    });
                  }}
                >
                  <BladeIcon name="Language" />
                </Button>
                <Button
                  onClick={async () => {
                    await postData('http://localhost:8080/ctl/youtube', {
                      action: 'play',
                    }).then((data) => {
                      // eslint-disable-next-line no-console
                      console.log(data); // JSON data parsed by `data.json()` call
                    });
                  }}
                >
                  <BladeIcon name="mdi:play" />
                </Button>
                <Button
                  onClick={async () => {
                    await postData('http://localhost:8080/ctl/youtube', {
                      action: 'stop',
                    }).then((data) => {
                      // eslint-disable-next-line no-console
                      console.log(data); // JSON data parsed by `data.json()` call
                    });
                  }}
                >
                  <BladeIcon name="mdi:stop" />
                </Button>
              </div>
              <div>
                {state && state.Artist !== '' && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      height: '100%',
                    }}
                  >
                    <Typography variant="h6">{state.Artist}</Typography>
                    <div>
                      <Typography variant="caption">{state.Title}</Typography>
                      <Typography variant="caption" color="textSecondary">
                        {'   '}({state.Size}MB | {state.Duration}s)
                      </Typography>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default YoutubeWidget;
