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
  const TrackFeatures = {
    danceability: 0.76,
    energy: 0.964,
    key: 2,
    loudness: -5.844,
    mode: 1,
    speechiness: 0.0576,
    acousticness: 0.00182,
    instrumentalness: 0.7,
    liveness: 0.0974,
    valence: 0.641,
    tempo: 125,
    type: 'audio_features',
    id: '62WEkOD8TUO7wzkolOQW9v',
    uri: 'spotify:track:62WEkOD8TUO7wzkolOQW9v',
    track_href: 'https://api.spotify.com/v1/tracks/62WEkOD8TUO7wzkolOQW9v',
    analysis_url:
      'https://api.spotify.com/v1/audio-analysis/62WEkOD8TUO7wzkolOQW9v',
    duration_ms: 248036,
    time_signature: 4,
  };

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
        backgroundColor: 'rgba(50, 246, 152, 0.5)',
        borderColor: 'rgb(0, 226, 123)',
        borderWidth: 3,
        pointBackgroundColor: 'rgb(50, 246, 152)',
        pointBorderWidth: 2,
        fontColor: 'rgba(255, 255, 255, 0.5)',
        data: [
          TrackFeatures.energy,
          TrackFeatures.danceability,
          TrackFeatures.valence,
          TrackFeatures.instrumentalness,
          (TrackFeatures.loudness * -1) / 13,
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
        backdropColor: 'rgba(0, 0, 0, 0)',
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
}
