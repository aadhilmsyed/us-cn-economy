interface Point {
  x: number;
  y: number;
}

export function linearRegression(points: Point[]) {
  const n = points.length;
  let sumX = 0;
  let sumY = 0;
  let sumXY = 0;
  let sumXX = 0;

  for (const point of points) {
    sumX += point.x;
    sumY += point.y;
    sumXY += point.x * point.y;
    sumXX += point.x * point.x;
  }

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  return { slope, intercept };
}

export function polynomialRegression(points: Point[], degree: number = 2) {
  // Normalize x values to prevent numerical instability
  const xValues = points.map(p => p.x);
  const xMin = Math.min(...xValues);
  const xMax = Math.max(...xValues);
  
  // Simple polynomial fit using least squares
  const coefficients = new Array(degree + 1).fill(0);
  
  // Helper function to calculate polynomial value
  const calculatePolynomial = (x: number, coeffs: number[]): number => {
    const normalizedX = (x - xMin) / (xMax - xMin);
    return coeffs.reduce((sum, coeff, power) => 
      sum + coeff * Math.pow(normalizedX, power), 0);
  };

  // Gradient descent to find coefficients
  const learningRate = 0.0001;
  const iterations = 1000;
  
  for (let iter = 0; iter < iterations; iter++) {
    for (const point of points) {
      const normalizedX = (point.x - xMin) / (xMax - xMin);
      const predicted = calculatePolynomial(point.x, coefficients);
      const error = predicted - point.y;
      
      // Update coefficients
      for (let j = 0; j <= degree; j++) {
        coefficients[j] -= learningRate * error * Math.pow(normalizedX, j);
      }
    }
  }

  // Return a function that computes the polynomial value
  return (x: number) => calculatePolynomial(x, coefficients);
}

// Matrix operations helpers
function transpose(matrix: number[][]): number[][] {
  return matrix[0].map((_, i) => matrix.map(row => row[i]));
}

function multiply(a: number[][], b: number[][]): number[][] {
  const result: number[][] = [];
  for (let i = 0; i < a.length; i++) {
    result[i] = [];
    for (let j = 0; j < b[0].length; j++) {
      result[i][j] = a[i].reduce((sum, val, k) => sum + val * b[k][j], 0);
    }
  }
  return result;
}

function solve(A: number[][], b: number[]): number[] {
  const n = A.length;
  const augmented = A.map((row, i) => [...row, b[i]]);

  // Gaussian elimination
  for (let i = 0; i < n; i++) {
    let maxRow = i;
    for (let j = i + 1; j < n; j++) {
      if (Math.abs(augmented[j][i]) > Math.abs(augmented[maxRow][i])) {
        maxRow = j;
      }
    }
    [augmented[i], augmented[maxRow]] = [augmented[maxRow], augmented[i]];
    
    for (let j = i + 1; j < n; j++) {
      const factor = augmented[j][i] / augmented[i][i];
      for (let k = i; k <= n; k++) {
        augmented[j][k] -= factor * augmented[i][k];
      }
    }
  }

  // Back substitution
  const x = new Array(n).fill(0);
  for (let i = n - 1; i >= 0; i--) {
    x[i] = augmented[i][n];
    for (let j = i + 1; j < n; j++) {
      x[i] -= augmented[i][j] * x[j];
    }
    x[i] /= augmented[i][i];
  }

  return x;
}

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