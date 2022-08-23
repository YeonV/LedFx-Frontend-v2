import React from 'react';
import {
  Card,
  Grid,
  Typography,
  CardContent,
  Avatar,
  LinearProgress,
} from '@material-ui/core';
import Chart from './Chart';
import SectionChart from './SectionChart';
import ChartSize from './ChartSize';
import ChordButtons from './ChordButtons';
import PitchSelect from './PitchSelect';
// import { connect } from 'react-redux';
// import { updatePlayerState } from 'modules/spotify';
// import { getAsyncIntegrations } from 'modules/integrations';
type MyProps = {
  analysis: any;
  albumURL: any;
  name: any;
  artist: any;
  sections: any;
  segments: any;
};
type MyState = { [key: string]: any };

export class Layout extends React.Component<MyProps, MyState> {
  constructor(props: any) {
    super(props);

    this.state = {
      width: 2000,
      height: 255,
      pitches: {
        C: true,
        'C#': true,
        D: true,
        'D#': true,
        E: true,
        F: true,
        'F#': true,
        G: true,
        'G#': true,
        A: true,
        'A#': true,
        B: true,
      },
      //   openFromSearch: false,
    };
  }

  handleSizeSliderChange = (event: any, newValue: any) => {
    this.setState({ width: newValue });
  };

  handleCheck = (event: any) => {
    const e = event;
    this.setState((state: any) => ({
      pitches: {
        ...state.pitches,
        [e.target.name]: e.target.checked,
      },
    }));
  };

  handleChordClick = (event: any) => {
    const e = event;
    const pitchClasses = [
      'C',
      'C#',
      'D',
      'D#',
      'E',
      'F',
      'F#',
      'G',
      'G#',
      'A',
      'A#',
      'B',
    ];
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

    numbers.map((item) => {
      this.setState((state) => ({
        pitches: {
          ...state.pitches,
          [pitchClasses[item]]: false,
        },
      }));
      return true;
    });

    setTimeout(() => {
      e.target.value.map((item: any) => {
        this.setState((state: any) => ({
          pitches: {
            ...state.pitches,
            [pitchClasses[item]]: true,
          },
        }));
        return true;
      });
    }, 100);
  };

  render() {
    const { analysis, albumURL, name, artist, sections, segments } = this.props;
    const { width, height, pitches } = this.state;

    return (
      <div className="wrapper" style={{ width: '100%' }}>
        <Grid
          container
          direction="column"
          justify="center"
          alignItems="center"
          spacing={2}
          style={{ width: '100%' }}
        >
          <Grid item xs={12} sm={12}>
            {/* <Header /> */}
          </Grid>
          <Grid container item xs={12} sm={12} justify="center">
            <Card
              style={{
                maxWidth: '99%',
                minWidth: '99%',
                overflowX: 'auto',
                backgroundColor: '#0f0f0f',
              }}
            >
              <CardContent>
                {Object.keys(analysis).length < 1 ? (
                  <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                    style={{ height, width: '95vw' }}
                  >
                    <div style={{ height: 5, marginBottom: 40, width: '100%' }}>
                      <LinearProgress style={{ height: 5, width: '100%' }} />
                    </div>
                    <Typography variant="h5" align="center" color="secondary">
                      Audio Analysis for current song generated here
                    </Typography>

                    <div style={{ height: 5, marginTop: 40, width: '100%' }}>
                      <LinearProgress
                        variant="query"
                        style={{ height: 5, width: '100%' }}
                      />
                    </div>
                  </Grid>
                ) : (
                  <div>
                    <Grid
                      container
                      spacing={3}
                      alignItems="center"
                      justify="center"
                      style={{ maxWidth: '95vw' }}
                    >
                      <Grid item>
                        <Avatar
                          style={{ border: '1px solid white' }}
                          alt="album-image"
                          src={albumURL}
                          variant="rounded"
                        >
                          A
                        </Avatar>
                      </Grid>
                      <Grid item>
                        <Typography variant="h5" style={{ color: '#f1f1f1' }}>
                          {name}
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography variant="h6" style={{ color: '#666' }}>
                          {artist}
                        </Typography>
                      </Grid>
                    </Grid>
                    <div
                      style={{
                        maxWidth: '98%',
                        overflowX: 'auto',
                        overflowY: 'hidden',
                      }}
                    >
                      <SectionChart
                        sections={sections}
                        segments={segments}
                        width={width}
                        height={height}
                      />
                      <Chart
                        segments={segments}
                        width={width}
                        height={height}
                        pitches={pitches}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
          <Grid item container xs={12} sm={12} spacing={2}>
            <Grid item id="left" xs={12} sm={4}>
              <Card style={{ height: '100%', backgroundColor: '#0f0f0f' }}>
                <CardContent>
                  <ChartSize
                    handleSizeSliderChange={this.handleSizeSliderChange}
                    value={width}
                  />
                </CardContent>
              </Card>
            </Grid>
            <Grid item id="right" xs={12} sm={8}>
              <Card style={{ height: '100%', backgroundColor: '#0f0f0f' }}>
                <CardContent
                  style={{ height: '100%', paddingTop: 0, paddingBottom: 0 }}
                >
                  <Grid
                    style={{ height: '100%' }}
                    container
                    alignItems="center"
                    justify="center"
                  >
                    <PitchSelect
                      pitches={pitches}
                      handleCheck={this.handleCheck}
                    />
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item id="right" xs={12} sm={12}>
              <Card style={{ backgroundColor: '#0f0f0f' }}>
                <CardContent>
                  <ChordButtons handleChordClick={this.handleChordClick} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {/* <Backdrop style={{zIndex: 1000}} open='true'>
                    <CircularProgress />
                </Backdrop> */}
        </Grid>
      </div>
    );
  }
}

// export default connect(
//   (state) => ({
//     analysis: state.spotify.audioAnalysis,
//     segments: state.spotify.audioAnalysis.segments,
//     sections: state.spotify.audioAnalysis.sections,
//   }),
//   { updatePlayerState, getAsyncIntegrations }
// )(Layout);

export default Layout;
