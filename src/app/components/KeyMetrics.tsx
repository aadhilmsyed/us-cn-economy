'use client';
import { motion } from 'framer-motion';

interface KeyMetric {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

interface KeyMetricsProps {
  metrics: KeyMetric[];
}

export default function KeyMetrics({ metrics }: KeyMetricsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="bg-white p-4 rounded-lg shadow-lg"
        >
          <h3 className="text-sm text-gray-600">{metric.title}</h3>
          <p className="text-2xl font-bold mt-2">{metric.value}</p>
          <p className={`text-sm mt-1 ${
            metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
          }`}>
            {metric.change}
          </p>
        </motion.div>
      ))}
    </div>
  );
} 