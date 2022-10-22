/* eslint-disable @typescript-eslint/indent */
import React from 'react';
import {
  ComposedChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Bar,
  Cell,
  Legend,
} from 'recharts';

const renderLegend = () => {
  return (
    <ul
      style={{
        height: 20,
        display: 'table',
        paddingLeft: 50,
        marginTop: 0,
        listStyleType: 'none',
      }}
    >
      <li style={{ color: '#f1f1f1' }}>Key</li>
    </ul>
  );
};

const Chart = (props: any) => {
  const pitchColors = [
    '#ff3333',
    '#ff9933',
    '#ffff33',
    '#99ff33',
    '#33ff33',
    '#33ff99',
    '#33ffff',
    '#3399ff',
    '#3333ff',
    '#9933ff',
    '#ff33ff',
    '#ff3399',
  ];

  const { sections, width } = props;
  return (
    <ResponsiveContainer width={width} height={20} debounce={5}>
      <ComposedChart
        barGap={1}
        data={sections}
        margin={{
          top: 15,
          right: 20,
          left: 0,
          bottom: 0,
        }}
      >
        <XAxis hide dataKey="start" unit="s" />
        <YAxis hide height={10} />
        <Legend
          align="left"
          height={20}
          layout="vertical"
          content={renderLegend}
        />
        {/* <Tooltip 
                        content={renderTooltip}
                    /> */}
        <Bar dataKey="start" minPointSize={10}>
          {sections
            ? sections.map((entry: any, index: any) => (
                <Cell key={`cell-${index}`} fill={pitchColors[entry.key]} />
              ))
            : null}
        </Bar>
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default Chart;
