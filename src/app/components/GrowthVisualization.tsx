'use client';

import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { FormControlLabel, Switch } from '@mui/material';

interface DataPoint {
  year: number;
  usGrowth: number;
  chinaGrowth: number;
}

const processData = (data: string): DataPoint[] => {
  const lines = data.split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1)
    .map(line => {
      const values = line.split(',');
      return {
        year: parseInt(values[0]),
        usGrowth: parseFloat(values[1]),
        chinaGrowth: parseFloat(values[2])
      };
    })
    .filter(point => !isNaN(point.year) && !isNaN(point.usGrowth) && !isNaN(point.chinaGrowth));
};

interface GrowthVisualizationProps {
  data: string;
}

const GrowthVisualization: React.FC<GrowthVisualizationProps> = ({ data }) => {
  const [showTrendline, setShowTrendline] = useState(false);
  const processedData = processData(data);

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white/60 text-sm">GDP Growth Rate Comparison</h3>
        <FormControlLabel
          control={
            <Switch
              checked={showTrendline}
              onChange={(e) => setShowTrendline(e.target.checked)}
              size="small"
              sx={{
                '& .MuiSwitch-track': {
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                },
                '& .MuiSwitch-thumb': {
                  backgroundColor: 'rgba(255, 255, 255, 0.6)',
                },
              }}
            />
          }
          label={<span className="text-white/60 text-sm">Show Trendline</span>}
        />
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis
            dataKey="year"
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
          />
          <YAxis 
            label={{ 
              value: 'Growth Rate (%)', 
              angle: -90, 
              position: 'outside',
              offset: 15,
              dx: -20,
              style: { fill: 'rgba(255,255,255,0.6)', fontSize: 10 }
            }}
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
            width={45}
            tickMargin={5}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
            labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
            itemStyle={{ color: 'rgba(255,255,255,0.8)' }}
          />
          <Legend
            wrapperStyle={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 10,
            }}
          />
          <Line
            type="monotone"
            dataKey="usGrowth"
            name="US Growth"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="chinaGrowth"
            name="China Growth"
            stroke="#ef4444"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GrowthVisualization; 