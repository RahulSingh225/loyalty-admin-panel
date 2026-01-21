"use client"

import React, { useState } from 'react'
import {
    Box,
    Grid,
    Typography,
    Tabs,
    Tab,
    Button,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    TextField
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getProcessDataAction } from '@/actions/process-actions'

export default function ProcessClient() {
    const { data } = useQuery({
        queryKey: ['process-data'],
        queryFn: () => getProcessDataAction(),
        staleTime: 60 * 1000,
    });

    if (!data) return null;

    const [activeTab, setActiveTab] = useState(0); // 0: Scan/Transaction, 1: Redemption, 2: Manual

    const getAvatarColor = (color: string) => {
        const colors: any = {
            blue: '#dbeafe',
            green: '#dcfce7',
            purple: '#f3e8ff',
            yellow: '#fef9c3',
            orange: '#ffedd5',
            red: '#fee2e2'
        };
        const textColors: any = {
            blue: '#1e40af',
            green: '#166534',
            purple: '#6b21a8',
            yellow: '#854d0e',
            orange: '#9a3412',
            red: '#991b1b'
        };
        return { bg: colors[color] || colors.blue, text: textColors[color] || textColors.blue };
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* TABS */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, val) => setActiveTab(val)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{
                        '& .MuiTab-root': {
                            textTransform: 'none',
                            fontWeight: 500,
                            minWidth: 'auto',
                            padding: '0.75rem 1rem',
                            color: 'text.secondary',
                            '&.Mui-selected': {
                                color: 'primary.main',
                            }
                        },
                        '& .MuiTabs-indicator': {
                            backgroundColor: 'primary.main',
                        }
                    }}
                >
                    <Tab label="Scan/Transaction Requests" />
                    <Tab label="Redemption Requests" />
                    <Tab label="Manual Entry" />
                </Tabs>
            </Box>

            {/* TAB CONTENTS */}
            {activeTab === 0 && (
                <Box>
                    {/* STATS */}
                    <Grid container spacing={3} mb={4}>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <div className="widget-card p-6">
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="subtitle2" color="text.secondary">Pending Requests</Typography>
                                    <i className="fas fa-clock text-orange-500"></i>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" mb={1}>{data.scanStats.pendingRequests}</Typography>
                                <Box display="flex" alignItems="center" fontSize="0.875rem">
                                    <span className="text-orange-600 font-medium">{data.scanStats.pendingRequestsToday}</span>
                                    <span className="text-gray-500 ml-2">today</span>
                                </Box>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <div className="widget-card p-6">
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="subtitle2" color="text.secondary">Approved Today</Typography>
                                    <i className="fas fa-check-circle text-green-500"></i>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" mb={1}>{data.scanStats.approvedToday}</Typography>
                                <Box display="flex" alignItems="center" fontSize="0.875rem">
                                    <span className="text-green-600 font-medium">{data.scanStats.approvedTodayTrend}</span>
                                    <span className="text-gray-500 ml-2">from yesterday</span>
                                </Box>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <div className="widget-card p-6">
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="subtitle2" color="text.secondary">Rejected Today</Typography>
                                    <i className="fas fa-times-circle text-red-500"></i>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" mb={1}>{data.scanStats.rejectedToday}</Typography>
                                <Box display="flex" alignItems="center" fontSize="0.875rem">
                                    <span className="text-red-600 font-medium">{data.scanStats.rejectedTodayTrend}</span>
                                    <span className="text-gray-500 ml-2">from yesterday</span>
                                </Box>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <div className="widget-card p-6">
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="subtitle2" color="text.secondary">Total Processed</Typography>
                                    <i className="fas fa-chart-line text-blue-500"></i>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" mb={1}>{data.scanStats.totalProcessed}</Typography>
                                <Box display="flex" alignItems="center" fontSize="0.875rem">
                                    <span className="text-blue-600 font-medium">{data.scanStats.totalProcessedTrend}</span>
                                    <span className="text-gray-500 ml-2">this week</span>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>

                    {/* TABLE */}
                    <div className="widget-card p-6">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography variant="h6" fontWeight="600">Pending Scan/Transaction Requests</Typography>
                            <Box display="flex" gap={1}>
                                <Button variant="outlined" size="small" sx={{ textTransform: 'none', color: 'text.secondary', borderColor: 'divider' }}>
                                    <i className="fas fa-filter mr-1"></i> Filter
                                </Button>
                                <Button variant="outlined" size="small" sx={{ textTransform: 'none', color: 'text.secondary', borderColor: 'divider' }}>
                                    <i className="fas fa-download mr-1"></i> Export
                                </Button>
                            </Box>
                        </Box>

                        <TableContainer sx={{ boxShadow: 'none' }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ '& th': { borderBottom: '1px solid #f1f5f9' } }}>
                                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>Request ID</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>User</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>Type</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>Amount</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>Date/Time</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.scanRequests.map((req: any) => {
                                        const { bg, text } = getAvatarColor(req.color);
                                        return (
                                            <TableRow key={req.id} hover sx={{ '& td': { borderBottom: '1px solid #f1f5f9' } }}>
                                                <TableCell sx={{ fontWeight: 500 }}>{req.id}</TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar sx={{ width: 32, height: 32, mr: 1, fontSize: '0.75rem', bgcolor: bg, color: text, fontWeight: 600 }}>
                                                            {req.initials}
                                                        </Avatar>
                                                        <Typography variant="body2">{req.user}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`badge ${req.type === 'Scan' ? 'badge-primary' : 'badge-success'}`}>
                                                        {req.type}
                                                    </span>
                                                </TableCell>
                                                <TableCell>{req.amount}</TableCell>
                                                <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{req.dateTime}</TableCell>
                                                <TableCell>
                                                    <Box display="flex" gap={2}>
                                                        <button className="text-green-600 hover:text-green-900 font-medium text-sm transition">Approve</button>
                                                        <button className="text-red-600 hover:text-red-900 font-medium text-sm transition">Reject</button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* PAGINATION */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                            <Typography variant="body2" color="text.secondary">Showing 1 to 4 of 42 entries</Typography>
                            <Box display="flex" gap={1}>
                                <Button variant="outlined" size="small" sx={{ borderColor: 'divider', color: 'text.primary', textTransform: 'none' }}>Previous</Button>
                                <Button variant="contained" size="small" sx={{ minWidth: 32, textTransform: 'none' }}>1</Button>
                                <Button variant="outlined" size="small" sx={{ minWidth: 32, borderColor: 'divider', color: 'text.primary', textTransform: 'none' }}>2</Button>
                                <Button variant="outlined" size="small" sx={{ minWidth: 32, borderColor: 'divider', color: 'text.primary', textTransform: 'none' }}>3</Button>
                                <Button variant="outlined" size="small" sx={{ borderColor: 'divider', color: 'text.primary', textTransform: 'none' }}>Next</Button>
                            </Box>
                        </Box>
                    </div>
                </Box>
            )}

            {activeTab === 1 && (
                <Box>
                    {/* REDEMPTION STATS */}
                    <Grid container spacing={3} mb={4}>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <div className="widget-card p-6">
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="subtitle2" color="text.secondary">Pending Redemptions</Typography>
                                    <i className="fas fa-clock text-orange-500"></i>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" mb={1}>{data.redemptionStats.pendingRedemptions}</Typography>
                                <Box display="flex" alignItems="center" fontSize="0.875rem">
                                    <span className="text-orange-600 font-medium">{data.redemptionStats.pendingRedemptionsToday}</span>
                                    <span className="text-gray-500 ml-2">today</span>
                                </Box>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <div className="widget-card p-6">
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="subtitle2" color="text.secondary">Approved Today</Typography>
                                    <i className="fas fa-check-circle text-green-500"></i>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" mb={1}>{data.redemptionStats.approvedRedemptionsToday}</Typography>
                                <Box display="flex" alignItems="center" fontSize="0.875rem">
                                    <span className="text-green-600 font-medium">{data.redemptionStats.approvedRedemptionsTodayTrend}</span>
                                    <span className="text-gray-500 ml-2">from yesterday</span>
                                </Box>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <div className="widget-card p-6">
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="subtitle2" color="text.secondary">Rejected Today</Typography>
                                    <i className="fas fa-times-circle text-red-500"></i>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" mb={1}>{data.redemptionStats.rejectedRedemptionsToday}</Typography>
                                <Box display="flex" alignItems="center" fontSize="0.875rem">
                                    <span className="text-red-600 font-medium">{data.redemptionStats.rejectedRedemptionsTodayTrend}</span>
                                    <span className="text-gray-500 ml-2">from yesterday</span>
                                </Box>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <div className="widget-card p-6">
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="subtitle2" color="text.secondary">Total Value Today</Typography>
                                    <i className="fas fa-rupee-sign text-blue-500"></i>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" mb={1}>{data.redemptionStats.totalValueToday}</Typography>
                                <Box display="flex" alignItems="center" fontSize="0.875rem">
                                    <span className="text-blue-600 font-medium">{data.redemptionStats.totalValueTodayTrend}</span>
                                    <span className="text-gray-500 ml-2">from yesterday</span>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>

                    {/* REDEMPTION TABLE */}
                    <div className="widget-card p-6">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                            <Typography variant="h6" fontWeight="600">Pending Redemption Requests</Typography>
                            <Box display="flex" gap={1}>
                                <Button variant="outlined" size="small" sx={{ textTransform: 'none', color: 'text.secondary', borderColor: 'divider' }}>
                                    <i className="fas fa-filter mr-1"></i> Filter
                                </Button>
                                <Button variant="outlined" size="small" sx={{ textTransform: 'none', color: 'text.secondary', borderColor: 'divider' }}>
                                    <i className="fas fa-download mr-1"></i> Export
                                </Button>
                            </Box>
                        </Box>

                        <TableContainer sx={{ boxShadow: 'none' }}>
                            <Table sx={{ minWidth: 650 }}>
                                <TableHead>
                                    <TableRow sx={{ '& th': { borderBottom: '1px solid #f1f5f9' } }}>
                                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>Request ID</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>User</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>Points</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>Value</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>Date/Time</TableCell>
                                        <TableCell sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.redemptionRequests.map((req: any) => {
                                        const { bg, text } = getAvatarColor(req.color);
                                        return (
                                            <TableRow key={req.id} hover sx={{ '& td': { borderBottom: '1px solid #f1f5f9' } }}>
                                                <TableCell sx={{ fontWeight: 500 }}>{req.id}</TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center">
                                                        <Avatar sx={{ width: 32, height: 32, mr: 1, fontSize: '0.75rem', bgcolor: bg, color: text, fontWeight: 600 }}>
                                                            {req.initials}
                                                        </Avatar>
                                                        <Typography variant="body2">{req.user}</Typography>
                                                    </Box>
                                                </TableCell>
                                                <TableCell>{req.points}</TableCell>
                                                <TableCell>{req.value}</TableCell>
                                                <TableCell sx={{ color: 'text.secondary', fontSize: '0.875rem' }}>{req.dateTime}</TableCell>
                                                <TableCell>
                                                    <Box display="flex" gap={2}>
                                                        <button className="text-green-600 hover:text-green-900 font-medium text-sm transition">Approve</button>
                                                        <button className="text-red-600 hover:text-red-900 font-medium text-sm transition">Reject</button>
                                                    </Box>
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>

                        {/* PAGINATION */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                            <Typography variant="body2" color="text.secondary">Showing 1 to 3 of 28 entries</Typography>
                            <Box display="flex" gap={1}>
                                <Button variant="outlined" size="small" sx={{ borderColor: 'divider', color: 'text.primary', textTransform: 'none' }}>Previous</Button>
                                <Button variant="contained" size="small" sx={{ minWidth: 32, textTransform: 'none' }}>1</Button>
                                <Button variant="outlined" size="small" sx={{ minWidth: 32, borderColor: 'divider', color: 'text.primary', textTransform: 'none' }}>2</Button>
                                <Button variant="outlined" size="small" sx={{ borderColor: 'divider', color: 'text.primary', textTransform: 'none' }}>Next</Button>
                            </Box>
                        </Box>
                    </div>
                </Box>
            )}

            {activeTab === 2 && (
                <Box>
                    {/* MANUAL ENTRY FORM */}
                    <div className="widget-card p-8 max-w-2xl mx-auto">
                        <Typography variant="h6" fontWeight="600" mb={4}>Manual Points Entry</Typography>
                        <Grid container spacing={3}>
                            <Grid size={{ xs: 12 }}>
                                <Box>
                                    <Typography variant="subtitle2" mb={1} color="text.secondary" fontWeight={500}>Select Member</Typography>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-sm">
                                        <option>Search for member...</option>
                                        <option>John Doe (RT-001)</option>
                                        <option>Alice Smith (EL-042)</option>
                                    </select>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="subtitle2" mb={1} color="text.secondary" fontWeight={500}>Entry Type</Typography>
                                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-sm">
                                        <option>Scan Adjustment</option>
                                        <option>Bonus Points</option>
                                        <option>Referral Reward</option>
                                        <option>Correction</option>
                                    </select>
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Box>
                                    <Typography variant="subtitle2" mb={1} color="text.secondary" fontWeight={500}>Points / Amount</Typography>
                                    <TextField fullWidth size="small" placeholder="0" type="number"
                                        sx={{
                                            '& .MuiOutlinedInput-root': { borderRadius: '8px' },
                                            '& input': { padding: '9px 14px' }
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Box>
                                    <Typography variant="subtitle2" mb={1} color="text.secondary" fontWeight={500}>Reason / Remarks</Typography>
                                    <TextField fullWidth multiline rows={4} placeholder="Enter reason for manual entry..."
                                        sx={{
                                            '& .MuiOutlinedInput-root': { borderRadius: '8px' }
                                        }}
                                    />
                                </Box>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Box display="flex" justifyContent="flex-end" gap={2} mt={1}>
                                    <Button variant="outlined" sx={{ textTransform: 'none', px: 3, borderRadius: '8px', color: 'text.primary', borderColor: 'divider' }}>Cancel</Button>
                                    <Button variant="contained" sx={{ textTransform: 'none', px: 3, borderRadius: '8px' }}>Submit Entry</Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </div>
                </Box>
            )}
        </Box>
    )
}
