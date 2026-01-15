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
    Chip,
    Avatar
} from '@mui/material'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

// --- TYPES ---
type TicketStatus = 'Open' | 'In Progress' | 'Resolved' | 'Closed'
type TicketPriority = 'High' | 'Medium' | 'Low'

interface Ticket {
    id: string
    priority: TicketPriority
    status: TicketStatus
    time: string
    subject: string
    desc: string
    user: {
        name: string
        email: string
        initials: string
        color: string // Tailwind bg class for avatar
    }
}

// --- DUMMY DATA ---
const ALL_TICKETS: Ticket[] = [
    {
        id: '#TCK-2847',
        priority: 'High',
        status: 'Open',
        time: '2 hours ago',
        subject: 'Points not credited after purchase',
        desc: "Customer purchased items worth ₹5,000 but points haven't been credited to their account after 24 hours.",
        user: { name: 'John Doe', email: 'john.doe@email.com', initials: 'JD', color: 'bg-blue-100 text-blue-800' }
    },
    {
        id: '#TCK-2846',
        priority: 'Medium',
        status: 'In Progress',
        time: '5 hours ago',
        subject: 'Unable to redeem points',
        desc: 'Customer is trying to redeem 500 points but getting an error message "Insufficient points" despite having sufficient balance.',
        user: { name: 'Alice Smith', email: 'alice.smith@email.com', initials: 'AS', color: 'bg-green-100 text-green-800' }
    },
    {
        id: '#TCK-2845',
        priority: 'Low',
        status: 'Resolved',
        time: '1 day ago',
        subject: 'Account login issue',
        desc: 'Customer was unable to login to their account. Password reset was sent and issue was resolved.',
        user: { name: 'Robert Johnson', email: 'robert.j@email.com', initials: 'RJ', color: 'bg-purple-100 text-purple-800' }
    },
]

export default function TicketsPage() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            redirect('/login')
        }
    })

    const [activeTab, setActiveTab] = useState(0) // 0: All, 1: Open, 2: In Progress, 3: Resolved, 4: Closed
    const [isModalOpen, setIsModalOpen] = useState(false)

    // Filter Logic
    const getFilteredTickets = () => {
        if (activeTab === 0) return ALL_TICKETS
        if (activeTab === 1) return ALL_TICKETS.filter(t => t.status === 'Open')
        if (activeTab === 2) return ALL_TICKETS.filter(t => t.status === 'In Progress')
        if (activeTab === 3) return ALL_TICKETS.filter(t => t.status === 'Resolved')
        if (activeTab === 4) return ALL_TICKETS.filter(t => t.status === 'Closed')
        return ALL_TICKETS
    }

    const filteredTickets = getFilteredTickets()

    // Helpers
    const getPriorityColor = (p: TicketPriority) => {
        if (p === 'High') return 'badge-danger'
        if (p === 'Medium') return 'badge-warning'
        return 'badge-success'
    }

    const getStatusColor = (s: TicketStatus) => {
        if (s === 'Open') return 'badge-warning'
        if (s === 'In Progress') return 'badge-primary'
        if (s === 'Resolved') return 'badge-success'
        return 'badge-secondary'
    }

    const getBorderClass = (p: TicketPriority) => {
        if (p === 'High') return 'border-l-4 border-l-red-500'
        if (p === 'Medium') return 'border-l-4 border-l-amber-500'
        if (p === 'Low') return 'border-l-4 border-l-emerald-500'
        return ''
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
                    <Tab label="All Tickets" />
                    <Tab label="Open" />
                    <Tab label="In Progress" />
                    <Tab label="Resolved" />
                    <Tab label="Closed" />
                </Tabs>
            </Box>

            {/* KPI CARDS (Only show for All Tickets tab as per ref? Actually ref shows them inside the tab content. Let's keep them static or dynamic based on tab? Ref implies they are inside 'All Tickets' tab. Let's put them there.) */}
            {activeTab === 0 && (
                <Grid container spacing={3} mb={3}>
                    <Grid item xs={12} md={6} lg={3}>
                        <div className="widget-card p-6 rounded-xl shadow">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle2" color="text.secondary">Total Tickets</Typography>
                                <i className="fas fa-ticket-alt text-blue-500"></i>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" mb={1}>342</Typography>
                            <Box display="flex" alignItems="center" fontSize="0.875rem">
                                <span className="text-green-600 mr-2">+24</span>
                                <span className="text-gray-500">this week</span>
                            </Box>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <div className="widget-card p-6 rounded-xl shadow">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle2" color="text.secondary">Open Tickets</Typography>
                                <i className="fas fa-exclamation-circle text-orange-500"></i>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" mb={1}>28</Typography>
                            <Box display="flex" alignItems="center" fontSize="0.875rem">
                                <span className="text-orange-600 mr-2">+5</span>
                                <span className="text-gray-500">today</span>
                            </Box>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <div className="widget-card p-6 rounded-xl shadow">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle2" color="text.secondary">In Progress</Typography>
                                <i className="fas fa-spinner text-blue-500"></i>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" mb={1}>15</Typography>
                            <Box display="flex" alignItems="center" fontSize="0.875rem">
                                <span className="text-blue-600 mr-2">-2</span>
                                <span className="text-gray-500">from yesterday</span>
                            </Box>
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6} lg={3}>
                        <div className="widget-card p-6 rounded-xl shadow">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle2" color="text.secondary">Resolved Today</Typography>
                                <i className="fas fa-check-circle text-green-500"></i>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" mb={1}>12</Typography>
                            <Box display="flex" alignItems="center" fontSize="0.875rem">
                                <span className="text-green-600 mr-2">+4</span>
                                <span className="text-gray-500">from yesterday</span>
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
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
                        <option>All Category</option>
                        <option>Account Issues</option>
                        <option>Points Inquiry</option>
                    </select>
                    <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white">
                        <option>All Assignee</option>
                        <option>Unassigned</option>
                        <option>John Doe</option>
                    </select>
                    <Button variant="contained" sx={{ textTransform: 'none' }} onClick={() => setIsModalOpen(true)}>
                        <i className="fas fa-plus mr-2"></i> Create Ticket
                    </Button>
                </Box>
            </div>

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

                <Box display="flex" flexDirection="column" gap={2}>
                    {filteredTickets.length === 0 ? (
                        <Typography color="text.secondary" textAlign="center" py={4}>No tickets found.</Typography>
                    ) : (
                        filteredTickets.map((ticket) => (
                            <div key={ticket.id} className={`p-6 border border-gray-200 rounded-xl hover:shadow-md transition cursor-pointer ${getBorderClass(ticket.priority)}`}>
                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <Typography variant="subtitle2" fontWeight="600">{ticket.id}</Typography>
                                        <span className={`badge ${getPriorityColor(ticket.priority)}`}>{ticket.priority}</span>
                                        <span className={`badge ${getStatusColor(ticket.status)}`}>{ticket.status}</span>
                                    </Box>
                                    <Typography variant="caption" color="text.secondary">{ticket.time}</Typography>
                                </Box>
                                <Typography variant="subtitle1" fontWeight="600" mb={1}>{ticket.subject}</Typography>
                                <Typography variant="body2" color="text.secondary" mb={2}>{ticket.desc}</Typography>

                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box display="flex" alignItems="center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${ticket.user.color}`}>
                                            <span className="text-xs font-bold">{ticket.user.initials}</span>
                                        </div>
                                        <Box>
                                            <Typography variant="subtitle2" fontSize="0.875rem">{ticket.user.name}</Typography>
                                            <Typography variant="caption" color="text.secondary">{ticket.user.email}</Typography>
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

                {/* PAGINATION */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                    <Typography variant="body2" color="text.secondary">Showing {filteredTickets.length} tickets</Typography>
                    <Box display="flex" gap={1}>
                        {/* Simplified pagination for demo */}
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
                        <Grid item xs={12} md={6}>
                            <Box mb={2}>
                                <Typography variant="subtitle2" mb={0.5}>Customer Email</Typography>
                                <TextField fullWidth size="small" placeholder="Enter customer email" />
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box mb={2}>
                                <Typography variant="subtitle2" mb={0.5}>Priority</Typography>
                                <TextField select fullWidth size="small" defaultValue="">
                                    <MenuItem value="">Select Priority</MenuItem>
                                    <MenuItem value="High">High</MenuItem>
                                    <MenuItem value="Medium">Medium</MenuItem>
                                    <MenuItem value="Low">Low</MenuItem>
                                </TextField>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box mb={2}>
                                <Typography variant="subtitle2" mb={0.5}>Category</Typography>
                                <TextField select fullWidth size="small" defaultValue="">
                                    <MenuItem value="">Select Category</MenuItem>
                                    <MenuItem value="account">Account Issues</MenuItem>
                                    <MenuItem value="points">Points Inquiry</MenuItem>
                                </TextField>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Box mb={2}>
                                <Typography variant="subtitle2" mb={0.5}>Assign To</Typography>
                                <TextField select fullWidth size="small" defaultValue="">
                                    <MenuItem value="">Unassigned</MenuItem>
                                    <MenuItem value="john">John Doe</MenuItem>
                                </TextField>
                            </Box>
                        </Grid>
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
                    <Button variant="contained" onClick={() => setIsModalOpen(false)}>Create Ticket</Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
