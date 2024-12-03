import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const [usGDPData, chinaGDPData, usRDData, chinaRDData, tradeData, techData] = await Promise.all([
      fs.readFile(path.join(process.cwd(), 'public/data/us_gdp.csv'), 'utf8'),
      fs.readFile(path.join(process.cwd(), 'public/data/china_gdp.csv'), 'utf8'),
      fs.readFile(path.join(process.cwd(), 'public/data/us_combined_rd.csv'), 'utf8'),
      fs.readFile(path.join(process.cwd(), 'public/data/china_combined_rd.csv'), 'utf8'),
      fs.readFile(path.join(process.cwd(), 'public/data/us_china_trade.csv'), 'utf8'),
      fs.readFile(path.join(process.cwd(), 'public/data/monthly_tech.csv'), 'utf8'),
    ]);

    // Parse CSV data
    const parseCSV = (csv: string) => {
      const [headers, ...rows] = csv.trim().split('\n');
      const headerArray = headers.split(',');
      
      return rows.map(row => {
        const values = row.split(',');
        return headerArray.reduce((obj: any, header, index) => {
          const value = values[index];
          obj[header] = isNaN(Number(value)) ? value : Number(value);
          return obj;
        }, {});
      });
    };

    return NextResponse.json({
      usGDP: parseCSV(usGDPData),
      chinaGDP: parseCSV(chinaGDPData),
      usRD: parseCSV(usRDData),
      chinaRD: parseCSV(chinaRDData),
      tradeData: parseCSV(tradeData),
      techData: parseCSV(techData)
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to load data' }, { status: 500 });
  }
} 