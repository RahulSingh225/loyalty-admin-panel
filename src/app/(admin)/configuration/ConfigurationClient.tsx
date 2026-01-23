'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getConfigurationAction } from '@/actions/configuration-actions';
import {
    Box,
    Typography,
    Grid,
    TextField,
    Button,
    IconButton,
    InputAdornment,
    Switch,
    FormControlLabel,
    Checkbox,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Card,
    CardContent,
    Divider,
    Tabs,
    Tab,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction,
    Avatar,
    Chip
} from '@mui/material';
import {
    Save,
    Undo,
    Add,
    Edit,
    Delete,
    Visibility,
    Image,
    Description,
    VideoLibrary,
    CardGiftcard,
    Notifications,
    Sms,
    WhatsApp,
    CalendarMonth,
    AllInclusive,
    CheckCircle,
    Cancel,
    ChevronRight,
    Search,
    FilterList,
    Download,
    MoreVert
} from '@mui/icons-material';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ py: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

export default function ConfigurationClient() {
    const [activeTab, setActiveTab] = useState(0);
    const [userType, setUserType] = useState('');

    const { data: configData } = useQuery({
        queryKey: ['configuration'],
        queryFn: getConfigurationAction
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const getCreativeIcon = (typeName: string) => {
        const name = typeName.toLowerCase();
        if (name.includes('banner')) return <Image className="text-blue-600 text-2xl" />;
        if (name.includes('video')) return <VideoLibrary className="text-purple-600 text-2xl" />;
        if (name.includes('content') || name.includes('doc') || name.includes('library')) return <Description className="text-red-600 text-2xl" />;
        if (name.includes('gift') || name.includes('reward')) return <CardGiftcard className="text-yellow-600 text-2xl" />;
        return <Image className="text-gray-600 text-2xl" />;
    };

    const getIconBgColor = (typeName: string) => {
        const name = typeName.toLowerCase();
        if (name.includes('banner')) return 'bg-blue-100';
        if (name.includes('video')) return 'bg-purple-100';
        if (name.includes('content') || name.includes('doc') || name.includes('library')) return 'bg-red-100';
        if (name.includes('gift') || name.includes('reward')) return 'bg-yellow-100';
        return 'bg-gray-100';
    };

    return (
        <Box>
            {/* Tabs */}
            <div className="tabs mb-6">
                <button
                    className={`tab ${activeTab === 0 ? 'active' : ''}`}
                    onClick={() => setActiveTab(0)}
                >
                    Masters & Schemes
                </button>
                <button
                    className={`tab ${activeTab === 1 ? 'active' : ''}`}
                    onClick={() => setActiveTab(1)}
                >
                    Banners & Content
                </button>
                <button
                    className={`tab ${activeTab === 2 ? 'active' : ''}`}
                    onClick={() => setActiveTab(2)}
                >
                    Referral
                </button>
                <button
                    className={`tab ${activeTab === 3 ? 'active' : ''}`}
                    onClick={() => setActiveTab(3)}
                >
                    Communication
                </button>
            </div>

            {/* Masters & Schemes Tab */}
            {activeTab === 0 && (
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <div className="widget-card rounded-xl shadow p-6">
                            <h3 className="text-lg font-semibold text-primary mb-4">Redemption Matrix Configuration</h3>
                            <Box component="form" className="space-y-4">
                                <FormControl fullWidth size="small">
                                    <InputLabel>User Type</InputLabel>
                                    <Select
                                        value={userType}
                                        label="User Type"
                                        onChange={(e) => setUserType(e.target.value)}
                                        className="bg-white"
                                    >
                                        <MenuItem value="retailer">Retailer</MenuItem>
                                        <MenuItem value="csb">CSB</MenuItem>
                                        <MenuItem value="electrician">Electrician</MenuItem>
                                        <MenuItem value="staff">Staff</MenuItem>
                                    </Select>
                                </FormControl>

                                {userType && (
                                    <div className="space-y-4">
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Min Points / Request for Redemption</label>
                                            <TextField fullWidth size="small" type="number" defaultValue={0} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Max Redemption Value / Day</label>
                                            <TextField fullWidth size="small" type="number" defaultValue={0} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Max Redemption Value / Week</label>
                                            <TextField fullWidth size="small" type="number" defaultValue={0} />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Max Redemption Value / Month</label>
                                            <TextField fullWidth size="small" type="number" defaultValue={0} />
                                        </div>
                                    </div>
                                )}

                                <Button variant="contained" className="bg-blue-600 hover:bg-blue-700 text-white transform-none">
                                    Save Configuration
                                </Button>
                            </Box>
                        </div>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 6 }}>
                        <div className="widget-card rounded-xl shadow p-6">
                            <h3 className="text-lg font-semibold text-primary mb-4">Scheme Management</h3>
                            <div className="space-y-4">
                                {/* Scheme Item 1 */}
                                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                                    <Box display="flex" justifyContent="space-between" alignItems="start">
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="600" color="text.primary">Diwali Bonanza</Typography>
                                            <Typography variant="body2" color="text.secondary">Double points on all scans during Diwali week</Typography>
                                            <Box display="flex" alignItems="center" mt={1} color="text.secondary" fontSize="0.75rem">
                                                <CalendarMonth sx={{ fontSize: 14, mr: 0.5 }} /> Oct 15 - Oct 25, 2023
                                            </Box>
                                        </Box>
                                        <span className="badge badge-success">Active</span>
                                    </Box>
                                    <Box mt={2} display="flex" gap={2}>
                                        <Button size="small" sx={{ color: '#2563eb', textTransform: 'none', minWidth: 0, p: 0 }}>Edit</Button>
                                        <Button size="small" sx={{ color: '#dc2626', textTransform: 'none', minWidth: 0, p: 0 }}>Deactivate</Button>
                                    </Box>
                                </div>

                                {/* Scheme Item 2 */}
                                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                                    <Box display="flex" justifyContent="space-between" alignItems="start">
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="600" color="text.primary">New Member Welcome</Typography>
                                            <Typography variant="body2" color="text.secondary">500 bonus points on first scan</Typography>
                                            <Box display="flex" alignItems="center" mt={1} color="text.secondary" fontSize="0.75rem">
                                                <AllInclusive sx={{ fontSize: 14, mr: 0.5 }} /> Ongoing
                                            </Box>
                                        </Box>
                                        <span className="badge badge-success">Active</span>
                                    </Box>
                                    <Box mt={2} display="flex" gap={2}>
                                        <Button size="small" sx={{ color: '#2563eb', textTransform: 'none', minWidth: 0, p: 0 }}>Edit</Button>
                                        <Button size="small" sx={{ color: '#dc2626', textTransform: 'none', minWidth: 0, p: 0 }}>Deactivate</Button>
                                    </Box>
                                </div>

                                {/* Scheme Item 3 */}
                                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-gray-500 hover:shadow-md transition-shadow">
                                    <Box display="flex" justifyContent="space-between" alignItems="start">
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="600" color="text.primary">Referral Fiesta</Typography>
                                            <Typography variant="body2" color="text.secondary">Extra 100 points per successful referral</Typography>
                                            <Box display="flex" alignItems="center" mt={1} color="text.secondary" fontSize="0.75rem">
                                                <CalendarMonth sx={{ fontSize: 14, mr: 0.5 }} /> Sep 1 - Sep 30, 2023
                                            </Box>
                                        </Box>
                                        <span className="badge badge-danger">Inactive</span>
                                    </Box>
                                    <Box mt={2} display="flex" gap={2}>
                                        <Button size="small" sx={{ color: '#2563eb', textTransform: 'none', minWidth: 0, p: 0 }}>Edit</Button>
                                        <Button size="small" sx={{ color: '#10b981', textTransform: 'none', minWidth: 0, p: 0 }}>Activate</Button>
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            )}

            {/* Banners & Content Tab */}
            {activeTab === 1 && (
                <Grid container spacing={4}>
                    {configData?.creativeTypes?.map((type: any) => (
                        <Grid key={type.id} size={{ xs: 12, lg: 6 }}>
                            <div className="widget-card rounded-xl shadow p-6 h-full">
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                                    <h3 className="text-lg font-semibold text-primary">{type.name} Management</h3>
                                    <Button startIcon={<Add />} variant="contained" size="small" className="bg-blue-600">Upload</Button>
                                </Box>

                                <div className="space-y-4">
                                    {configData?.creatives
                                        ?.filter((c: any) => c.typeId === type.id)
                                        .map((creative: any) => (
                                            <div key={creative.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:shadow-sm">
                                                <div className={`flex-shrink-0 w-16 h-16 ${getIconBgColor(type.name)} rounded-lg flex items-center justify-center`}>
                                                    {getCreativeIcon(type.name)}
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <Typography variant="body1" fontWeight="600">{creative.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{creative.carouselName}</Typography>
                                                </div>
                                                <Box display="flex" gap={1}>
                                                    <IconButton size="small" sx={{ color: '#2563eb' }}><Edit fontSize="small" /></IconButton>
                                                    <IconButton size="small" sx={{ color: '#dc2626' }}><Delete fontSize="small" /></IconButton>
                                                </Box>
                                            </div>
                                        ))}
                                    {configData?.creatives?.filter((c: any) => c.typeId === type.id).length === 0 && (
                                        <Box textAlign="center" py={4}>
                                            <Typography variant="body2" color="text.secondary">
                                                No {type.name.toLowerCase()} items found
                                            </Typography>
                                        </Box>
                                    )}
                                </div>
                            </div>
                        </Grid>
                    ))}
                    {(!configData?.creativeTypes || configData.creativeTypes.length === 0) && (
                        <Grid size={{ xs: 12 }}>
                            <div className="widget-card rounded-xl shadow p-12 text-center">
                                <Typography variant="h6" color="text.secondary" mb={2}>No Banner or Content Sections Configured</Typography>
                                <Typography variant="body2" color="text.secondary" mb={4}>Creative types defined in the database will appear here automatically.</Typography>
                                <Button startIcon={<Add />} variant="contained" className="bg-blue-600">Add Creative Type</Button>
                            </div>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* Referral Tab */}
            {activeTab === 2 && (
                <div className="widget-card rounded-xl shadow p-8 max-w-4xl mx-auto">
                    <h3 className="text-lg font-semibold text-primary mb-6 border-b pb-4">Referral Configuration</h3>
                    <Box component="form" className="space-y-6">
                        <FormControlLabel
                            control={<Checkbox defaultChecked sx={{ '&.Mui-checked': { color: '#2563eb' } }} />}
                            label={<Typography fontWeight="500">Enable Referral Program</Typography>}
                        />

                        <Grid container spacing={4}>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Referral Reward Points</label>
                                    <TextField fullWidth size="small" type="number" defaultValue={100} />
                                </div>
                            </Grid>
                            <Grid size={{ xs: 12, md: 6 }}>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Referee Reward Points</label>
                                    <TextField fullWidth size="small" type="number" defaultValue={50} />
                                </div>
                            </Grid>
                            <Grid size={{ xs: 12 }}>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Success Message</label>
                                    <TextField fullWidth size="small" multiline rows={2} defaultValue="Congratulations! Your friend has joined using your referral code." />
                                </div>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Referral Code Prefix</label>
                                    <TextField fullWidth size="small" defaultValue="STURLITE" />
                                </div>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Maximum Referrals per Member</label>
                                    <TextField fullWidth size="small" type="number" defaultValue={10} />
                                </div>
                            </Grid>
                            <Grid size={{ xs: 12, md: 4 }}>
                                <div className="space-y-1">
                                    <label className="text-sm font-medium text-gray-700">Referral Validity (Days)</label>
                                    <TextField fullWidth size="small" type="number" defaultValue={30} />
                                </div>
                            </Grid>
                        </Grid>

                        <Divider />

                        <Button variant="contained" className="bg-blue-600 hover:bg-blue-700 transform-none px-6">
                            Save Configuration
                        </Button>
                    </Box>
                </div>
            )}

            {/* Communication Tab */}
            {activeTab === 3 && (
                <Grid container spacing={4}>
                    <Grid size={{ xs: 12, lg: 6 }}>
                        <div className="widget-card rounded-xl shadow p-6">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                                <h3 className="text-lg font-semibold text-primary">Communication Triggers</h3>
                                <Button startIcon={<Add />} variant="contained" size="small" className="bg-blue-600">Create</Button>
                            </Box>

                            <div className="space-y-4">
                                {/* Trigger Item 1 */}
                                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-blue-500 hover:shadow-md transition-shadow">
                                    <Box display="flex" justifyContent="space-between" alignItems="start">
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="600" color="text.primary">Welcome Message</Typography>
                                            <Typography variant="body2" color="text.secondary">Sent to new members upon registration</Typography>
                                            <Box display="flex" alignItems="center" mt={1} color="text.secondary" fontSize="0.75rem">
                                                <Notifications sx={{ fontSize: 14, mr: 0.5 }} /> SMS, Push Notification
                                            </Box>
                                        </Box>
                                        <span className="badge badge-success">Active</span>
                                    </Box>
                                    <Box mt={2} display="flex" gap={2}>
                                        <Button size="small" sx={{ color: '#2563eb', textTransform: 'none', minWidth: 0, p: 0 }}>Edit</Button>
                                        <Button size="small" sx={{ color: '#dc2626', textTransform: 'none', minWidth: 0, p: 0 }}>Deactivate</Button>
                                    </Box>
                                </div>

                                {/* Trigger Item 2 */}
                                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-green-500 hover:shadow-md transition-shadow">
                                    <Box display="flex" justifyContent="space-between" alignItems="start">
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="600" color="text.primary">Points Credited</Typography>
                                            <Typography variant="body2" color="text.secondary">Sent when points are credited to member account</Typography>
                                            <Box display="flex" alignItems="center" mt={1} color="text.secondary" fontSize="0.75rem">
                                                <Notifications sx={{ fontSize: 14, mr: 0.5 }} /> SMS, Push Notification
                                            </Box>
                                        </Box>
                                        <span className="badge badge-success">Active</span>
                                    </Box>
                                    <Box mt={2} display="flex" gap={2}>
                                        <Button size="small" sx={{ color: '#2563eb', textTransform: 'none', minWidth: 0, p: 0 }}>Edit</Button>
                                        <Button size="small" sx={{ color: '#dc2626', textTransform: 'none', minWidth: 0, p: 0 }}>Deactivate</Button>
                                    </Box>
                                </div>

                                {/* Trigger Item 3 */}
                                <div className="bg-gray-50 rounded-lg p-4 border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
                                    <Box display="flex" justifyContent="space-between" alignItems="start">
                                        <Box>
                                            <Typography variant="subtitle1" fontWeight="600" color="text.primary">Inactivity Nudge</Typography>
                                            <Typography variant="body2" color="text.secondary">Sent to members inactive for 30 days</Typography>
                                            <Box display="flex" alignItems="center" mt={1} color="text.secondary" fontSize="0.75rem">
                                                <WhatsApp sx={{ fontSize: 14, mr: 0.5 }} /> WhatsApp, SMS
                                            </Box>
                                        </Box>
                                        <span className="badge badge-success">Active</span>
                                    </Box>
                                    <Box mt={2} display="flex" gap={2}>
                                        <Button size="small" sx={{ color: '#2563eb', textTransform: 'none', minWidth: 0, p: 0 }}>Edit</Button>
                                        <Button size="small" sx={{ color: '#dc2626', textTransform: 'none', minWidth: 0, p: 0 }}>Deactivate</Button>
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </Grid>

                    <Grid size={{ xs: 12, lg: 6 }}>
                        <div className="widget-card rounded-xl shadow p-6">
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                                <h3 className="text-lg font-semibold text-primary">Message Templates</h3>
                                <Button startIcon={<Add />} variant="contained" size="small" className="bg-blue-600">Create</Button>
                            </Box>

                            <div className="space-y-4">
                                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:shadow-sm">
                                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Sms className="text-blue-600" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <Typography variant="body1" fontWeight="600">Welcome SMS Template</Typography>
                                        <Typography variant="body2" color="text.secondary">Used for new member registration</Typography>
                                    </div>
                                    <Box display="flex" gap={1}>
                                        <IconButton size="small" sx={{ color: '#2563eb' }}><Edit fontSize="small" /></IconButton>
                                        <IconButton size="small" sx={{ color: '#dc2626' }}><Delete fontSize="small" /></IconButton>
                                    </Box>
                                </div>

                                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:shadow-sm">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                        <Sms className="text-green-600" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <Typography variant="body1" fontWeight="600">Points Credited Template</Typography>
                                        <Typography variant="body2" color="text.secondary">Used when points are credited</Typography>
                                    </div>
                                    <Box display="flex" gap={1}>
                                        <IconButton size="small" sx={{ color: '#2563eb' }}><Edit fontSize="small" /></IconButton>
                                        <IconButton size="small" sx={{ color: '#dc2626' }}><Delete fontSize="small" /></IconButton>
                                    </Box>
                                </div>

                                <div className="flex items-center p-3 bg-gray-50 rounded-lg hover:shadow-sm">
                                    <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                        <Sms className="text-purple-600" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <Typography variant="body1" fontWeight="600">Referral Success Template</Typography>
                                        <Typography variant="body2" color="text.secondary">Used when referral is successful</Typography>
                                    </div>
                                    <Box display="flex" gap={1}>
                                        <IconButton size="small" sx={{ color: '#2563eb' }}><Edit fontSize="small" /></IconButton>
                                        <IconButton size="small" sx={{ color: '#dc2626' }}><Delete fontSize="small" /></IconButton>
                                    </Box>
                                </div>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
}
