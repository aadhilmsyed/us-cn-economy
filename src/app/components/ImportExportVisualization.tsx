'use client';

import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { PieChart, Pie, Legend, Cell as PieCell } from 'recharts';

interface DataPoint {
  year: number;
  exports: number;
  imports: number;
}

interface ProductData {
  name: string;
  value: number;
  percentage: number;
}

interface Props {
  data: string;
  productsData: string;
}

const COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#eab308', '#ec4899', 
  '#8b5cf6', '#14b8a6', '#f97316', '#6366f1', '#84cc16',
  '#06b6d4', '#f43f5e'
];

const ImportExportVisualization: React.FC<Props> = ({ data, productsData }) => {
  const [showExports, setShowExports] = useState(true);
  const [showImports, setShowImports] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<{
    type: 'imports' | 'exports';
    year: number;
    data: ProductData[];
  } | null>(null);

  const processData = (data: string): DataPoint[] => {
    const lines = data.split('\n');
    const yearData: { [key: string]: DataPoint } = {};

    lines.forEach(line => {
      const values = line.split(',');
      const year = parseInt(values[0]);
      const productGroup = values[1];
      
      if (productGroup === 'All Products' && !isNaN(year) && year >= 1991) {
        const exports = parseFloat(values[2]) / 1000000; // Convert to billions
        const imports = parseFloat(values[3]) / 1000000;
        yearData[year] = { year, exports, imports };
      }
    });

    return Object.values(yearData).sort((a, b) => a.year - b.year);
  };

  const processProductData = (productsData: string, year: number, type: 'imports' | 'exports'): ProductData[] => {
    const lines = productsData.split('\n');
    const products: { [key: string]: number } = {};
    let total = 0;

    lines.forEach(line => {
      const values = line.split(',');
      const productYear = parseInt(values[0]);
      const productName = values[1];
      
      if (productYear === year && productName !== 'All Products') {
        const value = parseFloat(type === 'exports' ? values[2] : values[3]) / 1000000;
        if (!isNaN(value)) {
          products[productName] = value;
          total += value;
        }
      }
    });

    return Object.entries(products)
      .map(([name, value]) => ({
        name,
        value,
        percentage: (value / total) * 100
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10); // Show top 10 products
  };

  const chartData = useMemo(() => processData(data), [data]);

  const handleBarClick = (entry: any, type: 'imports' | 'exports') => {
    const productData = processProductData(productsData, entry.year, type);
    setSelectedData({
      type,
      year: entry.year,
      data: productData
    });
    setModalOpen(true);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-blue-200 font-medium tracking-tight text-sm">
          US/China Trade Volume (Click Bars for Product Composition)
        </h2>
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showExports}
              onChange={(e) => setShowExports(e.target.checked)}
              className="accent-red-500 w-4 h-4"
            />
            <span className="text-xs font-light text-red-500">Exports</span>
          </label>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={showImports}
              onChange={(e) => setShowImports(e.target.checked)}
              className="accent-blue-500 w-4 h-4"
            />
            <span className="text-xs font-light text-blue-500">Imports</span>
          </label>
        </div>
      </div>

      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
            <XAxis 
              dataKey="year" 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
            />
            <YAxis 
              stroke="rgba(255,255,255,0.3)"
              tick={{ fill: 'rgba(255,255,255,0.6)', fontSize: 10 }}
              width={45}
              tickMargin={5}
              label={{ 
                value: 'Trade Value (Billions of USD)', 
                angle: -90, 
                position: 'insideLeft',
                offset: -5,
                style: { 
                  fill: 'rgba(255,255,255,0.6)', 
                  fontSize: 10,
                  textAnchor: 'middle'
                }
              }}
            />
            <Tooltip 
              formatter={(value: number) => `$${value.toFixed(2)}B`}
              contentStyle={{
                backgroundColor: 'rgba(0, 0, 0, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                color: 'white',
                fontSize: '12px',
                padding: '8px 12px',
                fontWeight: 500,
                backdropFilter: 'blur(8px)'
              }}
              labelStyle={{ 
                color: 'white', 
                fontWeight: 600,
                marginBottom: '4px'
              }}
              itemStyle={{
                color: 'white',
                padding: '2px 0'
              }}
            />
            {showExports && (
              <Bar 
                dataKey="exports" 
                fill="#ef4444" 
                name="Exports"
                onClick={(data) => handleBarClick(data, 'exports')}
                style={{ cursor: 'pointer' }}
              />
            )}
            {showImports && (
              <Bar 
                dataKey="imports" 
                fill="#3b82f6" 
                name="Imports"
                onClick={(data) => handleBarClick(data, 'imports')}
                style={{ cursor: 'pointer' }}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <Dialog 
        open={modalOpen} 
        onClose={() => setModalOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: 'rgba(15, 23, 42, 0.98)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            color: 'white',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
          }
        }}
      >
        <DialogTitle sx={{ 
          color: '#bfdbfe',
          fontWeight: 500,
          fontSize: '0.875rem',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <span>{selectedData?.type === 'imports' ? 'Import' : 'Export'} Composition ({selectedData?.year})</span>
          <IconButton
            onClick={() => setModalOpen(false)}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '1.2rem',
              padding: '4px',
              '&:hover': {
                color: 'white',
                backgroundColor: 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            ×
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: '24px' }}>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={selectedData?.data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label={(entry) => `${entry.percentage.toFixed(1)}%`}
                >
                  {selectedData?.data.map((entry, index) => (
                    <PieCell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend 
                  layout="vertical" 
                  align="right"
                  verticalAlign="middle"
                  formatter={(value) => {
                    const entry = selectedData?.data.find(d => d.name === value);
                    return `${value} (${entry?.percentage.toFixed(1)}%)`;
                  }}
                  wrapperStyle={{ 
                    color: 'rgba(255,255,255,0.8)',
                    fontSize: '12px',
                    lineHeight: '1.5'
                  }}
                />
                <Tooltip 
                  formatter={(value: number) => `$${value.toFixed(2)}B`}
                  contentStyle={{
                    backgroundColor: 'rgba(0, 0, 0, 0.95)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    color: 'white',
                    fontSize: '12px',
                    padding: '8px 12px',
                    fontWeight: 500,
                    backdropFilter: 'blur(8px)'
                  }}
                  labelStyle={{ 
                    color: 'white', 
                    fontWeight: 600,
                    marginBottom: '4px'
                  }}
                  itemStyle={{
                    color: 'white',
                    padding: '2px 0'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImportExportVisualization; 