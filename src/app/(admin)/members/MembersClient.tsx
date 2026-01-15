'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    TextField,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Chip,
    InputAdornment,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    Search,
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Block as BlockIcon,
    FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getMembersAction, Member } from '@/actions/member-actions';

export default function MembersClient() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedMember, setSelectedMember] = useState<Member | null>(null);

    const { data: members = [], isLoading, error } = useQuery({
        queryKey: ['members'],
        queryFn: getMembersAction
    });

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(event.target.value);
    };

    const handleAddMember = () => {
        setSelectedMember(null);
        setOpenDialog(true);
    };

    const handleEditMember = (member: Member) => {
        setSelectedMember(member);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedMember(null);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'active':
                return 'success';
            case 'inactive':
                return 'warning';
            case 'blocked':
                return 'error';
            default:
                return 'default';
        }
    };

    const getTierColor = (tier: string) => {
        switch (tier) {
            case 'Gold':
                return '#FFD700';
            case 'Silver':
                return '#C0C0C0';
            case 'Bronze':
                return '#CD7F32';
            default:
                return '#000000';
        }
    };

    const filteredMembers = members.filter(member =>
        member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.mobile.includes(searchQuery)
    );

    if (isLoading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;
    if (error) return <Alert severity="error">Failed to load members</Alert>;

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <div>
                    <Typography variant="h4" gutterBottom fontWeight="bold">
                        Members
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Manage loyalty program members
                    </Typography>
                </div>
                <Box>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleAddMember}
                        sx={{ mr: 1, textTransform: 'none' }}
                    >
                        Add Member
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<FileDownloadIcon />}
                        sx={{ textTransform: 'none' }}
                    >
                        Export
                    </Button>
                </Box>
            </Box>

            <Card className="widget-card">
                <CardContent>
                    <Box sx={{ mb: 3 }}>
                        <TextField
                            fullWidth
                            placeholder="Search members by name, email, or mobile"
                            value={searchQuery}
                            onChange={handleSearch}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Search />
                                    </InputAdornment>
                                ),
                            }}
                            size="small"
                        />
                    </Box>

                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Member ID</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Mobile</TableCell>
                                    <TableCell>Points</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell>Tier</TableCell>
                                    <TableCell>Join Date</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredMembers.map((member) => (
                                    <TableRow key={member.id} hover>
                                        <TableCell>{member.id}</TableCell>
                                        <TableCell fontWeight="500">{member.name}</TableCell>
                                        <TableCell>{member.email}</TableCell>
                                        <TableCell>{member.mobile}</TableCell>
                                        <TableCell>{member.points.toLocaleString()}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={member.status.toUpperCase()}
                                                color={getStatusColor(member.status) as any}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={member.tier}
                                                size="small"
                                                sx={{
                                                    backgroundColor: getTierColor(member.tier) + '20', // Light bg
                                                    color: '#000',
                                                    border: `1px solid ${getTierColor(member.tier)}`
                                                }}
                                            />
                                        </TableCell>
                                        <TableCell>{member.joinDate}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleEditMember(member)}
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" color="error">
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                            {member.status !== 'blocked' && (
                                                <IconButton size="small" color="warning">
                                                    <BlockIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>

            {/* Add/Edit Member Dialog */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {selectedMember ? 'Edit Member' : 'Add New Member'}
                </DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ pt: 1 }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                            <TextField
                                fullWidth
                                label="Name"
                                defaultValue={selectedMember?.name}
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="Email"
                                type="email"
                                defaultValue={selectedMember?.email}
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="Mobile"
                                defaultValue={selectedMember?.mobile}
                                size="small"
                            />
                            <TextField
                                fullWidth
                                label="Initial Points"
                                type="number"
                                defaultValue={selectedMember?.points}
                                size="small"
                            />
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button variant="contained" color="primary">
                        {selectedMember ? 'Save Changes' : 'Add Member'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
