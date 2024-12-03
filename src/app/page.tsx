'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import ComparisonCard from './components/ComparisonCard';
import TradeBalanceChart from './components/TradeBalanceChart';
import TechTrendsChart from './components/TechTrendsChart';
import KPICard from './components/KPICard';
import Modal from './components/Modal';
import { processGDPData, processRDData, processTradeData, processTechTrends } from './utils/dataProcessing';
import styles from './page.module.css';
import ChartProvider from './components/ChartProvider';

const LineChart = dynamic(() => import('./components/LineChart'), { ssr: false });

interface ChartModalState {
  isOpen: boolean;
  title: string;
  content: React.ReactNode | null;
}

interface DataPoint {
  Year: number;
  GDP: number;
  'Growth Rate (%)': number;
  'R&D Spending (% of GDP)': number;
  Balance: number;
}

interface DashboardData {
  usGDP: DataPoint[];
  chinaGDP: DataPoint[];
  usRD: DataPoint[];
  chinaRD: DataPoint[];
  tradeData: {
    Year: number;
    Month: string;
    Exports: number;
    Imports: number;
    Balance: number;
  }[];
  techData: any[];
}

// Create a wrapper component to handle data fetching
export default function DashboardWrapper() {
  const [data, setData] = useState<DashboardData | null>(null);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/dashboard-data');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <Dashboard data={data} />;
}

function Dashboard({ data }: { data: DashboardData }) {
  const [modalState, setModalState] = useState<ChartModalState>({
    isOpen: false,
    title: '',
    content: null
  });

  const handleChartClick = (title: string, chart: React.ReactNode) => {
    setModalState({
      isOpen: true,
      title,
      content: chart
    });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, title: '', content: null });
  };

  const kpiMetrics = [
    {
      title: 'US-China Trade Balance',
      value: `$${Math.abs(data.tradeData[data.tradeData.length-1].Balance).toFixed(0)}B`,
      change: '2.3% vs Last Month',
      trend: 'up' as const,
      icon: 'fa-balance-scale'
    },
    {
      title: 'GDP Growth Rate',
      value: `${(data.chinaGDP[data.chinaGDP.length-1]['Growth Rate (%)']).toFixed(1)}%`,
      change: 'YoY',
      trend: 'up' as const,
      icon: 'fa-chart-line'
    },
    {
      title: 'R&D Investment Gap',
      value: `${(data.usRD[data.usRD.length-1]['R&D Spending (% of GDP)'] - 
              data.chinaRD[data.chinaRD.length-1]['R&D Spending (% of GDP)']).toFixed(1)}%`,
      change: 'US Lead',
      trend: 'neutral' as const,
      icon: 'fa-flask'
    }
  ];

  return (
    <ChartProvider>
      <main className={styles.main}>
        <div 
          className={styles.backgroundImage}
          style={{
            backgroundImage: 'url(/flag.jpg)'
          }}
        />
        
        <div className={styles.overlay} />
        
        <div className={styles.content}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-center mb-10 bg-gradient-to-r from-blue-600 via-white to-red-600 bg-clip-text text-transparent py-4 drop-shadow-lg">
              China's Economic Rise: A Threat to U.S. Dominance?
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
              {kpiMetrics.map((metric, index) => (
                <KPICard key={index} {...metric} />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div 
                onClick={() => handleChartClick('GDP Comparison', 
                  <LineChart
                    data={processGDPData(data.usGDP, data.chinaGDP)}
                    title="GDP Comparison"
                    yAxisLabel="GDP (Trillion USD)"
                  />
                )}
                className="cursor-pointer"
              >
                <LineChart
                  data={processGDPData(data.usGDP, data.chinaGDP)}
                  title="GDP Comparison"
                  yAxisLabel="GDP (Trillion USD)"
                />
              </div>

              <div 
                onClick={() => handleChartClick('R&D Investment', 
                  <LineChart
                    data={processRDData(data.usRD, data.chinaRD)}
                    title="R&D Investment"
                    yAxisLabel="R&D Spending (% of GDP)"
                  />
                )}
                className="cursor-pointer"
              >
                <LineChart
                  data={processRDData(data.usRD, data.chinaRD)}
                  title="R&D Investment"
                  yAxisLabel="R&D Spending (% of GDP)"
                />
              </div>

              <div 
                onClick={() => handleChartClick('Trade Balance', 
                  <TradeBalanceChart data={processTradeData(data.tradeData)} />
                )}
                className="cursor-pointer"
              >
                <TradeBalanceChart data={processTradeData(data.tradeData)} />
              </div>

              <div 
                onClick={() => handleChartClick('Technology Trends', 
                  <TechTrendsChart data={processTechTrends(data.techData)} />
                )}
                className="cursor-pointer"
              >
                <TechTrendsChart data={processTechTrends(data.techData)} />
              </div>
            </div>

            <Modal
              isOpen={modalState.isOpen}
              onClose={closeModal}
              title={modalState.title}
            >
              {modalState.content}
            </Modal>

            <footer className="mt-16 pb-8 text-center text-sm text-slate-400 border-t border-slate-700 pt-8">
              <p>© {new Date().getFullYear()} Aadhil Mubarak Syed. All rights reserved.</p>
              <p className="mt-2">Data sourced from public economic databases and government reports.</p>
              <p className="mt-1 text-xs text-slate-500">Developed as part of STA 141B coursework at UC Davis.</p>
            </footer>
          </div>
        </div>
      </main>
    </ChartProvider>
  );
} 