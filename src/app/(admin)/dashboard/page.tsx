"use client";

import { useState } from "react";
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  LinearProgress,
  IconButton,
  TextField,
  MenuItem,
  Select,
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

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect("/login");
    },
  });

  // -- State for Charts & Filters --
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" });
  const [chartData, setChartData] = useState({
    memberGrowth: [45, 52, 38, 65, 48, 72, 58],
    pointsEarned: [12500, 15200, 11800, 18500, 14200, 22000, 16800],
    pointsRedeemed: [8500, 9200, 7800, 10500, 8200, 12000, 9800],
  });

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // -- handlers --
  const handleApplyFilter = () => {
    // Logic to fetch new data based on dateFilter
    // keeping it simple for UI demo
    console.log("Applying filter:", dateFilter);
  };

  // -- Chart Configs --
  const lineChartData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "New Members",
        data: chartData.memberGrowth,
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
        data: chartData.pointsEarned,
        backgroundColor: "#10b981",
        borderRadius: 5,
        barPercentage: 0.6,
      },
      {
        label: "Points Redeemed",
        data: chartData.pointsRedeemed,
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

  return (
    <Box>
      {/* 1. KEY METRICS ROW */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Total Members */}
        <Grid item xs={12} sm={6} md={3}>
          <div className="widget-card p-6 h-full w-full">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                Total Members
              </Typography>
              <i className="fas fa-users text-blue-500 text-lg"></i>
            </Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
              12,847
            </Typography>
            <Box display="flex" alignItems="center" fontSize="0.875rem">
              <span className="text-green-600 font-medium mr-2">+12.5%</span>
              <span className="text-gray-500">from last month</span>
            </Box>
          </div>
        </Grid>

        {/* Active Members */}
        <Grid item xs={12} sm={6} md={3}>
          <div className="widget-card p-6 h-full w-full">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                Active Members
              </Typography>
              <i className="fas fa-user-check text-green-500 text-lg"></i>
            </Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
              8,432
            </Typography>
            <Box display="flex" alignItems="center" fontSize="0.875rem">
              <span className="text-green-600 font-medium mr-2">+8.2%</span>
              <span className="text-gray-500">from last month</span>
            </Box>
          </div>
        </Grid>

        {/* Total Points Issued */}
        <Grid item xs={12} sm={6} md={3}>
          <div className="widget-card p-6 h-full w-full">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                Total Points Issued
              </Typography>
              <i className="fas fa-coins text-yellow-500 text-lg"></i>
            </Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
              2.4M
            </Typography>
            <Box display="flex" alignItems="center" fontSize="0.875rem">
              <span className="text-green-600 font-medium mr-2">+18.7%</span>
              <span className="text-gray-500">from last month</span>
            </Box>
          </div>
        </Grid>

        {/* Points Redeemed */}
        <Grid item xs={12} sm={6} md={3}>
          <div className="widget-card p-6 h-full w-full">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                Points Redeemed
              </Typography>
              <i className="fas fa-gift text-purple-500 text-lg"></i>
            </Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
              1.8M
            </Typography>
            <Box display="flex" alignItems="center" fontSize="0.875rem">
              <span className="text-orange-600 font-medium mr-2">+5.3%</span>
              <span className="text-gray-500">from last month</span>
            </Box>
          </div>
        </Grid>
      </Grid>

      {/* 2. SECOND METRICS ROW (Scans, KYC, User Status) */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Total Scans with Date Filter */}
        <Grid item xs={12} sm={6} md={4}>
          <div className="widget-card p-6 h-full w-full">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                Total Scans
              </Typography>
              <i className="fas fa-qrcode text-indigo-500 text-lg"></i>
            </Box>
            <Typography variant="h5" fontWeight="bold" color="text.primary" gutterBottom>
              24,832
            </Typography>
            <Box display="flex" alignItems="center" fontSize="0.875rem" mb={2}>
              <span className="text-green-600 font-medium mr-2">+15.2%</span>
              <span className="text-gray-500">from last period</span>
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
        <Grid item xs={12} sm={6} md={4}>
          <div className="widget-card p-6 h-full">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                KYC Status
              </Typography>
              <i className="fas fa-user-check text-teal-500 text-lg"></i>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <div className="text-center">
                <Typography variant="h5" fontWeight="bold">9,523</Typography>
                <Typography variant="caption" color="text.secondary">Approved</Typography>
              </div>
              <div className="text-center">
                <Typography variant="h5" fontWeight="bold" color="warning.main">3,324</Typography>
                <Typography variant="caption" color="text.secondary">Pending</Typography>
              </div>
            </Box>

            <LinearProgress
              variant="determinate"
              value={74}
              sx={{ height: 8, borderRadius: 4, bgcolor: "grey.200", "& .MuiLinearProgress-bar": { bgcolor: "primary.main" } }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              74% of members have completed KYC
            </Typography>
          </div>
        </Grid>

        {/* User Status */}
        <Grid item xs={12} sm={6} md={4}>
          <div className="widget-card p-6 h-full">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <Typography variant="subtitle2" color="text.secondary" fontWeight={500}>
                User Status
              </Typography>
              <i className="fas fa-user-shield text-amber-500 text-lg"></i>
            </Box>

            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
              <div className="text-center">
                <Typography variant="h5" fontWeight="bold">10,428</Typography>
                <Typography variant="caption" color="text.secondary">Active</Typography>
              </div>
              <div className="text-center">
                <Typography variant="h5" fontWeight="bold" color="error.main">2,419</Typography>
                <Typography variant="caption" color="text.secondary">Blocked</Typography>
              </div>
            </Box>

            <LinearProgress
              variant="determinate"
              value={81}
              sx={{ height: 8, borderRadius: 4, bgcolor: "grey.200", "& .MuiLinearProgress-bar": { bgcolor: "primary.main" } }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: "block" }}>
              81% of users are active
            </Typography>
          </div>
        </Grid>
      </Grid>

      {/* 3. CHARTS ROW */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Member Growth Chart */}
        <Grid item xs={12} lg={6}>
          <div className="widget-card p-6 w-full">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">Member Growth</Typography>
              <select className="text-sm border border-gray-300 rounded px-2 py-1 outline-none">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
              </select>
            </Box>
            <Box sx={{ height: 300 }}>
              <Line data={lineChartData} options={lineChartOptions} />
            </Box>
          </div>
        </Grid>

        {/* Points Transaction Chart */}
        <Grid item xs={12} lg={6}>
          <div className="widget-card p-6 w-full">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">Points Transactions</Typography>
              <select className="text-sm border border-gray-300 rounded px-2 py-1 outline-none">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 3 months</option>
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
        <Grid item xs={12} lg={4}>
          <div className="widget-card p-6 h-full w-full">
            <Typography variant="h6" fontWeight="bold" mb={3}>Quick Actions</Typography>
            <Box display="flex" flexDirection="column" gap={2}>
              <button className="w-full text-left px-4 py-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition flex items-center justify-between group cursor-pointer border-none">
                <div className="flex items-center">
                  <i className="fas fa-user-plus text-blue-600 mr-3 w-5 text-center"></i>
                  <span className="text-sm font-medium text-gray-700">Add New Member</span>
                </div>
                <i className="fas fa-arrow-right text-blue-600 opacity-0 group-hover:opacity-100 transition"></i>
              </button>

              <button className="w-full text-left px-4 py-3 bg-green-50 hover:bg-green-100 rounded-lg transition flex items-center justify-between group cursor-pointer border-none">
                <div className="flex items-center">
                  <i className="fas fa-qrcode text-green-600 mr-3 w-5 text-center"></i>
                  <span className="text-sm font-medium text-gray-700">Generate QR Code</span>
                </div>
                <i className="fas fa-arrow-right text-green-600 opacity-0 group-hover:opacity-100 transition"></i>
              </button>

              <button className="w-full text-left px-4 py-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition flex items-center justify-between group cursor-pointer border-none">
                <div className="flex items-center">
                  <i className="fas fa-bullhorn text-purple-600 mr-3 w-5 text-center"></i>
                  <span className="text-sm font-medium text-gray-700">Create Campaign</span>
                </div>
                <i className="fas fa-arrow-right text-purple-600 opacity-0 group-hover:opacity-100 transition"></i>
              </button>

              <button className="w-full text-left px-4 py-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition flex items-center justify-between group cursor-pointer border-none">
                <div className="flex items-center">
                  <i className="fas fa-chart-line text-orange-600 mr-3 w-5 text-center"></i>
                  <span className="text-sm font-medium text-gray-700">View Reports</span>
                </div>
                <i className="fas fa-arrow-right text-orange-600 opacity-0 group-hover:opacity-100 transition"></i>
              </button>
            </Box>
          </div>
        </Grid>

        {/* Recent Transactions Table */}
        <Grid item xs={12} lg={8}>
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
                  {[
                    { id: "#TXN-2847", member: "John Doe", type: "Earned", points: "+250", time: "2 mins ago", typeClass: "badge-success", ptClass: "text-green-600" },
                    { id: "#TXN-2846", member: "Alice Smith", type: "Redeemed", points: "-500", time: "5 mins ago", typeClass: "badge-warning", ptClass: "text-red-600" },
                    { id: "#TXN-2845", member: "Robert Johnson", type: "Earned", points: "+180", time: "12 mins ago", typeClass: "badge-success", ptClass: "text-green-600" },
                    { id: "#TXN-2844", member: "Emma Wilson", type: "Earned", points: "+320", time: "18 mins ago", typeClass: "badge-success", ptClass: "text-green-600" },
                  ].map((row) => (
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
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </Grid>
      </Grid>

      {/* 5. TOP PERFORMERS & PENDING APPROVALS */}
      <Grid container spacing={3} sx={{ mt: 0 }}>
        {/* Top Performers */}
        <Grid item xs={12} md={6}>
          <div className="widget-card p-6 w-full">
            <Typography variant="h6" fontWeight="bold" mb={3}>Top Performers This Month</Typography>
            <div className="space-y-4">
              {[
                { name: "Michael Chen", pts: "2,450 points", change: "+28%", rank: 1, initial: "1", bg: "bg-yellow-100", text: "text-yellow-800" },
                { name: "Sarah Williams", pts: "2,180 points", change: "+15%", rank: 2, initial: "2", bg: "bg-gray-100", text: "text-gray-800" },
                { name: "David Martinez", pts: "1,920 points", change: "+32%", rank: 3, initial: "3", bg: "bg-orange-100", text: "text-orange-800" },
              ].map((p, i) => (
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
            </div>
          </div>
        </Grid>

        {/* Pending Approvals */}
        <Grid item xs={12} md={6}>
          <div className="widget-card p-6 w-full">
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h6" fontWeight="bold">Pending Approvals</Typography>
              <span className="badge badge-warning">12 items</span>
            </Box>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Redemption Request</p>
                  <p className="text-xs text-gray-500">John Doe - 500 points</p>
                </div>
                <button className="text-xs font-medium text-orange-600 hover:text-orange-800 uppercase border-none bg-transparent cursor-pointer">Review</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Scan Transaction</p>
                  <p className="text-xs text-gray-500">Alice Smith - ₹2,500</p>
                </div>
                <button className="text-xs font-medium text-blue-600 hover:text-blue-800 uppercase border-none bg-transparent cursor-pointer">Review</button>
              </div>
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900">Bulk Points Credit</p>
                  <p className="text-xs text-gray-500">45 members - 22,500 points</p>
                </div>
                <button className="text-xs font-medium text-purple-600 hover:text-purple-800 uppercase border-none bg-transparent cursor-pointer">Review</button>
              </div>
            </div>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
}