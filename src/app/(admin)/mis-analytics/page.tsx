'use client';

import { Box, Typography, Card, CardContent } from '@mui/material';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamically import charts to avoid SSR issues
const LineChart = dynamic(() => import('react-chartjs-2').then(mod => mod.Line), { ssr: false });
const DoughnutChart = dynamic(() => import('react-chartjs-2').then(mod => mod.Doughnut), { ssr: false });
const BarChart = dynamic(() => import('react-chartjs-2').then(mod => mod.Bar), { ssr: false });
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function MISAnalyticsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    }
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  // Sample data for charts
  const membershipData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'New Members',
        data: [320, 450, 380, 490, 550, 480],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.4,
      }
    ]
  };

  const pointsDistributionData = {
    labels: ['Purchases', 'Referrals', 'Promotions', 'Events', 'Others'],
    datasets: [
      {
        data: [45, 20, 15, 12, 8],
        backgroundColor: [
          '#2563eb',
          '#10b981',
          '#f59e0b',
          '#8b5cf6',
          '#ec4899',
        ],
      }
    ]
  };

  const redemptionTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Points Redeemed',
        data: [25000, 32000, 28000, 35000, 40000, 38000],
        backgroundColor: '#10b981',
        borderRadius: 5,
      }
    ]
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        MIS & Analytics
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Insights and analytics for your loyalty program
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' }, gap: 3 }}>
        {/* Membership Growth */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Membership Growth
            </Typography>
            <Box sx={{ height: 300 }}>
              <LineChart data={membershipData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: false,
                    }
                  },
                  x: {
                    grid: {
                      display: false,
                    }
                  }
                }
              }} />
            </Box>
          </CardContent>
        </Card>

        {/* Points Distribution */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Points Distribution
            </Typography>
            <Box sx={{ height: 300 }}>
              <DoughnutChart data={pointsDistributionData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right' as const,
                  }
                }
              }} />
            </Box>
          </CardContent>
        </Card>

        {/* Redemption Trends */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Redemption Trends
            </Typography>
            <Box sx={{ height: 300 }}>
              <BarChart data={redemptionTrendsData} options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      display: false,
                    }
                  },
                  x: {
                    grid: {
                      display: false,
                    }
                  }
                }
              }} />
            </Box>
          </CardContent>
        </Card>

        {/* Key Metrics Summary */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Key Metrics
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Active Members
                </Typography>
                <Typography variant="h4">
                  8,432
                </Typography>
                <Typography variant="body2" color="success.main">
                  +12.5% vs last month
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Average Points/Member
                </Typography>
                <Typography variant="h4">
                  2,850
                </Typography>
                <Typography variant="body2" color="success.main">
                  +8.3% vs last month
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Redemption Rate
                </Typography>
                <Typography variant="h4">
                  68%
                </Typography>
                <Typography variant="body2" color="success.main">
                  +5.2% vs last month
                </Typography>
              </Box>
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Member Retention
                </Typography>
                <Typography variant="h4">
                  92%
                </Typography>
                <Typography variant="body2" color="success.main">
                  +2.1% vs last month
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}