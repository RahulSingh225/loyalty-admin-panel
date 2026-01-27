'use client';

import { useState, useEffect } from 'react';
import {
    Card,
    CardContent,
    CardHeader,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    Button,
    IconButton,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    TextField,
    Checkbox,
    FormControlLabel,
    Chip,
    CircularProgress,
    Alert,
    Box
    , Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { ChevronDown, ChevronRight, Download, Upload, Edit, Delete } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMastersDataAction, updateStakeholderConfigAction, upsertPointsMatrixRuleAction, upsertSkuPointConfigAction, updateSkuPointConfigForEntityAction, type SkuNode, deletePointsMatrixRuleAction } from '@/actions/masters-actions';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index } = props;
    return value === index ? <>{children}</> : null;
}

function TreeView({ data, onSelect, selectedId }: { data: SkuNode[]; onSelect?: (id: string) => void; selectedId?: string | null }) {
    const [open, setOpen] = useState<{ [key: string]: boolean }>({});

    const toggle = (key: string) => setOpen((p) => ({ ...p, [key]: !p[key] }));

    const RenderNode = ({ node, path }: { node: SkuNode; path: string }) => {
        const hasChildren = node.children && node.children.length > 0;
        const icon = hasChildren ? (
            <i className="fas fa-folder text-blue-500 mr-2" />
        ) : (
            <i className="fas fa-file text-gray-500 mr-2" />
        );

        const isSelected = selectedId === node.id;

        return (
            <li>
                <div
                    className={`flex items-center py-1 cursor-pointer rounded ${isSelected ? 'bg-blue-50 dark:bg-blue-900' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                    onClick={() => {
                        if (hasChildren) toggle(path);
                        onSelect && onSelect(node.id);
                    }}
                >
                    {hasChildren ? (
                        <span className="mr-1">
                            {open[path] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                        </span>
                    ) : (
                        <span className="w-5" />
                    )}
                    {icon}
                    <span className="ml-2">{node.label}</span>
                    <span className="ml-auto mr-2">
                        <Chip label={node.levelName} size="small" color="primary" variant="outlined" />
                    </span>
                </div>
                {hasChildren && open[path] && (
                    <ul className="ml-6">
                        {node.children!.map((child) => (
                            <RenderNode key={child.id} node={child} path={`${path}-${child.id}`} />
                        ))}
                    </ul>
                )}
            </li>
        );
    };

    return (
        <ul className="space-y-1">
            {data.map((node) => (
                <RenderNode key={node.id} node={node} path={node.id} />
            ))}
        </ul>
    );
}

export default function MastersClient() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['masters-data'],
        queryFn: getMastersDataAction
    });

    const [tab, setTab] = useState(0);
    const queryClient = useQueryClient();

    // Stakeholder config form state
    const [selectedStakeholderId, setSelectedStakeholderId] = useState<string | null>(null);
    const [stakeholderMaxDailyScans, setStakeholderMaxDailyScans] = useState<number>(50);
    const [stakeholderKycLevel, setStakeholderKycLevel] = useState<string>('Basic');
    const [stakeholderChannelIds, setStakeholderChannelIds] = useState<number[]>([]);
    const [stakeholderSaveStatus, setStakeholderSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [confirmOpen, setConfirmOpen] = useState(false);

    const stakeholderMutation = useMutation({
        mutationFn: (payload: Parameters<typeof updateStakeholderConfigAction>[0]) => updateStakeholderConfigAction(payload),
        onMutate: () => setStakeholderSaveStatus('saving'),
        onSuccess: () => {
            setStakeholderSaveStatus('success');
            queryClient.invalidateQueries({ queryKey: ['masters-data'] });
            setTimeout(() => setStakeholderSaveStatus('idle'), 2000);
        },
        onError: () => {
            setStakeholderSaveStatus('error');
            setTimeout(() => setStakeholderSaveStatus('idle'), 2000);
        }
    });

    // SKU Points form state
    const [skuStakeholder, setSkuStakeholder] = useState<string>('All');
    const [skuCategory, setSkuCategory] = useState<string>('Electrical Products');
    const [skuSubCategory, setSkuSubCategory] = useState<string>('Wires & Cables');
    const [skuGroup, setSkuGroup] = useState<string>('Household Wires');
    const [pointsPerScan, setPointsPerScan] = useState<number>(10);
    const [maxScansPerDay, setMaxScansPerDay] = useState<number>(5);
    const [validFrom, setValidFrom] = useState<string>('');
    const [validTo, setValidTo] = useState<string>('');
    const [isActive, setIsActive] = useState<boolean>(true);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    // Points Matrix (Rule) form state - updated to match SKU point config style
    const [pmRuleId, setPmRuleId] = useState<number | null>(null);
    const [pmName, setPmName] = useState<string>('');
    const [pmClientId, setPmClientId] = useState<number>(1); // replace with real client context when available
    const [pmUserTypeId, setPmUserTypeId] = useState<number | 'All'>('All');
    const [pmSkuEntityId, setPmSkuEntityId] = useState<number | null>(null);
    const [pmSkuVariantId, setPmSkuVariantId] = useState<number | null>(null);
    const [pmActionType, setPmActionType] = useState<string>('FLAT_OVERRIDE');
    const [pmActionValue, setPmActionValue] = useState<number>(10);
    const [pmValidFrom, setPmValidFrom] = useState<string>('');
    const [pmValidTo, setPmValidTo] = useState<string>('');
    const [pmIsActive, setPmIsActive] = useState<boolean>(true);
    const [pmDescription, setPmDescription] = useState<string>('');
    const [pmSaveStatus, setPmSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    const pointsRuleMutation = useMutation({
        mutationFn: (payload: Parameters<typeof upsertPointsMatrixRuleAction>[0]) => upsertPointsMatrixRuleAction(payload),
        onMutate: () => setPmSaveStatus('saving'),
        onSuccess: () => {
            setPmSaveStatus('success');
            queryClient.invalidateQueries({ queryKey: ['masters-data'] });
            setTimeout(() => setPmSaveStatus('idle'), 2000);
        },
        onError: () => {
            setPmSaveStatus('error');
            setTimeout(() => setPmSaveStatus('idle'), 2000);
        }
    });

    const skuConfigMutation = useMutation({
        mutationFn: (payload: Parameters<typeof updateSkuPointConfigForEntityAction>[0]) => updateSkuPointConfigForEntityAction(payload),
        onMutate: () => setSaveStatus('saving'),
        onSuccess: () => {
            setSaveStatus('success');
            queryClient.invalidateQueries({ queryKey: ['masters-data'] });
            setTimeout(() => setSaveStatus('idle'), 2000);
        },
        onError: () => {
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 2000);
        }
    });

    const deleteRuleMutation = useMutation({
        mutationFn: (id: number) => deletePointsMatrixRuleAction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['masters-data'] });
        }
    });

    const updateBasePointsMutation = useMutation({
        mutationFn: (payload: Parameters<typeof upsertSkuPointConfigAction>[0]) => upsertSkuPointConfigAction(payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['masters-data'] });
            setEditModalOpen(false);
        }
    });

    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedRule, setSelectedRule] = useState<any>(null);
    const [editBasePoints, setEditBasePoints] = useState<number>(0);
    const [editBaseMaxScans, setEditBaseMaxScans] = useState<number>(5);

    // flatten skuHierarchy for selection (id, label, depth)
    const flatten = (nodes: any[], depth = 0, out: { id: string; label: string; depth: number; levelName: string; code?: string }[] = []) => {
        for (const n of nodes) {
            out.push({ id: n.id, label: n.label, depth, levelName: n.levelName, code: n.code });
            if (n.children && n.children.length) flatten(n.children, depth + 1, out);
        }
        return out;
    };

    const flattenedEntities = flatten(data?.skuHierarchy || []);
    const [selectedEntityId, setSelectedEntityId] = useState<string | null>(flattenedEntities[0]?.id || null);

    if (isLoading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;
    if (error) return <Alert severity="error">Failed to load configuration data</Alert>;

    const stakeholderTypes = data?.stakeholderTypes || [];
    const pointsMatrix = data?.pointsMatrix || [];

    useEffect(() => {
        if (!selectedStakeholderId && stakeholderTypes.length > 0) {
            setSelectedStakeholderId(stakeholderTypes[0].id);
        }
    }, [stakeholderTypes, selectedStakeholderId]);

    useEffect(() => {
        if (selectedStakeholderId) {
            const s = stakeholderTypes.find(st => st.id === selectedStakeholderId);
            if (s) {
                setStakeholderMaxDailyScans(s.maxDailyScans || 50);
                setStakeholderKycLevel(s.requiredKycLevel || 'Basic');
                const channels = s.allowedRedemptionChannels || [];
                setStakeholderChannelIds(channels.map((c) => Number(c)));
            }
        }
    }, [selectedStakeholderId, stakeholderTypes]);

    return (
        <main className="flex-1 overflow-y-auto p-6">
            {/* ---------- Tabs ---------- */}
            <Tabs value={tab} onChange={(_, v) => setTab(v)} className="mb-6">
                <Tab label="Stakeholder Master" />
                <Tab label="SKU Master" />
                <Tab label="Points Matrix" />
            </Tabs>

            {/* ---------- Stakeholder Tab ---------- */}
            <TabPanel value={tab} index={0}>
                <div className="space-y-6">
                    {/* Stakeholder Types Table */}
                    <Card>
                        <CardHeader
                            title={<Typography variant="h6">Stakeholder Types</Typography>}
                            action={
                                <div className="flex gap-2">
                                    <Button startIcon={<Download />} variant="outlined" size="small">
                                        Export
                                    </Button>
                                    <Button startIcon={<Upload />} variant="outlined" size="small">
                                        Import
                                    </Button>
                                </div>
                            }
                        />
                        <CardContent>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Type ID</TableCell>
                                        <TableCell>Type Name</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Max Daily Scans</TableCell>
                                        <TableCell>KYC Level</TableCell>
                                        <TableCell>Status</TableCell>
                                        {/* <TableCell>Actions</TableCell> */}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stakeholderTypes.map((row) => (
                                        <TableRow key={row.id} hover>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.code || row.name}</TableCell>
                                            <TableCell>{row.desc}</TableCell>
                                            <TableCell>{row.maxDailyScans}</TableCell>
                                            <TableCell>{row.requiredKycLevel}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.status}
                                                    color={row.status === 'Active' ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            {/* <TableCell>
                                                <IconButton size="small" onClick={() => { setSelectedStakeholderId(row.id); setTab(0); }}><Edit size={16} /></IconButton>
                                                <IconButton size="small" color="error"><Delete size={16} /></IconButton>
                                            </TableCell> */}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Config + Stats */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Config Form */}
                        <Card>
                            <CardHeader title={<Typography variant="h6">Stakeholder Configuration</Typography>} />
                            <CardContent>
                                <form className="space-y-4">
                                    <FormControl fullWidth>
                                        <InputLabel>Stakeholder Type</InputLabel>
                                        <Select value={selectedStakeholderId || ''} label="Stakeholder Type" onChange={(e) => setSelectedStakeholderId(e.target.value)}>
                                            {stakeholderTypes.map((s) => (
                                                <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <TextField label="Max Daily Scans" type="number" value={stakeholderMaxDailyScans} onChange={(e) => setStakeholderMaxDailyScans(Number(e.target.value))} fullWidth />
                                    <FormControl fullWidth>
                                        <InputLabel>Required KYC Level</InputLabel>
                                        <Select value={stakeholderKycLevel} label="Required KYC Level" onChange={(e) => setStakeholderKycLevel(e.target.value)}>
                                            <MenuItem value="Basic">Basic</MenuItem>
                                            <MenuItem value="Standard">Standard</MenuItem>
                                            <MenuItem value="Advanced">Advanced</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <div className="space-y-2">
                                        <Typography variant="body2" color="textSecondary">Allowed Redemption Channels</Typography>
                                        {(data?.redemptionChannels || []).map((ch: any) => (
                                            <FormControlLabel
                                                key={ch.id}
                                                control={
                                                    <Checkbox
                                                        checked={stakeholderChannelIds.includes(Number(ch.id))}
                                                        onChange={(e) => {
                                                            setStakeholderChannelIds((prev) => {
                                                                const id = Number(ch.id);
                                                                if (e.target.checked) return Array.from(new Set([...prev, id]));
                                                                return prev.filter((x) => x !== id);
                                                            });
                                                        }}
                                                    />
                                                }
                                                label={ch.name}
                                            />
                                        ))}
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button variant="outlined" onClick={() => {
                                            // reset to selected stakeholder values
                                            if (selectedStakeholderId) {
                                                const s = stakeholderTypes.find(st => st.id === selectedStakeholderId);
                                                if (s) {
                                                    setStakeholderMaxDailyScans(s.maxDailyScans || 50);
                                                    setStakeholderKycLevel(s.requiredKycLevel || 'Basic');
                                                    const channels = s.allowedRedemptionChannels || [];
                                                    setStakeholderChannelIds(channels.map((c: any) => Number(c)));
                                                }
                                            }
                                        }}>Cancel</Button>
                                        <Button variant="contained" color="primary" onClick={() => {
                                            if (!selectedStakeholderId) return;
                                            setConfirmOpen(true);
                                        }} disabled={stakeholderMutation.isPending}>
                                            {stakeholderMutation.isPending ? 'Saving...' : 'Save Configuration'}
                                        </Button>
                                        {stakeholderSaveStatus === 'success' && <Typography variant="body2" color="success.main" sx={{ ml: 2 }}>Saved</Typography>}
                                        {stakeholderSaveStatus === 'error' && <Typography variant="body2" color="error.main" sx={{ ml: 2 }}>Save failed</Typography>}
                                    </div>
                                    <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                                        <DialogTitle>Confirm Save</DialogTitle>
                                        <DialogContent>
                                            <Typography>Are you sure you want to save changes to this stakeholder configuration?</Typography>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                onClick={() => {
                                                    if (!selectedStakeholderId) return;
                                                    stakeholderMutation.mutate({
                                                        id: Number(selectedStakeholderId),
                                                        maxDailyScans: stakeholderMaxDailyScans,
                                                        requiredKycLevel: stakeholderKycLevel,
                                                        allowedRedemptionChannels: stakeholderChannelIds
                                                    });
                                                    setConfirmOpen(false);
                                                }}
                                                disabled={stakeholderMutation.isPending}
                                            >
                                                {stakeholderMutation.isPending ? 'Saving...' : 'Confirm'}
                                            </Button>
                                        </DialogActions>
                                    </Dialog>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Statistics */}
                        <Card>
                            <CardHeader title={<Typography variant="h6">Stakeholder Statistics</Typography>} />
                            <CardContent className="space-y-4">
                                {[
                                    { label: 'Total Retailers', value: '8,234', percent: 65 },
                                    { label: 'Total CSBs', value: '2,145', percent: 17 },
                                    { label: 'Total Electricians', value: '2,077', percent: 16 },
                                    { label: 'Total Distributors', value: '120', percent: 1 },
                                ].map((s) => (
                                    <div key={s.label}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-sm">{s.label}</span>
                                            <span className="font-medium">{s.value}</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full"
                                                style={{ width: `${s.percent}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-6 space-y-2">
                                    <div className="flex items-center text-sm">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                        125 new retailers added this week
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                                        32 CSBs upgraded to premium tier
                                    </div>
                                    <div className="flex items-center text-sm">
                                        <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                                        15 electricians pending KYC verification
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabPanel>

            {/* ---------- SKU Tab ---------- */}
            <TabPanel value={tab} index={1}>
                <div className="space-y-6">
                    {/* SKU Hierarchy Tree */}
                    <Card>
                        <CardHeader
                            title={<Typography variant="h6">SKU Hierarchy</Typography>}
                            action={
                                <div className="flex gap-2">
                                    <Button startIcon={<ChevronDown />} variant="outlined" size="small">
                                        Expand All
                                    </Button>
                                    <Button startIcon={<ChevronRight />} variant="outlined" size="small">
                                        Collapse All
                                    </Button>
                                </div>
                            }
                        />
                        <CardContent>
                            <TreeView data={data?.skuHierarchy || []} />
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* SKU Points Config */}
                        <Card>
                            <CardHeader title={<Typography variant="h6">SKU Points Configuration</Typography>} />
                            <CardContent>
                                <form className="space-y-4">
                                    <FormControl fullWidth>
                                        <InputLabel>Stakeholder Type</InputLabel>
                                        <Select value={skuStakeholder} label="Stakeholder Type" onChange={(e) => setSkuStakeholder(e.target.value)}>
                                            <MenuItem value="All">All Stakeholders</MenuItem>
                                            {stakeholderTypes.map((t) => (
                                                <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>


                                    <FormControl fullWidth>
                                        <InputLabel shrink>Apply To Entity</InputLabel>
                                        <Box sx={{ maxHeight: 260, overflow: 'auto', border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 1, mt: 1 }}>
                                            <TreeView data={data?.skuHierarchy || []} selectedId={selectedEntityId} onSelect={(id) => setSelectedEntityId(id)} />
                                        </Box>
                                        <Typography variant="caption" sx={{ mt: 1 }}>
                                            Selected: {selectedEntityId ? (flattenedEntities.find(f => f.id === selectedEntityId)?.label || selectedEntityId) : 'None'}
                                        </Typography>
                                    </FormControl>
                                    <TextField label="Points per Scan" type="number" value={pointsPerScan} onChange={(e) => setPointsPerScan(Number(e.target.value))} fullWidth />
                                    <TextField label="Max Scans per Day" type="number" value={maxScansPerDay} onChange={(e) => setMaxScansPerDay(Number(e.target.value))} fullWidth />
                                    <TextField label="Valid From" type="date" value={validFrom} onChange={(e) => setValidFrom(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
                                    <TextField label="Valid To" type="date" value={validTo} onChange={(e) => setValidTo(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
                                    <FormControlLabel control={<Checkbox checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />} label="Active" />
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outlined" onClick={() => {
                                            // reset form
                                            setSkuStakeholder('All');
                                            setSkuCategory('Electrical Products');
                                            setSkuSubCategory('Wires & Cables');
                                            setSkuGroup('Household Wires');
                                            setPointsPerScan(10);
                                            setMaxScansPerDay(5);
                                            setValidFrom('');
                                            setValidTo('');
                                            setIsActive(true);
                                        }}>Cancel</Button>
                                        <Button variant="contained" color="primary" onClick={() => {
                                            // clientId is assumed; replace with real client context if available
                                            skuConfigMutation.mutate({
                                                clientId: 1,
                                                userTypeId: skuStakeholder === 'All' ? undefined : Number(skuStakeholder),
                                                entityId: Number(selectedEntityId),
                                                pointsPerUnit: pointsPerScan,
                                                maxScansPerDay: maxScansPerDay,
                                                validFrom: validFrom || undefined,
                                                validTo: validTo || undefined,
                                                isActive: isActive
                                            });
                                        }} disabled={skuConfigMutation.isPending}>
                                            {skuConfigMutation.isPending ? 'Saving...' : 'Save Configuration'}
                                        </Button>
                                        {saveStatus === 'success' && <Typography variant="body2" color="success" sx={{ ml: 2 }}>Saved</Typography>}
                                        {saveStatus === 'error' && <Typography variant="body2" color="error" sx={{ ml: 2 }}>Save failed</Typography>}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* SKU Performance Chart */}
                        <Card>
                            <CardHeader title={<Typography variant="h6">SKU Performance</Typography>} />
                            <CardContent>
                                <div className="h-64">
                                    <Bar
                                        data={{
                                            labels: (data?.topSkus || []).map(s => s.name),
                                            datasets: [
                                                {
                                                    label: 'Scans',
                                                    data: (data?.topSkus || []).map(s => s.scans),
                                                    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444'],
                                                    borderRadius: 5,
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: { legend: { display: false } },
                                        }}
                                    />
                                </div>
                                <div className="mt-4 space-y-2">
                                    {(data?.topSkus || []).map((i) => (
                                        <div key={i.name} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-sm">{i.name}</p>
                                                <p className="text-xs text-gray-500">{i.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-sm">{i.scans} scans</p>
                                                <p className="text-xs text-green-600">
                                                    Top Performing
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabPanel>

            {/* ---------- Points Matrix Tab ---------- */}
            <TabPanel value={tab} index={2}>
                <div className="space-y-6">
                    {/* Points Matrix Table */}
                    <Card>
                        <CardHeader
                            title={<Typography variant="h6">Points Matrix Rules</Typography>}
                            action={
                                <div className="flex gap-2">
                                    <Button startIcon={<Download />} variant="outlined" size="small">
                                        Export
                                    </Button>
                                    <Button startIcon={<Upload />} variant="outlined" size="small">
                                        Import
                                    </Button>
                                </div>
                            }
                        />
                        <CardContent>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Rule ID</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell>Stakeholder</TableCell>
                                        <TableCell>SKU/Category</TableCell>
                                        <TableCell>Base Points</TableCell>
                                        <TableCell>Adjustment</TableCell>
                                        <TableCell>Effective From</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pointsMatrix.map((r) => (
                                        <TableRow key={r.id}>
                                            <TableCell>{r.id}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={r.ruleType}
                                                    size="small"
                                                    color={r.ruleType === 'Override' ? 'secondary' : 'default'}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>{r.stakeholder}</TableCell>
                                            <TableCell>
                                                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', textTransform: 'uppercase', fontSize: '0.65rem', fontWeight: 700 }}>
                                                    {r.categoryHeader}
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                                                    {r.categoryItem}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>{r.base}</TableCell>
                                            <TableCell>{r.mult}</TableCell>
                                            <TableCell>{r.from}</TableCell>
                                            <TableCell>
                                                <Typography variant="body2" className="truncate max-w-[150px]" title={r.description}>
                                                    {r.description || '---'}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={r.status}
                                                    color={r.status === 'Active' ? 'success' : r.status === 'Scheduled' ? 'warning' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                {r.ruleType === 'Base' ? (
                                                    <IconButton size="small" onClick={() => {
                                                        setSelectedRule(r);
                                                        setEditBasePoints(r.rawValue || 0);
                                                        setEditBaseMaxScans(r.maxScansPerDay || 5);
                                                        setEditModalOpen(true);
                                                    }}><Edit size={16} /></IconButton>
                                                ) : (
                                                    <IconButton size="small" color="error" onClick={() => {
                                                        if (confirm('Are you sure you want to delete this rule?')) {
                                                            deleteRuleMutation.mutate(Number(r.id.replace('RULE-', '')));
                                                        }
                                                    }}><Delete size={16} /></IconButton>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <Dialog open={editModalOpen} onClose={() => setEditModalOpen(false)} maxWidth="xs" fullWidth>
                        <DialogTitle>Edit Base Points Configuration</DialogTitle>
                        <DialogContent>
                            <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Stakeholder: {selectedRule?.stakeholder} | Item: {selectedRule?.category}
                                </Typography>
                                <TextField
                                    label="Base Points"
                                    type="number"
                                    fullWidth
                                    value={editBasePoints}
                                    onChange={(e) => setEditBasePoints(Number(e.target.value))}
                                />
                                <TextField
                                    label="Max Scans Per Day"
                                    type="number"
                                    fullWidth
                                    value={editBaseMaxScans}
                                    onChange={(e) => setEditBaseMaxScans(Number(e.target.value))}
                                />
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setEditModalOpen(false)}>Cancel</Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    if (selectedRule) {
                                        updateBasePointsMutation.mutate({
                                            id: Number(selectedRule.id.replace('CFG-', '')),
                                            clientId: 1, // Assume client 1 for now
                                            pointsPerUnit: editBasePoints,
                                            maxScansPerDay: editBaseMaxScans,
                                            isActive: true
                                        });
                                    }
                                }}
                            >
                                Save Changes
                            </Button>
                        </DialogActions>
                    </Dialog>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Add/Edit Rule Form */}
                        <Card>
                            <CardHeader title={<Typography variant="h6">Add/Edit Points Matrix Rule</Typography>} />
                            <CardContent>
                                <form className="space-y-4">
                                    <TextField label="Rule Name" value={pmName} onChange={(e) => setPmName(e.target.value)} fullWidth />

                                    <FormControl fullWidth>
                                        <InputLabel>Stakeholder Type</InputLabel>
                                        <Select value={pmUserTypeId} label="Stakeholder Type" onChange={(e) => setPmUserTypeId(e.target.value as any)}>
                                            <MenuItem value={'All'}>All</MenuItem>
                                            {stakeholderTypes.map((s) => (
                                                <MenuItem key={s.id} value={Number(s.id)}>{s.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>

                                    <FormControl fullWidth>
                                        <InputLabel>Apply To SKU Entity</InputLabel>
                                        <Select value={pmSkuEntityId ?? ''} label="Apply To SKU Entity" onChange={(e) => setPmSkuEntityId(e.target.value ? Number(e.target.value) : null)}>
                                            <MenuItem value="">-- Select Entity (optional) --</MenuItem>
                                            {flattenedEntities.map(f => {
                                                const depth = f.depth;
                                                const fontWeight = depth === 0 ? 700 : depth === 1 ? 500 : 400;
                                                const color = depth === 0 ? 'text.primary' : depth === 1 ? 'text.secondary' : 'text.disabled';
                                                const bgColor = depth === 0 ? 'rgba(0,0,0,0.04)' : 'transparent';

                                                return (
                                                    <MenuItem
                                                        key={f.id}
                                                        value={Number(f.id)}
                                                        sx={{
                                                            pl: depth * 2 + 2,
                                                            bgcolor: bgColor,
                                                            '&:hover': { bgcolor: 'rgba(0,0,0,0.08)' }
                                                        }}
                                                    >
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', gap: 2 }}>
                                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        color: 'primary.main',
                                                                        mr: 1,
                                                                        fontWeight: 600,
                                                                        fontSize: '0.65rem',
                                                                        textTransform: 'uppercase',
                                                                        letterSpacing: 0.5
                                                                    }}
                                                                >
                                                                    {f.levelName}
                                                                </Typography>
                                                                <Typography
                                                                    variant="body2"
                                                                    sx={{
                                                                        fontWeight: fontWeight,
                                                                        color: color,
                                                                        fontSize: depth === 0 ? '1rem' : '0.875rem'
                                                                    }}
                                                                >
                                                                    {f.label}
                                                                </Typography>
                                                            </Box>
                                                            {f.code && (
                                                                <Typography
                                                                    variant="caption"
                                                                    sx={{
                                                                        color: 'primary.main',
                                                                        bgcolor: 'primary.light',
                                                                        px: 0.8,
                                                                        py: 0.2,
                                                                        borderRadius: 1,
                                                                        fontSize: '0.7rem',
                                                                        fontWeight: 700,
                                                                        opacity: 0.9
                                                                    }}
                                                                >
                                                                    {f.code}
                                                                </Typography>
                                                            )}
                                                        </Box>
                                                    </MenuItem>
                                                );
                                            })}
                                        </Select>
                                    </FormControl>

                                    <TextField label="SKU Variant ID (optional)" type="number" value={pmSkuVariantId ?? ''} onChange={(e) => setPmSkuVariantId(e.target.value ? Number(e.target.value) : null)} fullWidth />

                                    <FormControl fullWidth>
                                        <InputLabel>Action Type</InputLabel>
                                        <Select value={pmActionType} label="Action Type" onChange={(e) => setPmActionType(e.target.value)}>
                                            <MenuItem value="FLAT_OVERRIDE">Flat Override</MenuItem>
                                            <MenuItem value="PERCENTAGE_ADD">Percentage Add</MenuItem>
                                            <MenuItem value="FIXED_ADD">Fixed Add</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <TextField label="Action Value" type="number" value={pmActionValue} onChange={(e) => setPmActionValue(Number(e.target.value))} fullWidth />

                                    <TextField label="Effective From" type="date" value={pmValidFrom} onChange={(e) => setPmValidFrom(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
                                    <TextField label="Effective To" type="date" value={pmValidTo} onChange={(e) => setPmValidTo(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />

                                    <TextField label="Description" multiline rows={2} value={pmDescription} onChange={(e) => setPmDescription(e.target.value)} fullWidth />

                                    <FormControlLabel control={<Checkbox checked={pmIsActive} onChange={(e) => setPmIsActive(e.target.checked)} />} label="Active" />

                                    <div className="flex justify-end gap-2">
                                        <Button variant="outlined" onClick={() => {
                                            // reset form
                                            setPmRuleId(null);
                                            setPmName('');
                                            setPmUserTypeId('All');
                                            setPmSkuEntityId(null);
                                            setPmSkuVariantId(null);
                                            setPmActionType('FLAT_OVERRIDE');
                                            setPmActionValue(10);
                                            setPmValidFrom('');
                                            setPmValidTo('');
                                            setPmIsActive(true);
                                            setPmDescription('');
                                        }}>Cancel</Button>
                                        <Button variant="contained" color="primary" onClick={() => {
                                            pointsRuleMutation.mutate({
                                                id: pmRuleId ?? undefined,
                                                name: pmName || `Rule ${Date.now()}`,
                                                clientId: pmClientId,
                                                userTypeId: pmUserTypeId === 'All' ? undefined : Number(pmUserTypeId),
                                                skuEntityId: pmSkuEntityId ?? undefined,
                                                skuVariantId: pmSkuVariantId ?? undefined,
                                                actionType: pmActionType,
                                                actionValue: pmActionValue,
                                                description: pmDescription,
                                                isActive: pmIsActive,
                                                validFrom: pmValidFrom || undefined,
                                                validTo: pmValidTo || undefined,
                                            });
                                        }} disabled={pointsRuleMutation.isPending}>
                                            {pointsRuleMutation.isPending ? 'Saving...' : 'Save Rule'}
                                        </Button>
                                        {pmSaveStatus === 'success' && <Typography variant="body2" color="success" sx={{ ml: 2 }}>Saved</Typography>}
                                        {pmSaveStatus === 'error' && <Typography variant="body2" color="error" sx={{ ml: 2 }}>Save failed</Typography>}
                                    </div>
                                </form>
                            </CardContent>
                        </Card>

                        {/* Points Distribution Chart */}
                        <Card>
                            <CardHeader title={<Typography variant="h6">Points Distribution Analysis</Typography>} />
                            <CardContent>
                                <div className="h-64">
                                    <Pie
                                        data={{
                                            labels: ['Electrical Products', 'Lighting Products', 'Special Promotion'],
                                            datasets: [
                                                {
                                                    data: [65, 25, 10],
                                                    backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
                                                },
                                            ],
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: { legend: { position: 'bottom' } },
                                        }}
                                    />
                                </div>
                                <div className="mt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span>Total Points Awarded (Last 30 days)</span>
                                        <span className="font-medium">245,678</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Average Points per Transaction</span>
                                        <span className="font-medium">12.5</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Highest Point Category</span>
                                        <span className="font-medium">Electrical Products</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Lowest Point Category</span>
                                        <span className="font-medium">Lighting Products</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </TabPanel>
        </main>
    );
}
