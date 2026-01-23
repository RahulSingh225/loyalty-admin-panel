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
    Alert,
    Tab,
    Tabs,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Switch,
    FormControlLabel,
    Grid
} from '@mui/material';
import {
    MailOutline,
    Chat,
    NotificationsActive,
    Campaign,
    Send,
    Schedule,
    FormatListBulleted,
    Settings,
    History,
    Add,
    Edit,
    Visibility,
    PlayArrow
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getNotificationTemplatesAction,
    getNotificationLogsAction,
    getEventMastersAction,
    upsertNotificationTemplateAction,
    sendManualNotificationAction
} from '@/actions/notification-actions';

export default function CommunicationClient() {
    const [activeTab, setActiveTab] = useState(0);
    const [openTemplateModal, setOpenTemplateModal] = useState(false);
    const [editingTemplate, setEditingTemplate] = useState<any>(null);
    const queryClient = useQueryClient();

    const { data: templates = [], isLoading: loadingTemplates } = useQuery({
        queryKey: ['notification-templates'],
        queryFn: () => getNotificationTemplatesAction()
    });

    const { data: logs = [], isLoading: loadingLogs } = useQuery({
        queryKey: ['notification-logs'],
        queryFn: () => getNotificationLogsAction()
    });

    const { data: eventMasters = [] } = useQuery({
        queryKey: ['event-masters'],
        queryFn: () => getEventMastersAction()
    });

    const upsertMutation = useMutation({
        mutationFn: upsertNotificationTemplateAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['notification-templates'] });
            setOpenTemplateModal(false);
            setEditingTemplate(null);
        }
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleEditTemplate = (template: any) => {
        setEditingTemplate(template);
        setOpenTemplateModal(true);
    };

    const handleSaveTemplate = (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const data = Object.fromEntries(formData.entries());
        upsertMutation.mutate({
            ...editingTemplate,
            ...data,
            isActive: data.isActive === 'on',
            triggerType: editingTemplate?.triggerType || 'manual'
        });
    };

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

    if (loadingTemplates || loadingLogs) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;

    return (
        <Box>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange}>
                    <Tab label="Campaigns & Direct" icon={<Send fontSize="small" />} iconPosition="start" />
                    <Tab label="Templates" icon={<FormatListBulleted fontSize="small" />} iconPosition="start" />
                    <Tab label="Event Triggers" icon={<Settings fontSize="small" />} iconPosition="start" />
                    <Tab label="Logs & History" icon={<History fontSize="small" />} iconPosition="start" />
                </Tabs>
            </Box>

            {
                activeTab === 0 && (
                    <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '350px 1fr' }, gap: 3 }}>
                        {/* Message Composer */}
                        <Card className="widget-card" sx={{ height: 'fit-content' }}>
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Compose Campaign</Typography>
                                <FormControl fullWidth sx={{ mb: 2 }}>
                                    <InputLabel>Select Template</InputLabel>
                                    <Select label="Select Template" defaultValue="">
                                        {templates.filter((t: any) => t.triggerType === 'campaign' || t.triggerType === 'manual').map((t: any) => (
                                            <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                <TextField fullWidth label="Target User Group / IDs" multiline rows={2} sx={{ mb: 2 }} placeholder="Enter User IDs separated by comma" />
                                <TextField fullWidth label="Custom Data (JSON)" multiline rows={3} sx={{ mb: 2 }} placeholder='{"name": "John"}' />
                                <Button variant="contained" fullWidth startIcon={<Send />}>Launch Campaign</Button>
                            </CardContent>
                        </Card>

                        <Card className="widget-card">
                            <CardContent>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>Recent Campaigns</Typography>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Subject</TableCell>
                                                <TableCell>Channel</TableCell>
                                                <TableCell>Status</TableCell>
                                                <TableCell>Recipients</TableCell>
                                                <TableCell>Date</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 4 }}>
                                                    <Typography color="text.secondary">No active campaigns found</Typography>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </CardContent>
                        </Card>
                    </Box>
                )
            }

            {
                activeTab === 1 && (
                    <Card className="widget-card">
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h6" fontWeight="bold">Notification Templates</Typography>
                                <Button variant="contained" startIcon={<Add />} onClick={() => { setEditingTemplate(null); setOpenTemplateModal(true); }}>
                                    Create Template
                                </Button>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell>Slug</TableCell>
                                            <TableCell>Trigger</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {templates.map((t: any) => (
                                            <TableRow key={t.id}>
                                                <TableCell sx={{ fontWeight: 'medium' }}>{t.name}</TableCell>
                                                <TableCell><Chip label={t.slug} size="small" variant="outlined" /></TableCell>
                                                <TableCell><Chip label={t.triggerType} size="small" color="secondary" variant="outlined" /></TableCell>
                                                <TableCell>
                                                    <Chip label={t.isActive ? 'Active' : 'Inactive'} color={t.isActive ? 'success' : 'default'} size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    <IconButton size="small" onClick={() => handleEditTemplate(t)} color="primary"><Edit fontSize="small" /></IconButton>
                                                    <IconButton size="small"><PlayArrow fontSize="small" /></IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                )
            }

            {
                activeTab === 2 && (
                    <Card className="widget-card">
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                                <Typography variant="h6" fontWeight="bold">Event Triggers</Typography>
                                <Button variant="outlined" startIcon={<Add />}>Add Event Mapping</Button>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Event Key</TableCell>
                                            <TableCell>Description</TableCell>
                                            <TableCell>Template</TableCell>
                                            <TableCell>Status</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {eventMasters.map((e: any) => (
                                            <TableRow key={e.id}>
                                                <TableCell><code>{e.eventKey}</code></TableCell>
                                                <TableCell>{e.description || 'No description'}</TableCell>
                                                <TableCell>
                                                    {templates.find((t: any) => t.id === e.templateId)?.name || 'Not Linked'}
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={e.isActive ? 'Active' : 'Inactive'} size="small" color={e.isActive ? 'success' : 'default'} />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                )
            }

            {
                activeTab === 3 && (
                    <Card className="widget-card">
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>Notification Logs</Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>User ID</TableCell>
                                            <TableCell>Channel</TableCell>
                                            <TableCell>Status</TableCell>
                                            <TableCell>Template</TableCell>
                                            <TableCell>Sent At</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logs.map((l: any) => (
                                            <TableRow key={l.id}>
                                                <TableCell>#{l.userId}</TableCell>
                                                <TableCell>
                                                    <Box display="flex" alignItems="center" gap={1}>
                                                        {getTypeIcon(l.channel)}
                                                        {l.channel.toUpperCase()}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Chip label={l.status} color={getStatusColor(l.status) as any} size="small" />
                                                </TableCell>
                                                <TableCell>
                                                    {templates.find((t: any) => t.id === l.templateId)?.name || `ID: ${l.templateId}`}
                                                </TableCell>
                                                <TableCell>{new Date(l.sentAt).toLocaleString()}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </CardContent>
                    </Card>
                )
            }

            {/* Template Modal */}
            <Dialog open={openTemplateModal} onClose={() => setOpenTemplateModal(false)} maxWidth="md" fullWidth>
                <form onSubmit={handleSaveTemplate}>
                    <DialogTitle>{editingTemplate ? 'Edit Template' : 'New Template'}</DialogTitle>
                    <DialogContent dividers>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth label="Template Name" name="name" defaultValue={editingTemplate?.name} required margin="dense" />
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <TextField fullWidth label="Slug" name="slug" defaultValue={editingTemplate?.slug} required margin="dense" />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Push Notification</Typography>
                                <TextField fullWidth label="Push Title" name="pushTitle" defaultValue={editingTemplate?.pushTitle} margin="dense" />
                                <TextField fullWidth label="Push Body" name="pushBody" defaultValue={editingTemplate?.pushBody} margin="dense" multiline rows={2} helperText="Use {{key}} for placeholders" />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>SMS Message</Typography>
                                <TextField fullWidth label="SMS Body" name="smsBody" defaultValue={editingTemplate?.smsBody} margin="dense" multiline rows={2} helperText="Use {{key}} for placeholders" />
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <FormControlLabel
                                    control={<Switch name="isActive" defaultChecked={editingTemplate ? editingTemplate.isActive : true} />}
                                    label="Active"
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setOpenTemplateModal(false)}>Cancel</Button>
                        <Button type="submit" variant="contained" disabled={upsertMutation.isPending}>
                            {upsertMutation.isPending ? 'Saving...' : 'Save Template'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}
