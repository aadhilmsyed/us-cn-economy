import React from 'react';
import { Tooltip } from '@mui/material';

interface TrendIndicatorProps {
  currentValue: number;
  previousValue: number;
  precision?: number;
}

const TrendIndicator: React.FC<TrendIndicatorProps> = ({ 
  currentValue, 
  previousValue,
  precision = 1
}) => {
  const difference = ((currentValue - previousValue) / previousValue) * 100;
  const isPositive = difference > 0;
  
  const tooltipText = `${Math.abs(difference).toFixed(1)}% ${isPositive ? 'increase' : 'decrease'} since 2023`;
  
  return (
    <Tooltip 
      title={tooltipText}
      arrow
      placement="top"
      sx={{
        '& .MuiTooltip-tooltip': {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          fontSize: '0.75rem',
          padding: '0.5rem 0.75rem',
        },
        '& .MuiTooltip-arrow': {
          color: 'rgba(0, 0, 0, 0.8)',
        },
      }}
    >
      <div className={`flex items-center gap-0.5 ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
        {isPositive ? (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4L20 12L16 12L16 20L8 20L8 12L4 12L12 4Z" fill="currentColor"/>
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 20L4 12L8 12L8 4L16 4L16 12L20 12L12 20Z" fill="currentColor"/>
          </svg>
        )}
        <span className="text-sm font-medium">
          {Math.abs(difference).toFixed(precision)}%
        </span>
      </div>
    </Tooltip>
  );
};

export default TrendIndicator;
