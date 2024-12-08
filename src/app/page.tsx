'use client';
import styles from './page.module.css';
import { useState, useEffect } from 'react';
import GDPVisualization from './components/GDPVisualization';
import RDVisualization from './components/RDVisualization';
import ImportExportVisualization from './components/ImportExportVisualization';
import TradeDeficitVisualization from './components/TradeDeficitVisualization';
import TrendIndicator from './components/TrendIndicator';

export default function Dashboard() {
  const [usGDPData, setUSGDPData] = useState<any[]>([]);
  const [chinaGDPData, setChinaGDPData] = useState<any[]>([]);
  const [usRDData, setUSRDData] = useState<any[]>([]);
  const [chinaRDData, setChinaRDData] = useState<any[]>([]);
  const [productsData, setProductsData] = useState<string>('');
  const [tradeData, setTradeData] = useState<string>('');

  useEffect(() => {
    const fetchData = async ()=> {
      const [usGDPResponse, chinaGDPResponse, usRDResponse, chinaRDResponse, productsResponse, tradeResponse] = await Promise.all([
        fetch('/us_gdp_data.csv'),
        fetch('/china_gdp_data.csv'),
        fetch('/usa_rd.csv'),
        fetch('/china_rd.csv'),
        fetch('/products.csv'),
        fetch('/trade_data.csv')
      ]);

      const usGDPText = await usGDPResponse.text();
      const chinaGDPText = await chinaGDPResponse.text();
      const usRDText = await usRDResponse.text();
      const chinaRDText = await chinaRDResponse.text();
      const productsText = await productsResponse.text();
      const tradeText = await tradeResponse.text();

      setUSGDPData(parseCSV(usGDPText));
      setChinaGDPData(parseCSV(chinaGDPText));
      setUSRDData(parseCSV(usRDText));
      setChinaRDData(parseCSV(chinaRDText));
      setProductsData(productsText);
      setTradeData(tradeText);
    };

    fetchData();
  }, []);

  return (
    <main className={`${styles.main} flex flex-col min-h-screen`}>
      <div 
        className={styles.backgroundImage}
        style={{
          backgroundImage: 'url(/flag.jpg)'
        }}
      />
      
      <div className={styles.overlay} />
      
      <div className={`${styles.content} flex-1`}>
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
            An interactive visualization dashboard exploring the economic threat of China to the United States through analysis of trade patterns, R&D investments, technological development, and media sentiment.
          </p>

          {/* Key Metrics Grid */}
          <div className="max-w-7xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* First Row */}
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">US GDP Growth</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-2xl font-bold text-white">6.3%</div>
                  {usGDPData.length > 0 && (
                    <TrendIndicator
                      currentValue={6.28}
                      previousValue={9.11}
                      precision={1}
                    />
                  )}
                </div>
                <div className="text-xs text-white/60 mt-1">2023</div>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">China GDP Growth</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-2xl font-bold text-white">-0.5%</div>
                  {chinaGDPData.length > 0 && (
                    <TrendIndicator
                      currentValue={-0.49}
                      previousValue={0.34}
                      precision={1}
                    />
                  )}
                </div>
                <div className="text-xs text-white/60 mt-1">2023</div>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">Trade Deficit</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-2xl font-bold text-white">$23.7B</div>
                  <TrendIndicator
                    currentValue={23.72}  // Jan 2024
                    previousValue={22.01}  // Dec 2023
                    precision={1}
                  />
                </div>
                <div className="text-xs text-white/60 mt-1">Jan 2024</div>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">US R&D Spending</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-2xl font-bold text-white">3.5%</div>
                  {usRDData.length > 0 && (
                    <TrendIndicator
                      currentValue={3.46}  // 2020 value
                      previousValue={3.17}  // 2019 value
                      precision={2}
                    />
                  )}
                </div>
                <div className="text-xs text-white/60 mt-1">of GDP</div>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">China R&D Spending</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-2xl font-bold text-white">2.4%</div>
                  {chinaRDData.length > 0 && (
                    <TrendIndicator
                      currentValue={2.41}  // 2020 value
                      previousValue={2.24}  // 2019 value
                      precision={2}
                    />
                  )}
                </div>
                <div className="text-xs text-white/60 mt-1">of GDP</div>
              </div>
              
              {/* Second Row */}
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">US Exports</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-2xl font-bold text-white">$2.06T</div>
                  <TrendIndicator
                    currentValue={12.07}  // Jan 2024 exports
                    previousValue={13.04}  // Jan 2023 exports
                    precision={1}
                  />
                </div>
                <div className="text-xs text-white/60 mt-1">to China (2024)</div>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">US Imports</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-2xl font-bold text-white">$3.37T</div>
                  <TrendIndicator
                    currentValue={35.79}  // Jan 2024 imports
                    previousValue={38.18}  // Jan 2023 imports
                    precision={1}
                  />
                </div>
                <div className="text-xs text-white/60 mt-1">from China (2024)</div>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">Total Deficit</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-2xl font-bold text-white">$5.4T+</div>
                  <TrendIndicator
                    currentValue={5.4}  // 2023 total
                    previousValue={5.1}  // 2022 total
                    precision={1}
                  />
                </div>
                <div className="text-xs text-white/60 mt-1">since 2000</div>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">US Patents</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-2xl font-bold text-white">340K</div>
                  <TrendIndicator
                    currentValue={340}  // 2023
                    previousValue={375}  // 2022
                    precision={1}
                  />
                </div>
                <div className="text-xs text-white/60 mt-1">2023</div>
              </div>
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg text-center">
                <div className="text-blue-200 font-medium mb-2">China Patents</div>
                <div className="flex items-center justify-center gap-2">
                  <div className="text-2xl font-bold text-white">420K</div>
                  <TrendIndicator
                    currentValue={420}  // 2023
                    previousValue={395}  // 2022
                    precision={1}
                  />
                </div>
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
          <div className="max-w-7xl mx-auto mb-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg h-[350px] md:col-span-2">
                <ImportExportVisualization data={productsData} productsData={productsData} />
              </div>
              <div className="bg-slate-900/40 backdrop-blur-sm p-4 rounded-lg h-[350px]">
                <TradeDeficitVisualization data={tradeData} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="relative mt-auto">
        {/* Dark background overlay for footer */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/98 to-black pointer-events-none" />
        
        {/* Additional solid background for better contrast */}
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm pointer-events-none" />
        
        {/* Border line with better visibility */}
        <div className="absolute top-0 inset-x-0 h-px bg-white/20" />
        
        {/* Footer content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
            {/* Left half - About */}
            <div className="text-center md:text-left">
              <h3 className="text-blue-200 font-semibold text-sm mb-2">
                About This Dashboard
              </h3>
              <p className="text-white/90 text-xs leading-relaxed">
                This interface was developed for our STA 141B Final Project to assess China's 
                economic rise as a potential threat to the United States. Using advanced web 
                scraping and API technologies, we gathered data on GDP, R&D spending, and trade 
                patterns. Our analysis visualizes the economic interdependence between both 
                nations, as well as China's advancements in technology and research.
              </p>
            </div>

            {/* Right half - Data Sources & Technologies side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center md:text-left">
                <h3 className="text-blue-200 font-semibold text-sm mb-2">
                  Data Sources
                </h3>
                <p className="text-white/90 text-xs leading-relaxed">
                  <a 
                    href="https://data.worldbank.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-200 transition-colors duration-200"
                  >
                    World Bank
                  </a><br />
                  <a 
                    href="https://www.census.gov/foreign-trade/balance/c5700.html" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-200 transition-colors duration-200"
                  >
                    US Census Bureau
                  </a><br />
                  <a 
                    href="https://www.uspto.gov/patents/stats" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-200 transition-colors duration-200"
                  >
                    US Patent Office
                  </a><br />
                  <a 
                    href="https://wits.worldbank.org/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-200 transition-colors duration-200"
                  >
                    World Integrated Trade Solution (WITS)
                  </a>
                </p>
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-blue-200 font-semibold text-sm mb-2">
                  Technologies Used
                </h3>
                <div className="text-white/90 text-xs leading-relaxed">
                  <div className="mb-2">
                    <span className="text-blue-200">Data Collection:</span> BeautifulSoup4, Pandas, NumPy
                  </div>
                  <div className="mb-2">
                    <span className="text-blue-200">Frontend:</span> Next.js 14, React 18, Tailwind CSS
                  </div>
                  <div className="mb-2">
                    <span className="text-blue-200">Backend:</span> Node.js, TypeScript, Python, FastAPI
                  </div>
                  <div>
                    <span className="text-blue-200">Graphs:</span> Recharts, Material-UI, Framer Motion
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright section */}
          <div className="mt-8 pt-6 border-t border-white/20 text-center">
            <p className="text-white/90 text-xs">
              © {new Date().getFullYear()} Aadhil Mubarak Syed. All Rights Reserved.
            </p>
            <p className="text-white/70 text-xs mt-1">
              This page may not be reproduced or redistributed without permission from the owner.
            </p>
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