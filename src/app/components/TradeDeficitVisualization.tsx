'use client';

import React, { useState, useMemo } from 'react';
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
import { FormControlLabel, Switch, Slider } from '@mui/material';

interface DataPoint {
  year: number;
  month: string;
  balance: number;
  monthIndex: number;
  displayDate: string;
}

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const processData = (data: string): DataPoint[] => {
  const lines = data.split('\n');
  const headers = lines[0].split(',');
  return lines.slice(1)
    .map(line => {
      const values = line.split(',');
      const year = parseInt(values[0]);
      const month = values[1];
      const monthIndex = MONTHS.indexOf(month);
      return {
        year,
        month,
        monthIndex,
        balance: parseFloat(values[2]) / 1000, // Convert to billions
        displayDate: `${month} ${year}`
      };
    })
    .filter(point => !isNaN(point.year) && !isNaN(point.balance))
    .sort((a, b) => a.year - b.year || a.monthIndex - b.monthIndex);
};

interface TradeDeficitVisualizationProps {
  data: string;
}

const TradeDeficitVisualization: React.FC<TradeDeficitVisualizationProps> = ({ data }) => {
  const [showTrendline, setShowTrendline] = useState(false);
  const [yearRange, setYearRange] = useState<[number, number]>([2000, 2023]);
  const processedData = processData(data);
  
  const years = Array.from(new Set(processedData.map(d => d.year))).sort();
  const filteredData = useMemo(() => {
    return processedData.filter(d => d.year >= yearRange[0] && d.year <= yearRange[1]);
  }, [processedData, yearRange]);

  // Create reference line data
  const referenceLineData = useMemo(() => {
    return {
      tradeWar: [
        { year: 2018, balance: -44 },
        { year: 2018, balance: 0 }
      ],
      covid: [
        { year: 2020, balance: -44 },
        { year: 2020, balance: 0 }
      ]
    };
  }, []);

  const isSingleYear = yearRange[0] === yearRange[1];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      // Filter out reference line data
      const tradeData = payload.find((p: { name: string }) => p.name === "Trade Balance");
      if (!tradeData) return null;

      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-white/10 rounded-lg shadow-lg">
          <p className="text-blue-200 font-medium text-xs mb-1">
            {isSingleYear ? label : `Year: ${label}`}
          </p>
          <p className="text-xs text-white/60">
            {`${tradeData.name}: ${tradeData.value?.toFixed(2)}`}
          </p>
        </div>
      );
    }
    return null;
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
          label={<span className="text-xs text-white/60 font-light">Show Trendline</span>}
        />

        <div className="flex items-center gap-2 min-w-[180px]">
          <span className="text-xs text-white/60 font-light whitespace-nowrap">
            {yearRange[0]} - {yearRange[1]}
          </span>
          <Slider
            value={yearRange}
            onChange={(_, newValue) => setYearRange(newValue as [number, number])}
            min={Math.min(...years)}
            max={Math.max(...years)}
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
          <LineChart
            data={filteredData}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey={isSingleYear ? "month" : "year"}
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
              tickMargin={10}
              height={40}
              angle={isSingleYear ? -45 : 0}
              textAnchor={isSingleYear ? "end" : "middle"}
              interval={isSingleYear ? 0 : "preserveStartEnd"}
            />
            <YAxis
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
              tickFormatter={(value) => String(value)}
              label={{ 
                value: 'Trade Balance (Billions USD)', 
                angle: -90, 
                position: 'outside',
                offset: 35,
                dx: -25,
                dy: -15,
                style: { fill: 'rgba(255,255,255,0.6)', fontSize: 10 }
              }}
              width={55}
              tickMargin={5}
              domain={['dataMin - 2', 'dataMax + 2']}
              ticks={[-44, -33, -22, -11, 0]}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Event markers */}
            {!isSingleYear && yearRange[0] <= 2018 && yearRange[1] >= 2018 && (
              <ReferenceLine
                x={2018}
                stroke="#ffd700"
                strokeDasharray="3 3"
                strokeWidth={2}
                ifOverflow="extendDomain"
                label={{
                  value: "Trade War",
                  position: 'insideTop',
                  fill: '#ffd700',
                  fontSize: 12,
                  dy: -10
                }}
              />
            )}
            {!isSingleYear && yearRange[0] <= 2020 && yearRange[1] >= 2020 && (
              <ReferenceLine
                x={2020}
                stroke="#00ff00"
                strokeDasharray="3 3"
                strokeWidth={2}
                ifOverflow="extendDomain"
                label={{
                  value: "COVID-19",
                  position: 'insideTop',
                  fill: '#00ff00',
                  fontSize: 12,
                  dy: -10
                }}
              />
            )}
            
            <Line
              type="monotone"
              dataKey="balance"
              name="Trade Balance"
              stroke="#ef4444"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#ef4444', stroke: 'rgba(255,255,255,0.2)', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      {/* Reference Line Labels */}
      <div className="flex justify-center items-center gap-6 mt-2 mb-1">
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