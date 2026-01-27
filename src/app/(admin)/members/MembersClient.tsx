'use client';

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    InputAdornment,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Avatar,
    CircularProgress,
    Divider,
    Chip,
    Stack,
    Snackbar,
    Alert
} from '@mui/material';
import {
    Search,
    FilterList,
    Download,
    MoreVert,
    PersonAdd,
    CheckCircle,
    Cancel,
    Visibility,
    Block,
    QrCode,
    CardGiftcard,
    Lock,
    Edit,
    Email,
    ChevronRight,
    ExpandMore,
    PersonOutline,
    Phone,
    Email as EmailIcon,
    LocationOn,
    CalendarToday,
    AccountBalance,
    CreditCard,
    Badge,
    Store,
    Business,
    AssignmentInd
} from '@mui/icons-material';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMembersDataAction, getMemberDetailsAction, getMemberKycDocumentsAction, updateKycDocumentStatusAction, getApprovalStatusesAction, updateMemberApprovalStatusAction, getMemberHierarchyAction, getMembersListAction } from '@/actions/member-actions';

export default function MembersClient() {
    const queryClient = useQueryClient();
    const [levelTab, setLevelTab] = useState(0);
    const [entityTab, setEntityTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [kycStatusFilter, setKycStatusFilter] = useState('All Status');
    const [regionFilter, setRegionFilter] = useState('All Regions');
    const [page, setPage] = useState(1);
    const limit = 10;

    const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<{ type: string, id: number, member: any } | null>(null);

    const [kycModalOpen, setKycModalOpen] = useState(false);
    const [selectedKycMember, setSelectedKycMember] = useState<any>(null);
    const [viewDocOpen, setViewDocOpen] = useState(false);
    const [viewDocUrl, setViewDocUrl] = useState('');
    const [viewDocType, setViewDocType] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const { data: hierarchyData } = useQuery({
        queryKey: ['member-hierarchy'],
        queryFn: getMemberHierarchyAction,
        staleTime: 60 * 1000,
    });

    const currentLevel = hierarchyData?.levels[levelTab];
    // Ensure entityTab is valid for currentLevel
    const activeEntityTab = currentLevel && entityTab >= currentLevel.entities.length ? 0 : entityTab;
    const currentEntity = currentLevel?.entities[activeEntityTab];

    const { data: membersListData, isLoading: isMembersLoading } = useQuery({
        queryKey: ['members-list', currentEntity?.id, page, searchQuery, kycStatusFilter, regionFilter],
        queryFn: () => currentEntity ? getMembersListAction({
            searchQuery: debouncedQuery,
            kycStatus: kycStatusFilter,
            region: regionFilter,
            page,
            limit,
            roleId: currentEntity.id
        }) : { list: [], stats: { total: 0, totalTrend: '', kycPending: 0, kycPendingTrend: '', kycApproved: 0, kycApprovedRate: '', activeToday: 0, activeTodayTrend: '' } },
        enabled: !!currentEntity,
    });

    const stats = membersListData?.stats || { total: 0, totalTrend: '', kycPending: 0, kycPendingTrend: '', kycApproved: 0, kycApprovedRate: '', activeToday: 0, activeTodayTrend: '' };
    const members = membersListData?.list || [];

    // console.log(hierarchyData); // Debug if needed
    const { data: memberDetails, isLoading: isLoadingDetails } = useQuery({
        queryKey: ['member-details', selectedMember?.type, selectedMember?.id],
        queryFn: () => selectedMember ? getMemberDetailsAction(selectedMember.type, selectedMember.id) : null,
        enabled: !!selectedMember,
    });

    const { data: kycDocuments, isLoading: isLoadingKycDocs } = useQuery({
        queryKey: ['member-kyc-docs', selectedKycMember?.dbId],
        queryFn: () => selectedKycMember ? getMemberKycDocumentsAction(selectedKycMember.dbId) : null,
        enabled: !!selectedKycMember,
    });

    const { data: blockStatuses } = useQuery({
        queryKey: ['approval-statuses'],
        queryFn: getApprovalStatusesAction
    });

    if (!hierarchyData || !hierarchyData.levels || hierarchyData.levels.length === 0) return null;

    // Ensure entityTab is valid for currentLevel (re-calculated above but here for initial render checks if needed, but activeEntityTab covers it)

    const handleLevelChange = (index: number) => {
        setLevelTab(index);
        setEntityTab(0);
        setPage(1); // Reset page on level change
    };

    const handleMenuOpen = (id: string, event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl({ ...anchorEl, [id]: event.currentTarget });
    };

    const handleMenuClose = (id: string) => {
        setAnchorEl({ ...anchorEl, [id]: null });
    };

    const handleViewKyc = (member: any) => {
        setSelectedKycMember(member);
        setKycModalOpen(true);
        handleMenuClose(`kyc-${member.id}`);
    };

    const handleViewDetails = (member: any) => {
        setSelectedMember({ type: currentEntity.name, id: member.dbId, member });
        setDetailsModalOpen(true);
        handleMenuClose(`more-${member.id}`);
    };

    const handleViewDocument = (url: string, type: string) => {
        console.log(url)
        setViewDocUrl(url);
        setViewDocType(type);
        setViewDocOpen(true);
    };

    const handleUpdateDocStatus = async (docId: number, status: 'verified' | 'rejected') => {
        try {
            await updateKycDocumentStatusAction(docId, status);
            // Refresh data
            queryClient.invalidateQueries({ queryKey: ['member-kyc-docs'] });
        } catch (error) {
            console.error("Failed to update document status:", error);
        }
    };

    const handleUpdateBlockStatus = async (userId: number, statusId: number, memberId: string) => {
        try {
            await updateMemberApprovalStatusAction(userId, statusId);
            queryClient.invalidateQueries({ queryKey: ['members-data'] });
            handleMenuClose(`block-${memberId}`);
            setSnackbarMessage('Member status updated successfully');
            setSnackbarOpen(true);
        } catch (error) {
            console.error("Failed to update block status:", error);
            setSnackbarMessage('Failed to update status');
            setSnackbarOpen(true);
        }
    };

    const getKycBadge = (status: string) => {
        switch (status) {
            case 'Approved':
                return <span className="badge badge-success">Approved</span>;
            case 'Rejected':
                return <span className="badge badge-danger">Rejected</span>;
            case 'Pending':
            default:
                return <span className="badge badge-warning">Pending</span>;
        }
    };

    const getKycRowClass = (status: string) => {
        switch (status) {
            case 'Approved': return 'kyc-approved';
            case 'Rejected': return 'kyc-rejected';
            default: return 'kyc-pending';
        }
    };

    return (
        <Box>
            {/* Main Tabs (Levels) */}
            <div className="tabs mb-4 px-1">
                {hierarchyData.levels.map((level: any, index: number) => (
                    <button
                        key={level.id}
                        className={`tab ${levelTab === index ? 'active' : ''}`}
                        onClick={() => handleLevelChange(index)}
                        style={{ fontSize: '0.9rem', padding: '8px 24px' }}
                    >
                        {level.name}
                    </button>
                ))}
            </div>

            {/* Sub Tabs (Entities within Level) */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide px-1">
                {currentLevel.entities.map((entity: any, index: number) => (
                    <button
                        key={entity.id}
                        onClick={() => { setEntityTab(index); setPage(1); }}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeEntityTab === index
                            ? 'bg-blue-600 text-white shadow-md'
                            : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
                            }`}
                    >
                        {entity.name}
                    </button>
                ))}
            </div>

            {/* Statistics */}
            {!currentEntity ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
                    <Typography color="text.secondary">No entities found for this level.</Typography>
                </Box>
            ) : (
                <>
                    <Grid container spacing={3} mb={4}>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <div className="widget-card rounded-xl shadow p-6">
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle2" color="text.secondary">Total {currentEntity.name}</Typography>
                                    <PersonOutline className="text-blue-500" />
                                </Box>
                                <Typography variant="h4" fontWeight="bold" mb={1}>{stats.total.toLocaleString()}</Typography>
                                <Box display="flex" alignItems="center" fontSize="0.875rem">
                                    <span className="text-green-600 font-medium">{stats.totalTrend}</span>
                                    <span className="text-gray-500 ml-2">this month</span>
                                </Box>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <div className="widget-card rounded-xl shadow p-6">
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle2" color="text.secondary">KYC Pending</Typography>
                                    <Box sx={{ color: 'orange' }}><Visibility sx={{ fontSize: 18 }} /></Box>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" mb={1}>{stats.kycPending}</Typography>
                                <Box display="flex" alignItems="center" fontSize="0.875rem">
                                    <span className="text-orange-600 font-medium">{stats.kycPendingTrend}</span>
                                    <span className="text-gray-500 ml-2">today</span>
                                </Box>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <div className="widget-card rounded-xl shadow p-6">
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle2" color="text.secondary">KYC Approved</Typography>
                                    <CheckCircle className="text-green-500" />
                                </Box>
                                <Typography variant="h4" fontWeight="bold" mb={1}>{stats.kycApproved.toLocaleString()}</Typography>
                                <Box display="flex" alignItems="center" fontSize="0.875rem">
                                    <span className="text-green-600 font-medium">{stats.kycApprovedRate}</span>
                                    <span className="text-gray-500 ml-2">approval rate</span>
                                </Box>
                            </div>
                        </Grid>
                        <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                            <div className="widget-card rounded-xl shadow p-6">
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                    <Typography variant="subtitle2" color="text.secondary">Active Today</Typography>
                                    <Box sx={{ color: '#EAB308' }}><PersonAdd sx={{ fontSize: 18 }} /></Box>
                                </Box>
                                <Typography variant="h4" fontWeight="bold" mb={1}>{stats.activeToday}</Typography>
                                <Box display="flex" alignItems="center" fontSize="0.875rem">
                                    <span className="text-blue-600 font-medium">{stats.activeTodayTrend}</span>
                                    <span className="text-gray-500 ml-2">from yesterday</span>
                                </Box>
                            </div>
                        </Grid>
                    </Grid>

                    {/* Filters */}
                    <div className="widget-card rounded-xl shadow p-4 mb-6">
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, md: 4 }}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    placeholder={`Search ${currentEntity.name.toLowerCase()}...`}
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Search />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </Grid>
                            <Grid size={{ xs: 6, md: 2 }}>
                                <select
                                    value={kycStatusFilter}
                                    onChange={(e) => setKycStatusFilter(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-sm"
                                >
                                    <option>All Status</option>
                                    <option>KYC Pending</option>
                                    <option>KYC Approved</option>
                                    <option>KYC Rejected</option>
                                    <option>Blocked</option>
                                </select>
                            </Grid>
                            <Grid size={{ xs: 6, md: 2 }}>
                                <select
                                    value={regionFilter}
                                    onChange={(e) => setRegionFilter(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-sm"
                                >
                                    <option>All Regions</option>
                                    <option>North</option>
                                    <option>South</option>
                                    <option>East</option>
                                    <option>West</option>
                                </select>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }} display="flex" justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    sx={{ bgcolor: '#2563eb', color: 'white', textTransform: 'none', px: 3, mr: 1 }}
                                >
                                    <FilterList sx={{ mr: 1, fontSize: 18 }} /> Apply Filters
                                </Button>
                            </Grid>
                        </Grid>
                    </div>

                    {/* Member List */}
                    <div className="widget-card rounded-xl shadow p-6">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                            <Typography variant="h6" fontWeight="bold">{currentEntity.name} List</Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<Download />}
                                sx={{ textTransform: 'none', color: '#374151', borderColor: '#d1d5db' }}
                            >
                                Export
                            </Button>
                        </Box>

                        <div className="overflow-x-auto">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                                            {currentEntity.name}
                                        </TableCell>
                                        <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>Contact</TableCell>
                                        <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                                            {currentEntity.name.toLowerCase().includes('retailer') ? 'Store' :
                                                currentEntity.name.toLowerCase().includes('counter sales') ? 'Company' :
                                                    currentLevel.name.toLowerCase().includes('internal') ? 'Role' : 'Region'}
                                        </TableCell>
                                        <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>KYC Status</TableCell>
                                        {currentEntity.name.toLowerCase().includes('electrician') && <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>Joined</TableCell>}
                                        <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {members.map((member: any) => (
                                        <TableRow key={member.id} className={getKycRowClass(member.kycStatus)}>
                                            <TableCell>
                                                <Box display="flex" alignItems="center">
                                                    <Avatar
                                                        sx={{
                                                            bgcolor: member.avatarColor + '20',
                                                            color: member.avatarColor,
                                                            width: 40,
                                                            height: 40,
                                                            mr: 2,
                                                            fontSize: '0.875rem',
                                                            fontWeight: 'bold'
                                                        }}
                                                    >
                                                        {member.initials}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="body2" fontWeight="medium">{member.name}</Typography>
                                                        <Typography variant="caption" color="text.secondary">ID: {member.id}</Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2">{member.phone}</Typography>
                                                <Typography variant="caption" color="text.secondary">{member.email}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                {currentEntity.name.toLowerCase().includes('retailer') ? (
                                                    <>
                                                        <Typography variant="body2" fontWeight="medium">{member.storeName || 'N/A'}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{member.location || 'N/A'}</Typography>
                                                    </>
                                                ) : currentEntity.name.toLowerCase().includes('counter sales') ? (
                                                    <>
                                                        <Typography variant="body2" fontWeight="medium">{member.companyName || 'N/A'}</Typography>
                                                        <Typography variant="caption" color="text.secondary">{member.location || 'N/A'}</Typography>
                                                    </>
                                                ) : currentLevel.name.toLowerCase().includes('internal') ? (
                                                    <Typography variant="body2">{member.role || 'N/A'}</Typography>
                                                ) : (
                                                    <Typography variant="body2">{member.regions || 'N/A'}</Typography>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                {getKycBadge(member.kycStatus)}
                                            </TableCell>
                                            {currentEntity.name.toLowerCase().includes('electrician') && (
                                                <TableCell>
                                                    <Typography variant="body2">{member.joinedDate}</Typography>
                                                </TableCell>
                                            )}
                                            <TableCell>
                                                <Box display="flex" gap={1}>
                                                    {/* KYC Dropdown button */}
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={(e) => handleMenuOpen(`kyc-${member.id}`, e)}
                                                        startIcon={<CheckCircle sx={{ fontSize: 16 }} />}
                                                        endIcon={<ExpandMore sx={{ fontSize: 16 }} />}
                                                        className="action-dropdown-toggle"
                                                        sx={{ textTransform: 'none', border: 'none', bgcolor: '#f3f4f6', color: '#374151', minWidth: 'auto', px: 2 }}
                                                    >
                                                        KYC
                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorEl[`kyc-${member.id}`]}
                                                        open={Boolean(anchorEl[`kyc-${member.id}`])}
                                                        onClose={() => handleMenuClose(`kyc-${member.id}`)}
                                                        PaperProps={{ className: 'action-dropdown-menu' }}
                                                    >

                                                        <MenuItem onClick={() => handleViewKyc(member)}>
                                                            <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
                                                            <ListItemText primary="View Documents" />
                                                        </MenuItem>
                                                    </Menu>

                                                    {/* Block Dropdown button */}
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={(e) => handleMenuOpen(`block-${member.id}`, e)}
                                                        startIcon={<Block sx={{ fontSize: 16 }} />}
                                                        endIcon={<ExpandMore sx={{ fontSize: 16 }} />}
                                                        className="action-dropdown-toggle"
                                                        sx={{ textTransform: 'none', border: 'none', bgcolor: '#f3f4f6', color: '#374151', minWidth: 'auto', px: 2 }}
                                                    >
                                                        Block
                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorEl[`block-${member.id}`]}
                                                        open={Boolean(anchorEl[`block-${member.id}`])}
                                                        onClose={() => handleMenuClose(`block-${member.id}`)}
                                                        PaperProps={{ className: 'action-dropdown-menu' }}
                                                    >
                                                        {blockStatuses?.map((status: any) => {
                                                            const ACTIONABLE_STATUSES = ['DELETE', 'BLOCKED', 'REDEMPTION_BLOCKED', 'SCAN_BLOCKED', 'INACTIVE'];
                                                            const isActionable = ACTIONABLE_STATUSES.includes(status.name?.toUpperCase());

                                                            return (
                                                                <MenuItem
                                                                    key={status.id}
                                                                    onClick={() => isActionable && handleUpdateBlockStatus(member.dbId, status.id, member.id)}
                                                                    disabled={!isActionable}
                                                                    sx={{ color: isActionable ? '#d97706' : 'text.disabled' }}
                                                                >
                                                                    <ListItemIcon><Lock fontSize="small" sx={{ color: isActionable ? '#d97706' : 'text.disabled' }} /></ListItemIcon>
                                                                    <ListItemText primary={status.name} />
                                                                </MenuItem>
                                                            );
                                                        })}
                                                        {(!blockStatuses || blockStatuses.length === 0) && (
                                                            <MenuItem disabled>
                                                                <ListItemText primary="No actions available" />
                                                            </MenuItem>
                                                        )}
                                                    </Menu>

                                                    {/* More Actions Dropdown */}
                                                    <Button
                                                        variant="outlined"
                                                        size="small"
                                                        onClick={(e) => handleMenuOpen(`more-${member.id}`, e)}
                                                        startIcon={<MoreVert sx={{ fontSize: 16 }} />}
                                                        className="action-dropdown-toggle"
                                                        sx={{ textTransform: 'none', border: 'none', bgcolor: '#f3f4f6', color: '#374151', minWidth: 'auto', px: 2 }}
                                                    >
                                                        More
                                                    </Button>
                                                    <Menu
                                                        anchorEl={anchorEl[`more-${member.id}`]}
                                                        open={Boolean(anchorEl[`more-${member.id}`])}
                                                        onClose={() => handleMenuClose(`more-${member.id}`)}
                                                        PaperProps={{ className: 'action-dropdown-menu' }}
                                                    >
                                                        <MenuItem onClick={() => handleViewDetails(member)}>
                                                            <ListItemIcon><Visibility fontSize="small" /></ListItemIcon>
                                                            <ListItemText primary="View Details" />
                                                        </MenuItem>
                                                        <MenuItem onClick={() => handleMenuClose(`more-${member.id}`)}>
                                                            <ListItemIcon><Edit fontSize="small" /></ListItemIcon>
                                                            <ListItemText primary="Edit Member" />
                                                        </MenuItem>
                                                        <MenuItem onClick={() => handleMenuClose(`more-${member.id}`)}>
                                                            <ListItemIcon><Email fontSize="small" /></ListItemIcon>
                                                            <ListItemText primary="Send Message" />
                                                        </MenuItem>
                                                    </Menu>
                                                </Box>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination */}
                        <Box display="flex" justifyContent="space-between" alignItems="center" mt={4}>
                            <Typography variant="body2" color="text.secondary">
                                Page {page} (Total: {stats.total.toLocaleString()})
                            </Typography>
                            <Box display="flex" gap={1}>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ textTransform: 'none', minWidth: 80 }}
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                >
                                    Previous
                                </Button>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    sx={{ textTransform: 'none', minWidth: 80 }}
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={members.length < limit}
                                >
                                    Next
                                </Button>
                            </Box>
                        </Box>
                    </div>
                </>
            )}

            {/* Member Details Modal */}
            <Dialog
                open={detailsModalOpen}
                onClose={() => setDetailsModalOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        overflow: 'hidden'
                    }
                }}
            >
                <DialogTitle sx={{ p: 0 }}>
                    <Box sx={{
                        background: 'linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)',
                        p: 4,
                        color: 'white',
                        position: 'relative'
                    }}>
                        <IconButton
                            onClick={() => setDetailsModalOpen(false)}
                            sx={{ position: 'absolute', right: 16, top: 16, color: 'white' }}
                        >
                            <Cancel />
                        </IconButton>
                        <Stack direction="row" spacing={3} alignItems="center">
                            <Avatar
                                sx={{
                                    width: 80,
                                    height: 80,
                                    fontSize: '2rem',
                                    fontWeight: 'bold',
                                    bgcolor: selectedMember?.member?.avatarColor,
                                    border: '4px solid rgba(255,255,255,0.2)'
                                }}
                            >
                                {selectedMember?.member?.initials}
                            </Avatar>
                            <Box>
                                <Typography variant="h5" fontWeight="bold" component="span">
                                    {selectedMember?.member?.name}
                                </Typography>
                                <Typography variant="body1" sx={{ opacity: 0.9 }} component="span">
                                    ID: {selectedMember?.member?.id}
                                </Typography>
                                <Box mt={1}>
                                    <Chip
                                        label={selectedMember?.member?.kycStatus}
                                        size="small"
                                        sx={{
                                            bgcolor: selectedMember?.member?.kycStatus === 'Approved' ? '#10b981' : '#f59e0b',
                                            color: 'white',
                                            fontWeight: 'bold',
                                            mr: 1
                                        }}
                                    />
                                    <Chip
                                        label={currentEntity?.name}
                                        size="small"
                                        sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: 'white' }}
                                    />
                                </Box>
                            </Box>
                        </Stack>
                    </Box>
                </DialogTitle>
                <DialogContent sx={{ p: 4, bgcolor: '#f8fafc' }}>
                    {isLoadingDetails ? (
                        <Box display="flex" justifyContent="center" alignItems="center" py={10}>
                            <CircularProgress size={40} />
                        </Box>
                    ) : memberDetails ? (
                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="h6" fontWeight="bold" mb={2} color="primary">Personal Information</Typography>
                                <Stack spacing={2}>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Phone color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Phone Number</Typography>
                                            <Typography variant="body1" fontWeight="medium">{(memberDetails as any).phone || 'N/A'}</Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <EmailIcon color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Email Address</Typography>
                                            <Typography variant="body1" fontWeight="medium">{(memberDetails as any).email || 'N/A'}</Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <CalendarToday color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Date of Birth</Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {(memberDetails as any).dob ? new Date((memberDetails as any).dob).toLocaleDateString() : 'N/A'}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <AssignmentInd color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Gender</Typography>
                                            <Typography variant="body1" fontWeight="medium">{(memberDetails as any).gender || 'N/A'}</Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Grid>

                            <Grid size={{ xs: 12, md: 6 }}>
                                <Typography variant="h6" fontWeight="bold" mb={2} color="primary">Professional Details</Typography>
                                <Stack spacing={2}>
                                    {currentEntity.name.toLowerCase().includes('retailer') && (
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Store color="action" />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Store Name</Typography>
                                                <Typography variant="body1" fontWeight="medium">{(memberDetails as any).storeName || 'N/A'}</Typography>
                                            </Box>
                                        </Box>
                                    )}
                                    {currentEntity.name.toLowerCase().includes('counter sales') && (
                                        <Box display="flex" alignItems="center" gap={2}>
                                            <Business color="action" />
                                            <Box>
                                                <Typography variant="caption" color="text.secondary">Company Name</Typography>
                                                <Typography variant="body1" fontWeight="medium">{(memberDetails as any).companyName || 'N/A'}</Typography>
                                            </Box>
                                        </Box>
                                    )}
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <LocationOn color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Location</Typography>
                                            <Typography variant="body1" fontWeight="medium">
                                                {(memberDetails as any).addressLine1 ? `${(memberDetails as any).addressLine1}, ` : ''}
                                                {(memberDetails as any).city}, {(memberDetails as any).state} {(memberDetails as any).pincode}
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Badge color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">Aadhaar Number</Typography>
                                            <Typography variant="body1" fontWeight="medium">{(memberDetails as any).aadhaar || 'N/A'}</Typography>
                                        </Box>
                                    </Box>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <CreditCard color="action" />
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">PAN Number</Typography>
                                            <Typography variant="body1" fontWeight="medium">{(memberDetails as any).pan || 'N/A'}</Typography>
                                        </Box>
                                    </Box>
                                </Stack>
                            </Grid>

                            <Grid size={{ xs: 12 }}>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="h6" fontWeight="bold" mb={2} color="primary">Financial & KYC</Typography>
                                <Grid container spacing={3}>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Box p={2} sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                            <Typography variant="caption" color="text.secondary" display="block">Points Balance</Typography>
                                            <Typography variant="h5" fontWeight="bold" color="primary.main">{(memberDetails as any).pointsBalance || 0}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Box p={2} sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                            <Typography variant="caption" color="text.secondary" display="block">Total Earnings</Typography>
                                            <Typography variant="h5" fontWeight="bold" color="success.main">₹{(memberDetails as any).totalEarnings || 0}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 4 }}>
                                        <Box p={2} sx={{ bgcolor: 'white', borderRadius: 2, border: '1px solid #e2e8f0' }}>
                                            <Typography variant="caption" color="text.secondary" display="block">Bank Status</Typography>
                                            <Chip
                                                label={(memberDetails as any).isBankValidated ? 'Validated' : 'Pending'}
                                                color={(memberDetails as any).isBankValidated ? 'success' : 'warning'}
                                                size="small"
                                                variant="outlined"
                                            />
                                        </Box>
                                    </Grid>
                                </Grid>
                            </Grid>

                            {(memberDetails as any).bankAccountNo && (
                                <Grid size={{ xs: 12 }}>
                                    <Box p={3} sx={{ bgcolor: 'rgba(37, 99, 235, 0.05)', borderRadius: 3, border: '1px dashed #2563eb' }}>
                                        <Typography variant="subtitle2" fontWeight="bold" mb={2} display="flex" alignItems="center" gap={1}>
                                            <AccountBalance sx={{ fontSize: 18 }} color="primary" /> Bank Account Details
                                        </Typography>
                                        <Grid container spacing={2}>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <Typography variant="caption" color="text.secondary">Account Holder</Typography>
                                                <Typography variant="body2" fontWeight="medium">{(memberDetails as any).bankAccountName || 'N/A'}</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <Typography variant="caption" color="text.secondary">Account Number</Typography>
                                                <Typography variant="body2" fontWeight="medium">{(memberDetails as any).bankAccountNo || 'N/A'}</Typography>
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 4 }}>
                                                <Typography variant="caption" color="text.secondary">IFSC Code</Typography>
                                                <Typography variant="body2" fontWeight="medium">{(memberDetails as any).bankAccountIfsc || 'N/A'}</Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Grid>
                            )}
                        </Grid>
                    ) : (
                        <Box py={5} textAlign="center">
                            <Typography color="text.secondary">No additional details found for this member.</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, bgcolor: '#f8fafc' }}>
                    <Button
                        onClick={() => setDetailsModalOpen(false)}
                        variant="outlined"
                        sx={{ textTransform: 'none', borderRadius: '8px' }}
                    >
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ textTransform: 'none', borderRadius: '8px', bgcolor: '#2563eb' }}
                        startIcon={<Edit sx={{ fontSize: 18 }} />}
                    >
                        Edit Profile
                    </Button>
                </DialogActions>
            </Dialog>
            {/* KYC Documents Modal */}
            <Dialog
                open={kycModalOpen}
                onClose={() => setKycModalOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '16px', p: 1 }
                }}
            >
                <DialogTitle>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6" fontWeight="bold" component="span">KYC Documents - {selectedKycMember?.name}</Typography>
                        <IconButton onClick={() => setKycModalOpen(false)} size="small">
                            <Cancel />
                        </IconButton>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    {isLoadingKycDocs ? (
                        <Box display="flex" justifyContent="center" alignItems="center" py={5}>
                            <CircularProgress size={30} />
                        </Box>
                    ) : !kycDocuments || kycDocuments.length === 0 ? (
                        <Box py={5} textAlign="center">
                            <Typography color="text.secondary">No KYC documents found for this member.</Typography>
                        </Box>
                    ) : (
                        <Grid container spacing={3} mt={1}>
                            {kycDocuments.map((doc: any, idx: number) => (
                                <Grid size={{ xs: 12, md: 6 }} key={idx}>
                                    <Typography variant="subtitle2" fontWeight="medium" mb={1}>{doc.documentType}</Typography>
                                    <Box
                                        onClick={() => handleViewDocument(doc.signedUrl, doc.documentType)}
                                        sx={{
                                            border: '2px dashed #e2e8f0',
                                            borderRadius: '12px',
                                            p: 4,
                                            textAlign: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s',
                                            '&:hover': {
                                                bgcolor: 'rgba(37, 99, 235, 0.04)',
                                                borderColor: '#2563eb'
                                            }
                                        }}
                                    >
                                        {doc.documentType.toLowerCase().includes('aadhaar') ? <AssignmentInd sx={{ fontSize: 40, color: 'text.secondary' }} /> :
                                            doc.documentType.toLowerCase().includes('pan') ? <CreditCard sx={{ fontSize: 40, color: 'text.secondary' }} /> :
                                                doc.documentType.toLowerCase().includes('address') ? <LocationOn sx={{ fontSize: 40, color: 'text.secondary' }} /> :
                                                    <Business sx={{ fontSize: 40, color: 'text.secondary' }} />}
                                        <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                                            Click to view document
                                        </Typography>
                                        <Chip
                                            label={doc.verificationStatus}
                                            size="small"
                                            color={doc.verificationStatus === 'verified' ? 'success' : doc.verificationStatus === 'rejected' ? 'error' : 'warning'}
                                            sx={{ mt: 1, textTransform: 'capitalize' }}
                                        />
                                    </Box>
                                    {doc.verificationStatus === 'pending' && (
                                        <Box display="flex" gap={1} mt={2}>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                color="success"
                                                startIcon={<CheckCircle />}
                                                onClick={() => handleUpdateDocStatus(doc.id, 'verified')}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                fullWidth
                                                variant="outlined"
                                                size="small"
                                                color="error"
                                                startIcon={<Cancel />}
                                                onClick={() => handleUpdateDocStatus(doc.id, 'rejected')}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    )}
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button
                        onClick={() => setKycModalOpen(false)}
                        variant="outlined"
                        sx={{ textTransform: 'none', borderRadius: '8px' }}
                    >
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Document Viewer Modal */}
            <Dialog
                open={viewDocOpen}
                onClose={() => setViewDocOpen(false)}
                maxWidth="lg"
                fullWidth
                PaperProps={{
                    sx: { borderRadius: '16px', bgcolor: 'black', color: 'white', overflow: 'hidden', height: '90vh' }
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" p={2} bgcolor="#1f2937">
                    <Typography variant="h6">{viewDocType}</Typography>
                    <Box>
                        <IconButton onClick={() => window.open(viewDocUrl, '_blank')} sx={{ color: 'white', mr: 1 }} title="Open in new tab">
                            <Download />
                        </IconButton>
                        <IconButton onClick={() => setViewDocOpen(false)} sx={{ color: 'white' }}>
                            <Cancel />
                        </IconButton>
                    </Box>
                </Box>
                <Box flex={1} display="flex" justifyContent="center" alignItems="center" bgcolor="#000" overflow="auto" p={2} height="100%">
                    {viewDocUrl && (viewDocUrl.toLowerCase().includes('.pdf') || viewDocType.toLowerCase().includes('pdf')) ? (
                        <iframe src={viewDocUrl} style={{ width: '100%', height: '100%', border: 'none' }} title="Document Viewer" />
                    ) : (
                        <img
                            src={viewDocUrl}
                            alt="Document"
                            style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                        />
                    )}
                </Box>
            </Dialog>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={() => setSnackbarOpen(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
