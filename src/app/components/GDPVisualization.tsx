'use client';
import { useState, useEffect, useMemo } from 'react';
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
import { Slider, Checkbox, FormGroup, FormControlLabel } from '@mui/material';

interface GDPData {
  Year: number;
  GDP: number;
  'Growth Rate (%)': number;
  'Cumulative Growth (%)': number;
}

interface GDPVisualizationProps {
  usData: GDPData[];
  chinaData: GDPData[];
  visualizationType: 'gdp' | 'combined';
  title: string;
}

const GDPVisualization: React.FC<GDPVisualizationProps> = ({ 
  usData, 
  chinaData, 
  visualizationType,
  title 
}) => {
  const [yearRange, setYearRange] = useState<[number, number]>([2000, 2023]);
  const [showUS, setShowUS] = useState(true);
  const [showChina, setShowChina] = useState(true);
  const [activeTab, setActiveTab] = useState<'growth' | 'cumulative'>('growth');

  // Process data based on selected options
  const processedData = useMemo(() => {
    const startYear = yearRange[0];
    const endYear = yearRange[1];

    return Array.from({ length: endYear - startYear + 1 }, (_, i) => {
      const year = startYear + i;
      const usEntry = usData.find(d => d.Year === year);
      const chinaEntry = chinaData.find(d => d.Year === year);

      return {
        Year: year,
        'US GDP': showUS ? (usEntry?.GDP || 0) / 1e12 : undefined, // Convert to trillion
        'China GDP': showChina ? (chinaEntry?.GDP || 0) / 1e12 : undefined,
        'US Growth': showUS ? usEntry?.['Growth Rate (%)'] : undefined,
        'China Growth': showChina ? chinaEntry?.['Growth Rate (%)'] : undefined,
        'US Cumulative': showUS ? usEntry?.['Cumulative Growth (%)'] : undefined,
        'China Cumulative': showChina ? chinaEntry?.['Cumulative Growth (%)'] : undefined,
      };
    });
  }, [usData, chinaData, yearRange, showUS, showChina]);

  const getYAxisLabel = () => {
    if (visualizationType === 'gdp') return 'GDP (Trillion USD)';
    return activeTab === 'growth' ? 'GDP Growth (%)' : 'Cumulative Growth (%)';
  };

  const getCurrentType = () => {
    if (visualizationType === 'gdp') return 'gdp';
    return activeTab;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-white/10 rounded-lg shadow-lg">
          <p className="text-blue-200 font-medium text-xs mb-1">{`Year: ${label}`}</p>
          {payload.map((entry: any, index: number) => {
            const value = entry.value;
            let formattedValue;
            
            // Format based on the data type
            if (entry.name.includes('GDP')) {
              formattedValue = `$${value.toFixed(2)}T`;
            } else {
              // For growth rates and cumulative growth
              formattedValue = `${value.toFixed(1)}%`;
            }
            
            return (
              <p key={index} className="text-xs text-white/60">
                {`${entry.name}: ${formattedValue}`}
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="text-white font-montserrat h-full flex flex-col">
      {visualizationType === 'combined' ? (
        <div className="flex -mx-4 -mt-4 mb-2">
          <button
            onClick={() => setActiveTab('growth')}
            className={`flex-1 px-4 py-2 text-xs rounded-t-lg transition-colors duration-200 ${
              activeTab === 'growth'
                ? 'bg-slate-900/40 text-blue-200 backdrop-blur-sm'
                : 'bg-slate-800/30 text-white/60 hover:bg-slate-800/40 hover:text-white/80'
            }`}
          >
            GDP Growth Rate
          </button>
          <button
            onClick={() => setActiveTab('cumulative')}
            className={`flex-1 px-4 py-2 text-xs rounded-t-lg transition-colors duration-200 ${
              activeTab === 'cumulative'
                ? 'bg-slate-900/40 text-blue-200 backdrop-blur-sm'
                : 'bg-slate-800/30 text-white/60 hover:bg-slate-800/40 hover:text-white/80'
            }`}
          >
            Cumulative Growth
          </button>
        </div>
      ) : (
        <div className="mb-2">
          <h2 className="text-blue-200 font-medium tracking-tight text-center text-sm">
            {title}
          </h2>
        </div>
      )}

      {/* Controls Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-2">
          <FormGroup row className="flex-nowrap">
            <FormControlLabel
              control={
                <Checkbox
                  checked={showUS}
                  onChange={(e) => setShowUS(e.target.checked)}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.3)',
                    '&.Mui-checked': {
                      color: '#0066cc',
                    },
                    padding: '2px',
                  }}
                  size="small"
                />
              }
              label={<span className="text-xs text-white/60 font-light">USA</span>}
              className="mr-4"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={showChina}
                  onChange={(e) => setShowChina(e.target.checked)}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.3)',
                    '&.Mui-checked': {
                      color: '#cc0000',
                    },
                    padding: '2px',
                    marginLeft: '8px',
                  }}
                  size="small"
                />
              }
              label={<span className="text-xs text-white/60 font-light">China</span>}
            />
          </FormGroup>
        </div>

        <div className="flex items-center gap-2 min-w-[180px]">
          <span className="text-xs text-white/60 font-light whitespace-nowrap">
            {yearRange[0]} - {yearRange[1]}
          </span>
          <Slider
            value={yearRange}
            onChange={(_, newValue) => setYearRange(newValue as [number, number])}
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
            <XAxis 
              dataKey="Year" 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
            />
            <YAxis 
              label={{ 
                value: getYAxisLabel(), 
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
            <Legend 
              wrapperStyle={{ 
                color: 'rgba(255,255,255,0.6)',
                fontSize: '12px',
              }}
            />
            {showUS && (
              <Line
                type="monotone"
                dataKey={
                  getCurrentType() === 'gdp' ? 'US GDP' :
                  getCurrentType() === 'growth' ? 'US Growth' : 'US Cumulative'
                }
                stroke="#0066cc"
                strokeWidth={2}
                dot={{ r: 3, fill: '#0066cc', strokeWidth: 0 }}
                activeDot={{ 
                  r: 6, 
                  fill: '#0066cc',
                  stroke: 'rgba(255,255,255,0.2)',
                  strokeWidth: 2
                }}
                animationDuration={750}
                animationBegin={0}
                animationEasing="ease-in-out"
              />
            )}
            {showChina && (
              <Line
                type="monotone"
                dataKey={
                  getCurrentType() === 'gdp' ? 'China GDP' :
                  getCurrentType() === 'growth' ? 'China Growth' : 'China Cumulative'
                }
                stroke="#cc0000"
                strokeWidth={2}
                dot={{ r: 3, fill: '#cc0000', strokeWidth: 0 }}
                activeDot={{ 
                  r: 6, 
                  fill: '#cc0000',
                  stroke: 'rgba(255,255,255,0.2)',
                  strokeWidth: 2
                }}
                animationDuration={750}
                animationBegin={0}
                animationEasing="ease-in-out"
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default GDPVisualization; 