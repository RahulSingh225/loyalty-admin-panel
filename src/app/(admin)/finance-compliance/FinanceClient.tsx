"use client"

import React, { useState } from 'react'
import {
    Box,
    Grid,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    CircularProgress,
    Alert,
    TextField
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
import { useQuery } from '@tanstack/react-query'
import { getFinanceDataAction } from '@/actions/finance-actions'

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

export default function FinanceClient() {
    const [activeTab, setActiveTab] = useState(0) // 0: Financial Overview, 1: Transactions

    const { data: financeData, isLoading, error } = useQuery({
        queryKey: ['finance-data'],
        queryFn: () => getFinanceDataAction()
    })

    // --- CHART DATA (Derived from Action or Default) ---
    const revenueTrendData = {
        labels: financeData?.overview?.revenueTrend?.labels || [],
        datasets: [
            {
                label: 'Revenue',
                data: financeData?.overview?.revenueTrend?.data || [],
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
                ticks: { callback: (value) => '₹' + (Number(value) / 10000000).toFixed(1) + 'Cr' },
                grid: { display: false }
            },
            x: { grid: { display: false } }
        }
    }

    const pointsFlowData = {
        labels: financeData?.overview?.pointsFlow?.labels || [],
        datasets: [
            {
                label: 'Points Issued',
                data: financeData?.overview?.pointsFlow?.issued || [],
                backgroundColor: '#10B981',
                borderRadius: 5
            },
            {
                label: 'Points Redeemed',
                data: financeData?.overview?.pointsFlow?.redeemed || [],
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
                ticks: { callback: (value) => '₹' + (Number(value) / 100000).toFixed(0) + 'L' },
                grid: { display: false }
            },
            x: { grid: { display: false } }
        }
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue)
    }

    if (isLoading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>
    if (error) return <Alert severity="error">Failed to load finance data</Alert>

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
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <div className="widget-card p-6 w-full h-full">
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <div className="p-3 bg-blue-100 rounded-lg">
                                            <i className="fas fa-wallet text-blue-600 text-xl"></i>
                                        </div>
                                        <Typography variant="caption" color="text.secondary">This Month</Typography>
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold" color="text.primary">₹{financeData?.overview?.totalRevenue?.toLocaleString()}</Typography>
                                    <Typography variant="body2" color="text.secondary">Total Revenue</Typography>
                                    <Box display="flex" alignItems="center" mt={2} fontSize="0.875rem">
                                        <span className="text-green-600 font-medium mr-2">+12.5%</span>
                                        <span className="text-gray-500">vs last month</span>
                                    </Box>
                                </div>
                            </Grid>

                            {/* Points Issued */}
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <div className="widget-card p-6 w-full h-full">
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <div className="p-3 bg-green-100 rounded-lg">
                                            <i className="fas fa-coins text-green-600 text-xl"></i>
                                        </div>
                                        <Typography variant="caption" color="text.secondary">This Month</Typography>
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold" color="text.primary">{financeData?.overview?.pointsIssued?.toLocaleString()}</Typography>
                                    <Typography variant="body2" color="text.secondary">Points Issued</Typography>
                                    <Box display="flex" alignItems="center" mt={2} fontSize="0.875rem">
                                        <span className="text-green-600 font-medium mr-2">+8.3%</span>
                                        <span className="text-gray-500">vs last month</span>
                                    </Box>
                                </div>
                            </Grid>

                            {/* Points Redeemed */}
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <div className="widget-card p-6 w-full h-full">
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <div className="p-3 bg-purple-100 rounded-lg">
                                            <i className="fas fa-exchange-alt text-purple-600 text-xl"></i>
                                        </div>
                                        <Typography variant="caption" color="text.secondary">This Month</Typography>
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold" color="text.primary">{financeData?.overview?.pointsRedeemed?.toLocaleString()}</Typography>
                                    <Typography variant="body2" color="text.secondary">Points Redeemed</Typography>
                                    <Box display="flex" alignItems="center" mt={2} fontSize="0.875rem">
                                        <span className="text-red-600 font-medium mr-2">-3.2%</span>
                                        <span className="text-gray-500">vs last month</span>
                                    </Box>
                                </div>
                            </Grid>

                            {/* Active Points Value */}
                            <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                                <div className="widget-card p-6 w-full h-full">
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <div className="p-3 bg-orange-100 rounded-lg">
                                            <i className="fas fa-chart-line text-orange-600 text-xl"></i>
                                        </div>
                                        <Typography variant="caption" color="text.secondary">Current</Typography>
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold" color="text.primary">{financeData?.overview?.activePointsValue?.toLocaleString()}</Typography>
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
                            <Grid size={{ xs: 12, lg: 6 }}>
                                <div className="widget-card p-6 w-full">
                                    <Typography variant="h6" fontWeight="600" mb={3}>Revenue Trend</Typography>
                                    <Box sx={{ height: 300 }}>
                                        <Line data={revenueTrendData} options={revenueTrendOptions} />
                                    </Box>
                                </div>
                            </Grid>
                            <Grid size={{ xs: 12, lg: 6 }}>
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
                                        {financeData?.transactions?.map((row: { id: string; date: string; typeBadge: string; type: string; member: string; amount: string; badgeColor: string; status: string }) => (
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
                        <div className="widget-card p-6 w-full mb-6">
                            {/* TRANSACTION FILTERS */}
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">Date Range</label>
                                    <input type="date" className="w-full px-3 py-[7px] border rounded-md text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">End Date</label>
                                    <input type="date" className="w-full px-3 py-[7px] border rounded-md text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500" />
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">Transaction Type</label>
                                    <select className="w-full px-3 py-2 border rounded-md text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                                        <option value="">All Types</option>
                                        <option value="credit">Credit</option>
                                        <option value="debit">Debit</option>
                                        <option value="refund">Refund</option>
                                        <option value="adjustment">Adjustment</option>
                                    </select>
                                </div>
                                <div className="flex flex-col gap-1">
                                    <label className="text-sm font-medium text-gray-700">Status</label>
                                    <select className="w-full px-3 py-2 border rounded-md text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white">
                                        <option value="">All Status</option>
                                        <option value="completed">Completed</option>
                                        <option value="pending">Pending</option>
                                        <option value="failed">Failed</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                                <div className="flex items-end">
                                    <Button variant="contained" size="small" fullWidth sx={{ py: 1.1, textTransform: 'none', backgroundColor: '#2563eb' }}>
                                        <i className="fas fa-filter mr-2"></i> Apply Filters
                                    </Button>
                                </div>
                            </div>

                            {/* TRANSACTION SUMMARY UNITS */}
                            <Grid container spacing={2} sx={{ mb: 6 }}>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                                        <p className="text-sm text-gray-500 mb-1">Total Transactions</p>
                                        <p className="text-2xl font-bold text-gray-900">1,234</p>
                                    </div>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <div className="text-center p-4 bg-green-50 rounded-lg">
                                        <p className="text-sm text-gray-500 mb-1">Total Credits</p>
                                        <p className="text-2xl font-bold text-green-600">₹{(financeData?.overview?.pointsIssued || 0).toLocaleString()}</p>
                                    </div>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <div className="text-center p-4 bg-red-50 rounded-lg">
                                        <p className="text-sm text-gray-500 mb-1">Total Debits</p>
                                        <p className="text-2xl font-bold text-red-600">₹{(financeData?.overview?.pointsRedeemed || 0).toLocaleString()}</p>
                                    </div>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                                        <p className="text-sm text-gray-500 mb-1">Net Balance</p>
                                        <p className="text-2xl font-bold text-purple-600">₹{((financeData?.overview?.pointsIssued || 0) - (financeData?.overview?.pointsRedeemed || 0)).toLocaleString()}</p>
                                    </div>
                                </Grid>
                            </Grid>

                            {/* TRANSACTIONS TABLE */}
                            <TableContainer sx={{ borderTop: '1px solid #f3f4f6' }}>
                                <Table sx={{ minWidth: 1000 }}>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">
                                                <input type="checkbox" className="rounded border-gray-300 ml-3" />
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase' }}>Transaction ID</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase' }}>Date & Time</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase' }}>Type</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase' }}>Member ID</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase' }}>Member Name</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase' }}>Description</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase' }}>Amount</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase' }}>Status</TableCell>
                                            <TableCell sx={{ fontWeight: 600, fontSize: '0.75rem', color: '#374151', textTransform: 'uppercase' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {financeData?.transactions?.map((row: any) => (
                                            <TableRow key={row.id}>
                                                <TableCell padding="checkbox">
                                                    <input type="checkbox" className="rounded border-gray-300 ml-3" />
                                                </TableCell>
                                                <TableCell className="font-medium text-gray-900">{row.id}</TableCell>
                                                <TableCell className="text-gray-500">{row.date} 10:30 AM</TableCell>
                                                <TableCell><span className={`badge ${row.typeBadge}`}>{row.type}</span></TableCell>
                                                <TableCell className="text-gray-500">MEM{(row.userId || '001').toString().slice(-3)}</TableCell>
                                                <TableCell className="text-gray-500">{row.member}</TableCell>
                                                <TableCell className="text-gray-500">Purchase Reward</TableCell>
                                                <TableCell className="font-medium text-gray-900">{row.amount}</TableCell>
                                                <TableCell><span className={`badge ${row.badgeColor}`}>{row.status}</span></TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2 text-sm font-medium">
                                                        <button className="text-blue-600 hover:text-blue-900">View</button>
                                                        <button className="text-green-600 hover:text-green-900">Edit</button>
                                                        <button className="text-red-600 hover:text-red-900">Cancel</button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {/* PAGINATION */}
                            <Box mt={4} display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="body2" color="text.secondary">
                                    Showing 1 to {financeData?.transactions?.length || 0} of 1,234 entries
                                </Typography>
                                <div className="flex gap-1">
                                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Previous</button>
                                    <button className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm">1</button>
                                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">2</button>
                                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">3</button>
                                    <button className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50">Next</button>
                                </div>
                            </Box>
                        </div>
                    </Box>
                )}
            </div>
        </Box>
    )
}
