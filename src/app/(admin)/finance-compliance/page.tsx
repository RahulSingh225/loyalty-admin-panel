"use client"
import React, { useState } from 'react'
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Tabs,
  Tab,
  TextField,
  MenuItem,
  Select,
  IconButton,
  Checkbox
} from '@mui/material'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function FinanceCompliancePage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    }
  })

  const [activeTab, setActiveTab] = useState(0) // 0: Financial Overview, 1: Transactions

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue)
  }

  // --- CHART DATA ---
  const revenueTrendData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Revenue',
        data: [18000000, 19500000, 21000000, 19800000, 22000000, 23500000, 24500000, 23800000, 25200000, 24567890],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true,
      }
    ]
  }

  const revenueTrendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: false,
        ticks: { callback: (value: any) => '₹' + (value / 10000000).toFixed(1) + 'Cr' },
        grid: { display: false }
      },
      x: { grid: { display: false } }
    }
  }

  const pointsFlowData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
    datasets: [
      {
        label: 'Points Issued',
        data: [3200000, 3450000, 3800000, 3600000, 3900000, 4200000, 4523456, 4380000, 4650000, 4523456],
        backgroundColor: '#10B981',
        borderRadius: 5
      },
      {
        label: 'Points Redeemed',
        data: [2800000, 2950000, 3100000, 3050000, 3200000, 3350000, 3210987, 3180000, 3320000, 3210987],
        backgroundColor: '#F59E0B',
        borderRadius: 5
      }
    ]
  }

  const pointsFlowOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' as const } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { callback: (value: any) => '₹' + (value / 100000).toFixed(0) + 'L' },
        grid: { display: false }
      },
      x: { grid: { display: false } }
    }
  }

  if (status === "loading") {
    return <div>Loading...</div>
  }

  return (
    <Box sx={{ width: "100%" }}>
      {/* TABS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="finance tabs">
          <Tab label="Financial Overview" sx={{ textTransform: 'none', fontWeight: 500 }} />
          <Tab label="Transactions" sx={{ textTransform: 'none', fontWeight: 500 }} />
        </Tabs>
      </Box>

      {/* TAB CONTENT: FINANCIAL OVERVIEW */}
      <div role="tabpanel" hidden={activeTab !== 0}>
        {activeTab === 0 && (
          <Box>
            {/* 1. METRICS CARDS */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              {/* Total Revenue */}
              <Grid item xs={12} md={6} lg={3}>
                <div className="widget-card p-6 w-full h-full">
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <i className="fas fa-wallet text-blue-600 text-xl"></i>
                    </div>
                    <Typography variant="caption" color="text.secondary">This Month</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">₹2,45,67,890</Typography>
                  <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                  <Box display="flex" alignItems="center" mt={2} fontSize="0.875rem">
                    <span className="text-green-600 font-medium mr-2">+12.5%</span>
                    <span className="text-gray-500">vs last month</span>
                  </Box>
                </div>
              </Grid>

              {/* Points Issued */}
              <Grid item xs={12} md={6} lg={3}>
                <div className="widget-card p-6 w-full h-full">
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <div className="p-3 bg-green-100 rounded-lg">
                      <i className="fas fa-coins text-green-600 text-xl"></i>
                    </div>
                    <Typography variant="caption" color="text.secondary">This Month</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">₹45,23,456</Typography>
                  <Typography variant="body2" color="text.secondary">Points Issued</Typography>
                  <Box display="flex" alignItems="center" mt={2} fontSize="0.875rem">
                    <span className="text-green-600 font-medium mr-2">+8.3%</span>
                    <span className="text-gray-500">vs last month</span>
                  </Box>
                </div>
              </Grid>

              {/* Points Redeemed */}
              <Grid item xs={12} md={6} lg={3}>
                <div className="widget-card p-6 w-full h-full">
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <i className="fas fa-exchange-alt text-purple-600 text-xl"></i>
                    </div>
                    <Typography variant="caption" color="text.secondary">This Month</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">₹32,10,987</Typography>
                  <Typography variant="body2" color="text.secondary">Points Redeemed</Typography>
                  <Box display="flex" alignItems="center" mt={2} fontSize="0.875rem">
                    <span className="text-red-600 font-medium mr-2">-3.2%</span>
                    <span className="text-gray-500">vs last month</span>
                  </Box>
                </div>
              </Grid>

              {/* Active Points Value */}
              <Grid item xs={12} md={6} lg={3}>
                <div className="widget-card p-6 w-full h-full">
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <div className="p-3 bg-orange-100 rounded-lg">
                      <i className="fas fa-chart-line text-orange-600 text-xl"></i>
                    </div>
                    <Typography variant="caption" color="text.secondary">Current</Typography>
                  </Box>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">₹1,23,45,678</Typography>
                  <Typography variant="body2" color="text.secondary">Active Points Value</Typography>
                  <Box display="flex" alignItems="center" mt={2} fontSize="0.875rem">
                    <span className="text-green-600 font-medium mr-2">+15.7%</span>
                    <span className="text-gray-500">growth</span>
                  </Box>
                </div>
              </Grid>
            </Grid>

            {/* 2. CHARTS */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} lg={6}>
                <div className="widget-card p-6 w-full">
                  <Typography variant="h6" fontWeight="600" mb={3}>Revenue Trend</Typography>
                  <Box sx={{ height: 300 }}>
                    <Line data={revenueTrendData} options={revenueTrendOptions} />
                  </Box>
                </div>
              </Grid>
              <Grid item xs={12} lg={6}>
                <div className="widget-card p-6 w-full">
                  <Typography variant="h6" fontWeight="600" mb={3}>Points Flow Analysis</Typography>
                  <Box sx={{ height: 300 }}>
                    <Bar data={pointsFlowData} options={pointsFlowOptions} />
                  </Box>
                </div>
              </Grid>
            </Grid>

            {/* 3. RECENT TRANSACTIONS (Preview) */}
            <div className="widget-card p-6 w-full">
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="600">Recent Transactions</Typography>
                <Button size="small" sx={{ textTransform: 'none' }} onClick={() => setActiveTab(1)}>View All</Button>
              </Box>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Transaction ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Date</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Member</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { id: 'TXN001234', date: 'Oct 25, 2023', type: 'Credit', member: 'John Doe', amount: '₹1,250', status: 'Completed', badgeColor: 'badge-success', typeBadge: 'badge-success' },
                      { id: 'TXN001235', date: 'Oct 25, 2023', type: 'Debit', member: 'Jane Smith', amount: '₹850', status: 'Completed', badgeColor: 'badge-success', typeBadge: 'badge-danger' },
                      { id: 'TXN001236', date: 'Oct 24, 2023', type: 'Credit', member: 'Robert Johnson', amount: '₹2,100', status: 'Pending', badgeColor: 'badge-warning', typeBadge: 'badge-success' },
                    ].map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium text-gray-900">{row.id}</TableCell>
                        <TableCell className="text-gray-500">{row.date}</TableCell>
                        <TableCell><span className={`badge ${row.typeBadge}`}>{row.type}</span></TableCell>
                        <TableCell className="text-gray-500">{row.member}</TableCell>
                        <TableCell className="font-medium text-gray-900">{row.amount}</TableCell>
                        <TableCell><span className={`badge ${row.badgeColor}`}>{row.status}</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Box>
        )}
      </div>

      {/* TAB CONTENT: TRANSACTIONS */}
      <div role="tabpanel" hidden={activeTab !== 1}>
        {activeTab === 1 && (
          <Box>
            {/* 1. FILTERS */}
            <div className="widget-card p-6 w-full mb-6">
              <Box display="flex" flexWrap="wrap" gap={3} mb={2}>
                <Box flex={1} minWidth={200}>
                  <Typography variant="subtitle2" mb={1}>Date Range</Typography>
                  <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </Box>
                <Box flex={1} minWidth={200}>
                  <Typography variant="subtitle2" mb={1}>End Date</Typography>
                  <input type="date" className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500" />
                </Box>
                <Box flex={1} minWidth={200}>
                  <Typography variant="subtitle2" mb={1}>Transaction Type</Typography>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500">
                    <option value="">All Types</option>
                    <option value="credit">Credit</option>
                    <option value="debit">Debit</option>
                    <option value="refund">Refund</option>
                  </select>
                </Box>
                <Box flex={1} minWidth={200}>
                  <Typography variant="subtitle2" mb={1}>Status</Typography>
                  <select className="w-full border border-gray-300 rounded px-3 py-2 text-sm outline-none focus:border-blue-500">
                    <option value="">All Status</option>
                    <option value="completed">Completed</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </Box>
                <Box display="flex" alignItems="flex-end">
                  <Button variant="contained" sx={{ textTransform: 'none', height: '38px', mb: '1px' }}>
                    <i className="fas fa-filter mr-2"></i> Apply Filters
                  </Button>
                </Box>
              </Box>
            </div>

            {/* 2. TRANSACTION SUMMARY */}
            <Grid container spacing={2} sx={{ mb: 6 }}>
              <Grid item xs={12} md={3}>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Typography variant="body2" color="text.secondary">Total Transactions</Typography>
                  <Typography variant="h5" fontWeight="bold" color="text.primary">1,234</Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Typography variant="body2" color="text.secondary">Total Credits</Typography>
                  <Typography variant="h5" fontWeight="bold" className="text-green-600">₹45,67,890</Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <Typography variant="body2" color="text.secondary">Total Debits</Typography>
                  <Typography variant="h5" fontWeight="bold" className="text-red-600">₹23,45,678</Typography>
                </div>
              </Grid>
              <Grid item xs={12} md={3}>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <Typography variant="body2" color="text.secondary">Net Balance</Typography>
                  <Typography variant="h5" fontWeight="bold" className="text-purple-600">₹22,22,212</Typography>
                </div>
              </Grid>
            </Grid>

            {/* 3. FULL TRANSACTIONS TABLE */}
            <div className="widget-card rounded-xl shadow p-6 w-full">
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead>
                    <TableRow>
                      <TableCell padding="checkbox"><Checkbox /></TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Transaction ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Date & Time</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Type</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Member ID</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Member Name</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Description</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Amount</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: 'text.secondary', textTransform: 'uppercase' }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { id: 'TXN001234', date: 'Oct 25, 2023 10:30 AM', type: 'Credit', memId: 'MEM001', memName: 'John Doe', desc: 'Purchase Reward', amt: '₹1,250', status: 'Completed', typeBadge: 'badge-success', statusBadge: 'badge-success' },
                      { id: 'TXN001235', date: 'Oct 25, 2023 09:45 AM', type: 'Debit', memId: 'MEM002', memName: 'Jane Smith', desc: 'Redemption', amt: '₹850', status: 'Completed', typeBadge: 'badge-danger', statusBadge: 'badge-success' },
                      { id: 'TXN001236', date: 'Oct 24, 2023 04:20 PM', type: 'Refund', memId: 'MEM003', memName: 'Robert Johnson', desc: 'Order Cancellation', amt: '₹2,100', status: 'Pending', typeBadge: 'badge-warning', statusBadge: 'badge-warning' },
                    ].map((row) => (
                      <TableRow key={row.id}>
                        <TableCell padding="checkbox"><Checkbox /></TableCell>
                        <TableCell className="font-medium text-gray-900">{row.id}</TableCell>
                        <TableCell className="text-gray-500">{row.date}</TableCell>
                        <TableCell><span className={`badge ${row.typeBadge}`}>{row.type}</span></TableCell>
                        <TableCell className="text-gray-500">{row.memId}</TableCell>
                        <TableCell className="text-gray-500">{row.memName}</TableCell>
                        <TableCell className="text-gray-500">{row.desc}</TableCell>
                        <TableCell className="font-medium text-gray-900">{row.amt}</TableCell>
                        <TableCell><span className={`badge ${row.statusBadge}`}>{row.status}</span></TableCell>
                        <TableCell>
                          <button className="text-blue-600 hover:text-blue-900 mr-2 text-sm font-medium border-none bg-transparent cursor-pointer">View</button>
                          <button className="text-green-600 hover:text-green-900 mr-2 text-sm font-medium border-none bg-transparent cursor-pointer">Edit</button>
                          <button className="text-red-600 hover:text-red-900 text-sm font-medium border-none bg-transparent cursor-pointer">Cancel</button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* PAGINATION */}
              <Box display="flex" justifyContent="space-between" alignItems="center" mt={3}>
                <Typography variant="body2" color="text.secondary">Showing 1 to 10 of 1,234 entries</Typography>
                <Box display="flex" gap={1}>
                  <Button size="small" variant="outlined" sx={{ minWidth: 'auto' }}>Previous</Button>
                  <Button size="small" variant="contained" sx={{ minWidth: 'auto' }}>1</Button>
                  <Button size="small" variant="outlined" sx={{ minWidth: 'auto' }}>2</Button>
                  <Button size="small" variant="outlined" sx={{ minWidth: 'auto' }}>3</Button>
                  <Button size="small" variant="outlined" sx={{ minWidth: 'auto' }}>Next</Button>
                </Box>
              </Box>
            </div>
          </Box>
        )}
      </div>
    </Box>
  )
}