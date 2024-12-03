'use client';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Scale,
  CoreScaleOptions,
  Tick
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TradeBalanceChartProps {
  data: any;
}

export default function TradeBalanceChart({ data }: TradeBalanceChartProps) {
  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 11
          },
          color: '#e2e8f0'
        }
      },
      title: {
        display: true,
        text: 'US-China Trade Balance',
        color: '#e2e8f0',
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(30, 41, 59, 0.95)',
        titleColor: '#e2e8f0',
        bodyColor: '#e2e8f0',
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 13
        },
        padding: 12,
        borderColor: '#334155',
        borderWidth: 1
      }
    },
    scales: {
      x: {
        grid: {
          color: '#334155',
          display: true
        },
        ticks: {
          font: {
            size: 10,
            family: "'Inter', sans-serif"
          },
          color: '#94a3b8'
        }
      },
      y: {
        grid: {
          color: '#334155',
          display: true
        },
        ticks: {
          font: {
            size: 10,
            family: "'Inter', sans-serif"
          },
          color: '#94a3b8',
          callback: function(tickValue: number | string, index: number, ticks: Tick[]) {
            const value = Number(tickValue);
            if (isNaN(value)) return tickValue;
            return value.toLocaleString('en-US', {
              style: 'currency',
              currency: 'USD',
              minimumFractionDigits: 0,
              maximumFractionDigits: 0,
              notation: 'compact'
            });
          }
        }
      }
    }
  };

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow-lg border border-slate-700 hover:shadow-xl transition-all duration-300">
      <Bar data={data} options={options} />
    </div>
  );
} 