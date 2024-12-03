'use client';
import { Line } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';

interface LineChartProps {
  data: any;
  title: string;
  yAxisLabel: string;
}

export default function LineChart({ data, title, yAxisLabel }: LineChartProps) {
  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1.5,
    plugins: {
      legend: {
        position: 'top',
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
        text: title,
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
        title: {
          display: true,
          text: yAxisLabel,
          color: '#e2e8f0',
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: 'bold' as const
          }
        },
        ticks: {
          font: {
            size: 10,
            family: "'Inter', sans-serif"
          },
          color: '#94a3b8'
        }
      }
    }
  };

  return (
    <div className="p-4 bg-slate-800 rounded-lg shadow-lg border border-slate-700 hover:shadow-xl transition-all duration-300">
      <Line data={data} options={options} />
    </div>
  );
} 