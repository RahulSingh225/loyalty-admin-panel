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
    Stack
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
import { useQuery } from '@tanstack/react-query';
import { getMembersDataAction, getMemberDetailsAction } from '@/actions/member-actions';

export default function MembersClient() {
    const [levelTab, setLevelTab] = useState(0);
    const [entityTab, setEntityTab] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [kycStatusFilter, setKycStatusFilter] = useState('All Status');
    const [regionFilter, setRegionFilter] = useState('All Regions');

    const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});
    const [detailsModalOpen, setDetailsModalOpen] = useState(false);
    const [selectedMember, setSelectedMember] = useState<{ type: string, id: number, member: any } | null>(null);

    const [kycModalOpen, setKycModalOpen] = useState(false);
    const [selectedKycMember, setSelectedKycMember] = useState<any>(null);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    const { data } = useQuery({
        queryKey: ['members-data', debouncedQuery, kycStatusFilter, regionFilter],
        queryFn: () => getMembersDataAction({
            searchQuery: debouncedQuery,
            kycStatus: kycStatusFilter,
            region: regionFilter
        }),
        staleTime: 60 * 1000,
    });

    const { data: memberDetails, isLoading: isLoadingDetails } = useQuery({
        queryKey: ['member-details', selectedMember?.type, selectedMember?.id],
        queryFn: () => selectedMember ? getMemberDetailsAction(selectedMember.type, selectedMember.id) : null,
        enabled: !!selectedMember,
    });

    if (!data || !data.levels || data.levels.length === 0) return null;

    const currentLevel = data.levels[levelTab];
    // Ensure entityTab is valid for currentLevel
    const activeEntityTab = entityTab >= currentLevel.entities.length ? 0 : entityTab;
    const currentEntity = currentLevel.entities[activeEntityTab];

    if (!currentEntity) return null;

    const stats = currentEntity.members.stats;
    const members = currentEntity.members.list;

    const handleLevelChange = (index: number) => {
        setLevelTab(index);
        setEntityTab(0);
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
                {data.levels.map((level: any, index: number) => (
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
                        onClick={() => setEntityTab(index)}
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
                                                <MenuItem onClick={() => handleMenuClose(`kyc-${member.id}`)} sx={{ color: '#059669' }}>
                                                    <ListItemIcon><CheckCircle fontSize="small" sx={{ color: '#059669' }} /></ListItemIcon>
                                                    <ListItemText primary="Approve KYC" />
                                                </MenuItem>
                                                <MenuItem onClick={() => handleMenuClose(`kyc-${member.id}`)} sx={{ color: '#dc2626' }}>
                                                    <ListItemIcon><Cancel fontSize="small" sx={{ color: '#dc2626' }} /></ListItemIcon>
                                                    <ListItemText primary="Reject KYC" />
                                                </MenuItem>
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
                                                <MenuItem onClick={() => handleMenuClose(`block-${member.id}`)} sx={{ color: '#d97706' }}>
                                                    <ListItemIcon><QrCode fontSize="small" sx={{ color: '#d97706' }} /></ListItemIcon>
                                                    <ListItemText primary="Block Scan" />
                                                </MenuItem>
                                                <MenuItem onClick={() => handleMenuClose(`block-${member.id}`)} sx={{ color: '#d97706' }}>
                                                    <ListItemIcon><CardGiftcard fontSize="small" sx={{ color: '#d97706' }} /></ListItemIcon>
                                                    <ListItemText primary="Block Redemption" />
                                                </MenuItem>
                                                <MenuItem onClick={() => handleMenuClose(`block-${member.id}`)} sx={{ color: '#dc2626' }}>
                                                    <ListItemIcon><Lock fontSize="small" sx={{ color: '#dc2626' }} /></ListItemIcon>
                                                    <ListItemText primary="Block Account" />
                                                </MenuItem>
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
                        Showing 1 to {members.length} of {stats.total.toLocaleString()} {currentEntity.name.toLowerCase()}
                    </Typography>
                    <Box display="flex" gap={1}>
                        <Button variant="outlined" size="small" sx={{ textTransform: 'none', minWidth: 80 }}>Previous</Button>
                        <Button variant="contained" size="small" sx={{ textTransform: 'none', minWidth: 32, p: 0, bgcolor: '#2563eb' }}>1</Button>
                        <Button variant="outlined" size="small" sx={{ textTransform: 'none', minWidth: 32, p: 0 }}>2</Button>
                        <Button variant="outlined" size="small" sx={{ textTransform: 'none', minWidth: 32, p: 0 }}>3</Button>
                        <Button variant="outlined" size="small" sx={{ textTransform: 'none', minWidth: 80 }}>Next</Button>
                    </Box>
                </Box>
            </div>

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
                                        label={currentEntity.name}
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
                    <Grid container spacing={3} mt={1}>
                        {[
                            { title: 'Aadhaar Card', icon: <AssignmentInd sx={{ fontSize: 40, color: 'text.secondary' }} /> },
                            { title: 'PAN Card', icon: <CreditCard sx={{ fontSize: 40, color: 'text.secondary' }} /> },
                            { title: 'Address Proof', icon: <LocationOn sx={{ fontSize: 40, color: 'text.secondary' }} /> },
                            { title: 'Business License', icon: <Business sx={{ fontSize: 40, color: 'text.secondary' }} /> }
                        ].map((doc, idx) => (
                            <Grid size={{ xs: 12, md: 6 }} key={idx}>
                                <Typography variant="subtitle2" fontWeight="medium" mb={1}>{doc.title}</Typography>
                                <Box
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
                                    {doc.icon}
                                    <Typography variant="caption" display="block" color="text.secondary" mt={1}>
                                        Click to view document
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ p: 3, gap: 1 }}>
                    <Button
                        onClick={() => setKycModalOpen(false)}
                        variant="outlined"
                        sx={{ textTransform: 'none', borderRadius: '8px' }}
                    >
                        Close
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ textTransform: 'none', borderRadius: '8px', bgcolor: '#10b981', '&:hover': { bgcolor: '#059669' } }}
                        startIcon={<CheckCircle />}
                    >
                        Approve KYC
                    </Button>
                    <Button
                        variant="contained"
                        sx={{ textTransform: 'none', borderRadius: '8px', bgcolor: '#ef4444', '&:hover': { bgcolor: '#dc2626' } }}
                        startIcon={<Cancel />}
                    >
                        Reject KYC
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
