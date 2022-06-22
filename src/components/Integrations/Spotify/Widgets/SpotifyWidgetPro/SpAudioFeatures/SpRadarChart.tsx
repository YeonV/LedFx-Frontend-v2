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

const RadarChartContainer = styled.div`
    width: 550px;
    height:'550px;
    h2 {
        margin-bottom: 40px;
        font-family: Inter;
        font-style: normal;
        font-weight: 900;
        font-size: 18px;
        color: white;
    }
`;

const RadarChart = (props: any) => {
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
        backgroundColor: 'rgba(128, 0, 0, 0.5)',
        borderColor: 'rgba(255, 0, 0, .5)',
        borderWidth: 1,
        pointBackgroundColor: 'rgb(200, 0, 0)',
        pointBorderWidth: 2,
        fontColor: 'rgba(255, 255, 255, 1)',
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
        left: 20,
        right: 0,
        top: 0,
        bottom: 0,
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
