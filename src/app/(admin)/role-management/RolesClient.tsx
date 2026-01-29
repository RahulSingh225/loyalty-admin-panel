'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Tabs,
    Tab,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Badge,
    Avatar,
    Chip,
    IconButton,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Pagination,
    Divider,
    Stack,
    TextField,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Search,
    FilterList,
    Edit,
    Security,
    Block,
    CheckCircle,
    Notifications,
    Logout,
    PersonAdd,
    Shield,
    People,
    Settings
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getRoleDataAction } from '@/actions/role-actions';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function RolesClient() {
    const [tabValue, setTabValue] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [debouncedSearch, setDebouncedSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(searchTerm);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm]);

    const { data, isLoading, error } = useQuery({
        queryKey: ['role-data', debouncedSearch, roleFilter, statusFilter],
        queryFn: () => getRoleDataAction({
            searchTerm: debouncedSearch,
            roleFilter,
            statusFilter
        })
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    if (isLoading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;
    if (error) return <Alert severity="error">Failed to load role data</Alert>;

    const users = data?.users || [];
    const roles = data?.roles || [];
    const logs = data?.logs || [];

    return (
        <Box sx={{ width: '100%', p: 3 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="role management tabs">
                    <Tab label="Users" {...a11yProps(0)} />
                    {/* <Tab label="Roles" {...a11yProps(1)} /> */}
                    <Tab label="Access Logs" {...a11yProps(1)} />
                </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
                {/* User Statistics */}
                <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Users
                                    </Typography>
                                    <People color="primary" />
                                </Box>
                                <Typography variant="h4" component="div" gutterBottom>
                                    {data?.stats?.totalUsers || 0}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" color="success.main">
                                        +0
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        this month
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Active Users
                                    </Typography>
                                    <CheckCircle color="success" />
                                </Box>
                                <Typography variant="h4" component="div" gutterBottom>
                                    {data?.stats?.activeUsers || 0}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" color="success.main">
                                        {data?.stats?.totalUsers ? Math.round((data.stats.activeUsers / data.stats.totalUsers) * 100) : 0}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        active rate
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Admin Users
                                    </Typography>
                                    <Shield color="secondary" />
                                </Box>
                                <Typography variant="h4" component="div" gutterBottom>
                                    {data?.stats?.adminUsers || 0}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" color="primary.main">
                                        {data?.stats?.totalUsers ? Math.round((data.stats.adminUsers / data.stats.totalUsers) * 100) : 0}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        of total
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Card>
                            <CardContent>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        Pending Invites
                                    </Typography>
                                    <Notifications color="warning" />
                                </Box>
                                <Typography variant="h4" component="div" gutterBottom>
                                    {data?.stats?.pendingInvites || 0}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    <Typography variant="body2" color="warning.main">
                                        0
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                                        expiring
                                    </Typography>
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* User Filters */}
                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <TextField
                                    fullWidth
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    InputProps={{
                                        startAdornment: <Search sx={{ mr: 1, color: 'text.secondary' }} />,
                                    }}
                                    size="small"
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="role-filter-label">Role</InputLabel>
                                    <Select
                                        labelId="role-filter-label"
                                        id="role-filter"
                                        value={roleFilter}
                                        label="Role"
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                    >
                                        <MenuItem value="">All Roles</MenuItem>
                                        <MenuItem value="Admin">Admin</MenuItem>
                                        <MenuItem value="Manager">Manager</MenuItem>
                                        <MenuItem value="Operator">Operator</MenuItem>
                                        <MenuItem value="Viewer">Viewer</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <FormControl fullWidth size="small">
                                    <InputLabel id="status-filter-label">Status</InputLabel>
                                    <Select
                                        labelId="status-filter-label"
                                        id="status-filter"
                                        value={statusFilter}
                                        label="Status"
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                    >
                                        <MenuItem value="">All Status</MenuItem>
                                        <MenuItem value="active">Active</MenuItem>
                                        <MenuItem value="inactive">Inactive</MenuItem>
                                        <MenuItem value="pending">Pending</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <Button
                                    variant="outlined"
                                    startIcon={<FilterList />}
                                    fullWidth
                                    onClick={() => {
                                        setSearchTerm('');
                                        setRoleFilter('');
                                        setStatusFilter('');
                                    }}
                                >
                                    Reset Filters
                                </Button>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* Users Table */}
                <Card>
                    <CardContent>
                        <TableContainer component={Paper} elevation={0} variant="outlined">
                            <Table sx={{ minWidth: 650 }} aria-label="users table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Email</TableCell>
                                        <TableCell>Role</TableCell>
                                        <TableCell>Department</TableCell>
                                        <TableCell>Last Login</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {users.map((user) => (
                                        <TableRow key={user.id} hover>
                                            <TableCell component="th" scope="row">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ bgcolor: user.color, mr: 2 }}>{user.initials}</Avatar>
                                                    <Box>
                                                        <Typography variant="body1" fontWeight="medium">
                                                            {user.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {user.id}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={user.role}
                                                    color={user.role === 'Admin' ? 'primary' : user.role === 'Manager' ? 'success' : user.role === 'Operator' ? 'warning' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{user.department}</TableCell>
                                            <TableCell>{user.lastLogin}</TableCell>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Box
                                                        sx={{
                                                            width: 8,
                                                            height: 8,
                                                            borderRadius: '50%',
                                                            backgroundColor: user.status === 'active' ? 'success.main' : user.status === 'pending' ? 'warning.main' : 'error.main',
                                                            mr: 1,
                                                        }}
                                                    />
                                                    <Typography variant="body2" color={user.status === 'active' ? 'success.main' : user.status === 'pending' ? 'warning.main' : 'error.main'}>
                                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small" color="primary">
                                                    <Edit fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="success">
                                                    <Security fontSize="small" />
                                                </IconButton>
                                                <IconButton size="small" color="error">
                                                    <Block fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
                            <Typography variant="body2" color="text.secondary">
                                Showing 1 to {users.length} of {data?.stats?.totalUsers || 0} entries
                            </Typography>
                            <Pagination count={Math.ceil((data?.stats?.totalUsers || 1) / 100)} page={1} />
                        </Box>
                    </CardContent>
                </Card>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
                {/* Roles Tab Content */}
                <Grid container spacing={3}>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Total Roles
                                </Typography>
                                <Typography variant="h4" component="div">
                                    8
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    2 custom roles
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    System Roles
                                </Typography>
                                <Typography variant="h4" component="div">
                                    6
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Built-in roles
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Custom Roles
                                </Typography>
                                <Typography variant="h4" component="div">
                                    2
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    User-defined roles
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mt: 3 }}>
                    {roles.map((role: any) => (
                        <Grid size={{ xs: 12, md: 6 }} key={role.id}>
                            <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => setSelectedRole(role.name)}>
                                <Typography variant="h6" gutterBottom>
                                    {role.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                    {role.description}
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <Typography variant="body2" gutterBottom>
                                    Permissions:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {role.permissions.map((p) => (
                                        <Chip key={p} label={p} size="small" />
                                    ))}
                                </Box>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {selectedRole && (
                    <Dialog open={true} onClose={() => setSelectedRole('')} maxWidth="md" fullWidth>
                        <DialogTitle>Role Details: {selectedRole}</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1" gutterBottom>
                                Configure permissions for the {selectedRole} role.
                            </Typography>
                            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                                Permissions:
                            </Typography>
                            <FormGroup>
                                <FormControlLabel control={<Checkbox defaultChecked />} label="Dashboard Access" />
                                <FormControlLabel control={<Checkbox defaultChecked />} label="User Management" />
                                <FormControlLabel control={<Checkbox />} label="Role Management" />
                                <FormControlLabel control={<Checkbox defaultChecked />} label="Reports" />
                                <FormControlLabel control={<Checkbox />} label="System Configuration" />
                                <FormControlLabel control={<Checkbox defaultChecked />} label="Process Management" />
                                <FormControlLabel control={<Checkbox />} label="Finance & Compliance" />
                                <FormControlLabel control={<Checkbox />} label="Fraud Detection" />
                            </FormGroup>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setSelectedRole('')}>Cancel</Button>
                            <Button variant="contained">Save Changes</Button>
                        </DialogActions>
                    </Dialog>
                )}
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
                {/* Access Logs Tab Content */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            Recent Access Logs
                        </Typography>
                        <TableContainer component={Paper} elevation={0} variant="outlined">
                            <Table sx={{ minWidth: 650 }} aria-label="access logs table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>User</TableCell>
                                        <TableCell>Action</TableCell>
                                        <TableCell>Module</TableCell>
                                        <TableCell>IP Address</TableCell>
                                        <TableCell>Date/Time</TableCell>
                                        <TableCell>Status</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {logs.map((log) => (
                                        <TableRow key={log.id} hover>
                                            <TableCell component="th" scope="row">
                                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                    <Avatar sx={{ bgcolor: log.color, mr: 2, width: 32, height: 32 }}>{log.initials}</Avatar>
                                                    <Typography variant="body2">{log.user}</Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{log.action}</TableCell>
                                            <TableCell>{log.module}</TableCell>
                                            <TableCell>{log.ip}</TableCell>
                                            <TableCell>{log.dateTime}</TableCell>
                                            <TableCell>
                                                <Chip label={log.status === 'success' ? 'Success' : 'Failed'} color={log.status === 'success' ? 'success' : 'error'} size="small" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </TabPanel>
        </Box>
    );
}
