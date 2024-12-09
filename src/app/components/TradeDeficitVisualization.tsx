'use client';

import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Slider, FormControlLabel, Switch } from '@mui/material';

interface TradeDeficitVisualizationProps {
  data: string;
}

const TradeDeficitVisualization: React.FC<TradeDeficitVisualizationProps> = ({ data }) => {
  const [yearRange, setYearRange] = useState<[number, number]>([2000, 2023]);
  const [showTrendline, setShowTrendline] = useState(true);

  const processedData = (() => {
    const lines = data.split('\n');
    const points = lines.slice(1)
      .map(line => {
        const values = line.split(',');
        if (!values[3] || !values[2]) return null;
        
        const year = parseInt(values[3].split('-')[0]);
        return {
          date: values[3],
          year,
          balance: parseFloat(values[2]) / 1000
        };
      })
      .filter((point): point is { date: string; year: number; balance: number } => {
        return point !== null && !isNaN(point.year) && !isNaN(point.balance) &&
          point.year >= yearRange[0] && point.year <= yearRange[1];
      });

    // Calculate 12-month moving average for trendline
    return points.map((point, index) => {
      const start = Math.max(0, index - 11);
      const values = points.slice(start, index + 1).map(p => p.balance);
      const trend = values.length === 12 ? 
        values.reduce((a, b) => a + b) / values.length : 
        null;
      
      return {
        ...point,
        trend
      };
    });
  })();

  const handleYearRangeChange = (_: Event, newValue: number | number[]) => {
    setYearRange(newValue as [number, number]);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const value = payload[0].value;
      const formattedValue = `$${Math.abs(value).toFixed(2)}B`;

      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-white/10 rounded-lg shadow-lg">
          <p className="text-blue-200 font-medium text-xs mb-1">
            {`Date: ${label}`}
          </p>
          <p className="text-xs text-white/60">
            {`Trade Balance: ${value < 0 ? '-' : ''}${formattedValue}`}
          </p>
        </div>
      );
    }
    return null;
  };

  // Format date based on year range
  const formatXAxis = (dateStr: string) => {
    const date = new Date(dateStr);
    const yearSpan = yearRange[1] - yearRange[0];
    
    if (yearSpan <= 1) {
      // Show "Jan 2020" format for small ranges
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        year: 'numeric'
      });
    } else {
      // Show only year for larger ranges
      return date.getFullYear().toString();
    }
  };

  return (
    <div className="text-white font-montserrat h-full flex flex-col">
      <div className="mb-2">
        <h2 className="text-blue-200 font-medium tracking-tight text-center text-sm">
          US/China Trade Balance (Billions USD)
        </h2>
      </div>

      {/* Controls Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <FormControlLabel
            control={
              <Switch
                checked={showTrendline}
                onChange={(e) => setShowTrendline(e.target.checked)}
                size="small"
                sx={{
                  color: 'rgba(255, 255, 255, 0.3)',
                  '&.Mui-checked': {
                    color: '#0066cc',
                  },
                  padding: '2px',
                }}
              />
            }
            label={<span className="text-xs text-white/60 font-light">Show Trendline</span>}
          />
        </div>

        <div className="flex items-center gap-2 min-w-[180px]">
          <span className="text-xs text-white/60 font-light whitespace-nowrap">
            {yearRange[0]} - {yearRange[1]}
          </span>
          <Slider
            value={yearRange}
            onChange={handleYearRangeChange}
            min={2000}
            max={2023}
            valueLabelDisplay="auto"
            size="small"
            sx={{
              color: 'rgb(191 219 254)', // blue-200
              '& .MuiSlider-thumb': {
                backgroundColor: 'rgb(191 219 254)',
                width: 14,
                height: 14,
                '&:hover, &.Mui-focusVisible': {
                  boxShadow: '0 0 0 6px rgba(191, 219, 254, 0.1)',
                },
              },
              '& .MuiSlider-track': {
                backgroundColor: 'rgb(191 219 254)',
                height: 2,
                border: 'none',
              },
              '& .MuiSlider-rail': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                height: 2,
              },
              '& .MuiSlider-valueLabel': {
                background: 'rgba(0, 0, 0, 0.8)',
                borderRadius: '6px',
                padding: '2px 6px',
                fontSize: '11px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
              },
              width: '120px',
              padding: '13px 0',
              marginLeft: '4px',
            }}
          />
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <ReferenceLine 
              y={0}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={1}
            />
            <XAxis 
              dataKey="date"
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
              tickFormatter={formatXAxis}
              interval={yearRange[1] - yearRange[0] === 1 ? 3 :
                      yearRange[1] - yearRange[0] === 2 ? 6 :
                      yearRange[1] - yearRange[0] === 0 ? 1 :
                      'preserveStartEnd'}
            />
            <YAxis 
              label={{ 
                value: 'Trade Balance (Billions USD)', 
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
              content={<CustomTooltip />}
              wrapperStyle={{
                background: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                backdropFilter: 'blur(8px)',
              }}
            />
            <ReferenceLine
              x="2018-01-01"
              stroke="#ffd700"
              strokeDasharray="3 3"
            />
            <ReferenceLine
              x="2020-03-01"
              stroke="#00ff00"
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="balance"
              name="Trade Balance"
              stroke="#ef4444"
              dot={false}
              strokeWidth={2}
              activeDot={{ 
                r: 6, 
                fill: '#ef4444',
                stroke: 'rgba(255,255,255,0.2)',
                strokeWidth: 2
              }}
            />
            {showTrendline && (
              <Line
                type="monotone"
                dataKey="trend"
                name="Trend (12-month MA)"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={false}
                strokeDasharray="5 5"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Reference Line Labels */}
      <div className="flex justify-center items-center gap-6 mt-1">
        <div className="flex items-center gap-2">
          <div className="w-6 h-0 border-t-2 border-dashed border-[#ffd700]"></div>
          <span className="text-[#ffd700] text-xs">Trade War (2018)</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-0 border-t-2 border-dashed border-[#00ff00]"></div>
          <span className="text-[#00ff00] text-xs">COVID-19 (2020)</span>
        </div>
      </div>
    </div>
  );
};

export default TradeDeficitVisualization;