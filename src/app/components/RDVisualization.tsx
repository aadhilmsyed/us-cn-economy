import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Slider, Checkbox, FormGroup, FormControlLabel } from '@mui/material';

interface RDData {
  Year: number;
  'R&D Spending (% of GDP)': number;
}

interface RDVisualizationProps {
  usData: RDData[];
  chinaData: RDData[];
}

const RDVisualization: React.FC<RDVisualizationProps> = ({ 
  usData, 
  chinaData 
}) => {
  const PREDICTION_START_YEAR = 2021;
  const MAX_YEAR = 2043;
  const [yearRange, setYearRange] = useState<[number, number]>([2000, PREDICTION_START_YEAR]);
  const [showUS, setShowUS] = useState(true);
  const [showChina, setShowChina] = useState(true);

  const handleYearRangeChange = (event: Event, newValue: number | number[]) => {
    // Ensure start year can't be in prediction range
    const [start, end] = newValue as [number, number];
    const startYear = Math.min(start, PREDICTION_START_YEAR);
    setYearRange([startYear, end]);
  };

  const processedData = usData
    .filter(d => d.Year >= yearRange[0] && d.Year <= yearRange[1])
    .map(d => ({
      Year: d.Year,
      'US R&D': d['R&D Spending (% of GDP)'],
      'China R&D': chinaData.find(cd => cd.Year === d.Year)?.['R&D Spending (% of GDP)'] || null,
      isPrediction: d.Year > PREDICTION_START_YEAR
    }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length > 0) {
      const isPrediction = payload[0]?.payload?.isPrediction;
      return (
        <div className="bg-black/80 backdrop-blur-sm p-3 border border-white/10 rounded-lg shadow-lg">
          <p className="text-blue-200 font-medium text-xs mb-1">
            {`Year: ${label}`}
            {isPrediction && <span className="text-yellow-400 ml-1">(Predicted)</span>}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} className="text-xs text-white/60">
              {`${entry.name}: ${entry.value?.toFixed(2)}%`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="text-white font-montserrat h-full flex flex-col">
      <div className="mb-2">
        <h2 className="text-blue-200 font-medium tracking-tight text-center text-sm">
          US/China R&D Spending (% of GDP)
        </h2>
      </div>

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
            onChange={handleYearRangeChange}
            min={2000}
            max={MAX_YEAR}
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
              tick={({ x, y, payload }) => (
                <g transform={`translate(${x},${y})`}>
                  <text
                    x={0}
                    y={0}
                    dy={16}
                    textAnchor="middle"
                    fill={payload.value > PREDICTION_START_YEAR ? "rgba(234, 179, 8, 0.8)" : "rgba(255,255,255,0.6)"}
                    fontSize={10}
                  >
                    {payload.value}
                  </text>
                </g>
              )}
            />
            <YAxis 
              label={{ 
                value: 'R&D Spending (% of GDP)', 
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
            {/* Prediction start line */}
            {yearRange[1] > PREDICTION_START_YEAR && (
              <>
                <ReferenceLine
                  x={PREDICTION_START_YEAR}
                  stroke="rgba(234, 179, 8, 0.5)"
                  strokeDasharray="3 3"
                  label={{
                    value: "Predictions →",
                    position: 'insideTopRight',
                    fill: 'rgba(234, 179, 8, 0.8)',
                    fontSize: 10,
                  }}
                />
                <ReferenceLine
                  x={PREDICTION_START_YEAR}
                  stroke="rgba(234, 179, 8, 0.5)"
                  strokeDasharray="3 3"
                />
              </>
            )}
            {showUS && (
              <>
                <Line
                  type="monotone"
                  dataKey={(dataPoint) => dataPoint.isPrediction ? null : dataPoint["US R&D"]}
                  name="US R&D"
                  stroke="#0066cc"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    fill: '#0066cc',
                    stroke: 'rgba(255,255,255,0.2)',
                    strokeWidth: 2
                  }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey={(dataPoint) => dataPoint.isPrediction ? dataPoint["US R&D"] : null}
                  name="US R&D (Predicted)"
                  stroke="#0066cc"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    fill: 'rgba(0, 102, 204, 0.5)',
                    stroke: 'rgba(255,255,255,0.2)',
                    strokeWidth: 2
                  }}
                  connectNulls
                />
              </>
            )}
            {showChina && (
              <>
                <Line
                  type="monotone"
                  dataKey={(dataPoint) => dataPoint.isPrediction ? null : dataPoint["China R&D"]}
                  name="China R&D"
                  stroke="#cc0000"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    fill: '#cc0000',
                    stroke: 'rgba(255,255,255,0.2)',
                    strokeWidth: 2
                  }}
                  connectNulls
                />
                <Line
                  type="monotone"
                  dataKey={(dataPoint) => dataPoint.isPrediction ? dataPoint["China R&D"] : null}
                  name="China R&D (Predicted)"
                  stroke="#cc0000"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    fill: 'rgba(204, 0, 0, 0.5)',
                    stroke: 'rgba(255,255,255,0.2)',
                    strokeWidth: 2
                  }}
                  connectNulls
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RDVisualization; 