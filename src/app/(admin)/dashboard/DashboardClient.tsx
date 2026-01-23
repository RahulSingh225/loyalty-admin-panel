"use client";

import { useState } from "react";
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
    LinearProgress,
    CircularProgress,
    Alert
} from "@mui/material";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
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
    Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { getDashboardDataAction } from "@/actions/dashboard-actions";

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
);

export default function DashboardClient() {
    const { data: session, status: sessionStatus } = useSession({
        required: true,
        onUnauthenticated() {
            redirect("/login");
        },
    });

    // -- State for Charts & Filters --
    const [dateFilter, setDateFilter] = useState({ from: "", to: "" });

    // -- Fetch Dashboard Data --
    const { data: dashboardData, isLoading, error } = useQuery({
        queryKey: ['dashboard-data', dateFilter],
        queryFn: () => getDashboardDataAction(dateFilter.from && dateFilter.to ? dateFilter : undefined),
        // Poll every 30 seconds for live-like updates
        refetchInterval: 30000
    });


    if (sessionStatus === "loading" || isLoading) {
        return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
    }

    if (error) {
        return <Alert severity="error">Failed to load dashboard data. Please try again later.</Alert>;
    }

    // -- handlers --
    const handleApplyFilter = () => {
        // Logic handled by useQuery dependency on dateFilter state
        console.log("Applying filter:", dateFilter);
    };

    // -- Chart Configs --
    // Using fetched chart data or defaulting to empty
    const charts = dashboardData?.charts || { memberGrowth: [], pointsEarned: [], pointsRedeemed: [] };

    const lineChartData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                label: "New Members",
                data: charts.memberGrowth, // Mapped from backend
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                tension: 0.4,
                fill: true,
            },
        ],
    };

    const lineChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
        },
        scales: {
            y: { beginAtZero: true, grid: { display: false } },
            x: { grid: { display: false } },
        },
    };

    const barChartData = {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [
            {
                label: "Points Earned",
                data: charts.pointsEarned,
                backgroundColor: "#10b981",
                borderRadius: 5,
                barPercentage: 0.6,
            },
            {
                label: "Points Redeemed",
                data: charts.pointsRedeemed,
                backgroundColor: "#f59e0b",
                borderRadius: 5,
                barPercentage: 0.6,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: true, position: "bottom" as const },
        },
        scales: {
            y: { beginAtZero: true, grid: { display: false } },
            x: { grid: { display: false } },
        },
    };

    const stats = dashboardData?.stats;

    // Calculate percentages for bars
    const activePercent = stats?.totalMembers ? Math.round((stats.activeMembers / stats.totalMembers) * 100) : 0;
    const blockedPercent = stats?.totalMembers ? Math.round((stats.blockedMembers / stats.totalMembers) * 100) : 0;
    const kycPercent = stats?.totalMembers ? Math.round((stats.kycApproved / stats.totalMembers) * 100) : 0;

    return (
        <Box>
            {/* 1. KEY METRICS ROW */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Total Members */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <div className="widget-card p-6 h-full w-full">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                                Total Members
                            </Typography>
                            <i className="fas fa-users text-blue-500 text-lg"></i>
                        </Box>
                        <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                            {stats?.totalMembers?.toLocaleString() ?? 0}
                        </Typography>
                        <Box display="flex" alignItems="center" fontSize="0.875rem">
                            <span className="text-green-600 font-medium mr-2">--</span>
                            <span className="text-gray-500">Registered</span>
                        </Box>
                    </div>
                </Grid>

                {/* Active Members */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <div className="widget-card p-6 h-full w-full">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                                Active Members
                            </Typography>
                            <i className="fas fa-user-check text-green-500 text-lg"></i>
                        </Box>
                        <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                            {stats?.activeMembers?.toLocaleString() ?? 0}
                        </Typography>
                        <Box display="flex" alignItems="center" fontSize="0.875rem">
                            <span className="text-gray-500">{activePercent}% of total</span>
                        </Box>
                    </div>
                </Grid>

                {/* Total Points Issued */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <div className="widget-card p-6 h-full w-full">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                                Total Points Issued
                            </Typography>
                            <i className="fas fa-coins text-yellow-500 text-lg"></i>
                        </Box>
                        <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                            {stats?.totalPointsIssued?.toLocaleString() ?? 0}
                        </Typography>
                        <Box display="flex" alignItems="center" fontSize="0.875rem">
                            <span className="text-gray-500">Lifetime</span>
                        </Box>
                    </div>
                </Grid>

                {/* Points Redeemed */}
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <div className="widget-card p-6 h-full w-full">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                                Points Redeemed
                            </Typography>
                            <i className="fas fa-gift text-purple-500 text-lg"></i>
                        </Box>
                        <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                            {stats?.pointsRedeemed?.toLocaleString() ?? 0}
                        </Typography>
                        <Box display="flex" alignItems="center" fontSize="0.875rem">
                            <span className="text-gray-500">Lifetime</span>
                        </Box>
                    </div>
                </Grid>
            </Grid>

            {/* 2. SECOND METRICS ROW (Scans, KYC, User Status) */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Total Scans with Date Filter */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <div className="widget-card p-6 h-full w-full">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                                Total Scans
                            </Typography>
                            <i className="fas fa-qrcode text-indigo-500 text-lg"></i>
                        </Box>
                        <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
                            {stats?.totalScans?.toLocaleString() ?? 0}
                        </Typography>
                        <Box display="flex" alignItems="center" fontSize="0.875rem" mb={2}>
                            <span className="text-gray-500">All channels</span>
                        </Box>

                        {/* Date Filter Inputs */}
                        <Box display="flex" gap={1} alignItems="center">
                            <input
                                type="date"
                                className="border border-gray-300 rounded px-2 py-1 text-xs w-full"
                                value={dateFilter.from}
                                onChange={(e) => setDateFilter({ ...dateFilter, from: e.target.value })}
                            />
                            <span className="text-gray-400 text-xs">to</span>
                            <input
                                type="date"
                                className="border border-gray-300 rounded px-2 py-1 text-xs w-full"
                                value={dateFilter.to}
                                onChange={(e) => setDateFilter({ ...dateFilter, to: e.target.value })}
                            />
                            {/* Filter is auto-applied via state, but keeping button for visual confirmation */}
                            <Button
                                variant="contained"
                                size="small"
                                sx={{ minWidth: "auto", px: 1.5, py: 0.5, fontSize: "0.75rem", textTransform: "none" }}
                                onClick={handleApplyFilter}
                            >
                                Apply
                            </Button>
                        </Box>
                    </div>
                </Grid>

                {/* KYC Status */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <div className="widget-card p-6 h-full">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                                KYC Status
                            </Typography>
                            <i className="fas fa-user-check text-teal-500 text-lg"></i>
                        </Box>

                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <div className="text-center">
                                <Typography variant="h5" fontWeight="bold">{stats?.kycApproved?.toLocaleString()}</Typography>
                                <Typography variant="caption" color="text.secondary">Approved</Typography>
                            </div>
                            <div className="text-center">
                                <Typography variant="h5" fontWeight="bold" color="warning.main">{stats?.kycPending?.toLocaleString()}</Typography>
                                <Typography variant="caption" color="text.secondary">Pending</Typography>
                            </div>
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={kycPercent}
                            sx={{ height: 8, borderRadius: 4, bgcolor: "grey.200", "& .MuiLinearProgress-bar": { bgcolor: "primary.main" } }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            {kycPercent}% of members have completed KYC
                        </Typography>
                    </div>
                </Grid>

                {/* User Status */}
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                    <div className="widget-card p-6 h-full">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                                User Status
                            </Typography>
                            <i className="fas fa-user-shield text-amber-500 text-lg"></i>
                        </Box>

                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <div className="text-center">
                                <Typography variant="h5" fontWeight="bold">{stats?.activeMembers?.toLocaleString()}</Typography>
                                <Typography variant="caption" color="text.secondary">Active</Typography>
                            </div>
                            <div className="text-center">
                                <Typography variant="h5" fontWeight="bold" color="error.main">{stats?.blockedMembers?.toLocaleString()}</Typography>
                                <Typography variant="caption" color="text.secondary">Blocked</Typography>
                            </div>
                        </Box>

                        <LinearProgress
                            variant="determinate"
                            value={activePercent}
                            sx={{ height: 8, borderRadius: 4, bgcolor: "grey.200", "& .MuiLinearProgress-bar": { bgcolor: "primary.main" } }}
                        />
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
                            {activePercent}% of users are active
                        </Typography>
                    </div>
                </Grid>
            </Grid>

            {/* 3. CHARTS ROW */}
            <Grid container spacing={3} sx={{ mb: 3 }}>
                {/* Member Growth Chart */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <div className="widget-card p-6 w-full">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" fontWeight="bold">Member Growth</Typography>
                            {/* Charts currently mock dynamic data, so select is placeholder */}
                            <select className="text-sm border border-gray-300 rounded px-2 py-1 outline-none">
                                <option>Last 7 days</option>
                            </select>
                        </Box>
                        <Box sx={{ height: 300 }}>
                            <Line data={lineChartData} options={lineChartOptions} />
                        </Box>
                    </div>
                </Grid>

                {/* Points Transaction Chart */}
                <Grid size={{ xs: 12, lg: 6 }}>
                    <div className="widget-card p-6 w-full">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" fontWeight="bold">Points Transactions</Typography>
                            <select className="text-sm border border-gray-300 rounded px-2 py-1 outline-none">
                                <option>Last 7 days</option>
                            </select>
                        </Box>
                        <Box sx={{ height: 300 }}>
                            <Bar data={barChartData} options={barChartOptions} />
                        </Box>
                    </div>
                </Grid>
            </Grid>

            {/* 4. BOTTOM SECTION: QUICK ACTIONS, TRANSACTIONS, ETC */}
            <Grid container spacing={3}>
                {/* Quick Actions */}
                <Grid size={{ xs: 12, lg: 4 }}>
                    <div className="widget-card p-6 h-full w-full">
                        <Typography variant="h6" fontWeight="bold" mb={3}>Quick Actions</Typography>
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Button className="w-full justify-start py-3 px-4 bg-blue-50 hover:bg-blue-100 text-gray-700" startIcon={<i className="fas fa-user-plus text-blue-600"></i>}>
                                Add New Member
                            </Button>
                            <Button className="w-full justify-start py-3 px-4 bg-green-50 hover:bg-green-100 text-gray-700" startIcon={<i className="fas fa-qrcode text-green-600"></i>}>
                                Generate QR Code
                            </Button>
                            <Button className="w-full justify-start py-3 px-4 bg-purple-50 hover:bg-purple-100 text-gray-700" startIcon={<i className="fas fa-bullhorn text-purple-600"></i>}>
                                Create Campaign
                            </Button>
                            <Button className="w-full justify-start py-3 px-4 bg-orange-50 hover:bg-orange-100 text-gray-700" startIcon={<i className="fas fa-chart-line text-orange-600"></i>}>
                                View Reports
                            </Button>
                        </Box>
                    </div>
                </Grid>

                {/* Recent Transactions Table */}
                <Grid size={{ xs: 12, lg: 8 }}>
                    <div className="widget-card p-6 h-full w-full">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" fontWeight="bold">Recent Transactions</Typography>
                            <Button size="small" sx={{ textTransform: 'none' }}>View All</Button>
                        </Box>
                        <TableContainer>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>TRANSACTION ID</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>MEMBER</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>TYPE</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>POINTS</TableCell>
                                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 600 }}>TIME</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dashboardData?.recentActivity?.map((row: any) => (
                                        <TableRow key={row.id}>
                                            <TableCell sx={{ fontSize: '0.875rem' }}>{row.id}</TableCell>
                                            <TableCell sx={{ fontSize: '0.875rem' }}>{row.member}</TableCell>
                                            <TableCell>
                                                <span className={`badge ${row.typeClass}`}>{row.type}</span>
                                            </TableCell>
                                            <TableCell sx={{ fontWeight: 500 }} className={row.ptClass}>{row.points}</TableCell>
                                            <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{row.time}</TableCell>
                                        </TableRow>
                                    ))}
                                    {(!dashboardData?.recentActivity || dashboardData.recentActivity.length === 0) && (
                                        <TableRow>
                                            <TableCell colSpan={5} align="center">No recent transactions found</TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                </Grid>
            </Grid>

            {/* 5. TOP PERFORMERS & PENDING APPROVALS */}
            <Grid container spacing={3} sx={{ mt: 0 }}>
                {/* Top Performers */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <div className="widget-card p-6 w-full">
                        <Typography variant="h6" fontWeight="bold" mb={3}>Top Performers This Month</Typography>
                        <div className="space-y-4">
                            {dashboardData?.topPerformers?.map((p: any, i: number) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <div className={`h-10 w-10 rounded-full ${p.bg} flex items-center justify-center mr-3`}>
                                            <span className={`${p.text} font-bold`}>{p.initial}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">{p.name}</p>
                                            <p className="text-xs text-gray-500">{p.pts}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-semibold text-green-600">{p.change}</p>
                                        <p className="text-xs text-gray-400">vs last month</p>
                                    </div>
                                </div>
                            ))}
                            {(!dashboardData?.topPerformers || dashboardData.topPerformers.length === 0) && (
                                <Typography variant="body2" color="text.secondary" textAlign="center">No performance data available</Typography>
                            )}
                        </div>
                    </div>
                </Grid>

                {/* Pending Approvals */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <div className="widget-card p-6 w-full">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" fontWeight="bold">Pending Approvals</Typography>
                            <span className="badge badge-warning">{dashboardData?.pendingApprovalsCount ?? 0} items</span>
                        </Box>
                        {/* 
                           Note: The detailed list wasn't fetched in the light dashboard action.
                           Showing a placeholder or generic list if count > 0, or empty state.
                           For now, we'll show a "Go to Approvals" link if items exist.
                        */}
                        <div className="space-y-3">
                            {dashboardData?.pendingApprovalsCount > 0 ? (
                                <Box textAlign="center" py={2}>
                                    <Typography variant="body2" mb={2}>You have {dashboardData.pendingApprovalsCount} pending redemption requests.</Typography>
                                    <Button variant="outlined" size="small">View All Approvals</Button>
                                </Box>
                            ) : (
                                <Typography variant="body2" color="text.secondary" textAlign="center">No pending approvals</Typography>
                            )}
                        </div>
                    </div>
                </Grid>
            </Grid>
        </Box>
    );
}
