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
    Alert
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

            {/* TAB CONTENT: TRANSACTIONS (Placeholder based on existing UI, can also query data if needed) */}
            <div role="tabpanel" hidden={activeTab !== 1}>
                {activeTab === 1 && (
                    <Box>
                        {/* ... Reuse filters and list styles from original file, potentially fetching more data ... */}
                        <div className="p-6 text-center text-gray-500">Full Transactions List Implementation Pending</div>
                    </Box>
                )}
            </div>
        </Box>
    )
}
