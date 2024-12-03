'use client';
import { motion } from 'framer-motion';

interface KPICardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon?: string;
}

export default function KPICard({ title, value, change, trend, icon }: KPICardProps) {
  const trendColors = {
    up: 'text-green-400',
    down: 'text-red-400',
    neutral: 'text-slate-400'
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-slate-800 p-4 rounded-xl shadow-lg border border-slate-700"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs text-slate-400 font-medium">{title}</h3>
        {icon && (
          <span className="text-slate-400 text-sm">
            <i className={`fas ${icon}`}></i>
          </span>
        )}
      </div>
      <div className="flex items-baseline justify-between">
        <p className="text-xl font-bold text-slate-200">{value}</p>
        <p className={`flex items-center text-xs ${trendColors[trend]}`}>
          {trend === 'up' && '↑'}
          {trend === 'down' && '↓'}
          {change}
        </p>
      </div>
    </motion.div>
  );
} 