// import React, { useState, useEffect } from 'react';
// import { Box } from '@mui/material';
// import {
//   Chart as ChartJS,
//   RadialLinearScale,
//   PointElement,
//   LineElement,
//   Filler,
//   // Tooltip,
//   Legend,
// } from 'chart.js';
import styled from 'styled-components';
import { Radar } from 'react-chartjs-2';
import { useTheme } from '@material-ui/core';

const RadarChartContainer = styled.div`
  width: 500px;
  height: 250px;
  margin: 0 auto;
  h2 {
    margin-bottom: 40px;
    font-family: Inter;
    font-style: normal;
    font-weight: 900;
    font-size: 22px;
    color: white;
  }
`;

const RadarChart = (props: any) => {
  const theme = useTheme();
  const TrackFeatures = props;
  // ChartJS.register(
  //   RadialLinearScale,
  //   PointElement,
  //   LineElement,
  //   Filler,
  //   Legend
  // );
  const data = {
    labels: [
      'Energy',
      'Danceability',
      'Positiveness',
      'Instrumentalness',
      'Loudness',
    ],
    datasets: [
      {
        label: 'Track Features',
        backgroundColor: `${theme.palette.primary.main}a0`,
        borderColor: `${theme.palette.primary.main}cc`,
        borderWidth: 1,
        pointBackgroundColor: `${theme.palette.primary.main}`,
        pointBorderWidth: 2,
        fontColor: theme.palette.text.primary,
        data: [
          TrackFeatures?.energy,
          TrackFeatures?.danceability,
          TrackFeatures?.valence,
          TrackFeatures?.instrumentalness,
          ((TrackFeatures?.loudness || 0) * -1) / 13,
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    legend: {
      display: false,
    },

    layout: {
      padding: {
        left: 0,
        right: 0,
        top: 20,
        bottom: 20,
      },
    },
    scale: {
      ticks: {
        beginAtZero: true,
        min: 0,
        max: 1,
        stepSize: 0,
        showLabelBackdrop: false,
        backdropColor: 'rgba(0, 0, 0, 1)',
      },
      pointLabels: {
        fontColor: 'white',
      },
      gridLines: {
        color: 'white',
      },
      angleLines: {
        color: 'white',
      },
    },
    tooltips: {
      callbacks: {
        label(tooltipItem: any) {
          return tooltipItem.yLabel;
        },
      },
    },
  };
  return (
    <RadarChartContainer>
      <Radar data={data} options={chartOptions} />
    </RadarChartContainer>
  );
};
export default RadarChart;
