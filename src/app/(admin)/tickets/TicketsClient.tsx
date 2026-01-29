"use client"

import React, { useState, useEffect } from 'react'
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
    Avatar,
    Stack,
    Autocomplete,
    Popper,
    Paper,
    Divider,
    Chip
} from '@mui/material'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getTicketsAction, createTicketAction, searchUsersAction, getTicketTypesAction, getTicketStatusesAction, updateTicketAction, getTicketDetailsAction } from '@/actions/ticket-actions'
import { Search, UserPlus, FileText, AlertCircle, Clock, CheckCircle2, MoreHorizontal, Download as DownloadIcon, Plus, X, User, MessageSquare, Tag, ShieldAlert } from 'lucide-react'
import { enqueueSnackbar } from 'notistack'

export default function TicketsClient() {
    const [activeTab, setActiveTab] = useState(0)
    const [searchTerm, setSearchTerm] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [priorityFilter, setPriorityFilter] = useState('All Priority')

    const { data: ticketStatuses = [] } = useQuery({
        queryKey: ['ticket-statuses'],
        queryFn: getTicketStatusesAction,
    })

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm)
        }, 500)
        return () => clearTimeout(handler)
    }, [searchTerm])

    const currentStatusId = React.useMemo(() => {
        if (activeTab === 0 || !ticketStatuses.length) return undefined
        return ticketStatuses[activeTab - 1]?.id
    }, [activeTab, ticketStatuses])

    const { data: tickets = [], isLoading, error } = useQuery({
        queryKey: ['tickets', debouncedSearch, priorityFilter, currentStatusId],
        queryFn: () => getTicketsAction({
            searchTerm: debouncedSearch,
            priority: priorityFilter,
            statusId: currentStatusId
        }),
        staleTime: 60 * 1000,
    })

    const queryClient = useQueryClient()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isViewModalOpen, setIsViewModalOpen] = useState(false)
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)
    const [isResolveModalOpen, setIsResolveModalOpen] = useState(false)
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null)
    const [resolutionNotes, setResolutionNotes] = useState('')

    // For Assignment Modal
    const [selectedAssignee, setSelectedAssignee] = useState<any | null>(null)

    // Form State for Creation
    const [formData, setFormData] = useState({
        subject: '',
        description: '',
        priority: 'Medium',
        typeId: '',
        statusId: '',
        requester: null as any | null,
        assignee: null as any | null,
    })

    const [userSearchTerm, setUserSearchTerm] = useState('')
    const { data: searchResults = [] } = useQuery({
        queryKey: ['user-search', userSearchTerm],
        queryFn: () => searchUsersAction(userSearchTerm),
        staleTime: 30 * 1000,
    })

    const { data: ticketTypes = [] } = useQuery({
        queryKey: ['ticket-types'],
        queryFn: getTicketTypesAction,
    })

    const createMutation = useMutation({
        mutationFn: createTicketAction,
        onSuccess: (res) => {
            if (res.success) {
                enqueueSnackbar('Ticket created successfully', { variant: 'success' })
                setIsModalOpen(false)
                queryClient.invalidateQueries({ queryKey: ['tickets'] })
                setFormData({
                    subject: '',
                    description: '',
                    priority: 'Medium',
                    typeId: '',
                    statusId: '',
                    requester: null,
                    assignee: null,
                })
            } else {
                enqueueSnackbar(res.error || 'Failed to create ticket', { variant: 'error' })
            }
        },
    })

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number, data: any }) => updateTicketAction(id, data),
        onSuccess: (res) => {
            if (res.success) {
                enqueueSnackbar('Ticket updated successfully', { variant: 'success' })
                setIsAssignModalOpen(false)
                setIsResolveModalOpen(false)
                queryClient.invalidateQueries({ queryKey: ['tickets'] })
                queryClient.invalidateQueries({ queryKey: ['ticket-details', selectedTicketId] })
                setResolutionNotes('')
                setSelectedAssignee(null)
            } else {
                enqueueSnackbar(res.error || 'Failed to update ticket', { variant: 'error' })
            }
        }
    })

    const { data: ticketDetails, isLoading: isLoadingDetails } = useQuery({
        queryKey: ['ticket-details', selectedTicketId],
        queryFn: () => selectedTicketId ? getTicketDetailsAction(selectedTicketId) : null,
        enabled: !!selectedTicketId && isViewModalOpen,
    })

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

    const filteredTickets = tickets

    const handleCreate = () => {
        if (!formData.subject || !formData.description || !formData.typeId || !formData.statusId) {
            enqueueSnackbar('Please fill all required fields', { variant: 'warning' })
            return
        }
        createMutation.mutate({
            subject: formData.subject,
            description: formData.description,
            priority: formData.priority,
            typeId: Number(formData.typeId),
            statusId: Number(formData.statusId),
            createdBy: formData.requester?.id || 1,
            assigneeId: formData.assignee?.id || undefined,
        })
    }

    const handleView = (id: string) => {
        setSelectedTicketId(id)
        setIsViewModalOpen(true)
    }

    const handleOpenAssign = (id: string) => {
        setSelectedTicketId(id)
        const ticket = tickets.find((t: any) => t.id === id)
        if (ticket && ticket.assigneeId) {
            setSelectedAssignee({
                id: ticket.assigneeId,
                name: ticket.assignedTo,
                type: ticket.assignedToType
            })
        } else {
            setSelectedAssignee(null)
        }
        setIsAssignModalOpen(true)
    }

    const handleOpenResolve = (id: string) => {
        setSelectedTicketId(id)
        setIsResolveModalOpen(true)
    }

    const handleAssignSubmit = () => {
        if (!selectedTicketId || !selectedAssignee) return
        const numericId = parseInt(selectedTicketId.replace('TKT-', ''))
        updateMutation.mutate({
            id: numericId,
            data: { assigneeId: selectedAssignee.id }
        })
    }

    const handleResolveSubmit = () => {
        if (!selectedTicketId) return
        const numericId = parseInt(selectedTicketId.replace('TKT-', ''))
        const resolvedStatus = ticketStatuses.find((s: any) =>
            s.name.toLowerCase() === 'resolved' || s.name.toLowerCase() === 'closed'
        )
        if (!resolvedStatus) {
            enqueueSnackbar('Resolved status not found in configuration', { variant: 'error' })
            return
        }
        updateMutation.mutate({
            id: numericId,
            data: {
                statusId: resolvedStatus.id,
                resolutionNotes: resolutionNotes,
                resolvedAt: new Date().toISOString()
            }
        })
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs
                    value={activeTab}
                    onChange={(e, val) => setActiveTab(val)}
                    variant="scrollable"
                    scrollButtons="auto"
                    sx={{ '& .MuiTab-root': { textTransform: 'none', fontWeight: 500, minWidth: 'auto' } }}
                >
                    <Tab label="All Tickets" />
                    {ticketStatuses.map((status: any) => (
                        <Tab key={status.id} label={status.name} />
                    ))}
                </Tabs>
            </Box>

            {activeTab === 0 && (
                <Grid container spacing={3} mb={3}>
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
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
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        <div className="widget-card p-6 rounded-xl shadow">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle2" color="text.secondary">Open Tickets</Typography>
                                <i className="fas fa-exclamation-circle text-orange-500"></i>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" mb={1}>
                                {tickets.filter((t: any) => (t.statusName || t.status) === 'Open').length}
                            </Typography>
                            <Box display="flex" alignItems="center" fontSize="0.875rem">
                                <span className="text-gray-500">requiring attention</span>
                            </Box>
                        </div>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        <div className="widget-card p-6 rounded-xl shadow">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle2" color="text.secondary">In Progress</Typography>
                                <i className="fas fa-spinner text-blue-500"></i>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" mb={1}>
                                {tickets.filter((t: any) => (t.statusName || t.status) === 'In Progress').length}
                            </Typography>
                            <Box display="flex" alignItems="center" fontSize="0.875rem">
                                <span className="text-gray-500">being worked on</span>
                            </Box>
                        </div>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                        <div className="widget-card p-6 rounded-xl shadow">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Typography variant="subtitle2" color="text.secondary">Resolved Today</Typography>
                                <i className="fas fa-check-circle text-green-500"></i>
                            </Box>
                            <Typography variant="h4" fontWeight="bold" mb={1}>
                                {tickets.filter((t: any) => (t.statusName || t.status) === 'Resolved').length}
                            </Typography>
                            <Box display="flex" alignItems="center" fontSize="0.875rem">
                                <span className="text-gray-500">completed</span>
                            </Box>
                        </div>
                    </Grid>
                </Grid>
            )}

            <div className="widget-card p-4 mb-6 rounded-xl shadow">
                <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
                    <Box flex={1} minWidth={200}>
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </Box>
                    <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white"
                    >
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

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>Failed to load tickets: {(error as Error).message}</Alert>
            )}

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
                                            {ticket.createdAt ? new Date(ticket.createdAt).toISOString() : 'N/A'}
                                        </Typography>
                                    </Box>
                                    <Typography variant="subtitle1" fontWeight="600" mb={1}>{ticket.subject}</Typography>
                                    <Typography variant="body2" color="text.secondary" mb={2}>{ticket.description || ticket.subject}</Typography>

                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box display="flex" alignItems="center">
                                            <Avatar sx={{ width: 32, height: 32, mr: 1, fontSize: '0.875rem' }}>{ticket.requester?.[0] || 'U'}</Avatar>
                                            <Box>
                                                <Typography variant="subtitle2" fontSize="0.875rem">{ticket.requester}</Typography>
                                                <Typography variant="caption" color="text.secondary">{ticket.requesterType}</Typography>
                                            </Box>
                                        </Box>
                                        <Box display="flex" gap={1}>
                                            <Button size="small" sx={{ minWidth: 0, px: 1 }} color="primary" onClick={() => handleView(ticket.id)}>View</Button>
                                            <Button size="small" sx={{ minWidth: 0, px: 1 }} color="success" onClick={() => handleOpenAssign(ticket.id)}>Assign</Button>
                                            <Button size="small" sx={{ minWidth: 0, px: 1 }} color="secondary" onClick={() => handleOpenResolve(ticket.id)}>Resolve</Button>
                                        </Box>
                                    </Box>
                                </div>
                            ))
                        )}
                    </Box>
                )}

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
            <Dialog open={isModalOpen} onClose={() => setIsModalOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
                <DialogTitle sx={{ borderBottom: '1px solid #e2e8f0', pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box display="flex" alignItems="center" gap={1.5}>
                        <Box sx={{ bgcolor: 'blue.50', p: 1, borderRadius: '8px', display: 'flex' }}>
                            <FileText color="#2563eb" size={20} />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" component="span">Create New Ticket</Typography>
                            <Typography variant="caption" color="text.secondary">Create a support request for a member</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={() => setIsModalOpen(false)} size="small" sx={{ color: 'text.secondary' }}>
                        <X size={20} />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ py: 3, bgcolor: '#f8fafc' }}>
                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 7 }}>
                            <Box sx={{ bgcolor: 'white', p: 3, borderRadius: '12px', border: '1px solid #e2e8f0', height: '100%' }}>
                                <Typography variant="subtitle2" fontWeight="600" mb={2} display="flex" alignItems="center" gap={1}>
                                    Ticket Details
                                </Typography>
                                <Stack spacing={2.5}>
                                    <Box>
                                        <Typography variant="caption" fontWeight="600" color="text.secondary" mb={0.5} display="block">Subject *</Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Brief summary of the issue"
                                            value={formData.subject}
                                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        />
                                    </Box>
                                    <Box>
                                        <Typography variant="caption" fontWeight="600" color="text.secondary" mb={0.5} display="block">Description *</Typography>
                                        <TextField
                                            fullWidth
                                            multiline
                                            rows={4}
                                            placeholder="Detailed information about the issue"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        />
                                    </Box>
                                    <Grid container spacing={2}>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="caption" fontWeight="600" color="text.secondary" mb={0.5} display="block">Type *</Typography>
                                            <TextField
                                                select
                                                fullWidth
                                                size="small"
                                                value={formData.typeId}
                                                onChange={(e) => setFormData({ ...formData, typeId: e.target.value })}
                                            >
                                                {ticketTypes.map((t: any) => (
                                                    <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <Typography variant="caption" fontWeight="600" color="text.secondary" mb={0.5} display="block">Priority</Typography>
                                            <TextField
                                                select
                                                fullWidth
                                                size="small"
                                                value={formData.priority}
                                                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                                            >
                                                <MenuItem value="Low">Low</MenuItem>
                                                <MenuItem value="Medium">Medium</MenuItem>
                                                <MenuItem value="High">High</MenuItem>
                                            </TextField>
                                        </Grid>
                                    </Grid>
                                    <Box>
                                        <Typography variant="caption" fontWeight="600" color="text.secondary" mb={0.5} display="block">Initial Status *</Typography>
                                        <TextField
                                            select
                                            fullWidth
                                            size="small"
                                            value={formData.statusId}
                                            onChange={(e) => setFormData({ ...formData, statusId: e.target.value })}
                                        >
                                            {ticketStatuses.map((s: any) => (
                                                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                            ))}
                                        </TextField>
                                    </Box>
                                </Stack>
                            </Box>
                        </Grid>
                        <Grid size={{ xs: 12, md: 5 }}>
                            <Stack spacing={3}>
                                <Box sx={{ bgcolor: 'white', p: 3, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <Typography variant="subtitle2" fontWeight="600" mb={2} display="flex" alignItems="center" gap={1}>
                                        <UserPlus size={16} /> Requester
                                    </Typography>
                                    <Autocomplete
                                        size="small"
                                        options={searchResults.filter((u: any) => u.isLastLevel)}
                                        value={formData.requester}
                                        getOptionLabel={(option: any) => `${option.name} (${option.type})`}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        onInputChange={(e, value, reason) => {
                                            if (reason === 'input') setUserSearchTerm(value)
                                        }}
                                        onChange={(e, value: any) => setFormData({ ...formData, requester: value })}
                                        renderInput={(params) => (
                                            <TextField {...params} placeholder="Search Name, ID, Phone..." />
                                        )}
                                        renderOption={(props, option: any) => (
                                            <li {...props}>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="600">{option.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        {option.type} • {option.uniqueId !== 'N/A' ? `ID: ${option.uniqueId} • ` : ''}{option.phone}
                                                    </Typography>
                                                </Box>
                                            </li>
                                        )}
                                    />
                                    {formData.requester && (
                                        <Alert severity="success" sx={{ mt: 1.5, py: 0 }}>
                                            Requester linked successfully
                                        </Alert>
                                    )}
                                </Box>
                                <Box sx={{ bgcolor: 'white', p: 3, borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <Typography variant="subtitle2" fontWeight="600" mb={2} display="flex" alignItems="center" gap={1}>
                                        <UserPlus size={16} /> Assign To (Optional)
                                    </Typography>
                                    <Autocomplete
                                        size="small"
                                        options={searchResults.filter((u: any) => !u.isLastLevel)}
                                        value={formData.assignee}
                                        getOptionLabel={(option: any) => `${option.name} (${option.type})`}
                                        isOptionEqualToValue={(option, value) => option.id === value.id}
                                        onInputChange={(e, value, reason) => {
                                            if (reason === 'input') setUserSearchTerm(value)
                                        }}
                                        onChange={(e, value: any) => setFormData({ ...formData, assignee: value })}
                                        renderInput={(params) => (
                                            <TextField {...params} placeholder="Search Staff..." />
                                        )}
                                        renderOption={(props, option: any) => (
                                            <li {...props}>
                                                <Box>
                                                    <Typography variant="body2" fontWeight="600">{option.name}</Typography>
                                                    <Typography variant="caption" color="text.secondary">{option.phone}</Typography>
                                                </Box>
                                            </li>
                                        )}
                                    />
                                </Box>
                            </Stack>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <Button variant="outlined" onClick={() => setIsModalOpen(false)} sx={{ textTransform: 'none', borderRadius: '8px', px: 3 }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleCreate}
                        disabled={createMutation.isPending}
                        sx={{ textTransform: 'none', borderRadius: '8px', px: 4, bgcolor: '#2563eb' }}
                    >
                        {createMutation.isPending ? <CircularProgress size={24} color="inherit" /> : 'Create Support Ticket'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* VIEW TICKET MODAL */}
            <Dialog open={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} maxWidth="md" fullWidth PaperProps={{ sx: { borderRadius: '16px' } }}>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3, borderBottom: '1px solid #eef2f6' }}>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Box sx={{ width: 40, height: 40, borderRadius: '10px', bgcolor: 'primary.50', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FileText size={20} color="#2563eb" />
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight="bold" component="span">Ticket Details</Typography>
                            <Typography variant="caption" color="text.secondary">Viewing information for #{selectedTicketId}</Typography>
                        </Box>
                    </Box>
                    <IconButton onClick={() => setIsViewModalOpen(false)}><X size={20} /></IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 0, bgcolor: '#f8fafc' }}>
                    {isLoadingDetails ? (
                        <Box display="flex" justifyContent="center" p={10}><CircularProgress /></Box>
                    ) : ticketDetails ? (
                        <Grid container>
                            <Grid size={{ xs: 12, md: 8 }} sx={{ p: 4, bgcolor: 'white' }}>
                                <Box mb={4}>
                                    <Box display="flex" alignItems="center" gap={1.5} mb={1}>
                                        <Chip label={ticketDetails.typeName} size="small" sx={{ bgcolor: 'blue.50', color: 'blue.700', fontWeight: 600, borderRadius: '6px' }} />
                                        <Chip label={ticketDetails.priority} size="small" sx={{
                                            bgcolor: ticketDetails.priority === 'High' ? 'red.50' : ticketDetails.priority === 'Medium' ? 'orange.50' : 'green.50',
                                            color: ticketDetails.priority === 'High' ? 'red.700' : ticketDetails.priority === 'Medium' ? 'orange.700' : 'green.700',
                                            fontWeight: 600,
                                            borderRadius: '6px'
                                        }} />
                                    </Box>
                                    <Typography variant="h5" fontWeight="bold" mb={2}>{ticketDetails.subject}</Typography>
                                    <Box p={3} sx={{ borderRadius: '12px', bgcolor: '#f8fafc', border: '1px solid #eef2f6' }}>
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap', color: 'text.primary', lineHeight: 1.6 }}>
                                            {ticketDetails.description}
                                        </Typography>
                                    </Box>
                                </Box>
                                {ticketDetails.resolutionNotes && (
                                    <Box mt={4}>
                                        <Typography variant="subtitle2" fontWeight="bold" mb={2} display="flex" alignItems="center" gap={1}>
                                            <CheckCircle2 size={18} color="#10b981" /> Resolution Details
                                        </Typography>
                                        <Box p={3} sx={{ borderRadius: '12px', bgcolor: 'rgba(16, 185, 129, 0.05)', border: '1px dashed #10b981' }}>
                                            <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                                                Resolved at: {new Date(ticketDetails.resolvedAt).toLocaleString()}
                                            </Typography>
                                            <Typography variant="body2" fontWeight="medium">
                                                {ticketDetails.resolutionNotes}
                                            </Typography>
                                        </Box>
                                    </Box>
                                )}
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }} sx={{ p: 4, borderLeft: '1px solid #eef2f6' }}>
                                <Stack spacing={4}>
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }} mb={2} display="block">Statuses</Typography>
                                        <Stack spacing={2}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="body2" color="text.secondary">Current Status</Typography>
                                                <Chip label={ticketDetails.statusName} size="small" color="primary" sx={{ fontWeight: 600 }} />
                                            </Box>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Typography variant="body2" color="text.secondary">Created Date</Typography>
                                                <Typography variant="body2" fontWeight="medium">{new Date(ticketDetails.createdAt).toLocaleDateString()}</Typography>
                                            </Box>
                                        </Stack>
                                    </Box>
                                    <Divider />
                                    <Box>
                                        <Typography variant="caption" fontWeight="bold" color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 1 }} mb={2} display="block">People Involved</Typography>
                                        <Stack spacing={2.5}>
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem' }}>{ticketDetails.requesterName?.[0]}</Avatar>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" display="block">Requester ({ticketDetails.requesterTypeName})</Typography>
                                                    <Typography variant="body2" fontWeight="600">{ticketDetails.requesterName}</Typography>
                                                </Box>
                                            </Box>
                                            <Box display="flex" alignItems="center" gap={1.5}>
                                                <Avatar sx={{ width: 32, height: 32, fontSize: '0.875rem', bgcolor: 'primary.main' }}>{ticketDetails.assigneeName?.[0] || '?'}</Avatar>
                                                <Box>
                                                    <Typography variant="caption" color="text.secondary" display="block">Assigned To {ticketDetails.assigneeTypeName ? `(${ticketDetails.assigneeTypeName})` : ''}</Typography>
                                                    <Typography variant="body2" fontWeight="600">{ticketDetails.assigneeName || 'Unassigned'}</Typography>
                                                </Box>
                                            </Box>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Grid>
                        </Grid>
                    ) : null}
                </DialogContent>
                <DialogActions sx={{ p: 3, borderTop: '1px solid #eef2f6' }}>
                    <Button variant="outlined" onClick={() => setIsViewModalOpen(false)} sx={{ borderRadius: '8px', textTransform: 'none' }}>Close</Button>
                    {!ticketDetails?.resolvedAt && (
                        <>
                            <Button variant="contained" color="success" onClick={() => { setIsViewModalOpen(false); handleOpenResolve(selectedTicketId!); }} sx={{ borderRadius: '8px', textTransform: 'none' }}>Resolve Ticket</Button>
                            <Button variant="contained" onClick={() => { setIsViewModalOpen(false); handleOpenAssign(selectedTicketId!); }} sx={{ borderRadius: '8px', textTransform: 'none' }}>Update Assignment</Button>
                        </>
                    )}
                </DialogActions>
            </Dialog>

            {/* ASSIGN TICKET MODAL */}
            <Dialog open={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
                <DialogTitle sx={{ borderBottom: '1px solid #eef2f6', pb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" component="span">Assign Ticket</Typography>
                    <Typography variant="caption" color="text.secondary">Select a staff member to handle this ticket</Typography>
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Box pt={1}>
                        <Typography variant="caption" fontWeight="600" color="text.secondary" mb={1} display="block">Assign To</Typography>
                        <Autocomplete
                            size="small"
                            options={searchResults.filter((u: any) => !u.isLastLevel)}
                            value={selectedAssignee}
                            getOptionLabel={(option: any) => `${option.name} (${option.type})`}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            onInputChange={(e, value, reason) => {
                                if (reason === 'input') setUserSearchTerm(value)
                            }}
                            onChange={(e, value: any) => setSelectedAssignee(value)}
                            renderInput={(params) => (
                                <TextField {...params} placeholder="Search staff name..." />
                            )}
                            renderOption={(props, option: any) => (
                                <li {...props}>
                                    <Box>
                                        <Typography variant="body2" fontWeight="600">{option.name}</Typography>
                                        <Typography variant="caption" color="text.secondary">{option.phone}</Typography>
                                    </Box>
                                </li>
                            )}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
                    <Button variant="outlined" onClick={() => setIsAssignModalOpen(false)} sx={{ borderRadius: '8px', textTransform: 'none' }}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleAssignSubmit}
                        disabled={updateMutation.isPending || !selectedAssignee}
                        sx={{ borderRadius: '8px', textTransform: 'none', px: 4 }}
                    >
                        {updateMutation.isPending ? <CircularProgress size={20} color="inherit" /> : 'Assign Now'}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* RESOLVE TICKET MODAL */}
            <Dialog open={isResolveModalOpen} onClose={() => setIsResolveModalOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: '12px' } }}>
                <DialogTitle sx={{ borderBottom: '1px solid #eef2f6', pb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" component="span" sx={{ color: 'success.main' }}>Resolve Ticket</Typography>
                    <Typography variant="caption" color="text.secondary">Provide details on how the issue was resolved</Typography>
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Box pt={1}>
                        <Typography variant="caption" fontWeight="600" color="text.secondary" mb={1} display="block">Resolution Notes *</Typography>
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Describe the solution..."
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
                    <Button variant="outlined" onClick={() => setIsResolveModalOpen(false)} sx={{ borderRadius: '8px', textTransform: 'none' }}>Cancel</Button>
                    <Button
                        variant="contained"
                        color="success"
                        onClick={handleResolveSubmit}
                        disabled={updateMutation.isPending || !resolutionNotes}
                        sx={{ borderRadius: '8px', textTransform: 'none', px: 4 }}
                    >
                        {updateMutation.isPending ? <CircularProgress size={20} color="inherit" /> : 'Confirm Resolution'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    )
}
