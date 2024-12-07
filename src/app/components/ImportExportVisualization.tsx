'use client';

import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label
} from 'recharts';
import { FormControlLabel, Switch } from '@mui/material';

interface DataPoint {
  year: number;
  exports: number;
  imports: number;
}

const processData = (data: string): DataPoint[] => {
  const lines = data.split('\n');
  const yearData: { [key: string]: DataPoint } = {};

  lines.forEach(line => {
    const values = line.split(',');
    const year = parseInt(values[0]);
    const productGroup = values[1];
    
    if (productGroup === 'All Products' && !isNaN(year) && year >= 1991) {
      const exports = parseFloat(values[2]) / 1000000; // Convert to billions
      const imports = parseFloat(values[3]) / 1000000; // Convert to billions
      yearData[year] = { year, exports, imports };
    }
  });

  return Object.values(yearData).sort((a, b) => a.year - b.year);
};

interface ImportExportVisualizationProps {
  data: string;
}

const ImportExportVisualization: React.FC<ImportExportVisualizationProps> = ({ data }) => {
  const [showTrendline, setShowTrendline] = useState(false);
  const processedData = processData(data);

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-white/60 text-sm">US/China Trade (Billions USD)</h3>
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
        <BarChart
          data={processedData}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
          <XAxis 
            dataKey="year" 
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
            angle={-45}
            textAnchor="end"
            tickMargin={10}
          />
          <YAxis
            stroke="rgba(255,255,255,0.3)"
            tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
            tickFormatter={(value) => `${value}b`}
            label={{ 
              value: 'Trade Value (Billions USD)', 
              angle: -90, 
              position: 'outside',
              offset: 45,
              style: { fill: 'rgba(255,255,255,0.6)', fontSize: 10 }
            }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'rgba(0,0,0,0.8)',
              border: '1px solid rgba(255,255,255,0.2)',
            }}
            labelStyle={{ color: 'rgba(255,255,255,0.8)' }}
            itemStyle={{ color: 'rgba(255,255,255,0.8)' }}
            formatter={(value: number) => [`${value.toFixed(2)}B`, '']}
          />
          <Legend
            wrapperStyle={{
              color: 'rgba(255,255,255,0.6)',
              fontSize: 10,
            }}
          />
          <Bar dataKey="exports" fill="#ef4444" name="Exports" />
          <Bar dataKey="imports" fill="#3b82f6" name="Imports" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ImportExportVisualization; 