"use client"

import React, { useState } from 'react'
import {
    Box,
    Grid,
    Typography,
    Tabs,
    Tab,
    Button,
    TextField,
    MenuItem,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert,
    Avatar
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getTicketsAction } from '@/actions/ticket-actions'

// --- TYPES ---
export default function TicketsClient() {
    // React Query Fetching
    // Since we use HydrationBoundary in the parent, this useQuery will 
    // immediately return the pre-fetched data from the server.
    const { data: tickets = [], isLoading, error } = useQuery({
        queryKey: ['tickets'],
        queryFn: () => getTicketsAction(),
        staleTime: 60 * 1000,
    })

    const [activeTab, setActiveTab] = useState(0) // 0: All, 1: Open, 2: In Progress, 3: Resolved, 4: Closed
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Helpers
    const getPriorityColor = (p: string) => {
        if (p === 'High') return 'badge-danger'
        if (p === 'Medium') return 'badge-warning'
        return 'badge-success'
    }

    const getStatusColor = (s: string) => {
        if (s === 'Open') return 'badge-warning'
        if (s === 'In Progress') return 'badge-primary'
        if (s === 'Resolved') return 'badge-success'
        return 'badge-secondary'
    }

    const getBorderClass = (p: string) => {
        if (p === 'High') return 'border-l-4 border-l-red-500'
        if (p === 'Medium') return 'border-l-4 border-l-amber-500'
        if (p === 'Low') return 'border-l-4 border-l-emerald-500'
        return ''
    }

    // Filter Logic (Client-side for now, can move to server)
    const getFilteredTickets = () => {
        if (!tickets) return []

        // Helper to safely get status name
        const getStatusName = (t: any) => t.status?.name || t.status || 'Open'

        if (activeTab === 0) return tickets
        if (activeTab === 1) return tickets.filter((t: any) => getStatusName(t) === 'Open')
        if (activeTab === 2) return tickets.filter((t: any) => getStatusName(t) === 'In Progress')
        if (activeTab === 3) return tickets.filter((t: any) => getStatusName(t) === 'Resolved')
        if (activeTab === 4) return tickets.filter((t: any) => getStatusName(t) === 'Closed')
        return tickets
    }

    const filteredTickets = getFilteredTickets()

    // Handlers
    const handleCreate = () => {
        // Logic would go here
        setIsModalOpen(false)
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
                    <Tab label="All Tickets" />
                    <Tab label="Open" />
                    <Tab label="In Progress" />
                    <Tab label="Resolved" />
                    <Tab label="Closed" />
                </Tabs>
            </Box>

            {/* KPI CARDS - Dynamic based on fetched data */}
            {activeTab === 0 && (
                <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={6} lg={3}>
                        <div className="widget-card p-6 rounded-xl shadow">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle2" color="text.secondary">Total Tickets</Typography>
                                <i className="fas fa-ticket-alt text-blue-500"></i>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" mb={1}>{tickets.length}</Typography>
                            <Box display="flex" alignItems="center" fontSize="0.875rem">
                                <span className="text-gray-500">Real-time data</span>
                            </Box>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <div className="widget-card p-6 rounded-xl shadow">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle2" color="text.secondary">Open Tickets</Typography>
                                <i className="fas fa-exclamation-circle text-orange-500"></i>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" mb={1}>
                                {tickets.filter((t: any) => (t.status?.name || t.status) === 'Open').length}
                            </Typography>
                            <Box display="flex" alignItems="center" fontSize="0.875rem">
                                <span className="text-gray-500">requiring attention</span>
                            </Box>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <div className="widget-card p-6 rounded-xl shadow">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle2" color="text.secondary">In Progress</Typography>
                                <i className="fas fa-spinner text-blue-500"></i>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" mb={1}>
                                {tickets.filter((t: any) => (t.status?.name || t.status) === 'In Progress').length}
                            </Typography>
                            <Box display="flex" alignItems="center" fontSize="0.875rem">
                                <span className="text-gray-500">being worked on</span>
                            </Box>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <div className="widget-card p-6 rounded-xl shadow">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle2" color="text.secondary">Resolved Today</Typography>
                                <i className="fas fa-check-circle text-green-500"></i>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" mb={1}>
                                {tickets.filter((t: any) => (t.status?.name || t.status) === 'Resolved').length}
                            </Typography>
                            <Box display="flex" alignItems="center" fontSize="0.875rem">
                                <span className="text-gray-500">completed</span>
                            </Box>
                        </div>
                    </Grid>
                </Grid>
            )}

            {/* FILTERS */}
            <div className="widget-card p-4 mb-6 rounded-xl shadow">
                <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
                    <Box flex={1} minWidth={200}>
                        <input type="text" placeholder="Search tickets..." className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500" />
                    </Box>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
                        <option>All Priority</option>
                        <option>High</option>
                        <option>Medium</option>
                        <option>Low</option>
                    </select>
                    <Button variant="contained" sx={{ textTransform: 'none' }} onClick={() => setIsModalOpen(true)}>
                        <i className="fas fa-plus mr-2"></i> Create Ticket
                    </Button>
                </Box>
            </div>

            {/* LIST OR ERROR */}
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>Failed to load tickets: {(error as Error).message}</Alert>
            )}

            {/* TICKETS LIST */}
            <div className="widget-card p-6 rounded-xl shadow">
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                    <Typography variant="h6" fontWeight="600">
                        {activeTab === 0 ? 'All Tickets' :
                            activeTab === 1 ? 'Open Tickets' :
                                activeTab === 2 ? 'Tickets In Progress' :
                                    activeTab === 3 ? 'Resolved Tickets' : 'Closed Tickets'}
                    </Typography>
                    <Button variant="outlined" size="small" sx={{ textTransform: 'none', color: 'text.secondary', borderColor: 'divider' }}>
                        <i className="fas fa-download mr-1"></i> Export
                    </Button>
                </Box>

                {isLoading ? (
                    <Box display="flex" justifyContent="center" p={4}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box display="flex" flexDirection="column" gap={2}>
                        {filteredTickets.length === 0 ? (
                            <Typography color="text.secondary" textAlign="center" py={4}>No tickets found.</Typography>
                        ) : (
                            filteredTickets.map((ticket: any) => (
                                <div key={ticket.id} className={`p-6 border border-gray-200 rounded-xl hover:shadow-md transition cursor-pointer ${getBorderClass(ticket.priority || 'Low')}`}>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="subtitle2" fontWeight="600">#{ticket.id}</Typography>
                                            <span className={`badge ${getPriorityColor(ticket.priority || 'Low')}`}>{ticket.priority || 'Low'}</span>
                                            <span className={`badge ${getStatusColor(ticket.status?.name || ticket.status || 'Open')}`}>{ticket.status?.name || ticket.status || 'Open'}</span>
                                        </Box>
                                        <Typography variant="caption" color="text.secondary">
                                            {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight="600" mb={1}>{ticket.subject}</Typography>
                                    <Typography variant="body2" color="text.secondary" mb={2}>{ticket.description || ticket.subject}</Typography>

                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box display="flex" alignItems="center">
                                            <Avatar sx={{ width: 32, height: 32, mr: 1, fontSize: '0.875rem' }}>U</Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontSize="0.875rem">User {ticket.requester || ticket.createdBy}</Typography>
                                            </Box>
                                        </Box>
                                        <Box display="flex" gap={1}>
                                            <Button size="small" sx={{ minWidth: 0, px: 1 }} color="primary">View</Button>
                                            <Button size="small" sx={{ minWidth: 0, px: 1 }} color="success">Assign</Button>
                                            <Button size="small" sx={{ minWidth: 0, px: 1 }} color="secondary">Resolve</Button>
                                        </Box>
                                    </Box>
                                </div>
                            ))
                        )}
                    </Box>
                )}

                {/* PAGINATION */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                    <Typography variant="body2" color="text.secondary">Showing {filteredTickets.length} tickets</Typography>
                    <Box display="flex" gap={1}>
                        <Button variant="outlined" size="small" disabled>Previous</Button>
                        <Button variant="contained" size="small">1</Button>
                        <Button variant="outlined" size="small">Next</Button>
                    </Box>
                </Box>
            </div>

            {/* CREATE TICKET MODAL */}
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle display="flex" justifyContent="space-between" alignItems="center">
                    Create New Ticket
                    <IconButton onClick={() => setIsModalOpen(false)} size="small"><i className="fas fa-times"></i></IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Grid container spacing={2} pt={1}>
                        <Grid item xs={12}>
                            <Box mb={2}>
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    This form will be connected to a Server Action using <code>useMutation</code>.
                                </Alert>
                                <Typography variant="subtitle2" mb={0.5}>Customer Email</Typography>
                                <TextField fullWidth size="small" placeholder="Enter customer email" />
                            </Box>
                        </Grid>
                        {/* Simplified fields for demo */}
                        <Grid item xs={12}>
                            <Box mb={2}>
                                <Typography variant="subtitle2" mb={0.5}>Subject</Typography>
                                <TextField fullWidth size="small" placeholder="Enter ticket subject" />
                            </Box>
                        </Grid>
                        <Grid item xs={12}>
                            <Box>
                                <Typography variant="subtitle2" mb={0.5}>Description</Typography>
                                <TextField fullWidth multiline rows={4} placeholder="Enter ticket description" />
                            </Box>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button variant="outlined" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleCreate}>Create Ticket</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
