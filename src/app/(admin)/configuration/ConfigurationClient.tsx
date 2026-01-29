'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    getConfigurationAction,
    saveCreativeAction,
    deleteCreativeAction,
    updateReferralGlobalConfigAction,
    updateUserTypeReferralConfigAction
} from '@/actions/configuration-actions';
import { uploadFileAction } from '@/actions/file-actions';
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
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress
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
    CloudUpload,
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
    const queryClient = useQueryClient();
    const [activeTab, setActiveTab] = useState(1);
    const [userType, setUserType] = useState('');
    const [selectedReferralUserType, setSelectedReferralUserType] = useState<number | ''>('');
    const [isSaving, setIsSaving] = useState(false);

    const { data: configData } = useQuery({
        queryKey: ['configuration'],
        queryFn: getConfigurationAction
    });

    // Updated states for referral form
    const [referralGlobalFields, setReferralGlobalFields] = useState<any>(null);
    const [referralUserTypeFields, setReferralUserTypeFields] = useState<any>(null);

    // Initial load of fields when configData arrives
    useEffect(() => {
        if (configData?.referralConfig?.global && !referralGlobalFields) {
            setReferralGlobalFields(configData.referralConfig.global);
        }
    }, [configData, referralGlobalFields]);

    const handleReferralUserTypeChange = (userTypeId: number | '') => {
        setSelectedReferralUserType(userTypeId);
        if (userTypeId === '') {
            setReferralUserTypeFields(null);
        } else {
            const utConfig = configData?.referralConfig?.userTypes?.find((ut: any) => ut.id === userTypeId);
            if (utConfig) {
                setReferralUserTypeFields({
                    isReferralEnabled: utConfig.isReferralEnabled,
                    referralRewardPoints: utConfig.referralRewardPoints,
                    refereeRewardPoints: utConfig.refereeRewardPoints,
                    maxReferrals: utConfig.maxReferrals,
                    referralCodePrefix: utConfig.referralCodePrefix || "",
                    referralValidityDays: utConfig.referralValidityDays || 30,
                    referralSuccessMessage: utConfig.referralSuccessMessage || ""
                });
            } else {
                setReferralUserTypeFields({
                    isReferralEnabled: true,
                    referralRewardPoints: 0,
                    refereeRewardPoints: 0,
                    maxReferrals: 10,
                    referralCodePrefix: "",
                    referralValidityDays: 30,
                    referralSuccessMessage: ""
                });
            }
        }
    };

    const handleSaveReferralConfig = async () => {
        setIsSaving(true);
        try {
            // 1. Save Global Config
            if (referralGlobalFields) {
                await updateReferralGlobalConfigAction(referralGlobalFields);
            }

            // 2. Save UserType Config if selected
            if (selectedReferralUserType !== '' && referralUserTypeFields) {
                await updateUserTypeReferralConfigAction(selectedReferralUserType, referralUserTypeFields);
            }

            queryClient.invalidateQueries({ queryKey: ['configuration'] });
            alert('Configuration saved successfully!');
        } catch (error) {
            console.error("Save failed:", error);
            alert('Failed to save configuration.');
        } finally {
            setIsSaving(false);
        }
    };

    // States for Creatives Modal
    const [isCreativeModalOpen, setIsCreativeModalOpen] = useState(false);
    const [currentCreative, setCurrentCreative] = useState<any>(null);
    const [creativeForm, setCreativeForm] = useState({
        id: undefined,
        typeId: 0,
        title: '',
        url: '',
        previewUrl: '',
        carouselName: '',
        displayOrder: 0,
        description: ''
    });

    const creativeSaveMutation = useMutation({
        mutationFn: saveCreativeAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['configuration'] });
            setIsCreativeModalOpen(false);
        }
    });

    const creativeDeleteMutation = useMutation({
        mutationFn: deleteCreativeAction,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['configuration'] });
        }
    });

    const handleOpenCreativeModal = (typeId: number, creative?: any) => {
        if (creative) {
            setCreativeForm({
                id: creative.id,
                typeId: creative.typeId,
                title: creative.title,
                url: creative.url,
                previewUrl: creative.previewUrl || creative.url,
                carouselName: creative.carouselName,
                displayOrder: creative.displayOrder || 0,
                description: creative.description || ''
            });
        } else {
            setCreativeForm({
                id: undefined,
                typeId: typeId,
                title: '',
                url: '',
                previewUrl: '',
                carouselName: '',
                displayOrder: 0,
                description: ''
            });
        }
        setIsCreativeModalOpen(true);
    };

    const [isUploading, setIsUploading] = useState(false);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'creatives');

            const result = await uploadFileAction(formData);
            if (result.success && result.url) {
                setCreativeForm({ ...creativeForm, url: result.url, previewUrl: result.url });
            } else {
                alert(result.error || 'Upload failed');
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert('Upload failed');
        } finally {
            setIsUploading(false);
        }
    };

    const handleSaveCreative = async () => {
        if (!creativeForm.title || !creativeForm.url || !creativeForm.carouselName) {
            alert('Please fill in all required fields');
            return;
        }
        creativeSaveMutation.mutate(creativeForm);
    };

    const handleDeleteCreative = async (id: number) => {
        if (confirm('Are you sure you want to delete this item?')) {
            creativeDeleteMutation.mutate(id);
        }
    };

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
                {/* <button
                    className={`tab ${activeTab === 0 ? 'active' : ''}`}
                    onClick={() => setActiveTab(0)}
                >
                    Masters & Schemes
                </button> */}
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
                {/* <button
                    className={`tab ${activeTab === 3 ? 'active' : ''}`}
                    onClick={() => setActiveTab(3)}
                >
                    Communication
                </button> */}
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
                                    <Button
                                        startIcon={<Add />}
                                        variant="contained"
                                        size="small"
                                        className="bg-blue-600 transform-none"
                                        onClick={() => handleOpenCreativeModal(type.id)}
                                    >
                                        Add New
                                    </Button>
                                </Box>

                                <div className="space-y-4">
                                    {configData?.creatives
                                        ?.filter((c: any) => c.typeId === type.id)
                                        .map((creative: any) => (
                                            <div key={creative.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:shadow-sm">
                                                <div className={`flex-shrink-0 w-16 h-16 ${getIconBgColor(type.name)} rounded-lg flex items-center justify-center overflow-hidden border`}>
                                                    {creative.previewUrl ? (
                                                        <img src={creative.previewUrl} alt={creative.title} className="w-full h-full object-cover" />
                                                    ) : creative.previewUrl && type.name.toLowerCase().includes('video') ? (
                                                        <div className="relative w-full h-full flex items-center justify-center">
                                                            <VideoLibrary className="text-purple-600 opacity-50" />
                                                            <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                                                                <Visibility className="text-white text-sm" />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        getCreativeIcon(type.name)
                                                    )}
                                                </div>
                                                <div className="ml-4 flex-1">
                                                    <Typography variant="body1" fontWeight="600">{creative.title}</Typography>
                                                    <Typography variant="body2" color="text.secondary">{creative.carouselName}</Typography>
                                                </div>
                                                <Box display="flex" gap={1}>
                                                    <IconButton
                                                        size="small"
                                                        sx={{ color: '#2563eb' }}
                                                        onClick={() => handleOpenCreativeModal(type.id, creative)}
                                                    >
                                                        <Edit fontSize="small" />
                                                    </IconButton>
                                                    <IconButton
                                                        size="small"
                                                        sx={{ color: '#dc2626' }}
                                                        onClick={() => handleDeleteCreative(creative.id)}
                                                    >
                                                        <Delete fontSize="small" />
                                                    </IconButton>
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
                    <Box className="space-y-6">
                        {/* Global System Settings */}
                        <Box className="bg-blue-50 p-4 rounded-lg mb-6">
                            <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>Global System Settings</Typography>
                            <FormControlLabel
                                control={
                                    <Switch
                                        checked={referralGlobalFields?.enabled ?? configData?.referralConfig?.global?.enabled ?? true}
                                        onChange={(e) => setReferralGlobalFields({
                                            ...(referralGlobalFields || configData?.referralConfig?.global),
                                            enabled: e.target.checked
                                        })}
                                        sx={{ '&.Mui-checked': { color: '#2563eb' } }}
                                    />
                                }
                                label={<Typography fontWeight="500">Enable Referral Program System-wide</Typography>}
                            />

                            <Grid container spacing={4} sx={{ mt: 1 }}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Referral Code Prefix</label>
                                        <TextField
                                            fullWidth size="small"
                                            value={referralGlobalFields?.prefix ?? configData?.referralConfig?.global?.prefix ?? "STURLITE"}
                                            onChange={(e) => setReferralGlobalFields({
                                                ...(referralGlobalFields || configData?.referralConfig?.global),
                                                prefix: e.target.value
                                            })}
                                        />
                                    </div>
                                </Grid>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Referral Validity (Days)</label>
                                        <TextField
                                            fullWidth size="small" type="number"
                                            value={referralGlobalFields?.validityDays ?? configData?.referralConfig?.global?.validityDays ?? 30}
                                            onChange={(e) => setReferralGlobalFields({
                                                ...(referralGlobalFields || configData?.referralConfig?.global),
                                                validityDays: parseInt(e.target.value)
                                            })}
                                        />
                                    </div>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <div className="space-y-1">
                                        <label className="text-sm font-medium text-gray-700">Success Message</label>
                                        <TextField
                                            fullWidth size="small" multiline rows={2}
                                            value={referralGlobalFields?.successMessage ?? configData?.referralConfig?.global?.successMessage ?? ""}
                                            onChange={(e) => setReferralGlobalFields({
                                                ...(referralGlobalFields || configData?.referralConfig?.global),
                                                successMessage: e.target.value
                                            })}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </Box>

                        <Divider sx={{ my: 4 }} />

                        {/* Per-UserType Settings */}
                        <Box>
                            <Typography variant="subtitle2" color="primary" sx={{ mb: 2, fontWeight: 'bold' }}>Per-UserType Overrides</Typography>
                            <FormControl fullWidth size="small" sx={{ mb: 4 }}>
                                <InputLabel>Configure for User Type</InputLabel>
                                <Select
                                    value={selectedReferralUserType}
                                    label="Configure for User Type"
                                    onChange={(e) => handleReferralUserTypeChange(e.target.value as any)}
                                    className="bg-white"
                                >
                                    <MenuItem value=""><em>Global Default (None Selected)</em></MenuItem>
                                    {configData?.referralConfig?.userTypes?.map((ut: any) => (
                                        <MenuItem key={ut.id} value={ut.id}>{ut.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            {selectedReferralUserType !== '' && referralUserTypeFields && (
                                <Grid container spacing={4} className="animate-in fade-in duration-300">
                                    <Grid size={{ xs: 12 }}>
                                        <FormControlLabel
                                            control={
                                                <Checkbox
                                                    checked={referralUserTypeFields.isReferralEnabled}
                                                    onChange={(e) => setReferralUserTypeFields({ ...referralUserTypeFields, isReferralEnabled: e.target.checked })}
                                                    sx={{ '&.Mui-checked': { color: '#2563eb' } }}
                                                />
                                            }
                                            label={<Typography fontWeight="500">Enable Referral for this User Type</Typography>}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Referral Reward Points (to Referrer)</label>
                                            <TextField
                                                fullWidth size="small" type="number"
                                                value={referralUserTypeFields.referralRewardPoints}
                                                onChange={(e) => setReferralUserTypeFields({ ...referralUserTypeFields, referralRewardPoints: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Referee Reward Points (to New Member)</label>
                                            <TextField
                                                fullWidth size="small" type="number"
                                                value={referralUserTypeFields.refereeRewardPoints}
                                                onChange={(e) => setReferralUserTypeFields({ ...referralUserTypeFields, refereeRewardPoints: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Maximum Referrals allowed</label>
                                            <TextField
                                                fullWidth size="small" type="number"
                                                value={referralUserTypeFields.maxReferrals}
                                                onChange={(e) => setReferralUserTypeFields({ ...referralUserTypeFields, maxReferrals: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Referral Code Prefix (Override)</label>
                                            <TextField
                                                fullWidth size="small"
                                                value={referralUserTypeFields.referralCodePrefix}
                                                onChange={(e) => setReferralUserTypeFields({ ...referralUserTypeFields, referralCodePrefix: e.target.value })}
                                                placeholder="Leave empty to use global"
                                            />
                                        </div>
                                    </Grid>
                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Referral Validity (Days Override)</label>
                                            <TextField
                                                fullWidth size="small" type="number"
                                                value={referralUserTypeFields.referralValidityDays}
                                                onChange={(e) => setReferralUserTypeFields({ ...referralUserTypeFields, referralValidityDays: parseInt(e.target.value) })}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <div className="space-y-1">
                                            <label className="text-sm font-medium text-gray-700">Success Message (Override)</label>
                                            <TextField
                                                fullWidth size="small" multiline rows={2}
                                                value={referralUserTypeFields.referralSuccessMessage}
                                                onChange={(e) => setReferralUserTypeFields({ ...referralUserTypeFields, referralSuccessMessage: e.target.value })}
                                                placeholder="Leave empty to use global"
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                            )}

                            {selectedReferralUserType === '' && (
                                <Box className="bg-gray-50 border border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <Typography color="text.secondary">Select a User Type to configure specific rewards and limits. <br />Global settings at the top apply to all unless overridden.</Typography>
                                </Box>
                            )}
                        </Box>

                        <Divider sx={{ mt: 6 }} />

                        <Box display="flex" justifyContent="flex-end" gap={2}>
                            <Button
                                variant="outlined"
                                onClick={() => {
                                    setReferralGlobalFields(null);
                                    handleReferralUserTypeChange(selectedReferralUserType);
                                }}
                                disabled={isSaving}
                            >
                                Reset Changes
                            </Button>
                            <Button
                                variant="contained"
                                className="bg-blue-600 hover:bg-blue-700 transform-none px-8"
                                startIcon={isSaving ? <Save className="animate-spin" /> : <Save />}
                                onClick={handleSaveReferralConfig}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Saving...' : 'Save Configuration'}
                            </Button>
                        </Box>
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
            {/* Creative Management Dialog */}
            <Dialog
                open={isCreativeModalOpen}
                onClose={() => setIsCreativeModalOpen(false)}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle className="border-b">
                    {creativeForm.id ? 'Edit' : 'Add New'} {configData?.creativeTypes?.find((t: any) => t.id === creativeForm.typeId)?.name || 'Creative'}
                </DialogTitle>
                <DialogContent sx={{ py: 3 }}>
                    <Box className="space-y-4 pt-2">
                        <TextField
                            fullWidth
                            label="Title"
                            size="small"
                            required
                            value={creativeForm.title}
                            onChange={(e) => setCreativeForm({ ...creativeForm, title: e.target.value })}
                        />
                        <TextField
                            fullWidth
                            label="Carousel Name / Section"
                            size="small"
                            placeholder="e.g. Home Page Main"
                            required
                            value={creativeForm.carouselName}
                            onChange={(e) => setCreativeForm({ ...creativeForm, carouselName: e.target.value })}
                        />
                        {creativeForm.previewUrl && (
                            <Box className="w-full h-40 bg-gray-100 rounded-lg overflow-hidden border mb-4 flex items-center justify-center">
                                {configData?.creativeTypes?.find((t: any) => t.id === creativeForm.typeId)?.name?.toLowerCase().includes('video') ? (
                                    <div className="flex flex-col items-center">
                                        <VideoLibrary className="text-4xl text-purple-600 mb-2" />
                                        <Typography variant="caption">Video Resource Linked</Typography>
                                    </div>
                                ) : (
                                    <img src={creativeForm.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                                )}
                            </Box>
                        )}
                        <Box>
                            <Typography variant="caption" fontWeight="600" color="text.secondary" mb={1} display="block">
                                Resource Artifact *
                            </Typography>
                            <Box display="flex" gap={2} alignItems="center">
                                <TextField
                                    fullWidth
                                    size="small"
                                    required
                                    value={creativeForm.url}
                                    onChange={(e) => setCreativeForm({ ...creativeForm, url: e.target.value })}
                                    placeholder="https://example.com/image.jpg"
                                    helperText="Upload a file or paste a direct URL"
                                />
                                <Button
                                    component="label"
                                    variant="outlined"
                                    startIcon={isUploading ? <CircularProgress size={20} /> : <CloudUpload />}
                                    disabled={isUploading}
                                    sx={{ whiteSpace: 'nowrap', height: '40px' }}
                                >
                                    {isUploading ? 'Uploading...' : 'Upload'}
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*,video/*"
                                        onChange={handleFileUpload}
                                    />
                                </Button>
                            </Box>
                        </Box>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 6 }}>
                                <TextField
                                    fullWidth
                                    label="Display Order"
                                    size="small"
                                    type="number"
                                    value={creativeForm.displayOrder}
                                    onChange={(e) => setCreativeForm({ ...creativeForm, displayOrder: parseInt(e.target.value) || 0 })}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            fullWidth
                            label="Description"
                            size="small"
                            multiline
                            rows={3}
                            value={creativeForm.description}
                            onChange={(e) => setCreativeForm({ ...creativeForm, description: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions className="bg-gray-50 p-4 border-t">
                    <Button onClick={() => setIsCreativeModalOpen(false)} sx={{ textTransform: 'none' }}>
                        Cancel
                    </Button>
                    <Button
                        variant="contained"
                        className="bg-blue-600 hover:bg-blue-700 px-6 transform-none"
                        onClick={handleSaveCreative}
                        disabled={creativeSaveMutation.isPending}
                        startIcon={creativeSaveMutation.isPending ? <CircularProgress size={16} color="inherit" /> : <Save />}
                    >
                        {creativeSaveMutation.isPending ? 'Saving...' : (creativeForm.id ? 'Update' : 'Create')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
