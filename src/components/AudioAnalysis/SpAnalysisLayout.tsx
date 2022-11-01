import React, { useEffect, useState } from 'react';
import {
  Card,
  Grid,
  Typography,
  CardContent,
  LinearProgress,
} from '@mui/material';

import Chart from './SpAnalysisChart';
import SectionChart from './SpAnalysisSectionChart';
import ChartSize from './SpAnalysisChartSize';
import ChordButtons from './SpAnalysisChordButtons';
import PitchSelect from './SpAnalysisPitchSelect';
import useStore from '../../store/useStore';
import { fixAnalysis } from '../../utils/spotifyProxies';
import pitchClasses from './constants/constants';

export default function SpAnalysisLayout() {
  const analysis = useStore(
    (state) => state?.spotify?.spotifyData?.trackAnalysis
  );

  const [width, setWidth] = useState(2000);
  const [height] = useState(255);
  const [pitches, setPitches] = useState({
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
  });
  const [newAnalysis, setNewAnalysis] = useState({});

  useEffect(() => {
    const newData = fixAnalysis(analysis);
    setNewAnalysis(newData);
  }, [analysis]);

  const handleSizeSliderChange = (event: any, newValue: any) => {
    setWidth(newValue);
  };

  const handleCheck = (e: any) => {
    setPitches((prev) => ({
      ...prev,
      [e.target.name]: e.target.checked,
    }));
  };

  const handleChordClick = (e: any) => {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    numbers.map((item) => {
      setPitches((prev) => ({
        ...prev,
        [pitchClasses[item]]: false,
      }));
      return null;
    });

    setTimeout(() => {
      e.target.value.map((item: any) => {
        setPitches((prev) => ({ ...prev, [pitchClasses[item]]: true }));
        return null;
      });
    });
  };

  const { segments, sections } = analysis;
  // console.log({ analysis });

  return (
    <Card style={{ color: 'white' }}>
      <div className="wrapper" style={{ width: '100%' }}>
        <Grid
          container
          direction="column"
          // justify="center"
          alignItems="center"
          spacing={2}
          style={{ width: '100%' }}
        >
          <Grid item xs={12} sm={12}>
            {/* <Header /> */}
          </Grid>
          <Grid container item xs={12} sm={12}>
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
                    // justify="center"
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
                      analysis={newAnalysis}
                      width={width}
                      height={height}
                      pitches={pitches}
                    />
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
                    handleSizeSliderChange={handleSizeSliderChange}
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
                    // justify="center"
                  >
                    <PitchSelect pitches={pitches} handleCheck={handleCheck} />
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item id="right" xs={12} sm={12}>
              <Card style={{ backgroundColor: '#0f0f0f' }}>
                <CardContent>
                  <ChordButtons handleChordClick={handleChordClick} />
                </CardContent>
              </Card>
            </Grid>
          </Grid>
          {/* <Backdrop style={{zIndex: 1000}} open='true'>
                  <CircularProgress />
              </Backdrop> */}
        </Grid>
      </div>
    </Card>
  );
}
