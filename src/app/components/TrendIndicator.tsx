import React from 'react';

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
  const difference = currentValue - previousValue;
  const isPositive = difference > 0;
  
  return (
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
  );
};

export default TrendIndicator;
