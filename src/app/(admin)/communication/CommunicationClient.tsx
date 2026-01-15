'use client';

import { useState } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Button,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import {
    MailOutline,
    Chat,
    NotificationsActive,
    Campaign,
    Send,
    Schedule,
    FormatListBulleted
} from '@mui/icons-material';
import { useQuery } from '@tanstack/react-query';
import { getCommunicationDataAction, Message } from '@/actions/communication-actions';

export default function CommunicationClient() {
    const [selectedType, setSelectedType] = useState('email');
    const [messageSubject, setMessageSubject] = useState('');

    const { data: messages = [], isLoading, error } = useQuery({
        queryKey: ['communication-messages'],
        queryFn: getCommunicationDataAction
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'sent':
                return 'success';
            case 'scheduled':
                return 'warning';
            case 'draft':
                return 'info';
            default:
                return 'default';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'email':
                return <MailOutline fontSize="small" />;
            case 'sms':
                return <Chat fontSize="small" />;
            case 'notification':
                return <NotificationsActive fontSize="small" />;
            default:
                return null;
        }
    };

    if (isLoading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;
    if (error) return <Alert severity="error">Failed to load messages</Alert>;

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Communication Console
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                Manage all your customer communications in one place
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '300px 1fr' }, gap: 3 }}>
                {/* Message Composer */}
                <Card className="widget-card">
                    <CardContent>
                        <Typography variant="h6" gutterBottom>
                            New Message
                        </Typography>
                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>Message Type</InputLabel>
                            <Select
                                value={selectedType}
                                label="Message Type"
                                onChange={(e) => setSelectedType(e.target.value)}
                            >
                                <MenuItem value="email">Email</MenuItem>
                                <MenuItem value="sms">SMS</MenuItem>
                                <MenuItem value="notification">Push Notification</MenuItem>
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Subject"
                            value={messageSubject}
                            onChange={(e) => setMessageSubject(e.target.value)}
                            sx={{ mb: 2 }}
                        />

                        <TextField
                            fullWidth
                            label="Message"
                            multiline
                            rows={4}
                            sx={{ mb: 2 }}
                        />

                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                startIcon={<Send />}
                                fullWidth
                            >
                                Send Now
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<Schedule />}
                                fullWidth
                            >
                                Schedule
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                {/* Message List */}
                <Card className="widget-card">
                    <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                            <Typography variant="h6">
                                Recent Messages
                            </Typography>
                            <Button
                                startIcon={<FormatListBulleted />}
                            >
                                View All
                            </Button>
                        </Box>

                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Subject</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Recipients</TableCell>
                                        <TableCell>Open Rate</TableCell>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {messages.map((message) => (
                                        <TableRow key={message.id}>
                                            <TableCell>
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    {getTypeIcon(message.type)}
                                                    <Typography variant="body2">
                                                        {message.type.toUpperCase()}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>{message.subject}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={message.status.toUpperCase()}
                                                    color={getStatusColor(message.status) as any}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{message.recipients.toLocaleString()}</TableCell>
                                            <TableCell>
                                                {message.openRate ? `${message.openRate}%` : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {message.sentDate || message.scheduledDate || '-'}
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small" color="primary">
                                                    <Campaign />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}
