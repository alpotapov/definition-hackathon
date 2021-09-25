import React, { useState, useEffect } from 'react';
import { client } from 'defi-sdk';
import {
  LineChart,
  XAxis,
  Tooltip,
  CartesianGrid,
  Line,
  YAxis,
} from 'recharts';
// import Chart2 from './Chart2.png';

import './PriceChart.css';

const PriceChart = () => {
  // eslint-disable-next-line
  const [chartData, setChartData] = useState([]);
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(0);

  useEffect(() => {
    const unsubscribe = client.subscribe({
      namespace: 'assets',
      body: {
        scope: ['charts'],
        payload: { asset_codes: ['eth'], currency: 'usd' },
        charts_type: 'M',
      },
      onMessage: (event, data) => {
        if (event === 'received') {
          const receivedChartData = data.payload.charts.eth.reverse();
          let currentMinValue = receivedChartData[0][1];
          let currentMaxValue = receivedChartData[0][1];
          const mapped = receivedChartData.map((item) => {
            const [block, value] = item;
            if (value > maxValue) currentMaxValue = value;
            if (currentMinValue > value) currentMinValue = value;
            return {
              block,
              value,
            };
          });
          console.log({ mapped });
          setMinValue(currentMinValue - 100);
          setMaxValue(currentMaxValue + 100);
          setChartData(mapped);
        }
        // setChartData(receivedChartData);
      },
    });

    return unsubscribe;
  }, []);

  return (
    <div className="PriceChart">
      <LineChart
        width={400}
        height={400}
        data={chartData}
        margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
      >
        <XAxis dataKey="block" />
        <YAxis domain={[minValue, maxValue]} />
        <Tooltip />
        <CartesianGrid stroke="#f5f5f5" />
        <Line
          dataKey="value"
          type="monotone"
          stroke="#ff7300"
          yAxisId={0}
          dot={false}
        />
        {/* <Line type="monotone" stroke="#387908" yAxisId={1} /> */}
      </LineChart>
    </div>
  );
};

export default PriceChart;
