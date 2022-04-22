// import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

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

export default function RadarChart() {
  ChartJS.register(
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend
  );

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
        data: [0.964, 0.76, 0.641, 0.7, 0.5],
        backgroundColor: 'rgba(50, 246, 152, 0.5)',
        borderColor: 'rgb(0, 226, 123)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(50, 246, 152)',
        pointBorderWidth: 2,
        fontColor: '#fff',
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
        top: 0,
        bottom: 0,
      },
    },
    scale: {
      ticks: {
        callback() {
          return '';
        },
        backdropColor: 'rgba(0, 0, 0, 0)',
        min: -0.5,
        max: 1,
      },
      pointLabels: {
        fontColor: 'black',
      },
      gridLines: {
        color: '#009688',
      },
      angleLines: {
        color: '#009688',
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
}
