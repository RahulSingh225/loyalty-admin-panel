'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
} from '@mui/material';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  Button,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  TextField,
} from '@mui/material';
import { Add, ArrowUpward, Delete, Download, Edit, Search } from '@mui/icons-material';

const activeCampaigns = [
  { id: '#CMP-001', name: 'Monsoon Fan Special', type: 'Booster', start: '2023-06-01', end: '2023-06-30', participants: 342, status: 'Active' },
  { id: '#CMP-002', name: 'Summer LED Campaign', type: 'Slab Based', start: '2023-05-15', end: '2023-07-15', participants: 278, status: 'Active' },
  { id: '#CMP-003', name: 'Festive Lighting Sale', type: 'Cross-Sell', start: '2023-06-10', end: '2023-08-10', participants: 156, status: 'Active' },
  { id: '#CMP-004', name: 'New Electrician Onboarding', type: 'Booster', start: '2023-06-01', end: '2023-07-31', participants: 89, status: 'Active' },
  { id: '#CMP-005', name: 'Switch & Socket Special', type: 'Slab Based', start: '2023-06-05', end: '2023-07-05', participants: 234, status: 'Active' },
];

const skuData = [
  { skuCode: 'STL-FAN-001', brand: 'STURLITE', model: 'CEILING FAN 1200MM', description: 'CEILING FAN WITH REMOTE', mrp: '2899', points: '57.98', totalPoints: '60' },
  { skuCode: 'STL-FAN-002', brand: 'STURLITE', model: 'CEILING FAN 1400MM', description: 'CEILING FAN WITH REMOTE', mrp: '3299', points: '65.98', totalPoints: '70' },
  { skuCode: 'STL-LGT-001', brand: 'STURLITE', model: 'LED BULB 9W', description: 'LED BULB COOL WHITE', mrp: '199', points: '3.98', totalPoints: '5' },
  { skuCode: 'STL-LGT-002', brand: 'STURLITE', model: 'LED BULB 12W', description: 'LED BULB WARM WHITE', mrp: '249', points: '4.98', totalPoints: '5' },
  { skuCode: 'STL-SWT-001', brand: 'STURLITE', model: 'SWITCH 2 MODULE', description: 'MODULAR SWITCH 2 MODULE', mrp: '399', points: '7.98', totalPoints: '10' },
  { skuCode: 'STL-SWT-002', brand: 'STURLITE', model: 'SWITCH 4 MODULE', description: 'MODULAR SWITCH 4 MODULE', mrp: '599', points: '11.98', totalPoints: '15' },
  { skuCode: 'STL-MCB-001', brand: 'STURLITE', model: 'MCB 16A', description: 'MINIATURE CIRCUIT BREAKER', mrp: '299', points: '5.98', totalPoints: '10' },
  { skuCode: 'STL-MCB-002', brand: 'STURLITE', model: 'MCB 32A', description: 'MINIATURE CIRCUIT BREAKER', mrp: '399', points: '7.98', totalPoints: '10' },
  { skuCode: 'STL-WIR-001', brand: 'STURLITE', model: 'WIRE 1.5SQMM', description: 'COPPER WIRE 90MTRS', mrp: '1899', points: '37.98', totalPoints: '40' },
  { skuCode: 'STL-WIR-002', brand: 'STURLITE', model: 'WIRE 2.5SQMM', description: 'COPPER WIRE 90MTRS', mrp: '2899', points: '57.98', totalPoints: '60' },
];

const productHierarchy = {
  fans: {
    name: "Fans",
    subcategories: {
      "ceiling-fans": {
        name: "Ceiling Fans",
        skus: {
          "STL-FAN-001": "STL-FAN-001 - STURLITE CEILING FAN 1200MM",
          "STL-FAN-002": "STL-FAN-002 - STURLITE CEILING FAN 1400MM"
        }
      },
      "table-fans": {
        name: "Table Fans",
        skus: {}
      },
      "pedestal-fans": {
        name: "Pedestal Fans",
        skus: {}
      }
    }
  },
  lighting: {
    name: "Lighting",
    subcategories: {
      "led-bulbs": {
        name: "LED Bulbs",
        skus: {
          "STL-LGT-001": "STL-LGT-001 - STURLITE LED BULB 9W",
          "STL-LGT-002": "STL-LGT-002 - STURLITE LED BULB 12W"
        }
      },
      "led-tubes": {
        name: "LED Tubes",
        skus: {}
      }
    }
  },
  switches: {
    name: "Switches",
    subcategories: {
      "modular-switches": {
        name: "Modular Switches",
        skus: {
          "STL-SWT-001": "STL-SWT-001 - STURLITE SWITCH 2 MODULE",
          "STL-SWT-002": "STL-SWT-002 - STURLITE SWITCH 4 MODULE"
        }
      }
    }
  },
  wires: {
    name: "Wires",
    subcategories: {
      "copper-wires": {
        name: "Copper Wires",
        skus: {
          "STL-WIR-001": "STL-WIR-001 - STURLITE WIRE 1.5SQMM",
          "STL-WIR-002": "STL-WIR-002 - STURLITE WIRE 2.5SQMM"
        }
      }
    }
  },
  mcbs: {
    name: "MCBs",
    subcategories: {
      "miniature-breakers": {
        name: "Miniature Circuit Breakers",
        skus: {
          "STL-MCB-001": "STL-MCB-001 - STURLITE MCB 16A",
          "STL-MCB-002": "STL-MCB-002 - STURLITE MCB 32A"
        }
      }
    }
  }
};

export default function CampaignManagementPage() {
  const [campaignType, setCampaignType] = useState('');
  const [campaignName, setCampaignName] = useState('');
  const [campaignDescription, setCampaignDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [targetAudience, setTargetAudience] = useState([]);
  const [state, setState] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');

  // Booster
  const [pointsMultiplier, setPointsMultiplier] = useState('');
  const [boosterSelectedSkus, setBoosterSelectedSkus] = useState({});
  const [boosterSearch, setBoosterSearch] = useState('');

  // Slab Based
  const [category, setCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [slabBasis, setSlabBasis] = useState('scans');
  const [slabRewardType, setSlabRewardType] = useState('monetary');
  const [slabs, setSlabs] = useState([
    { name: 'Slab 1', min: 1, max: 2, multiplier: 1, rewardType: 'gold-coins', rewardValue: '' },
    { name: 'Slab 2', min: 3, max: 5, multiplier: 2, rewardType: 'gold-coins', rewardValue: '' },
    { name: 'Slab 3', min: 6, max: '', multiplier: 3, rewardType: 'gold-coins', rewardValue: '' },
  ]);
  const [slabSelectedSkus, setSlabSelectedSkus] = useState({});
  const [slabSearch, setSlabSearch] = useState('');

  // Cross-Sell
  const [crossSellRewardType, setCrossSellRewardType] = useState('monetary');
  const [combinations, setCombinations] = useState([
    {
      productCount: 2,
      name: '',
      products: Array.from({ length: 2 }, (_, i) => ({ category: '', subcategory: '', sku: '', quantity: 1 })),
      extraPoints: 0,
      rewardType: 'gold-coins',
      rewardValue: '',
      active: true,
    },
  ]);

  // Promo Schemes
  const [promoPointsMultiplier, setPromoPointsMultiplier] = useState('');
  const [birthdayEnabled, setBirthdayEnabled] = useState(false);
  const [birthdayPoints, setBirthdayPoints] = useState(0);
  const [birthdayMultiplier, setBirthdayMultiplier] = useState(1);
  const [anniversaryEnabled, setAnniversaryEnabled] = useState(false);
  const [anniversaryPoints, setAnniversaryPoints] = useState(0);
  const [anniversaryMultiplier, setAnniversaryMultiplier] = useState(1);
  const [customEnabled, setCustomEnabled] = useState(false);
  const [customName, setCustomName] = useState('');
  const [customPoints, setCustomPoints] = useState(0);
  const [customMultiplier, setCustomMultiplier] = useState(1);
  const [customDate, setCustomDate] = useState('');
  const [promoSelectedSkus, setPromoSelectedSkus] = useState({});
  const [promoSearch, setPromoSearch] = useState('');

  const handleAudienceChange = (value) => {
    if (value === 'both') {
      setTargetAudience(['both']);
    } else {
      setTargetAudience((prev) => {
        if (prev.includes('both')) return [value];
        if (prev.includes(value)) return prev.filter((v) => v !== value);
        return [...prev, value];
      });
    }
  };

  const handleSkuChange = (section, skuCode, checked) => {
    const setFn = section === 'booster' ? setBoosterSelectedSkus : section === 'slab' ? setSlabSelectedSkus : setPromoSelectedSkus;
    setFn((prev) => {
      if (checked) {
        const sku = skuData.find((s) => s.skuCode === skuCode);
        return { ...prev, [skuCode] : sku };
      } else {
        const { [skuCode]: _, ...rest } = prev;
        return rest;
      }
    });
  };

  const handleSelectAll = (section, checked) => {
    const setFn = section === 'booster' ? setBoosterSelectedSkus : section === 'slab' ? setSlabSelectedSkus : setPromoSelectedSkus;
    if (checked) {
      const selected = {};
      skuData.forEach((sku) => selected[sku.skuCode] = sku);
      setFn(selected);
    } else {
      setFn({});
    }
  };

  const filterSkus = (search) => skuData.filter((sku) => Object.values(sku).some((v) => v.toLowerCase().includes(search.toLowerCase())));

  const addSlab = () => {
    const slabCount = slabs.length + 1;
    setSlabs([...slabs, { name: `Slab ${slabCount}`, min: slabCount * (slabBasis === 'scans' ? 5 : 100), max: (slabCount + 1) * (slabBasis === 'scans' ? 5 : 100), multiplier: slabCount, rewardType: 'gold-coins', rewardValue: '' }]);
  };

  const updateSlab = (index, field, value) => {
    const newSlabs = [...slabs];
    newSlabs[index][field] = value;
    setSlabs(newSlabs);
  };

  const removeSlab = (index) => setSlabs(slabs.filter((_, i) => i !== index));

  const addCombination = () => {
    setCombinations([...combinations, {
      productCount: 2,
      name: '',
      products: Array.from({ length: 2 }, () => ({ category: '', subcategory: '', sku: '', quantity: 1 })),
      extraPoints: 0,
      rewardType: 'gold-coins',
      rewardValue: '',
      active: true,
    }]);
  };

  const updateCombination = (index, field, value) => {
    const newCombs = [...combinations];
    newCombs[index][field] = value;
    if (field === 'productCount') {
      newCombs[index].products = Array.from({ length: value }, (_, i) => newCombs[index].products[i] || { category: '', subcategory: '', sku: '', quantity: 1 });
    }
    setCombinations(newCombs);
  };

  const updateProduct = (combIndex, prodIndex, field, value) => {
    const newCombs = [...combinations];
    newCombs[combIndex].products[prodIndex][field] = value;
    if (field === 'category') newCombs[combIndex].products[prodIndex].subcategory = '';
    if (field === 'category' || field === 'subcategory') newCombs[combIndex].products[prodIndex].sku = '';
    setCombinations(newCombs);
  };

  const removeCombination = (index) => setCombinations(combinations.filter((_, i) => i !== index));

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation and submission logic here
    // For now, reset form
    setCampaignType('');
    setCampaignName('');
    setCampaignDescription('');
    setStartDate('');
    setEndDate('');
    setTargetAudience([]);
    setState('');
    setCity('');
    setDistrict('');
    setPointsMultiplier('');
    setBoosterSelectedSkus({});
    setBoosterSearch('');
    setCategory('');
    setSubCategory('');
    setSlabBasis('scans');
    setSlabRewardType('monetary');
    setSlabs([]);
    setSlabSelectedSkus({});
    setSlabSearch('');
    setCrossSellRewardType('monetary');
    setCombinations([{
      productCount: 2,
      name: '',
      products: Array.from({ length: 2 }, () => ({ category: '', subcategory: '', sku: '', quantity: 1 })),
      extraPoints: 0,
      rewardType: 'gold-coins',
      rewardValue: '',
      active: true,
    }]);
    setPromoPointsMultiplier('');
    setBirthdayEnabled(false);
    setBirthdayPoints(0);
    setBirthdayMultiplier(1);
    setAnniversaryEnabled(false);
    setAnniversaryPoints(0);
    setAnniversaryMultiplier(1);
    setCustomEnabled(false);
    setCustomName('');
    setCustomPoints(0);
    setCustomMultiplier(1);
    setCustomDate('');
    setPromoSelectedSkus({});
    setPromoSearch('');
    // Show success
    // showNotification('Campaign created successfully', 'success');
  };

  return (
    <main className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-black dark:to-gray-900">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="widget-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Typography variant="h6">Total Campaigns</Typography>
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <i className="fas fa-bullhorn text-blue-600"></i>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUpward fontSize="small" className="mr-1" /> 3 new this month
            </div>
          </CardContent>
        </Card>
        <Card className="widget-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Typography variant="h6">Active Campaigns</Typography>
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <i className="fas fa-play-circle text-green-600"></i>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUpward fontSize="small" className="mr-1" /> 2 started this week
            </div>
          </CardContent>
        </Card>
        <Card className="widget-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Typography variant="h6">Total Participants</Typography>
              <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center">
                <i className="fas fa-users text-yellow-600"></i>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,245</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUpward fontSize="small" className="mr-1" /> 12% from last month
            </div>
          </CardContent>
        </Card>
        <Card className="widget-card">
          <CardHeader>
            <div className="flex justify-between items-center">
              <Typography variant="h6">Points Distributed</Typography>
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                <i className="fas fa-coins text-red-600"></i>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45,670</div>
            <div className="flex items-center text-sm text-green-600">
              <ArrowUpward fontSize="small" className="mr-1" /> 8% from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="widget-card mb-6">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Typography>Active Campaigns</Typography>
            <div className="flex space-x-2">
              <Button
                variant="outlined"
                size="small"
                onClick={() => {
                  const el = document.getElementById('campaignCreationSection');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Add className="mr-1" /> Create Campaign
              </Button>
              <Button variant="outlined" size="small">
                <Download className="mr-1" /> Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Campaign ID</TableCell>
                <TableCell>Campaign Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>End Date</TableCell>
                <TableCell>Participants</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {activeCampaigns.map((camp) => (
                <TableRow key={camp.id}>
                  <TableCell>{camp.id}</TableCell>
                  <TableCell>{camp.name}</TableCell>
                  <TableCell>{camp.type}</TableCell>
                  <TableCell>{camp.start}</TableCell>
                  <TableCell>{camp.end}</TableCell>
                  <TableCell>{camp.participants}</TableCell>
                  <TableCell>
                    <Chip label={camp.status} color="success" size="small" />
                  </TableCell>
                  <TableCell>
                    <IconButton size="small"><Edit /></IconButton>
                    <IconButton size="small" color="error"><Delete /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card id="campaignCreationSection" className="widget-card">
        <CardHeader>
          <Typography variant="h6">Create New Campaign</Typography>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FormControl component="fieldset" className="mb-4">
              <FormLabel>Campaign Type</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {['booster', 'slab-based', 'cross-sell', 'promo-schemes'].map((type) => (
                  <Card
                    key={type}
                    className={`campaign-type cursor-pointer ${campaignType === type ? 'selected' : ''}`}
                    onClick={() => setCampaignType(type)}
                  >
                    <CardContent className="flex flex-col items-center">
                      <i className={`fas ${type === 'booster' ? 'fa-coins' : type === 'slab-based' ? 'fa-layer-group' : type === 'cross-sell' ? 'fa-exchange-alt' : 'fa-gift'} text-2xl text-blue-600 mb-2`}></i>
                      <h4 className="font-medium">{type.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</h4>
                      <p className="text-sm text-gray-500 text-center">
                        {type === 'booster' ? 'Offer additional points for specific actions' : type === 'slab-based' ? 'Define slabs with customizable ranges and multipliers' : type === 'cross-sell' ? 'Reward customers for purchasing from different categories' : 'Special promotions with bonus points for occasions'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FormControl>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <TextField label="Campaign Name" value={campaignName} onChange={(e) => setCampaignName(e.target.value)} fullWidth />
              <TextField label="Description" value={campaignDescription} onChange={(e) => setCampaignDescription(e.target.value)} multiline rows={2} fullWidth />
              <TextField label="Start Date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
              <TextField label="End Date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} InputLabelProps={{ shrink: true }} fullWidth />
            </div>

            <FormControl component="fieldset" className="mb-4">
              <FormLabel>Target Audience</FormLabel>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['retailers', 'electricians', 'both'].map((aud) => (
                  <Card
                    key={aud}
                    className={`audience-option cursor-pointer ${targetAudience.includes(aud) ? 'bg-blue-50 border-blue-500' : ''}`}
                    onClick={() => handleAudienceChange(aud)}
                  >
                    <CardContent>
                      <FormControlLabel
                        control={<Checkbox checked={targetAudience.includes(aud)} onChange={() => handleAudienceChange(aud)} />}
                        label={aud.charAt(0).toUpperCase() + aud.slice(1)}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </FormControl>

            <FormControl component="fieldset" className="mb-4">
              <FormLabel>Target Geography (Optional)</FormLabel>
              <p className="text-sm text-gray-500 mb-2">Specify the target location for this campaign. Leave blank to make it available nationwide.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormControl fullWidth>
                  <InputLabel>State</InputLabel>
                  <Select value={state} onChange={(e) => setState(e.target.value)}>
                    <MenuItem value="">-- Select State --</MenuItem>
                    <MenuItem value="maharashtra">Maharashtra</MenuItem>
                    {/* Add other states */}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>City</InputLabel>
                  <Select value={city} onChange={(e) => setCity(e.target.value)}>
                    <MenuItem value="">-- Select City --</MenuItem>
                    <MenuItem value="mumbai">Mumbai</MenuItem>
                    {/* Add other cities */}
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>District</InputLabel>
                  <Select value={district} onChange={(e) => setDistrict(e.target.value)}>
                    <MenuItem value="">-- Select District --</MenuItem>
                    <MenuItem value="mumbai-city">Mumbai City</MenuItem>
                    {/* Add other districts */}
                  </Select>
                </FormControl>
              </div>
            </FormControl>

            {campaignType === 'booster' && (
              <div>
                <TextField label="Points Multiplier" type="number" value={pointsMultiplier} onChange={(e) => setPointsMultiplier(e.target.value)} inputProps={{ min: 1, step: 0.1 }} fullWidth className="mb-4" />
                <FormLabel>Select SKUs for Campaign</FormLabel>
                <TextField
                  placeholder="Search by SKU Code, Brand, Model, or Description..."
                  value={boosterSearch}
                  onChange={(e) => setBoosterSearch(e.target.value)}
                  fullWidth
                  InputProps={{ startAdornment: <Search /> }}
                  className="mb-3"
                />
                <div className="p-3 bg-gray-50 rounded-lg mb-3">
                  <div className="font-medium mb-2">Selected SKUs:</div>
                  <div className="flex flex-wrap">
                    {Object.keys(boosterSelectedSkus).length === 0 ? <span className="text-gray-500 italic">No SKUs selected</span> : Object.entries(boosterSelectedSkus).map(([code, sku]) => (
                      <Chip key={code} label={`${code} - ${sku.brand} ${sku.model}`} onDelete={() => handleSkuChange('booster', code, false)} className="m-1" />
                    ))}
                  </div>
                </div>
                <div className="sku-table border rounded-lg overflow-hidden max-h-300 overflow-y-auto">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Checkbox checked={Object.keys(boosterSelectedSkus).length === skuData.length} onChange={(e) => handleSelectAll('booster', e.target.checked)} /></TableCell>
                        <TableCell>SKU Code</TableCell>
                        <TableCell>Brand Name</TableCell>
                        <TableCell>Model Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>MRP</TableCell>
                        <TableCell>Points @ 2%</TableCell>
                        <TableCell>Total Points</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterSkus(boosterSearch).map((sku) => (
                        <TableRow key={sku.skuCode}>
                          <TableCell><Checkbox checked={!!boosterSelectedSkus[sku.skuCode]} onChange={(e) => handleSkuChange('booster', sku.skuCode, e.target.checked)} /></TableCell>
                          <TableCell>{sku.skuCode}</TableCell>
                          <TableCell>{sku.brand}</TableCell>
                          <TableCell>{sku.model}</TableCell>
                          <TableCell>{sku.description}</TableCell>
                          <TableCell>{sku.mrp}</TableCell>
                          <TableCell>{sku.points}</TableCell>
                          <TableCell>{sku.totalPoints}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {campaignType === 'slab-based' && (
              <div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <FormControl fullWidth>
                    <InputLabel>Category</InputLabel>
                    <Select value={category} onChange={(e) => setCategory(e.target.value)}>
                      <MenuItem value="">-- Select Category --</MenuItem>
                      <MenuItem value="fans">Fans</MenuItem>
                      <MenuItem value="lighting">Lighting</MenuItem>
                      <MenuItem value="switches">Switches</MenuItem>
                      <MenuItem value="wires">Wires</MenuItem>
                      <MenuItem value="mcbs">MCBs</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>Sub-Category</InputLabel>
                    <Select value={subCategory} onChange={(e) => setSubCategory(e.target.value)}>
                      <MenuItem value="">-- Select Sub-Category --</MenuItem>
                      <MenuItem value="ceiling-fans">Ceiling Fans</MenuItem>
                      <MenuItem value="table-fans">Table Fans</MenuItem>
                      <MenuItem value="pedestal-fans">Pedestal Fans</MenuItem>
                      <MenuItem value="led-bulbs">LED Bulbs</MenuItem>
                      <MenuItem value="led-tubes">LED Tubes</MenuItem>
                    </Select>
                  </FormControl>
                </div>
                <Card className="p-4 bg-gray-50 mb-4">
                  <FormControl component="fieldset" className="mb-4">
                    <FormLabel>Slab Basis</FormLabel>
                    <RadioGroup row value={slabBasis} onChange={(e) => setSlabBasis(e.target.value)}>
                      <FormControlLabel value="scans" control={<Radio />} label="Based on Number of Scans" />
                      <FormControlLabel value="points" control={<Radio />} label="Based on Points Earned" />
                    </RadioGroup>
                  </FormControl>
                  <FormControl component="fieldset" className="mb-4">
                    <FormLabel>Reward Type</FormLabel>
                    <RadioGroup row value={slabRewardType} onChange={(e) => setSlabRewardType(e.target.value)}>
                      <FormControlLabel value="monetary" control={<Radio />} label="Monetary (Points)" />
                      <FormControlLabel value="non-monetary" control={<Radio />} label="Non-Monetary (Gold Coins, Vouchers, etc.)" />
                    </RadioGroup>
                  </FormControl>
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Slab Configuration</span>
                    <Button variant="contained" size="small" onClick={addSlab}>
                      <Add className="mr-1" /> Add Slab
                    </Button>
                  </div>
                  <div>
                    {slabs.map((slab, index) => (
                      <div key={index} className="slab-item mb-2">
                        <TextField label="Slab Name" value={slab.name} onChange={(e) => updateSlab(index, 'name', e.target.value)} />
                        <div>
                          <FormLabel>{slabBasis === 'scans' ? 'Range (Number of Scans)' : 'Range (Points Earned)'}</FormLabel>
                          <div className="flex items-center">
                            <TextField type="number" value={slab.min} onChange={(e) => updateSlab(index, 'min', parseInt(e.target.value))} inputProps={{ min: 1 }} />
                            <span className="mx-2">-</span>
                            <TextField type="number" value={slab.max} onChange={(e) => updateSlab(index, 'max', parseInt(e.target.value))} inputProps={{ min: 1 }} placeholder="No limit" />
                          </div>
                        </div>
                        {slabRewardType === 'monetary' ? (
                          <TextField label="Multiplier" type="number" value={slab.multiplier} onChange={(e) => updateSlab(index, 'multiplier', parseFloat(e.target.value))} inputProps={{ min: 0.1, step: 0.1 }} />
                        ) : (
                          <div>
                            <FormControl fullWidth>
                              <InputLabel>Reward Type</InputLabel>
                              <Select value={slab.rewardType} onChange={(e) => updateSlab(index, 'rewardType', e.target.value)}>
                                <MenuItem value="gold-coins">Gold Coins</MenuItem>
                                <MenuItem value="voucher">Voucher</MenuItem>
                                <MenuItem value="trip">Trip to Thailand</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                              </Select>
                            </FormControl>
                            <TextField label="Reward Value/Description" value={slab.rewardValue} onChange={(e) => updateSlab(index, 'rewardValue', e.target.value)} />
                          </div>
                        )}
                        <IconButton color="error" onClick={() => removeSlab(index)}><Delete /></IconButton>
                      </div>
                    ))}
                  </div>
                </Card>
                <FormLabel>Select SKUs for Campaign</FormLabel>
                <TextField
                  placeholder="Search by SKU Code, Brand, Model, or Description..."
                  value={slabSearch}
                  onChange={(e) => setSlabSearch(e.target.value)}
                  fullWidth
                  InputProps={{ startAdornment: <Search /> }}
                  className="mb-3"
                />
                <div className="p-3 bg-gray-50 rounded-lg mb-3">
                  <div className="font-medium mb-2">Selected SKUs:</div>
                  <div className="flex flex-wrap">
                    {Object.keys(slabSelectedSkus).length === 0 ? <span className="text-gray-500 italic">No SKUs selected</span> : Object.entries(slabSelectedSkus).map(([code, sku]) => (
                      <Chip key={code} label={`${code} - ${sku.brand} ${sku.model}`} onDelete={() => handleSkuChange('slab', code, false)} className="m-1" />
                    ))}
                  </div>
                </div>
                <div className="sku-table border rounded-lg overflow-hidden max-h-300 overflow-y-auto">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Checkbox checked={Object.keys(slabSelectedSkus).length === skuData.length} onChange={(e) => handleSelectAll('slab', e.target.checked)} /></TableCell>
                        <TableCell>SKU Code</TableCell>
                        <TableCell>Brand Name</TableCell>
                        <TableCell>Model Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>MRP</TableCell>
                        <TableCell>Points @ 2%</TableCell>
                        <TableCell>Total Points</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterSkus(slabSearch).map((sku) => (
                        <TableRow key={sku.skuCode}>
                          <TableCell><Checkbox checked={!!slabSelectedSkus[sku.skuCode]} onChange={(e) => handleSkuChange('slab', sku.skuCode, e.target.checked)} /></TableCell>
                          <TableCell>{sku.skuCode}</TableCell>
                          <TableCell>{sku.brand}</TableCell>
                          <TableCell>{sku.model}</TableCell>
                          <TableCell>{sku.description}</TableCell>
                          <TableCell>{sku.mrp}</TableCell>
                          <TableCell>{sku.points}</TableCell>
                          <TableCell>{sku.totalPoints}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {campaignType === 'cross-sell' && (
              <div>
                <FormControl component="fieldset" className="mb-4">
                  <FormLabel>Reward Type</FormLabel>
                  <RadioGroup row value={crossSellRewardType} onChange={(e) => setCrossSellRewardType(e.target.value)}>
                    <FormControlLabel value="monetary" control={<Radio />} label="Monetary (Points)" />
                    <FormControlLabel value="non-monetary" control={<Radio />} label="Non-Monetary (Gold Coins, Vouchers, etc.)" />
                  </RadioGroup>
                </FormControl>
                <Card className="p-4 bg-gray-50 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <span className="font-medium">Scan-Based Combinations</span>
                    <Button variant="contained" size="small" onClick={addCombination}>
                      <Add className="mr-1" /> Add Combination
                    </Button>
                  </div>
                  <div>
                    {combinations.map((comb, index) => (
                      <div key={index} className="combination-item mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-3">
                          <FormControl fullWidth>
                            <InputLabel>Number of Products</InputLabel>
                            <Select value={comb.productCount} onChange={(e) => updateCombination(index, 'productCount', parseInt(e.target.value))}>
                              <MenuItem value={2}>2 Products</MenuItem>
                              <MenuItem value={3}>3 Products</MenuItem>
                              <MenuItem value={4}>4 Products</MenuItem>
                              <MenuItem value={5}>5 Products</MenuItem>
                            </Select>
                          </FormControl>
                          <TextField label="Combination Name" value={comb.name} onChange={(e) => updateCombination(index, 'name', e.target.value)} className="md:col-span-3" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          {comb.products.map((prod, pIndex) => (
                            <div key={pIndex}>
                              <FormLabel>Product {pIndex + 1}</FormLabel>
                              <FormControl fullWidth className="mb-2">
                                <InputLabel>-- Select Category --</InputLabel>
                                <Select value={prod.category} onChange={(e) => updateProduct(index, pIndex, 'category', e.target.value)}>
                                  <MenuItem value="">-- Select Category --</MenuItem>
                                  {Object.keys(productHierarchy).map((cat) => <MenuItem key={cat} value={cat}>{productHierarchy[cat].name}</MenuItem>)}
                                </Select>
                              </FormControl>
                              {prod.category && (
                                <FormControl fullWidth className="mb-2">
                                  <InputLabel>-- Select Sub-Category --</InputLabel>
                                  <Select value={prod.subcategory} onChange={(e) => updateProduct(index, pIndex, 'subcategory', e.target.value)}>
                                    <MenuItem value="">-- Select Sub-Category --</MenuItem>
                                    {Object.keys(productHierarchy[prod.category].subcategories).map((sub) => <MenuItem key={sub} value={sub}>{productHierarchy[prod.category].subcategories[sub].name}</MenuItem>)}
                                  </Select>
                                </FormControl>
                              )}
                              {prod.subcategory && Object.keys(productHierarchy[prod.category].subcategories[prod.subcategory].skus).length > 0 && (
                                <FormControl fullWidth className="mb-2">
                                  <InputLabel>-- Select SKU (Optional) --</InputLabel>
                                  <Select value={prod.sku} onChange={(e) => updateProduct(index, pIndex, 'sku', e.target.value)}>
                                    <MenuItem value="">-- Select SKU (Optional) --</MenuItem>
                                    {Object.keys(productHierarchy[prod.category].subcategories[prod.subcategory].skus).map((skuKey) => <MenuItem key={skuKey} value={skuKey}>{productHierarchy[prod.category].subcategories[prod.subcategory].skus[skuKey]}</MenuItem>)}
                                  </Select>
                                </FormControl>
                              )}
                              <TextField type="number" label="Quantity" value={prod.quantity} onChange={(e) => updateProduct(index, pIndex, 'quantity', parseInt(e.target.value))} inputProps={{ min: 1 }} fullWidth className="mb-2" />
                              <div className="text-sm text-gray-600">{prod.category ? `Selected: ${prod.sku ? productHierarchy[prod.category].subcategories[prod.subcategory].skus[prod.sku] : prod.subcategory ? `All ${productHierarchy[prod.category].subcategories[prod.subcategory].name}` : `All ${productHierarchy[prod.category].name}`}` : 'No selection'}</div>
                            </div>
                          ))}
                        </div>
                        {crossSellRewardType === 'monetary' ? (
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <TextField label="Extra Points for Combo" type="number" value={comb.extraPoints} onChange={(e) => updateCombination(index, 'extraPoints', parseInt(e.target.value))} inputProps={{ min: 0 }} />
                            <div className="md:col-span-3 flex items-center">
                              <FormControlLabel control={<Checkbox checked={comb.active} onChange={(e) => updateCombination(index, 'active', e.target.checked)} />} label="Active Combination" />
                              <IconButton color="error" onClick={() => removeCombination(index)} className="ml-auto"><Delete /></IconButton>
                            </div>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <FormControl fullWidth>
                              <InputLabel>Reward Type</InputLabel>
                              <Select value={comb.rewardType} onChange={(e) => updateCombination(index, 'rewardType', e.target.value)}>
                                <MenuItem value="gold-coins">Gold Coins</MenuItem>
                                <MenuItem value="voucher">Voucher</MenuItem>
                                <MenuItem value="trip">Trip to Thailand</MenuItem>
                                <MenuItem value="other">Other</MenuItem>
                              </Select>
                            </FormControl>
                            <TextField label="Reward Value/Description" value={comb.rewardValue} onChange={(e) => updateCombination(index, 'rewardValue', e.target.value)} />
                            <div className="flex items-center">
                              <FormControlLabel control={<Checkbox checked={comb.active} onChange={(e) => updateCombination(index, 'active', e.target.checked)} />} label="Active Combination" />
                              <IconButton color="error" onClick={() => removeCombination(index)} className="ml-auto"><Delete /></IconButton>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {campaignType === 'promo-schemes' && (
              <div>
                <TextField label="Points Multiplier" type="number" value={promoPointsMultiplier} onChange={(e) => setPromoPointsMultiplier(e.target.value)} inputProps={{ min: 1, step: 0.1 }} fullWidth className="mb-4" />
                <FormLabel>Special Days Bonus Configuration</FormLabel>
                <p className="text-sm text-gray-500 mb-3">Configure additional points or multipliers for special occasions</p>
                <Card className="p-4 bg-gray-50 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <i className="fas fa-birthday-cake text-pink-500 mr-2"></i>
                      <span className="font-medium">Birthday Bonus</span>
                    </div>
                    <FormControlLabel control={<Checkbox checked={birthdayEnabled} onChange={(e) => setBirthdayEnabled(e.target.checked)} />} label="Enable" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField label="Additional Points" type="number" value={birthdayPoints} onChange={(e) => setBirthdayPoints(parseInt(e.target.value))} disabled={!birthdayEnabled} />
                    <TextField label="Multiplier" type="number" value={birthdayMultiplier} onChange={(e) => setBirthdayMultiplier(parseFloat(e.target.value))} inputProps={{ min: 1, step: 0.1 }} disabled={!birthdayEnabled} />
                  </div>
                </Card>
                <Card className="p-4 bg-gray-50 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <i className="fas fa-heart text-red-500 mr-2"></i>
                      <span className="font-medium">Anniversary Bonus</span>
                    </div>
                    <FormControlLabel control={<Checkbox checked={anniversaryEnabled} onChange={(e) => setAnniversaryEnabled(e.target.checked)} />} label="Enable" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <TextField label="Additional Points" type="number" value={anniversaryPoints} onChange={(e) => setAnniversaryPoints(parseInt(e.target.value))} disabled={!anniversaryEnabled} />
                    <TextField label="Multiplier" type="number" value={anniversaryMultiplier} onChange={(e) => setAnniversaryMultiplier(parseFloat(e.target.value))} inputProps={{ min: 1, step: 0.1 }} disabled={!anniversaryEnabled} />
                  </div>
                </Card>
                <Card className="p-4 bg-gray-50 mb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                      <i className="fas fa-calendar-star text-purple-500 mr-2"></i>
                      <span className="font-medium">Custom Special Day</span>
                    </div>
                    <FormControlLabel control={<Checkbox checked={customEnabled} onChange={(e) => setCustomEnabled(e.target.checked)} />} label="Enable" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <TextField label="Day Name" value={customName} onChange={(e) => setCustomName(e.target.value)} disabled={!customEnabled} />
                    <TextField label="Additional Points" type="number" value={customPoints} onChange={(e) => setCustomPoints(parseInt(e.target.value))} disabled={!customEnabled} />
                    <TextField label="Multiplier" type="number" value={customMultiplier} onChange={(e) => setCustomMultiplier(parseFloat(e.target.value))} inputProps={{ min: 1, step: 0.1 }} disabled={!customEnabled} />
                  </div>
                  <TextField label="Date (Optional - leave blank for recurring)" type="date" value={customDate} onChange={(e) => setCustomDate(e.target.value)} InputLabelProps={{ shrink: true }} disabled={!customEnabled} />
                </Card>
                <FormLabel>Select SKUs for Campaign</FormLabel>
                <TextField
                  placeholder="Search by SKU Code, Brand, Model, or Description..."
                  value={promoSearch}
                  onChange={(e) => setPromoSearch(e.target.value)}
                  fullWidth
                  InputProps={{ startAdornment: <Search /> }}
                  className="mb-3"
                />
                <div className="p-3 bg-gray-50 rounded-lg mb-3">
                  <div className="font-medium mb-2">Selected SKUs:</div>
                  <div className="flex flex-wrap">
                    {Object.keys(promoSelectedSkus).length === 0 ? <span className="text-gray-500 italic">No SKUs selected</span> : Object.entries(promoSelectedSkus).map(([code, sku]) => (
                      <Chip key={code} label={`${code} - ${sku.brand} ${sku.model}`} onDelete={() => handleSkuChange('promo', code, false)} className="m-1" />
                    ))}
                  </div>
                </div>
                <div className="sku-table border rounded-lg overflow-hidden max-h-300 overflow-y-auto">
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell><Checkbox checked={Object.keys(promoSelectedSkus).length === skuData.length} onChange={(e) => handleSelectAll('promo', e.target.checked)} /></TableCell>
                        <TableCell>SKU Code</TableCell>
                        <TableCell>Brand Name</TableCell>
                        <TableCell>Model Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>MRP</TableCell>
                        <TableCell>Points @ 2%</TableCell>
                        <TableCell>Total Points</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filterSkus(promoSearch).map((sku) => (
                        <TableRow key={sku.skuCode}>
                          <TableCell><Checkbox checked={!!promoSelectedSkus[sku.skuCode]} onChange={(e) => handleSkuChange('promo', sku.skuCode, e.target.checked)} /></TableCell>
                          <TableCell>{sku.skuCode}</TableCell>
                          <TableCell>{sku.brand}</TableCell>
                          <TableCell>{sku.model}</TableCell>
                          <TableCell>{sku.description}</TableCell>
                          <TableCell>{sku.mrp}</TableCell>
                          <TableCell>{sku.points}</TableCell>
                          <TableCell>{sku.totalPoints}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-2 mt-6">
              <Button type="submit" variant="contained" color="primary">
                <i className="fas fa-save mr-2"></i> Create Campaign
              </Button>
              <Button variant="outlined" onClick={() => { /* cancel logic similar to reset */ }}>
                <i className="fas fa-times mr-2"></i> Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}