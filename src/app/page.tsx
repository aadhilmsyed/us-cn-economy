'use client';
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import GDPVisualization from './components/GDPVisualization';
import RDVisualization from './components/RDVisualization';

export default function Dashboard() {
  const [usGDPData, setUSGDPData]= useState([]);
  const [chinaGDPData, setChinaGDPData] = useState([]);
  const [usRDData, setUSRDData] = useState([]);
  const [chinaRDData, setChinaRDData] = useState([]);

  useEffect(() => {
    const fetchData = async ()=> {
      const [usGDPResponse, chinaGDPResponse, usRDResponse, chinaRDResponse] = await Promise.all([
        fetch('/us_gdp_data.csv'),
        fetch('/china_gdp_data.csv'),
        fetch('/usa_rd.csv'),
        fetch('/china_rd.csv')
      ]);

      const usGDPText = await usGDPResponse.text();
      const chinaGDPText = await chinaGDPResponse.text();
      const usRDText = await usRDResponse.text();
      const chinaRDText = await chinaRDResponse.text();

      setUSGDPData(parseCSV(usGDPText));
      setChinaGDPData(parseCSV(chinaGDPText));
      setUSRDData(parseCSV(usRDText));
      setChinaRDData(parseCSV(chinaRDText));
    };

    fetchData();
  }, []);

  return (
    <main className={`${styles.main} pb-0`}>
      <div 
        className={styles.backgroundImage}
        style={{
          backgroundImage: 'url(/flag.jpg)'
        }}
      />
      
      <div className={styles.overlay} />
      
      <div className={`${styles.content} pb-[120px]`}>
        <div className="w-full px-4">
          <h1 
            className="text-3xl font-extrabold text-center mb-3 max-w-[1600px] mx-auto tracking-tight"
            style={{
              background: 'linear-gradient(90deg, #ff0000, #ffffff, #0000ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            China's Rise: Economic Opportunity or Threat to the US?
          </h1>

          <p className="text-base text-center text-white/80 mb-12 max-w-[800px] mx-auto">
            An interactive data visualization exploring the economic and technological relationship between the United States and China through analysis of trade patterns, R&D investments, technological development, and media sentiment.
          </p>

          {/* Key Metrics Grid */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* First Row */}
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">US GDP Growth</div>
                <div className="text-2xl font-bold text-white">2.1%</div>
                <div className="text-xs text-white/60 mt-1">2023</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">China GDP Growth</div>
                <div className="text-2xl font-bold text-white">5.2%</div>
                <div className="text-xs text-white/60 mt-1">2023</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">Trade Deficit</div>
                <div className="text-2xl font-bold text-white">$23.7B</div>
                <div className="text-xs text-white/60 mt-1">Jan 2024</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">US R&D Spending</div>
                <div className="text-2xl font-bold text-white">3.5%</div>
                <div className="text-xs text-white/60 mt-1">of GDP</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">China R&D Spending</div>
                <div className="text-2xl font-bold text-white">2.4%</div>
                <div className="text-xs text-white/60 mt-1">of GDP</div>
              </div>
              
              {/* Second Row */}
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">US Exports</div>
                <div className="text-2xl font-bold text-white">$2.06T</div>
                <div className="text-xs text-white/60 mt-1">to China</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">US Imports</div>
                <div className="text-2xl font-bold text-white">$3.37T</div>
                <div className="text-xs text-white/60 mt-1">from China</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">Total Deficit</div>
                <div className="text-2xl font-bold text-white">$5.4T+</div>
                <div className="text-xs text-white/60 mt-1">since 2000</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">US Patents</div>
                <div className="text-2xl font-bold text-white">340K</div>
                <div className="text-xs text-white/60 mt-1">2023</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">China Patents</div>
                <div className="text-2xl font-bold text-white">420K</div>
                <div className="text-xs text-white/60 mt-1">2023</div>
              </div>
            </div>
          </div>

          {/* Graphs Grid */}
          <div className="max-w-7xl mx-auto mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* First Row */}
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg h-[350px]">
                <GDPVisualization 
                  usData={usGDPData}
                  chinaData={chinaGDPData}
                  visualizationType="gdp"
                  title="US/China GDP (Trillions USD)"
                />
              </div>
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg h-[350px] relative">
                <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm rounded-lg" />
                <div className="relative h-full">
                  <GDPVisualization 
                    usData={usGDPData}
                    chinaData={chinaGDPData}
                    visualizationType="combined"
                    title="Growth Analysis"
                  />
                </div>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg h-[350px]">
                <RDVisualization 
                  usData={usRDData}
                  chinaData={chinaRDData}
                />
              </div>
            </div>
          </div>

          {/* New Grid for Import/Export Visualizations */}
          <div className="max-w-7xl mx-auto mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg h-[350px] md:col-span-2">
                Graph 4 (Import/Export)
              </div>
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg h-[350px]">
                Graph 5 (Trade Deficit)
              </div>
            </div>
          </div>

          {/* Info Section */}
          <div className="text-center text-white/80 text-sm max-w-4xl mx-auto px-4">
            <div className="mb-4">
              This website was built using Next.js 14, React 18, TypeScript, Chart.js, Tailwind CSS, and Framer Motion
            </div>
            <div>
              Data sourced from World Bank, US Census Bureau, US Patent Office, and World Integrated Trade Solution (WITS)
            </div>
          </div>
        </div>
      </div>
      
      <footer className="absolute bottom-0 left-0 right-0 text-center text-white text-sm py-6 bg-gradient-to-b from-black/70 to-black/90 backdrop-blur-sm z-50">
        <div className="text-white/80 text-xs">
          <div className="mb-2">
            © {new Date().getFullYear()} Aadhil Mubarak Syed. All Rights Reserved.
          </div>
          <div className="font-light">
            This page may not be reproduced or redistributed without permission from the owner.
          </div>
        </div>
      </footer>
    </main>
  );
}

function parseCSV(csv: string) {
  const lines= csv.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj: any, header, i) => {
      obj[header.trim()] = isNaN(Number(values[i])) ? values[i] : Number(values[i]);
      return obj;
    }, {});
  }).filter(row => !isNaN(row.Year));
}