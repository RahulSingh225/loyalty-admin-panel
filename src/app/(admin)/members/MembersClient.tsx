'use client';

import { useState } from 'react';
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
    Avatar
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
    PersonOutline
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getMembersDataAction } from '@/actions/member-actions';

export default function MembersClient() {
    const [activeTab, setActiveTab] = useState(0); // 0: Electricians, 1: Retailers, 2: CSB, 3: Staff
    const [searchQuery, setSearchQuery] = useState('');
    const [anchorEl, setAnchorEl] = useState<{ [key: string]: HTMLElement | null }>({});

    const { data } = useQuery({
        queryKey: ['members-data'],
        queryFn: getMembersDataAction,
        staleTime: 60 * 1000,
    });

    if (!data) return null;

    const tabs = [
        { label: 'Electricians', key: 'electricians' },
        { label: 'Retailers', key: 'retailers' },
        { label: 'CSB', key: 'csb' },
        { label: 'Staff', key: 'staff' },
    ];

    const currentTabKey = tabs[activeTab].key as keyof typeof data;
    const currentData = data[currentTabKey];
    const stats = currentData.stats;
    const members = currentData.list;

    const handleMenuOpen = (id: string, event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl({ ...anchorEl, [id]: event.currentTarget });
    };

    const handleMenuClose = (id: string) => {
        setAnchorEl({ ...anchorEl, [id]: null });
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
            {/* Header section is managed by Layout/TopBar but we add page-specific actions if needed */}
            {/* Based on ref/14.htm, the header is handled differently, but we'll stick to our Layout */}

            {/* Tabs */}
            <div className="tabs mb-6">
                {tabs.map((tab, index) => (
                    <button
                        key={tab.key}
                        className={`tab ${activeTab === index ? 'active' : ''}`}
                        onClick={() => setActiveTab(index)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Statistics */}
            <Grid container spacing={3} mb={4}>
                <Grid size={{ xs: 12, md: 6, lg: 3 }}>
                    <div className="widget-card rounded-xl shadow p-6">
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography variant="subtitle2" color="text.secondary">Total {tabs[activeTab].label}</Typography>
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
                            placeholder={`Search ${tabs[activeTab].label.toLowerCase()}...`}
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
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-sm">
                            <option>All Status</option>
                            <option>KYC Pending</option>
                            <option>KYC Approved</option>
                            <option>KYC Rejected</option>
                            <option>Blocked</option>
                        </select>
                    </Grid>
                    <Grid size={{ xs: 6, md: 2 }}>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-white text-sm">
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
                    <Typography variant="h6" fontWeight="bold">{tabs[activeTab].label} List</Typography>
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
                                    {activeTab === 0 ? 'Electrician' : activeTab === 1 ? 'Retailer' : activeTab === 2 ? 'CSB' : 'Staff'}
                                </TableCell>
                                <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>Contact</TableCell>
                                <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>
                                    {activeTab === 1 ? 'Store' : activeTab === 2 ? 'Company' : activeTab === 3 ? 'Role' : 'Region'}
                                </TableCell>
                                <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>KYC Status</TableCell>
                                {activeTab === 0 && <TableCell sx={{ textTransform: 'uppercase', fontSize: '0.75rem', fontWeight: 600, color: 'text.secondary' }}>Joined</TableCell>}
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
                                        {activeTab === 1 ? (
                                            <>
                                                <Typography variant="body2" fontWeight="medium">{member.storeName}</Typography>
                                                <Typography variant="caption" color="text.secondary">{member.location}</Typography>
                                            </>
                                        ) : activeTab === 2 ? (
                                            <>
                                                <Typography variant="body2" fontWeight="medium">{member.companyName}</Typography>
                                                <Typography variant="caption" color="text.secondary">{member.location}</Typography>
                                            </>
                                        ) : activeTab === 3 ? (
                                            <Typography variant="body2">{member.role}</Typography>
                                        ) : (
                                            <Typography variant="body2">{member.regions}</Typography>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        {getKycBadge(member.kycStatus)}
                                    </TableCell>
                                    {activeTab === 0 && (
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
                                                <MenuItem onClick={() => handleMenuClose(`kyc-${member.id}`)}>
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
                                                <MenuItem onClick={() => handleMenuClose(`more-${member.id}`)}>
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
                        Showing 1 to {members.length} of {stats.total.toLocaleString()} {tabs[activeTab].label.toLowerCase()}
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
        </Box>
    );
}
