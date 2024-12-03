export const processGDPData = (usGDP: any[], chinaGDP: any[]) => {
  const years = usGDP.map(d => d.Year);
  const usValues = usGDP.map(d => d.GDP / 1e12); // Convert to trillion
  const chinaValues = chinaGDP.map(d => d.GDP / 1e12);

  return {
    labels: years,
    datasets: [
      {
        label: 'US GDP (Trillion USD)',
        data: usValues,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'China GDP (Trillion USD)',
        data: chinaValues,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
};

export const processRDData = (usRD: any[], chinaRD: any[]) => {
  const years = usRD.map(d => d.Year);
  const usValues = usRD.map(d => d['R&D Spending (% of GDP)']);
  const chinaValues = chinaRD.map(d => d['R&D Spending (% of GDP)']);

  return {
    labels: years,
    datasets: [
      {
        label: 'US R&D Spending (% of GDP)',
        data: usValues,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
      {
        label: 'China R&D Spending (% of GDP)',
        data: chinaValues,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };
};

export const processTradeData = (tradeData: any[]) => {
  // Group by year and calculate annual totals
  const yearlyData = tradeData.reduce((acc: any, curr: any) => {
    const year = curr.Year;
    if (!acc[year]) {
      acc[year] = {
        exports: 0,
        imports: 0,
        balance: 0
      };
    }
    acc[year].exports += parseFloat(curr.Exports);
    acc[year].imports += parseFloat(curr.Imports);
    acc[year].balance += parseFloat(curr.Balance);
    return acc;
  }, {});

  const years = Object.keys(yearlyData).sort();
  const balances = years.map(year => yearlyData[year].balance);

  return {
    labels: years,
    datasets: [
      {
        label: 'Trade Balance',
        data: balances,
        backgroundColor: balances.map(b => b < 0 ? 'rgba(255, 99, 132, 0.5)' : 'rgba(53, 162, 235, 0.5)'),
        borderColor: balances.map(b => b < 0 ? 'rgb(255, 99, 132)' : 'rgb(53, 162, 235)'),
        borderWidth: 1
      }
    ]
  };
};

export const processTechTrends = (techData: any[]) => {
  const latestMonths = techData.slice(-12);
  const labels = latestMonths.map(d => d.Month_Year);
  const technologies = ['artificial intelligence', 'robotics', 'cybersecurity', 'quantum computing'];

  return {
    labels,
    datasets: technologies.map((tech, index) => ({
      label: tech,
      data: latestMonths.map(d => d[tech] || 0),
      borderColor: `hsl(${index * 90}, 70%, 50%)`,
      backgroundColor: `hsla(${index * 90}, 70%, 50%, 0.5)`,
    }))
  };
}; 