"use client"

import React, { useState } from 'react'
import {
  Box,
  Grid,
  Card,
  Typography,
  Button,
  Tabs,
  Tab,
  Select,
  MenuItem,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  LinearProgress,
  IconButton
} from '@mui/material'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function MISAnalyticsPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    }
  })

  const [activeTab, setActiveTab] = useState(0)

  // --- CHART DATA ---
  // Executive: Points Alloted
  const pointsAllotedData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'Points Alloted',
      data: [35000, 38000, 42000, 40000, 43500, 45230],
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  }

  // Executive: Member Growth
  const memberGrowthData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{
      label: 'New Members',
      data: [1200, 1350, 1500, 1800, 2100, 2450],
      backgroundColor: '#10b981',
      borderRadius: 4
    }]
  }

  // Performance: Transaction Volume
  const transactionVolumeData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Volume',
      data: [150, 230, 180, 320, 290, 140, 190],
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  }

  // Performance: Category Perf (Bar)
  const categoryPerfData = {
    labels: ['Wires', 'Switches', 'Lights', 'Fans', 'MCBs'],
    datasets: [{
      label: 'Sales (Lakhs)',
      data: [23.4, 18.7, 15.4, 12.1, 9.8],
      backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'],
      borderRadius: 4
    }]
  }

  // Member Analytics: Segmentation (Doughnut)
  const memberSegData = {
    labels: ['Electricians', 'Retailers', 'Contractors', 'Builders'],
    datasets: [{
      data: [45, 25, 20, 10],
      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
      hoverOffset: 4
    }]
  }

  // Campaign Analytics: Perf Trend
  const campaignTrendData = {
    labels: ['W1', 'W2', 'W3', 'W4'],
    datasets: [
      {
        label: 'Reach',
        data: [5000, 12000, 28000, 45000],
        borderColor: '#3b82f6',
        tension: 0.4
      },
      {
        label: 'Conversion',
        data: [100, 350, 980, 1850],
        borderColor: '#10b981',
        tension: 0.4
      }
    ]
  }

  // Campaign Analytics: Channel Effectiveness
  const channelEffectData = {
    labels: ['SMS', 'WhatsApp', 'Email', 'Push Notif'],
    datasets: [{
      label: 'Conversion Rate %',
      data: [12, 28, 5, 8],
      backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
      borderRadius: 4
    }]
  }

  if (status === 'loading') return <div>Loading...</div>

  return (
    <Box sx={{ width: '100%' }}>
      {/* TABS */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, val) => setActiveTab(val)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, minWidth: 'auto' } }}
        >
          <Tab label="Executive Dashboard" />
          <Tab label="Performance Metrics" />
          <Tab label="Member Analytics" />
          <Tab label="Campaign Analytics" />
          <Tab label="Reports" />
        </Tabs>
      </Box>

      {/* --- TAB 0: EXECUTIVE DASHBOARD --- */}
      <div role="tabpanel" hidden={activeTab !== 0}>
        {activeTab === 0 && (
          <Box>
            {/* KPI CARDS */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} md={6} lg={3}>
                <div className="text-white rounded-xl p-6 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" fontWeight="600">Total Points</Typography>
                    <i className="fas fa-star opacity-50 text-2xl"></i>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" mb={1}>45,230</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>This Quarter</Typography>
                  <Box mt={2} display="flex" alignItems="center" fontSize="0.875rem">
                    <i className="fas fa-arrow-up mr-1"></i> 18.5% from last quarter
                  </Box>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <div className="text-white rounded-xl p-6 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" fontWeight="600">Active Members</Typography>
                    <i className="fas fa-users opacity-50 text-2xl"></i>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" mb={1}>45,678</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Registered</Typography>
                  <Box mt={2} display="flex" alignItems="center" fontSize="0.875rem">
                    <i className="fas fa-arrow-up mr-1"></i> 12.3% growth
                  </Box>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <div className="text-white rounded-xl p-6 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" fontWeight="600">Engagement</Typography>
                    <i className="fas fa-chart-line opacity-50 text-2xl"></i>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" mb={1}>78.5%</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Monthly Active</Typography>
                  <Box mt={2} display="flex" alignItems="center" fontSize="0.875rem">
                    <i className="fas fa-arrow-up mr-1"></i> 5.2% improvement
                  </Box>
                </div>
              </Grid>
              <Grid item xs={12} md={6} lg={3}>
                <div className="text-white rounded-xl p-6 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="h6" fontWeight="600">Redemption</Typography>
                    <i className="fas fa-gift opacity-50 text-2xl"></i>
                  </Box>
                  <Typography variant="h4" fontWeight="bold" mb={1}>42.3%</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>Points Redeemed</Typography>
                  <Box mt={2} display="flex" alignItems="center" fontSize="0.875rem">
                    <i className="fas fa-arrow-down mr-1"></i> 2.1% from last month
                  </Box>
                </div>
              </Grid>
            </Grid>

            {/* CHARTS */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} lg={6}>
                <div className="widget-card p-6 w-full h-full">
                  <Typography variant="h6" fontWeight="600" mb={3}>Points Alloted Trend</Typography>
                  <Box height={250}>
                    <Line data={pointsAllotedData} options={{ maintainAspectRatio: false }} />
                  </Box>
                </div>
              </Grid>
              <Grid item xs={12} lg={6}>
                <div className="widget-card p-6 w-full h-full">
                  <Typography variant="h6" fontWeight="600" mb={3}>Member Growth</Typography>
                  <Box height={250}>
                    <Bar data={memberGrowthData} options={{ maintainAspectRatio: false }} />
                  </Box>
                </div>
              </Grid>
            </Grid>

            {/* LISTS */}
            <Grid container spacing={3}>
              {/* Top Members */}
              <Grid item xs={12} lg={4}>
                <div className="widget-card p-6 w-full h-full">
                  <Typography variant="h6" fontWeight="600" mb={3}>Top Members by Points</Typography>
                  {[{ name: 'Rahul Sharma', sub: 'Electrician', val: '45,230', bg: 'bg-blue-100', txt: 'text-blue-600', idx: 1 },
                  { name: 'Amit Patel', sub: 'Contractor', val: '38,450', bg: 'bg-blue-100', txt: 'text-blue-600', idx: 2 },
                  { name: 'Vikram Singh', sub: 'Distributor', val: '32,100', bg: 'bg-blue-100', txt: 'text-blue-600', idx: 3 }
                  ].map((item) => (
                    <Box key={item.name} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box display="flex" alignItems="center">
                        <div className={`w-8 h-8 ${item.bg} rounded-full flex items-center justify-center mr-3`}>
                          <span className={`text-xs font-bold ${item.txt}`}>{item.idx}</span>
                        </div>
                        <Box>
                          <Typography variant="subtitle2">{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.sub}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" fontWeight="600">{item.val}</Typography>
                    </Box>
                  ))}
                </div>
              </Grid>
              {/* Top Products */}
              <Grid item xs={12} lg={4}>
                <div className="widget-card p-6 w-full h-full">
                  <Typography variant="h6" fontWeight="600" mb={3}>Top Performing Products</Typography>
                  {[{ name: 'Wires & Cables', sub: '2,345 scans', val: '₹23.4L', bg: 'bg-green-100', txt: 'text-green-600', idx: 1 },
                  { name: 'Switches', sub: '1,876 scans', val: '₹18.7L', bg: 'bg-green-100', txt: 'text-green-600', idx: 2 },
                  { name: 'LED Lights', sub: '1,543 scans', val: '₹15.4L', bg: 'bg-green-100', txt: 'text-green-600', idx: 3 }
                  ].map((item) => (
                    <Box key={item.name} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box display="flex" alignItems="center">
                        <div className={`w-8 h-8 ${item.bg} rounded-full flex items-center justify-center mr-3`}>
                          <span className={`text-xs font-bold ${item.txt}`}>{item.idx}</span>
                        </div>
                        <Box>
                          <Typography variant="subtitle2">{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.sub}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" fontWeight="600">{item.val}</Typography>
                    </Box>
                  ))}
                </div>
              </Grid>
              {/* Regional */}
              <Grid item xs={12} lg={4}>
                <div className="widget-card p-6 w-full h-full">
                  <Typography variant="h6" fontWeight="600" mb={3}>Regional Performance</Typography>
                  {[{ name: 'Maharashtra', sub: '12,345 members', val: '₹4.2Cr', bg: 'bg-purple-100', txt: 'text-purple-600', idx: 1 },
                  { name: 'Gujarat', sub: '9,876 members', val: '₹3.8Cr', bg: 'bg-purple-100', txt: 'text-purple-600', idx: 2 },
                  { name: 'Karnataka', sub: '8,234 members', val: '₹2.9Cr', bg: 'bg-purple-100', txt: 'text-purple-600', idx: 3 }
                  ].map((item) => (
                    <Box key={item.name} display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                      <Box display="flex" alignItems="center">
                        <div className={`w-8 h-8 ${item.bg} rounded-full flex items-center justify-center mr-3`}>
                          <span className={`text-xs font-bold ${item.txt}`}>{item.idx}</span>
                        </div>
                        <Box>
                          <Typography variant="subtitle2">{item.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{item.sub}</Typography>
                        </Box>
                      </Box>
                      <Typography variant="subtitle2" fontWeight="600">{item.val}</Typography>
                    </Box>
                  ))}
                </div>
              </Grid>
            </Grid>
          </Box>
        )}
      </div>

      {/* --- TAB 1: PERFORMANCE METRICS --- */}
      <div role="tabpanel" hidden={activeTab !== 1}>
        {activeTab === 1 && (
          <Box>
            {/* FILTERS */}
            <div className="widget-card p-6 w-full mb-6">
              <Box display="flex" flexWrap="wrap" gap={3}>
                <Box flex={1} minWidth={200}>
                  <Typography variant="subtitle2" mb={1}>Time Period</Typography>
                  <TextField select fullWidth size="small" defaultValue="month">
                    <MenuItem value="today">Today</MenuItem>
                    <MenuItem value="week">This Week</MenuItem>
                    <MenuItem value="month">This Month</MenuItem>
                  </TextField>
                </Box>
                <Box flex={1} minWidth={200}>
                  <Typography variant="subtitle2" mb={1}>Region</Typography>
                  <TextField select fullWidth size="small" defaultValue="">
                    <MenuItem value="">All Regions</MenuItem>
                    <MenuItem value="mh">Maharashtra</MenuItem>
                    <MenuItem value="gj">Gujarat</MenuItem>
                  </TextField>
                </Box>
                <Box flex={1} minWidth={200}>
                  <Typography variant="subtitle2" mb={1}>Member Type</Typography>
                  <TextField select fullWidth size="small" defaultValue="">
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="electrician">Electrician</MenuItem>
                    <MenuItem value="retailer">Retailer</MenuItem>
                  </TextField>
                </Box>
                <Box display="flex" alignItems="flex-end">
                  <Button variant="contained" sx={{ textTransform: 'none' }}>
                    <i className="fas fa-filter mr-2"></i> Apply Filters
                  </Button>
                </Box>
              </Box>
            </div>

            {/* KPIS */}
            <Grid container spacing={3} mb={3}>
              {[
                { title: 'Avg. Txn Value', val: '₹1,250', chg: '+8.5%', icon: 'fa-chart-bar', color: 'text-blue-500' },
                { title: 'Scan Frequency', val: '3.4/day', chg: '+12.3%', icon: 'fa-qrcode', color: 'text-green-500' },
                { title: 'Retention Rate', val: '86.5%', chg: '+3.2%', icon: 'fa-user-check', color: 'text-purple-500' },
                { title: 'Conversion Rate', val: '24.8%', chg: '-1.5%', icon: 'fa-percentage', color: 'text-orange-500', isNeg: true },
              ].map((k) => (
                <Grid item xs={12} md={6} lg={3} key={k.title}>
                  <div className="widget-card p-6 w-full">
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2" color="text.secondary">{k.title}</Typography>
                      <i className={`fas ${k.icon} ${k.color}`}></i>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" mb={1}>{k.val}</Typography>
                    <Box display="flex" alignItems="center" fontSize="0.75rem">
                      <span className={k.isNeg ? 'text-red-600' : 'text-green-600'} style={{ marginRight: 4 }}>{k.chg}</span>
                      <span className="text-gray-500">vs last period</span>
                    </Box>
                  </div>
                </Grid>
              ))}
            </Grid>

            {/* CHARTS */}
            <Grid container spacing={3}>
              <Grid item xs={12} lg={6}>
                <div className="widget-card p-6 w-full">
                  <Typography variant="h6" fontWeight="600" mb={3}>Transaction Volume Trend</Typography>
                  <Box height={250}>
                    <Line data={transactionVolumeData} options={{ maintainAspectRatio: false }} />
                  </Box>
                </div>
              </Grid>
              <Grid item xs={12} lg={6}>
                <div className="widget-card p-6 w-full">
                  <Typography variant="h6" fontWeight="600" mb={3}>Category Performance</Typography>
                  <Box height={250}>
                    <Bar data={categoryPerfData} options={{ maintainAspectRatio: false }} />
                  </Box>
                </div>
              </Grid>
            </Grid>
          </Box>
        )}
      </div>

      {/* --- TAB 2: MEMBER ANALYTICS --- */}
      <div role="tabpanel" hidden={activeTab !== 2}>
        {activeTab === 2 && (
          <Box>
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} lg={4}>
                <div className="widget-card p-6 w-full h-full">
                  <Typography variant="h6" fontWeight="600" mb={3}>Member Segmentation</Typography>
                  <Box height={250} display="flex" justifyContent="center">
                    <Doughnut data={memberSegData} options={{ maintainAspectRatio: false }} />
                  </Box>
                </div>
              </Grid>
              <Grid item xs={12} lg={4}>
                <div className="widget-card p-6 w-full h-full">
                  <Typography variant="h6" fontWeight="600" mb={3}>Member Lifecycle</Typography>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" color="text.secondary">New Members</Typography>
                      <Typography variant="body2" fontWeight="600">2,345</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={25} sx={{ height: 8, borderRadius: 1 }} />
                  </Box>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" color="text.secondary">Active Members</Typography>
                      <Typography variant="body2" fontWeight="600">35,678</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={78} sx={{ height: 8, borderRadius: 1 }} />
                  </Box>
                  <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" color="text.secondary">At Risk Members</Typography>
                      <Typography variant="body2" fontWeight="600">5,432</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={12} color="warning" sx={{ height: 8, borderRadius: 1 }} />
                  </Box>
                  <Box>
                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                      <Typography variant="body2" color="text.secondary">Churned Members</Typography>
                      <Typography variant="body2" fontWeight="600">1,223</Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={3} color="error" sx={{ height: 8, borderRadius: 1 }} />
                  </Box>
                </div>
              </Grid>
              <Grid item xs={12} lg={4}>
                <div className="widget-card p-6 w-full h-full text-center">
                  <Typography variant="h6" fontWeight="600" mb={3}>Member Satisfaction</Typography>
                  <Typography variant="h2" fontWeight="bold" color="success.main" mb={1}>4.6</Typography>
                  <Box display="flex" justifyContent="center" mb={2} color="#facc15">
                    {[1, 2, 3, 4].map((i) => <i key={i} className="fas fa-star text-2xl"></i>)}
                    <i className="fas fa-star-half-alt text-2xl"></i>
                  </Box>
                  <Typography variant="body2" color="text.secondary">Average Rating</Typography>
                </div>
              </Grid>
            </Grid>

            {/* TABLE */}
            <div className="widget-card p-6 w-full">
              <Typography variant="h6" fontWeight="600" mb={3}>Recent Member Activity</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Member ID</TableCell>
                      <TableCell>Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Last Activity</TableCell>
                      <TableCell>Points Earned</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {[
                      { id: 'MEM001234', name: 'Rahul Sharma', type: 'Electrician', last: '2 hours ago', pts: 450, st: 'Active', stCls: 'badge-success' },
                      { id: 'MEM001237', name: 'Amit Patel', type: 'Contractor', last: '5 hours ago', pts: 320, st: 'Active', stCls: 'badge-success' },
                      { id: 'MEM001239', name: 'Vikram Singh', type: 'Distributor', last: '2 days ago', pts: 180, st: 'At Risk', stCls: 'badge-warning' },
                    ].map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="font-medium text-gray-900">{r.id}</TableCell>
                        <TableCell className="text-gray-500">{r.name}</TableCell>
                        <TableCell className="text-gray-500">{r.type}</TableCell>
                        <TableCell className="text-gray-500">{r.last}</TableCell>
                        <TableCell className="text-gray-900 font-medium">{r.pts}</TableCell>
                        <TableCell><span className={`badge ${r.stCls}`}>{r.st}</span></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Box>
        )}
      </div>

      {/* --- TAB 3: CAMPAIGN ANALYTICS --- */}
      <div role="tabpanel" hidden={activeTab !== 3}>
        {activeTab === 3 && (
          <Box>
            {/* KPIS */}
            <Grid container spacing={3} mb={3}>
              {[
                { title: 'Active Campaigns', val: '12', chg: '+3', icon: 'fa-bullhorn', color: 'text-blue-500' },
                { title: 'Total Reach', val: '1.2L', chg: '+25%', icon: 'fa-users', color: 'text-green-500' },
                { title: 'Conversion Rate', val: '18.5%', chg: '+4.2%', icon: 'fa-chart-line', color: 'text-purple-500' },
                { title: 'ROI', val: '245%', chg: '+32%', icon: 'fa-dollar-sign', color: 'text-orange-500' },
              ].map((k) => (
                <Grid item xs={12} md={6} lg={3} key={k.title}>
                  <div className="widget-card p-6 w-full">
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                      <Typography variant="subtitle2" color="text.secondary">{k.title}</Typography>
                      <i className={`fas ${k.icon} ${k.color}`}></i>
                    </Box>
                    <Typography variant="h5" fontWeight="bold" mb={1}>{k.val}</Typography>
                    <Box display="flex" alignItems="center" fontSize="0.75rem">
                      <span className='text-green-600' style={{ marginRight: 4 }}>{k.chg}</span>
                      <span className="text-gray-500">vs last period</span>
                    </Box>
                  </div>
                </Grid>
              ))}
            </Grid>
            {/* CHARTS */}
            <Grid container spacing={3} mb={3}>
              <Grid item xs={12} lg={6}>
                <div className="widget-card p-6 w-full">
                  <Typography variant="h6" fontWeight="600" mb={3}>Campaign Performance Trend</Typography>
                  <Box height={250}>
                    <Line data={campaignTrendData} options={{ maintainAspectRatio: false }} />
                  </Box>
                </div>
              </Grid>
              <Grid item xs={12} lg={6}>
                <div className="widget-card p-6 w-full">
                  <Typography variant="h6" fontWeight="600" mb={3}>Channel Effectiveness</Typography>
                  <Box height={250}>
                    <Bar data={channelEffectData} options={{ maintainAspectRatio: false }} />
                  </Box>
                </div>
              </Grid>
            </Grid>
            {/* TABLE */}
            <div className="widget-card p-6 w-full">
              <Typography variant="h6" fontWeight="600" mb={3}>Top Performing Campaigns</Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Campaign Name</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Duration</TableCell>
                      <TableCell>Reach</TableCell>
                      <TableCell>Engagement</TableCell>
                      <TableCell>Conversion</TableCell>
                      <TableCell>ROI</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">Diwali Special</TableCell>
                      <TableCell><span className="badge badge-primary">Points Multiplier</span></TableCell>
                      <TableCell className="text-gray-500">Oct 15-25</TableCell>
                      <TableCell className="text-gray-900">45,678</TableCell>
                      <TableCell className="text-gray-900">78.5%</TableCell>
                      <TableCell className="text-gray-900">22.3%</TableCell>
                      <TableCell className="text-gray-900">285%</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">New Member Welcome</TableCell>
                      <TableCell><span className="badge badge-success">Onboarding</span></TableCell>
                      <TableCell className="text-gray-500">Ongoing</TableCell>
                      <TableCell className="text-gray-900">12,345</TableCell>
                      <TableCell className="text-gray-900">92.1%</TableCell>
                      <TableCell className="text-gray-900">45.6%</TableCell>
                      <TableCell className="text-gray-900">320%</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </div>
          </Box>
        )}
      </div>

      {/* --- TAB 4: REPORTS --- */}
      <div role="tabpanel" hidden={activeTab !== 4}>
        {activeTab === 4 && (
          <Box display="flex" flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
            {/* SIDEBAR */}
            <Box width={{ xs: '100%', lg: 280 }}>
              <div className="widget-card p-4 h-full">
                <Typography variant="h6" fontWeight="600" mb={3}>Report Categories</Typography>
                <Box display="flex" flexDirection="column" gap={1}>
                  {[
                    { lbl: 'Registration & Login', icon: 'fa-user-plus', active: true },
                    { lbl: 'QR Scans', icon: 'fa-qrcode' },
                    { lbl: 'Redemptions', icon: 'fa-exchange-alt' },
                    { lbl: 'Referrals', icon: 'fa-share-alt' },
                    { lbl: 'Compliance', icon: 'fa-file-invoice-dollar' },
                  ].map((c) => (
                    <div key={c.lbl} className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer ${c.active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'}`}>
                      <i className={`fas ${c.icon} mr-3 ${c.active ? 'text-blue-500' : 'text-gray-500'}`}></i>
                      {c.lbl}
                    </div>
                  ))}
                </Box>
              </div>
            </Box>

            {/* MAIN CONTENT */}
            <Box flex={1}>
              <div className="widget-card p-6 w-full">
                <Box display="flex" justifyContent="space-between" flexWrap={{ xs: 'wrap', md: 'nowrap' }} alignItems="center" mb={3}>
                  <Box mb={{ xs: 2, md: 0 }}>
                    <Typography variant="h6" fontWeight="600">QR Scan Report</Typography>
                    <Typography variant="body2" color="text.secondary">Detailed QR transaction data</Typography>
                  </Box>
                  <Box display="flex" gap={1}>
                    <Button variant="contained" size="small" sx={{ textTransform: 'none' }}><i className="fas fa-file-csv mr-2"></i> Export CSV</Button>
                    <Button variant="contained" color="error" size="small" sx={{ textTransform: 'none' }}><i className="fas fa-file-pdf mr-2"></i> Export PDF</Button>
                  </Box>
                </Box>

                {/* Report Filters */}
                <Box bgcolor="#f9fafb" p={2} borderRadius={2} mb={3}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={3}>
                      <Typography variant="caption" fontWeight="600" mb={0.5} display="block">Stakeholder</Typography>
                      <Select fullWidth size="small" defaultValue="All" sx={{ bgcolor: 'white' }}>
                        <MenuItem value="All">All</MenuItem>
                        <MenuItem value="Retailers">Retailers</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="caption" fontWeight="600" mb={0.5} display="block">SKU</Typography>
                      <Select fullWidth size="small" defaultValue="All" sx={{ bgcolor: 'white' }}>
                        <MenuItem value="All">All</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="caption" fontWeight="600" mb={0.5} display="block">Geography</Typography>
                      <Select fullWidth size="small" defaultValue="All" sx={{ bgcolor: 'white' }}>
                        <MenuItem value="All">All</MenuItem>
                      </Select>
                    </Grid>
                    <Grid item xs={12} md={3}>
                      <Typography variant="caption" fontWeight="600" mb={0.5} display="block">Date Range</Typography>
                      <input type="date" className="w-full border border-gray-300 rounded px-3 py-[8.5px] text-sm outline-none focus:border-blue-500 bg-white" />
                    </Grid>
                  </Grid>
                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Button variant="contained" size="small" sx={{ textTransform: 'none' }}>Apply Filters</Button>
                  </Box>
                </Box>

                {/* Report Table */}
                <TableContainer>
                  <Table>
                    <TableHead sx={{ bgcolor: '#f9fafb' }}>
                      <TableRow>
                        <TableCell>Txn ID</TableCell>
                        <TableCell>Stakeholder</TableCell>
                        <TableCell>SKU</TableCell>
                        <TableCell>Geography</TableCell>
                        <TableCell>Scan Time</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        { id: '#12345', sh: 'Retailer A', sku: 'SKU001', geo: 'Delhi', time: '2023-10-01 10:30', type: 'Mono', typeC: 'bg-blue-100 text-blue-800', st: 'Success', stC: 'bg-green-100 text-green-800' },
                        { id: '#12346', sh: 'Electrician B', sku: 'SKU002', geo: 'Mumbai', time: '2023-10-01 11:15', type: 'Sub-mono', typeC: 'bg-purple-100 text-purple-800', st: 'Failed', stC: 'bg-red-100 text-red-800' },
                        { id: '#12347', sh: 'CSB C', sku: 'SKU003', geo: 'Bangalore', time: '2023-10-01 12:45', type: 'Mono', typeC: 'bg-blue-100 text-blue-800', st: 'Success', stC: 'bg-green-100 text-green-800' },
                      ].map((r) => (
                        <TableRow key={r.id}>
                          <TableCell className="font-medium text-gray-900">{r.id}</TableCell>
                          <TableCell className="text-gray-500">{r.sh}</TableCell>
                          <TableCell className="text-gray-500">{r.sku}</TableCell>
                          <TableCell className="text-gray-500">{r.geo}</TableCell>
                          <TableCell className="text-gray-500">{r.time}</TableCell>
                          <TableCell><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.typeC}`}>{r.type}</span></TableCell>
                          <TableCell><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.stC}`}>{r.st}</span></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </div>
            </Box>
          </Box>
        )}
      </div>

    </Box>
  )
}