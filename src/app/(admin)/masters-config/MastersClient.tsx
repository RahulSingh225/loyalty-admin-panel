'use client';

import { useState } from 'react';
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
} from '@mui/material';
import { Chart as ChartJS, ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import { ChevronDown, ChevronRight, Download, Upload, Edit, Delete } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getMastersDataAction } from '@/actions/masters-actions';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function TabPanel(props: { children?: React.ReactNode; index: number; value: number }) {
    const { children, value, index } = props;
    return value === index ? <>{children}</> : null;
}

function TreeView() {
    const [open, setOpen] = useState<{ [key: string]: boolean }>({});

    const toggle = (key: string) => setOpen((p) => ({ ...p, [key]: !p[key] }));

    const Node = ({
        label,
        icon,
        badge,
        children,
        path,
    }: {
        label: string;
        icon: React.ReactNode;
        badge?: string;
        children?: React.ReactNode;
        path: string;
    }) => (
        <li>
            <div
                className="flex items-center py-1 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
                onClick={() => children && toggle(path)}
            >
                {children ? (
                    <span className="mr-1">
                        {open[path] ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </span>
                ) : (
                    <span className="w-5" />
                )}
                {icon}
                <span className="ml-2">{label}</span>
                {badge && (
                    <span className="ml-auto mr-2">
                        <Chip label={badge} size="small" color="primary" />
                    </span>
                )}
            </div>
            {children && open[path] && <ul className="ml-6">{children}</ul>}
        </li>
    );

    return (
        <ul className="space-y-1">
            <Node label="Electrical Products" icon={<i className="fas fa-folder text-blue-500 mr-2" />} badge="Category" path="ep">
                <Node label="Wires & Cables" icon={<i className="fas fa-folder text-blue-500 mr-2" />} badge="Sub-Category" path="ep-wc">
                    <Node label="Household Wires" icon={<i className="fas fa-file text-gray-500 mr-2" />} badge="SKU Group" path="ep-wc-hw">
                        <Node label="FR Wire 1.5mm" icon={<i className="fas fa-file text-gray-500 mr-2" />} badge="SKU" path="ep-wc-hw-1" />
                        <Node label="FR Wire 2.5mm" icon={<i className="fas fa-file text-gray-500 mr-2" />} badge="SKU" path="ep-wc-hw-2" />
                    </Node>
                    <Node label="Industrial Wires" icon={<i className="fas fa-file text-gray-500 mr-2" />} badge="SKU Group" path="ep-wc-iw">
                        <Node label="Industrial Cable 10mm" icon={<i className="fas fa-file text-gray-500 mr-2" />} badge="SKU" path="ep-wc-iw-1" />
                    </Node>
                </Node>
                <Node label="Switches & Sockets" icon={<i className="fas fa-folder text-blue-500 mr-2" />} badge="Sub-Category" path="ep-ss">
                    <Node label="Modular Switches" icon={<i className="fas fa-file text-gray-500 mr-2" />} badge="SKU Group" path="ep-ss-ms" />
                </Node>
            </Node>

            <Node label="Lighting Products" icon={<i className="fas fa-folder text-blue-500 mr-2" />} badge="Category" path="lp">
                <Node label="LED Bulbs" icon={<i className="fas fa-file text-gray-500 mr-2" />} badge="SKU Group" path="lp-led" />
            </Node>
        </ul>
    );
}

export default function MastersClient() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['masters-data'],
        queryFn: getMastersDataAction
    });

    const [tab, setTab] = useState(0);

    if (isLoading) return <Box p={4} display="flex" justifyContent="center"><CircularProgress /></Box>;
    if (error) return <Alert severity="error">Failed to load configuration data</Alert>;

    const stakeholderTypes = data?.stakeholderTypes || [];
    const pointsMatrix = data?.pointsMatrix || [];

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
                                        <TableCell>Points Multiplier</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {stakeholderTypes.map((row) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{row.id}</TableCell>
                                            <TableCell>{row.name}</TableCell>
                                            <TableCell>{row.desc}</TableCell>
                                            <TableCell>{row.mult}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.status}
                                                    color={row.status === 'Active' ? 'success' : 'warning'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small"><Edit size={16} /></IconButton>
                                                <IconButton size="small" color="error"><Delete size={16} /></IconButton>
                                            </TableCell>
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
                                        <Select defaultValue="Retailer" label="Stakeholder Type">
                                            <MenuItem value="Retailer">Retailer</MenuItem>
                                            <MenuItem value="CSB">CSB</MenuItem>
                                            <MenuItem value="Electrician">Electrician</MenuItem>
                                            <MenuItem value="Distributor">Distributor</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <TextField label="Points Multiplier" type="number" defaultValue={1.0} inputProps={{ step: 0.1 }} fullWidth />
                                    <TextField label="Max Daily Scans" type="number" defaultValue={50} fullWidth />
                                    <FormControl fullWidth>
                                        <InputLabel>Required KYC Level</InputLabel>
                                        <Select defaultValue="Basic" label="Required KYC Level">
                                            <MenuItem value="Basic">Basic</MenuItem>
                                            <MenuItem value="Standard">Standard</MenuItem>
                                            <MenuItem value="Advanced">Advanced</MenuItem>
                                        </Select>
                                    </FormControl>

                                    <div className="space-y-2">
                                        <FormControlLabel control={<Checkbox defaultChecked />} label="UPI" />
                                        <FormControlLabel control={<Checkbox defaultChecked />} label="Bank Transfer" />
                                        <FormControlLabel control={<Checkbox />} label="Voucher" />
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button variant="outlined">Cancel</Button>
                                        <Button variant="contained" color="primary">
                                            Save Configuration
                                        </Button>
                                    </div>
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
                            <TreeView />
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* SKU Points Config */}
                        <Card>
                            <CardHeader title={<Typography variant="h6">SKU Points Configuration</Typography>} />
                            <CardContent>
                                <form className="space-y-4">
                                    <FormControl fullWidth>
                                        <InputLabel>SKU Category</InputLabel>
                                        <Select defaultValue="Electrical Products" label="SKU Category">
                                            <MenuItem value="Electrical Products">Electrical Products</MenuItem>
                                            <MenuItem value="Lighting Products">Lighting Products</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>SKU Sub-Category</InputLabel>
                                        <Select defaultValue="Wires & Cables" label="SKU Sub-Category">
                                            <MenuItem value="Wires & Cables">Wires & Cables</MenuItem>
                                            <MenuItem value="Switches & Sockets">Switches & Sockets</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>SKU Group</InputLabel>
                                        <Select defaultValue="Household Wires" label="SKU Group">
                                            <MenuItem value="Household Wires">Household Wires</MenuItem>
                                            <MenuItem value="Industrial Wires">Industrial Wires</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField label="Points per Scan" type="number" defaultValue={10} fullWidth />
                                    <TextField label="Max Scans per Day" type="number" defaultValue={5} fullWidth />
                                    <TextField label="Valid From" type="date" InputLabelProps={{ shrink: true }} fullWidth />
                                    <TextField label="Valid To" type="date" InputLabelProps={{ shrink: true }} fullWidth />
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outlined">Cancel</Button>
                                        <Button variant="contained" color="primary">
                                            Save Configuration
                                        </Button>
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
                                            labels: ['FR Wire 1.5mm', 'Industrial Cable 10mm', 'LED Bulb 9W', 'Modular Switch 2-Way', 'FR Wire 2.5mm'],
                                            datasets: [
                                                {
                                                    label: 'Scans',
                                                    data: [1245, 987, 756, 634, 512],
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
                                    {[
                                        { name: 'FR Wire 1.5mm', scans: 1245, change: '+12.5%' },
                                        { name: 'Industrial Cable 10mm', scans: 987, change: '+8.3%' },
                                        { name: 'LED Bulb 9W', scans: 756, change: '-2.1%' },
                                    ].map((i) => (
                                        <div key={i.name} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium text-sm">{i.name}</p>
                                                <p className="text-xs text-gray-500">Electrical Products &gt; Wires &amp; Cables</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-medium text-sm">{i.scans} scans</p>
                                                <p className={`text-xs ${i.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                                                    {i.change}
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
                                        <TableCell>Stakeholder Type</TableCell>
                                        <TableCell>SKU Category</TableCell>
                                        <TableCell>Base Points</TableCell>
                                        <TableCell>Multiplier</TableCell>
                                        <TableCell>Effective From</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {pointsMatrix.map((r) => (
                                        <TableRow key={r.id}>
                                            <TableCell>{r.id}</TableCell>
                                            <TableCell>{r.stakeholder}</TableCell>
                                            <TableCell>{r.category}</TableCell>
                                            <TableCell>{r.base}</TableCell>
                                            <TableCell>{r.mult}</TableCell>
                                            <TableCell>{r.from}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={r.status}
                                                    color={r.status === 'Active' ? 'success' : r.status === 'Scheduled' ? 'warning' : 'default'}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <IconButton size="small"><Edit size={16} /></IconButton>
                                                <IconButton size="small" color="error"><Delete size={16} /></IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Add/Edit Rule Form */}
                        <Card>
                            <CardHeader title={<Typography variant="h6">Add/Edit Points Matrix Rule</Typography>} />
                            <CardContent>
                                <form className="space-y-4">
                                    <FormControl fullWidth>
                                        <InputLabel>Stakeholder Type</InputLabel>
                                        <Select defaultValue="All" label="Stakeholder Type">
                                            <MenuItem value="All">All</MenuItem>
                                            <MenuItem value="Retailer">Retailer</MenuItem>
                                            <MenuItem value="CSB">CSB</MenuItem>
                                            <MenuItem value="Electrician">Electrician</MenuItem>
                                            <MenuItem value="Distributor">Distributor</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl fullWidth>
                                        <InputLabel>SKU Category</InputLabel>
                                        <Select defaultValue="All" label="SKU Category">
                                            <MenuItem value="All">All</MenuItem>
                                            <MenuItem value="Electrical Products">Electrical Products</MenuItem>
                                            <MenuItem value="Lighting Products">Lighting Products</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <TextField label="Base Points" type="number" defaultValue={10} fullWidth />
                                    <TextField label="Multiplier" type="number" defaultValue={1.0} inputProps={{ step: 0.1 }} fullWidth />
                                    <TextField label="Effective From" type="date" InputLabelProps={{ shrink: true }} fullWidth />
                                    <TextField label="Effective To" type="date" InputLabelProps={{ shrink: true }} fullWidth />
                                    <FormControl fullWidth>
                                        <InputLabel>Status</InputLabel>
                                        <Select defaultValue="Active" label="Status">
                                            <MenuItem value="Active">Active</MenuItem>
                                            <MenuItem value="Inactive">Inactive</MenuItem>
                                            <MenuItem value="Scheduled">Scheduled</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <div className="flex justify-end gap-2">
                                        <Button variant="outlined">Cancel</Button>
                                        <Button variant="contained" color="primary">
                                            Save Rule
                                        </Button>
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
