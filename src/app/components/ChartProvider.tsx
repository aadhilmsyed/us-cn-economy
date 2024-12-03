'use client';
import { ReactNode, useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarElement
} from 'chart.js';

interface ChartProviderProps {
  children: ReactNode;
}

export default function ChartProvider({ children }: ChartProviderProps) {
  const [isChartReady, setIsChartReady] = useState(false);

  useEffect(() => {
    ChartJS.register(
      CategoryScale,
      LinearScale,
      PointElement,
      LineElement,
      BarElement,
      Title,
      Tooltip,
      Legend,
      Filler
    );
    setIsChartReady(true);
  }, []);

  if (!isChartReady) {
    return null;
  }

  return <>{children}</>;
} 