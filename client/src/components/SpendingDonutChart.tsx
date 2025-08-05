import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import {
  Typography,
  Box,
} from '@mui/material';
import ChartCard from './ChartCard';

ChartJS.register(ArcElement, Tooltip, Legend);

interface DonutData {
  category: string;
  value: number;
}
interface Props {
  data: DonutData[];
  onClickCategory?: (cat: string) => void;
  selectedCategory?: string | null;
}

const SpendingDonutChart = ({ data = [], onClickCategory, selectedCategory }: Props) => {
  const categories = data.map(d => d.category);
  const amounts = data.map(d => d.value);

  const generateColors = (count: number) =>
    Array.from({ length: count }, (_, i) =>
      `hsl(${(i * 360) / count}, 70%, 60%)`
    );

  const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  });

  const chartData = {
    labels: categories,
    datasets: [
      {
        data: amounts,
        backgroundColor: generateColors(categories.length),
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 1000,
      easing: 'easeOutQuart'
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: (ctx: any) => {
            const label = ctx.label || '';
            const value = ctx.parsed || 0;
            return `${label}: ${currency.format(value)}`;
          }
        }
      },
      legend: {
        position: 'top' as const,
        labels: {
          boxWidth: 20,
          padding: 15
        },
        onClick: onClickCategory
          ? (_e: any, legendItem: any) => {
              const cat = legendItem.text;
              onClickCategory(cat);
            }
          : undefined
      }
    },
    onClick: onClickCategory
      ? (_e: any, elements: any, chart: any) => {
          if (elements.length > 0) {
            const idx = elements[0].index;
            const cat = chart.data.labels[idx];
            onClickCategory(cat);
          }
        }
      : undefined
  };

  return (
    <ChartCard title='Spending Breakdown'>
      {data.length === 0 ? (
        <Typography variant="body2" color="text.secondary" align="center">
          No data for selected filter.
        </Typography>
      ) : (
        <Box sx={{ height: 250, p: 2 }}>
          <Doughnut data={chartData} options={options} />
        </Box>
      )}
      {selectedCategory && (
        <Typography variant="caption" color="primary" align="center" display="block" mt={1}>
          Selected: {selectedCategory}
        </Typography>
      )}
    </ChartCard>
  );
};

export default SpendingDonutChart;