import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartCard from './ChartCard';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  annotationPlugin
);

interface TrendChartProps {
  title?: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor: string;
    backgroundColor?: string;
    fill?: boolean;
  }[];
  currencyFormatter?: Intl.NumberFormat;
  threshold?: number; // e.g. max budget line
}

const TrendChart = ({ title, labels, datasets, currencyFormatter, threshold }: TrendChartProps) => {
  const allValues = datasets.flatMap(d => d.data);
  const avg = allValues.reduce((a, b) => a + b, 0) / allValues.length;

  const data = { labels, datasets };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      title: { display: false },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        callbacks: {
          label: function (ctx: any) {
            const label = ctx.dataset.label || '';
            const value = ctx.parsed.y || 0;
            return `${label}: ${
              currencyFormatter ? currencyFormatter.format(value) : `$${value.toFixed(2)}`
            }`;
          }
        }
      },
      annotation: {
        annotations: {
          ...(threshold && {
            thresholdLine: {
              type: 'line',
              yMin: threshold,
              yMax: threshold,
              borderColor: 'orange',
              borderWidth: 2,
              borderDash: [6, 6],
              label: {
                content: `Budget Limit: ${currencyFormatter?.format(threshold) || `$${threshold}`}`,
                enabled: true,
                position: 'start',
                backgroundColor: 'rgba(255,165,0,0.2)',
                color: 'orange'
              }
            }
          }),
          avgLine: {
            type: 'line',
            yMin: avg,
            yMax: avg,
            borderColor: 'gray',
            borderWidth: 1,
            borderDash: [4, 4],
            label: {
              content: `Avg: ${currencyFormatter?.format(avg) || `$${avg.toFixed(2)}`}`,
              enabled: true,
              position: 'end',
              backgroundColor: 'rgba(0,0,0,0.1)',
              color: 'gray'
            }
          }
        }
      }
    },
    interaction: {
      mode: 'index' as const,
      intersect: false
    },
    hover: {
      mode: 'nearest' as const,
      intersect: false
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 45,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <ChartCard title={title || 'Spending Trend'}>
      <Line data={data} options={options} />
    </ChartCard>
  );
};

export default TrendChart;
