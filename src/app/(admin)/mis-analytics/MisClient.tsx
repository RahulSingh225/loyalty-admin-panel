"use client"

import React, { useState } from 'react'
import {
    Box,
    Grid,
    Typography,
    Tabs,
    Tab,
    Button,
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
    CircularProgress,
    Alert
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
import { useQuery } from '@tanstack/react-query'
import { getMisAnalyticsAction } from '@/actions/mis-actions'

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

export default function MisClient() {
    const [activeTab, setActiveTab] = useState(0)

    // Fetch Data
    const { data: analyticsData, isLoading, error } = useQuery({
        queryKey: ['mis-analytics'],
        queryFn: () => getMisAnalyticsAction()
    })

    // Fallback / Mock Data helpers if real data structure is partial
    // For the sake of this migration, I'll largely reuse the static data logic 
    // but populate the specific fields we standardized in the Action.

    // Executive: Points Alloted
    const pointsAllotedData = {
        labels: analyticsData?.executive?.pointsTrend?.labels || [],
        datasets: [{
            label: 'Points Alloted',
            data: analyticsData?.executive?.pointsTrend?.data || [],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            fill: true,
            tension: 0.4
        }]
    }

    // Executive: Member Growth
    const memberGrowthData = {
        labels: analyticsData?.executive?.memberGrowth?.labels || [],
        datasets: [{
            label: 'New Members',
            data: analyticsData?.executive?.memberGrowth?.data || [],
            backgroundColor: '#10b981',
            borderRadius: 4
        }]
    }

    // Performance: Transaction Volume (Using Data from Action or default)
    const transactionVolumeData = {
        labels: analyticsData?.performance?.txnVolume?.labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: 'Volume',
            data: analyticsData?.performance?.txnVolume?.data || [150, 230, 180, 320, 290, 140, 190],
            borderColor: '#8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            fill: true,
            tension: 0.4
        }]
    }

    // Performance: Category Perf (Bar)
    const categoryPerfData = {
        labels: analyticsData?.performance?.categoryPerf?.labels || ['Wires', 'Switches', 'Lights', 'Fans', 'MCBs'],
        datasets: [{
            label: 'Sales (Lakhs)',
            data: analyticsData?.performance?.categoryPerf?.data || [23.4, 18.7, 15.4, 12.1, 9.8],
            backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444'],
            borderRadius: 4
        }]
    }

    // Member Analytics: Segmentation (Doughnut)
    const memberSegData = {
        labels: analyticsData?.memberAnalytics?.segmentation?.labels || ['Electricians', 'Retailers', 'Contractors', 'Builders'],
        datasets: [{
            data: analyticsData?.memberAnalytics?.segmentation?.data || [45, 25, 20, 10],
            backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
            hoverOffset: 4
        }]
    }

    // Campaign Analytics: Trend
    const campaignTrendData = {
        labels: analyticsData?.campaignAnalytics?.performanceTrend?.labels || ['W1', 'W2', 'W3', 'W4'],
        datasets: analyticsData?.campaignAnalytics?.performanceTrend?.datasets || [
            { label: 'Reach', data: [5000, 12000, 28000, 45000], borderColor: '#3b82f6', tension: 0.4 },
            { label: 'Conversion', data: [100, 350, 980, 1850], borderColor: '#10b981', tension: 0.4 }
        ]
    }

    // Campaign Analytics: Channel Effectiveness
    const channelEffectData = {
        labels: analyticsData?.campaignAnalytics?.channelEffectiveness?.labels || ['SMS', 'WhatsApp', 'Email', 'Push Notif'],
        datasets: [{
            label: 'Conversion Rate %',
            data: analyticsData?.campaignAnalytics?.channelEffectiveness?.data || [12, 28, 5, 8],
            backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
            borderRadius: 4
        }]
    }

    if (isLoading) {
        return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>
    }

    if (error) {
        return <Alert severity="error">Failed to fetch analytics data</Alert>
    }

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
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <div className="text-white rounded-xl p-6 relative overflow-hidden"
                                    style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="h6" fontWeight="600">Total Points</Typography>
                                        <i className="fas fa-star opacity-50 text-2xl"></i>
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" mb={1}>{analyticsData?.executive?.totalPoints?.toLocaleString() ?? 0}</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>This Quarter</Typography>
                                    <Box mt={2} display="flex" alignItems="center" fontSize="0.875rem">
                                        <i className="fas fa-arrow-up mr-1"></i> 18.5% from last quarter
                                    </Box>
                                </div>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <div className="text-white rounded-xl p-6 relative overflow-hidden"
                                    style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="h6" fontWeight="600">Active Members</Typography>
                                        <i className="fas fa-users opacity-50 text-2xl"></i>
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" mb={1}>{analyticsData?.executive?.activeMembers?.toLocaleString() ?? 0}</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Total Registered</Typography>
                                    <Box mt={2} display="flex" alignItems="center" fontSize="0.875rem">
                                        <i className="fas fa-arrow-up mr-1"></i> 12.3% growth
                                    </Box>
                                </div>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <div className="text-white rounded-xl p-6 relative overflow-hidden"
                                    style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="h6" fontWeight="600">Engagement</Typography>
                                        <i className="fas fa-chart-line opacity-50 text-2xl"></i>
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" mb={1}>{analyticsData?.executive?.engagement ?? 0}%</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Monthly Active</Typography>
                                    <Box mt={2} display="flex" alignItems="center" fontSize="0.875rem">
                                        <i className="fas fa-arrow-up mr-1"></i> 5.2% improvement
                                    </Box>
                                </div>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <div className="text-white rounded-xl p-6 relative overflow-hidden"
                                    style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                        <Typography variant="h6" fontWeight="600">Redemption</Typography>
                                        <i className="fas fa-gift opacity-50 text-2xl"></i>
                                    </Box>
                                    <Typography variant="h4" fontWeight="bold" mb={1}>{analyticsData?.executive?.redemptionRate ?? 0}%</Typography>
                                    <Typography variant="body2" sx={{ opacity: 0.9 }}>Points Redeemed</Typography>
                                    <Box mt={2} display="flex" alignItems="center" fontSize="0.875rem">
                                        <i className="fas fa-arrow-down mr-1"></i> 2.1% from last month
                                    </Box>
                                </div>
                            </Grid>
                        </Grid>

                        {/* CHARTS */}
                        <Grid container spacing={3} mb={3}>
                            <Grid size={{ xs: 12, lg: 6 }}>
                                <div className="widget-card p-6 w-full h-full">
                                    <Typography variant="h6" fontWeight="600" mb={3}>Points Alloted Trend</Typography>
                                    <Box height={250}>
                                        <Line data={pointsAllotedData} options={{ maintainAspectRatio: false }} />
                                    </Box>
                                </div>
                            </Grid>
                            <Grid size={{ xs: 12, lg: 6 }}>
                                <div className="widget-card p-6 w-full h-full">
                                    <Typography variant="h6" fontWeight="600" mb={3}>Member Growth</Typography>
                                    <Box height={250}>
                                        <Bar data={memberGrowthData} options={{ maintainAspectRatio: false }} />
                                    </Box>
                                </div>
                            </Grid>
                        </Grid>

                        {/* LISTS (Static for now, can be hydrated later) */}
                        <Grid container spacing={3}>
                            {/* Top Members */}
                            <Grid size={{ xs: 12, lg: 4 }}>
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
                            <Grid size={{ xs: 12, lg: 4 }}>
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
                            <Grid size={{ xs: 12, lg: 4 }}>
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
                                <Grid size={{ xs: 12, md: 6, lg: 3 }} key={k.title}>
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
                            <Grid size={{ xs: 12, lg: 6 }}>
                                <div className="widget-card p-6 w-full">
                                    <Typography variant="h6" fontWeight="600" mb={3}>Transaction Volume Trend</Typography>
                                    <Box height={250}>
                                        <Line data={transactionVolumeData} options={{ maintainAspectRatio: false }} />
                                    </Box>
                                </div>
                            </Grid>
                            <Grid size={{ xs: 12, lg: 6 }}>
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
                        {/* Member Segmentation & Lifecycle */}
                        <Grid container spacing={3} mb={3}>
                            <Grid size={{ xs: 12, lg: 4 }}>
                                <div className="widget-card p-6 w-full h-full">
                                    <Typography variant="h6" fontWeight="600" mb={3}>Member Segmentation</Typography>
                                    <Box height={250} display="flex" justifyContent="center">
                                        <Doughnut data={{
                                            labels: analyticsData?.memberAnalytics?.segmentation?.labels || [],
                                            datasets: [{
                                                data: analyticsData?.memberAnalytics?.segmentation?.data || [],
                                                backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'],
                                                hoverOffset: 4
                                            }]
                                        }} options={{ maintainAspectRatio: false }} />
                                    </Box>
                                </div>
                            </Grid>

                            <Grid size={{ xs: 12, lg: 4 }}>
                                <div className="widget-card p-6 w-full h-full">
                                    <Typography variant="h6" fontWeight="600" mb={3}>Member Lifecycle</Typography>
                                    <Box display="flex" flexDirection="column" gap={2}>
                                        {[
                                            { label: 'New Members', val: analyticsData?.memberAnalytics?.lifecycle?.new, color: 'bg-blue-500', width: '25%' },
                                            { label: 'Active Members', val: analyticsData?.memberAnalytics?.lifecycle?.active, color: 'bg-green-500', width: '78%' },
                                            { label: 'At Risk Members', val: analyticsData?.memberAnalytics?.lifecycle?.atRisk, color: 'bg-yellow-500', width: '12%' },
                                            { label: 'Churned Members', val: analyticsData?.memberAnalytics?.lifecycle?.churned, color: 'bg-red-500', width: '3%' },
                                        ].map((item, i) => (
                                            <Box key={i}>
                                                <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                    <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                                                    <Typography variant="body2" fontWeight="600">{item.val?.toLocaleString()}</Typography>
                                                </Box>
                                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                                    <div className={`h-full ${item.color}`} style={{ width: item.width }}></div>
                                                </div>
                                            </Box>
                                        ))}
                                    </Box>
                                </div>
                            </Grid>

                            <Grid size={{ xs: 12, lg: 4 }}>
                                <div className="widget-card p-6 w-full h-full text-center">
                                    <Typography variant="h6" fontWeight="600" mb={3}>Member Satisfaction</Typography>
                                    <Typography variant="h3" fontWeight="bold" color="success.main" mb={1}>
                                        {analyticsData?.memberAnalytics?.satisfaction?.average}
                                    </Typography>
                                    <Box display="flex" justifyContent="center" mb={2} color="warning.main">
                                        {[1, 2, 3, 4].map(i => <i key={i} className="fas fa-star" />)}
                                        <i className="fas fa-star-half-alt" />
                                    </Box>
                                    <Typography variant="body2" color="text.secondary" mb={3}>Average Rating</Typography>

                                    <Box display="flex" flexDirection="column" gap={1}>
                                        {analyticsData?.memberAnalytics?.satisfaction?.distribution?.map((pct, idx) => (
                                            <Box key={idx} display="flex" justifyContent="space-between" fontSize="0.875rem">
                                                <span>{['Excellent (5★)', 'Good (4★)', 'Average (3★)', 'Poor (2★)', 'Very Poor (1★)'][idx]}</span>
                                                <span className="font-semibold">{pct}%</span>
                                            </Box>
                                        ))}
                                    </Box>
                                </div>
                            </Grid>
                        </Grid>

                        {/* Recent Activity Table */}
                        <div className="widget-card p-6 w-full">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h6" fontWeight="600">Recent Member Activity</Typography>
                                <Button size="small">View All</Button>
                            </Box>
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
                                        {analyticsData?.memberAnalytics?.recentActivity?.map((row: any) => (
                                            <TableRow key={row.id} hover>
                                                <TableCell sx={{ fontWeight: 500 }}>{row.id}</TableCell>
                                                <TableCell>{row.name}</TableCell>
                                                <TableCell color="text.secondary">{row.type}</TableCell>
                                                <TableCell color="text.secondary">{row.lastActivity}</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>{row.points}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${row.status === 'Active' ? 'bg-green-100 text-green-800' :
                                                        row.status === 'At Risk' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {row.status}
                                                    </span>
                                                </TableCell>
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
                        {/* Campaign KPIs */}
                        <Grid container spacing={3} mb={3}>
                            {[
                                { title: 'Active Campaigns', val: analyticsData?.campaignAnalytics?.kpis?.activeCampaigns, chg: '+3', icon: 'fa-bullhorn', color: 'text-blue-500' },
                                { title: 'Total Reach', val: analyticsData?.campaignAnalytics?.kpis?.totalReach, chg: '+25%', icon: 'fa-users', color: 'text-green-500' },
                                { title: 'Conversion Rate', val: `${analyticsData?.campaignAnalytics?.kpis?.conversionRate}%`, chg: '+4.2%', icon: 'fa-chart-line', color: 'text-purple-500' },
                                { title: 'ROI', val: `${analyticsData?.campaignAnalytics?.kpis?.roi}%`, chg: '+32%', icon: 'fa-dollar-sign', color: 'text-orange-500' },
                            ].map((k) => (
                                <Grid size={{ xs: 12, md: 6, lg: 3 }} key={k.title}>
                                    <div className="widget-card p-6 w-full">
                                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                            <Typography variant="subtitle2" color="text.secondary">{k.title}</Typography>
                                            <i className={`fas ${k.icon} ${k.color}`}></i>
                                        </Box>
                                        <Typography variant="h5" fontWeight="bold" mb={1}>{k.val}</Typography>
                                        <Box display="flex" alignItems="center" fontSize="0.75rem">
                                            <span className="text-green-600 mr-1">{k.chg}</span>
                                            <span className="text-gray-500">improvement</span>
                                        </Box>
                                    </div>
                                </Grid>
                            ))}
                        </Grid>

                        {/* Campaign Charts */}
                        <Grid container spacing={3} mb={3}>
                            <Grid size={{ xs: 12, lg: 6 }}>
                                <div className="widget-card p-6 w-full h-full">
                                    <Typography variant="h6" fontWeight="600" mb={3}>Campaign Performance Trend</Typography>
                                    <Box height={250}>
                                        <Line data={{
                                            labels: analyticsData?.campaignAnalytics?.performanceTrend?.labels || [],
                                            datasets: analyticsData?.campaignAnalytics?.performanceTrend?.datasets || []
                                        }} options={{ maintainAspectRatio: false }} />
                                    </Box>
                                </div>
                            </Grid>
                            <Grid size={{ xs: 12, lg: 6 }}>
                                <div className="widget-card p-6 w-full h-full">
                                    <Typography variant="h6" fontWeight="600" mb={3}>Channel Effectiveness</Typography>
                                    <Box height={250}>
                                        <Bar data={{
                                            labels: analyticsData?.campaignAnalytics?.channelEffectiveness?.labels || [],
                                            datasets: [{
                                                label: 'Conversion Rate %',
                                                data: analyticsData?.campaignAnalytics?.channelEffectiveness?.data || [],
                                                backgroundColor: ['#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'],
                                                borderRadius: 4
                                            }]
                                        }} options={{ maintainAspectRatio: false }} />
                                    </Box>
                                </div>
                            </Grid>
                        </Grid>

                        {/* Top Campaigns Table */}
                        <div className="widget-card p-6 w-full">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h6" fontWeight="600">Top Performing Campaigns</Typography>
                                <Button size="small">View All</Button>
                            </Box>
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
                                        {analyticsData?.campaignAnalytics?.topCampaigns?.map((row: any) => (
                                            <TableRow key={row.name} hover>
                                                <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-800`}>
                                                        {row.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell color="text.secondary">{row.duration}</TableCell>
                                                <TableCell sx={{ fontWeight: 500 }}>{row.reach}</TableCell>
                                                <TableCell>{row.engagement}</TableCell>
                                                <TableCell>{row.conversion}</TableCell>
                                                <TableCell sx={{ fontWeight: 600, color: 'success.main' }}>{row.roi}</TableCell>
                                            </TableRow>
                                        ))}
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
                    <Box>
                        <Grid container spacing={3}>
                            {/* Report Categories Sidebar */}
                            <Grid size={{ xs: 12, lg: 3 }}>
                                <div className="widget-card p-4 w-full">
                                    <Typography variant="h6" fontWeight="600" mb={2}>Report Categories</Typography>
                                    <Box display="flex" flexDirection="column" gap={0.5}>
                                        {[
                                            { name: 'Registration & Login', icon: 'fa-user-plus' },
                                            { name: 'QR Scans', icon: 'fa-qrcode', active: true },
                                            { name: 'Redemptions', icon: 'fa-exchange-alt' },
                                            { name: 'Referrals', icon: 'fa-share-alt' },
                                            { name: 'Gamification', icon: 'fa-gamepad' },
                                            { name: 'Compliance', icon: 'fa-file-invoice-dollar' },
                                            { name: 'Sales & Marketing', icon: 'fa-chart-line' },
                                        ].map((item, i) => (
                                            <div key={i} className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition ${item.active ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
                                                }`}>
                                                <i className={`fas ${item.icon} mr-3 ${item.active ? 'text-blue-500' : 'text-gray-500'}`}></i>
                                                {item.name}
                                            </div>
                                        ))}
                                    </Box>
                                </div>
                            </Grid>

                            {/* Report Content */}
                            <Grid size={{ xs: 12, lg: 9 }}>
                                <div className="widget-card p-6 w-full">
                                    {/* Header & Actions */}
                                    <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ md: 'center' }} mb={4} gap={2}>
                                        <Box>
                                            <Typography variant="h6" fontWeight="600">QR Scan Report</Typography>
                                            <Typography variant="body2" color="text.secondary">Detailed QR transaction data</Typography>
                                        </Box>
                                        <Box display="flex" gap={1}>
                                            <Button variant="contained" color="primary" size="small" startIcon={<i className="fas fa-file-csv"></i>}>Export CSV</Button>
                                            <Button variant="contained" color="error" size="small" startIcon={<i className="fas fa-file-pdf"></i>}>Export PDF</Button>
                                        </Box>
                                    </Box>

                                    {/* Filters */}
                                    <Box bgcolor="grey.50" p={2} borderRadius={2} mb={4}>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, md: 3 }}>
                                                <Typography variant="caption" fontWeight={600} mb={0.5} display="block">Stakeholder</Typography>
                                                <Select fullWidth size="small" defaultValue="All" sx={{ bgcolor: 'white' }}>
                                                    <MenuItem value="All">All</MenuItem>
                                                    <MenuItem value="Retailer">Retailer</MenuItem>
                                                </Select>
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 3 }}>
                                                <Typography variant="caption" fontWeight={600} mb={0.5} display="block">SKU</Typography>
                                                <Select fullWidth size="small" defaultValue="All" sx={{ bgcolor: 'white' }}>
                                                    <MenuItem value="All">All</MenuItem>
                                                </Select>
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 3 }}>
                                                <Typography variant="caption" fontWeight={600} mb={0.5} display="block">Date Range</Typography>
                                                <TextField type="date" fullWidth size="small" sx={{ bgcolor: 'white' }} />
                                            </Grid>
                                            <Grid size={{ xs: 12, md: 3 }} display="flex" alignItems="flex-end">
                                                <Button fullWidth variant="contained">Apply Filters</Button>
                                            </Grid>
                                        </Grid>
                                    </Box>

                                    {/* Table */}
                                    <TableContainer>
                                        <Table>
                                            <TableHead sx={{ bgcolor: 'grey.50' }}>
                                                <TableRow>
                                                    <TableCell>Txn ID</TableCell>
                                                    <TableCell>Stakeholder</TableCell>
                                                    <TableCell>SKU</TableCell>
                                                    <TableCell>Geo</TableCell>
                                                    <TableCell>Time</TableCell>
                                                    <TableCell>Type</TableCell>
                                                    <TableCell>Status</TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {analyticsData?.reports?.qrScanReport?.map((row: any) => (
                                                    <TableRow key={row.id} hover>
                                                        <TableCell sx={{ fontWeight: 500 }}>{row.id}</TableCell>
                                                        <TableCell color="text.secondary">{row.stakeholder}</TableCell>
                                                        <TableCell>{row.sku}</TableCell>
                                                        <TableCell>{row.geo}</TableCell>
                                                        <TableCell>{row.time}</TableCell>
                                                        <TableCell>
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                                {row.type}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === 'Success' ? 'bg-green-100 text-green-800' :
                                                                row.status === 'Failed' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                                                                }`}>
                                                                {row.status}
                                                            </span>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                </div>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </div>
        </Box>
    )
}
