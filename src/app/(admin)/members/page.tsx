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
  Grid
} from '@mui/material';
import {
  Search,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
  FileDownload as FileDownloadIcon
} from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface Member {
  id: string;
  name: string;
  email: string;
  mobile: string;
  points: number;
  status: 'active' | 'inactive' | 'blocked';
  joinDate: string;
  tier: string;
}

const membersData: Member[] = [
  {
    id: 'MEM001',
    name: 'John Doe',
    email: 'john.doe@example.com',
    mobile: '+91 9876543210',
    points: 2500,
    status: 'active',
    joinDate: '2023-01-15',
    tier: 'Gold'
  },
  {
    id: 'MEM002',
    name: 'Alice Smith',
    email: 'alice.smith@example.com',
    mobile: '+91 9876543211',
    points: 1800,
    status: 'active',
    joinDate: '2023-02-20',
    tier: 'Silver'
  },
  {
    id: 'MEM003',
    name: 'Bob Johnson',
    email: 'bob.johnson@example.com',
    mobile: '+91 9876543212',
    points: 500,
    status: 'inactive',
    joinDate: '2023-03-10',
    tier: 'Bronze'
  },
  {
    id: 'MEM004',
    name: 'Emma Wilson',
    email: 'emma.wilson@example.com',
    mobile: '+91 9876543213',
    points: 3200,
    status: 'blocked',
    joinDate: '2023-01-05',
    tier: 'Gold'
  }
];

export default function MembersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    }
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

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

  const filteredMembers = membersData.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.mobile.includes(searchQuery)
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <div>
          <Typography variant="h4" gutterBottom>
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
            sx={{ mr: 1 }}
          >
            Add Member
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
          >
            Export
          </Button>
        </Box>
      </Box>

      <Card>
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
                  <TableRow key={member.id}>
                    <TableCell>{member.id}</TableCell>
                    <TableCell>{member.name}</TableCell>
                    <TableCell>{member.email}</TableCell>
                    <TableCell>{member.mobile}</TableCell>
                    <TableCell>{member.points.toLocaleString()}</TableCell>
                    <TableCell>
                      <Chip
                        label={member.status.toUpperCase()}
                        color={getStatusColor(member.status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={member.tier}
                        size="small"
                        sx={{
                          backgroundColor: getTierColor(member.tier),
                          color: '#000000'
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
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" color="error">
                        <DeleteIcon />
                      </IconButton>
                      {member.status !== 'blocked' && (
                        <IconButton size="small" color="warning">
                          <BlockIcon />
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
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Name"
                  defaultValue={selectedMember?.name}
                />
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  defaultValue={selectedMember?.email}
                />
                <TextField
                  fullWidth
                  label="Mobile"
                  defaultValue={selectedMember?.mobile}
                />
                <TextField
                  fullWidth
                  label="Initial Points"
                  type="number"
                  defaultValue={selectedMember?.points}
                />
            </Box>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" color="primary">
            {selectedMember ? 'Save Changes' : 'Add Member'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}