'use client';
import { motion } from 'framer-motion';

interface ComparisonCardProps {
  title: string;
  usValue: string | number;
  chinaValue: string | number;
  description: string;
}

export default function ComparisonCard({ title, usValue, chinaValue, description }: ComparisonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white p-6 rounded-lg shadow-lg"
    >
      <h3 className="text-xl font-bold mb-4">{title}</h3>
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">United States</p>
          <p className="text-2xl font-bold text-blue-600">{usValue}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">China</p>
          <p className="text-2xl font-bold text-red-600">{chinaValue}</p>
        </div>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </motion.div>
  );
} 