'use client';
import React, { useState } from 'react';
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
  InputBase,
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
} from '@mui/material';
import {
  Search,
  FilterList,
  Download,
  Edit,
  Security,
  Block,
  CheckCircle,
  Add,
  Notifications,
  Settings,
  Logout,
  PersonAdd,
  Shield,
  Timeline,
  Assessment,
  People,
  Assignment,
  Settings as SettingsIcon,
  ViewList,
} from '@mui/icons-material';

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

export default function RoleManagement() {
  const [tabValue, setTabValue] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Box sx={{ width: '100%', p: 3 }}>
      {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Role Management
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage user roles, permissions, and access control
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" startIcon={<PersonAdd />} onClick={handleOpenDialog}>
            Add User
          </Button>
          <Button variant="contained" color="success" startIcon={<Shield />}>
            Create Role
          </Button>
          <IconButton color="inherit">
            <Badge badgeContent={1} color="error">
              <Notifications />
            </Badge>
          </IconButton>
          <IconButton color="inherit">
            <Settings />
          </IconButton>
          <Button variant="contained" color="error" startIcon={<Logout />}>
            Logout
          </Button>
        </Stack>
      </Box> */}

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="role management tabs">
          <Tab label="Users" {...a11yProps(0)} />
          <Tab label="Roles" {...a11yProps(1)} />
          <Tab label="Access Logs" {...a11yProps(2)} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {/* User Statistics */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Total Users
                  </Typography>
                  <People color="primary" />
                </Box>
                <Typography variant="h4" component="div" gutterBottom>
                  248
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="success.main">
                    +12
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    this month
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Active Users
                  </Typography>
                  <CheckCircle color="success" />
                </Box>
                <Typography variant="h4" component="div" gutterBottom>
                  186
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="success.main">
                    75%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    active rate
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Admin Users
                  </Typography>
                  <Shield color="secondary" />
                </Box>
                <Typography variant="h4" component="div" gutterBottom>
                  12
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="primary.main">
                    5%
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    of total
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Pending Invites
                  </Typography>
                  <Notifications color="warning" />
                </Box>
                <Typography variant="h4" component="div" gutterBottom>
                  8
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography variant="body2" color="warning.main">
                    3
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
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: <Search position="start" />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
                  <InputLabel id="role-filter-label">Role</InputLabel>
                  <Select
                    labelId="role-filter-label"
                    id="role-filter"
                    value={roleFilter}
                    label="Role"
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="manager">Manager</MenuItem>
                    <MenuItem value="operator">Operator</MenuItem>
                    <MenuItem value="viewer">Viewer</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth>
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
              <Grid item xs={12} sm={6} md={3}>
                <Button variant="contained" startIcon={<FilterList />}>
                  Apply Filters
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Users Table */}
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
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
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>JD</Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            John Doe
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            User ID: USR001
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>john.doe@sturlite.com</TableCell>
                    <TableCell>
                      <Chip label="Admin" color="primary" size="small" />
                    </TableCell>
                    <TableCell>IT</TableCell>
                    <TableCell>Oct 25, 2023 10:30 AM</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'success.main',
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2" color="success.main">
                          Active
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
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>AS</Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            Alice Smith
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            User ID: USR002
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>alice.smith@sturlite.com</TableCell>
                    <TableCell>
                      <Chip label="Manager" color="success" size="small" />
                    </TableCell>
                    <TableCell>Sales</TableCell>
                    <TableCell>Oct 25, 2023 09:15 AM</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'success.main',
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2" color="success.main">
                          Active
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
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', mr: 2 }}>RJ</Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            Robert Johnson
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            User ID: USR003
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>robert.johnson@sturlite.com</TableCell>
                    <TableCell>
                      <Chip label="Operator" color="warning" size="small" />
                    </TableCell>
                    <TableCell>Operations</TableCell>
                    <TableCell>Oct 24, 2023 04:45 PM</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'success.main',
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2" color="success.main">
                          Active
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
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>EW</Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            Emma Wilson
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            User ID: USR004
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>emma.wilson@sturlite.com</TableCell>
                    <TableCell>
                      <Chip label="Viewer" color="default" size="small" />
                    </TableCell>
                    <TableCell>Marketing</TableCell>
                    <TableCell>Oct 23, 2023 02:30 PM</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'warning.main',
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2" color="warning.main">
                          Pending
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
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>MB</Avatar>
                        <Box>
                          <Typography variant="body1" fontWeight="medium">
                            Michael Brown
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            User ID: USR005
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>michael.brown@sturlite.com</TableCell>
                    <TableCell>
                      <Chip label="Manager" color="success" size="small" />
                    </TableCell>
                    <TableCell>Finance</TableCell>
                    <TableCell>Oct 22, 2023 11:20 AM</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            backgroundColor: 'error.main',
                            mr: 1,
                          }}
                        />
                        <Typography variant="body2" color="error.main">
                          Inactive
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
                      <IconButton size="small" color="success">
                        <CheckCircle fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Showing 1 to 5 of 248 entries
              </Typography>
              <Pagination count={5} page={1} />
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {/* Roles Tab Content */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={4}>
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
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => setSelectedRole('admin')}>
              <Typography variant="h6" gutterBottom>
                Admin
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Full system access with all permissions
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" gutterBottom>
                Permissions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="User Management" size="small" />
                <Chip label="Role Management" size="small" />
                <Chip label="System Configuration" size="small" />
                <Chip label="Reports" size="small" />
                <Chip label="All Modules" size="small" />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => setSelectedRole('manager')}>
              <Typography variant="h6" gutterBottom>
                Manager
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Department-level access with limited permissions
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" gutterBottom>
                Permissions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Team Management" size="small" />
                <Chip label="Department Reports" size="small" />
                <Chip label="Process Approval" size="small" />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => setSelectedRole('operator')}>
              <Typography variant="h6" gutterBottom>
                Operator
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Day-to-day operations with limited access
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" gutterBottom>
                Permissions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="Scan/Transaction" size="small" />
                <Chip label="Redemption" size="small" />
                <Chip label="Basic Reports" size="small" />
              </Box>
            </Card>
          </Grid>
          <Grid item xs={12} md={6}>
            <Card sx={{ p: 2, cursor: 'pointer' }} onClick={() => setSelectedRole('viewer')}>
              <Typography variant="h6" gutterBottom>
                Viewer
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Read-only access to reports and dashboards
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" gutterBottom>
                Permissions:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                <Chip label="View Reports" size="small" />
                <Chip label="View Dashboard" size="small" />
              </Box>
            </Card>
          </Grid>
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

      <TabPanel value={tabValue} index={2}>
        {/* Access Logs Tab Content */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Recent Access Logs
            </Typography>
            <TableContainer component={Paper}>
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
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 32, height: 32 }}>JD</Avatar>
                        <Typography variant="body2">John Doe</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>Login</TableCell>
                    <TableCell>Authentication</TableCell>
                    <TableCell>192.168.1.1</TableCell>
                    <TableCell>Oct 25, 2023 10:30 AM</TableCell>
                    <TableCell>
                      <Chip label="Success" color="success" size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'success.main', mr: 2, width: 32, height: 32 }}>AS</Avatar>
                        <Typography variant="body2">Alice Smith</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>View Report</TableCell>
                    <TableCell>Reports</TableCell>
                    <TableCell>192.168.1.2</TableCell>
                    <TableCell>Oct 25, 2023 09:45 AM</TableCell>
                    <TableCell>
                      <Chip label="Success" color="success" size="small" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell component="th" scope="row">
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ bgcolor: 'secondary.main', mr: 2, width: 32, height: 32 }}>RJ</Avatar>
                        <Typography variant="body2">Robert Johnson</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>Failed Login</TableCell>
                    <TableCell>Authentication</TableCell>
                    <TableCell>192.168.1.3</TableCell>
                    <TableCell>Oct 25, 2023 09:15 AM</TableCell>
                    <TableCell>
                      <Chip label="Failed" color="error" size="small" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Showing 1 to 3 of 1,842 entries
              </Typography>
              <Pagination count={5} page={1} />
            </Box>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Add User Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Add New User</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoFocus
                margin="dense"
                id="firstName"
                label="First Name"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                margin="dense"
                id="lastName"
                label="Last Name"
                type="text"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                id="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                margin="dense"
                id="mobile"
                label="Mobile Number"
                type="tel"
                fullWidth
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel id="role-select-label">Role</InputLabel>
                <Select
                  labelId="role-select-label"
                  id="role-select"
                  label="Role"
                  defaultValue=""
                >
                  <MenuItem value="">Select Role</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="manager">Manager</MenuItem>
                  <MenuItem value="operator">Operator</MenuItem>
                  <MenuItem value="viewer">Viewer</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel id="department-select-label">Department</InputLabel>
                <Select
                  labelId="department-select-label"
                  id="department-select"
                  label="Department"
                  defaultValue=""
                >
                  <MenuItem value="">Select Department</MenuItem>
                  <MenuItem value="it">IT</MenuItem>
                  <MenuItem value="sales">Sales</MenuItem>
                  <MenuItem value="operations">Operations</MenuItem>
                  <MenuItem value="marketing">Marketing</MenuItem>
                  <MenuItem value="finance">Finance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCloseDialog} variant="contained">
            Add User
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}