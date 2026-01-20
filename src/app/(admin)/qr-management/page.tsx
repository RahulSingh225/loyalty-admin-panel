
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
  TablePagination
} from '@mui/material';

// Removed fetchSkus as we now use fetchVariantsAction
import { generateQrCodeAction, fetchQrHistory, fetchQrFileAction } from '@/app/actions/qr.actions';
import {
  fetchL1Action,
  fetchL2Action,
  fetchL3Action,
  fetchL4Action,
  fetchL5Action,
  fetchL6Action,
  fetchVariantsAction
} from '@/app/actions/sku-level.actions';

interface QRBatch {
  batchId: string;
  skuCode: string;
  quantity: number;
  generatedDate: string;
  status: 'Active' | 'Inactive';
}

export default function QRGeneration() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    }
  });

  const [sku, setSku] = useState(''); // This will store the variant name
  const [qrType, setQrType] = useState('inner');
  const [numberOfQRs, setNumberOfQRs] = useState('');

  // New state for variants
  const [variants, setVariants] = useState<any[]>([]);

  // Level State
  const [l1List, setL1List] = useState<any[]>([]);
  const [l2List, setL2List] = useState<any[]>([]);
  const [l3List, setL3List] = useState<any[]>([]);
  const [l4List, setL4List] = useState<any[]>([]);
  const [l5List, setL5List] = useState<any[]>([]);
  const [l6List, setL6List] = useState<any[]>([]);

  const [selectedL1, setSelectedL1] = useState<number | ''>('');
  const [selectedL2, setSelectedL2] = useState<number | ''>('');
  const [selectedL3, setSelectedL3] = useState<number | ''>('');
  const [selectedL4, setSelectedL4] = useState<number | ''>('');
  const [selectedL5, setSelectedL5] = useState<number | ''>('');
  const [selectedL6, setSelectedL6] = useState<number | ''>('');

  // Fetch L1 on mount
  useEffect(() => {
    fetchL1Action().then(setL1List);
  }, []);

  // Fetch L2 when L1 changes
  useEffect(() => {
    if (selectedL1) {
      fetchL2Action(selectedL1).then(setL2List);
    } else {
      setL2List([]);
    }
    // Reset child selections
    setSelectedL2('');
    setSelectedL3('');
    setSelectedL4('');
    setSelectedL5('');
    setSelectedL6('');
    setL3List([]);
    setL4List([]);
    setL5List([]);
    setL6List([]);
    setVariants([]);
    setSku('');
  }, [selectedL1]);

  // Fetch L3 when L1 or L2 changes
  useEffect(() => {
    if (selectedL2) {
      fetchL3Action(selectedL1 || undefined, selectedL2).then(setL3List);
    } else {
      setL3List([]);
    }
    // Reset child selections
    setSelectedL3('');
    setSelectedL4('');
    setSelectedL5('');
    setSelectedL6('');
    setL4List([]);
    setL5List([]);
    setL6List([]);
    setVariants([]);
    setSku('');
  }, [selectedL1, selectedL2]);

  // Fetch L4 when L1, L2, or L3 changes
  useEffect(() => {
    if (selectedL3) {
      fetchL4Action(selectedL1 || undefined, selectedL2 || undefined, selectedL3).then(setL4List);
    } else {
      setL4List([]);
    }
    // Reset child selections
    setSelectedL4('');
    setSelectedL5('');
    setSelectedL6('');
    setL5List([]);
    setL6List([]);
    setVariants([]);
    setSku('');
  }, [selectedL1, selectedL2, selectedL3]);

  // Fetch L5 when L1, L2, L3, or L4 changes
  useEffect(() => {
    if (selectedL4) {
      fetchL5Action(
        selectedL1 || undefined,
        selectedL2 || undefined,
        selectedL3 || undefined,
        selectedL4
      ).then(setL5List);
    } else {
      setL5List([]);
    }
    // Reset child selections
    setSelectedL5('');
    setSelectedL6('');
    setL6List([]);
    setVariants([]);
    setSku('');
  }, [selectedL1, selectedL2, selectedL3, selectedL4]);

  // Fetch L6 when L1, L2, L3, L4, or L5 changes
  useEffect(() => {
    if (selectedL5) {
      fetchL6Action(
        selectedL1 || undefined,
        selectedL2 || undefined,
        selectedL3 || undefined,
        selectedL4 || undefined,
        selectedL5
      ).then(setL6List);
    } else {
      setL6List([]);
    }
    // Reset child selection
    setSelectedL6('');
    setVariants([]);
    setSku('');
  }, [selectedL1, selectedL2, selectedL3, selectedL4, selectedL5]);

  // Fetch Variants when L6 changes
  useEffect(() => {
    if (selectedL6) {
      fetchVariantsAction(selectedL6).then(setVariants);
    } else {
      setVariants([]);
    }
    setSku('');
  }, [selectedL6]);


  const [batches, setBatches] = useState<any[]>([]);
  const [loadingBatches, setLoadingBatches] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  const loadQrBatches = async () => {
    setLoadingBatches(true);
    try {
      const result = await fetchQrHistory(page, rowsPerPage);
      if (result.success) {
        setBatches(result.data || []); // Ensure data is an array
        setTotalCount(result.total || 0);
      } else {
        console.error('Failed to load batches:', result.message);
      }
    } catch (error) {
      console.error('Error loading batches:', error);
    } finally {
      setLoadingBatches(false);
    }
  };

  useEffect(() => {
    loadQrBatches();
  }, [page, rowsPerPage]);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    // sku here is the variant name (string)
    if (!sku || !qrType || !numberOfQRs) {
      alert('Please fill all fields');
      return;
    }

    const quantity = parseInt(numberOfQRs, 10);
    if (isNaN(quantity) || quantity < 1 || quantity > 10000) {
      alert('Quantity must be between 1 and 10000');
      return;
    }

    setGenerating(true);
    try {
      const result = await generateQrCodeAction({
        skuCode: sku, // Passing variant name as skuCode
        type: qrType as 'inner' | 'outer',
        quantity: parseInt(numberOfQRs, 10),
      });

      if (result.success) {
        alert(result.message);
        // Refresh batches after successful generation
        await loadQrBatches();
        // Reset form
        setSku('');
        setQrType('inner');
        setNumberOfQRs('');
      } else {
        alert('Error: ' + result.message);
      }
    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred');
    } finally {
      setGenerating(false);
    }
  };

  const handleDownload = async (batchId: number) => {
    try {
      const result = await fetchQrFileAction(batchId);
      if (result.success && 'fileUrl' in result && result.fileUrl) {
        // Open the signed URL in a new tab
        window.open(result.fileUrl, '_blank');
      } else {
        alert('Error: ' + (result.message || 'Failed to download file'));
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download file');
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      <Box sx={{ display: 'grid', gap: 3, marginTop: 3 }}>
        {/* Generate QR Codes Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Generate QR Codes
            </Typography>

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3, mt: 2 }}>
              {/* L1 - L6 Filters */}
              <TextField select label="L1 Level" value={selectedL1} onChange={(e) => setSelectedL1(Number(e.target.value) || '')} fullWidth size="small">
                <MenuItem value="">-- Select L1 --</MenuItem>
                {l1List.map((item: any) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
              </TextField>
              <TextField select label="L2 Level" value={selectedL2} onChange={(e) => setSelectedL2(Number(e.target.value) || '')} fullWidth size="small">
                <MenuItem value="">-- Select L2 --</MenuItem>
                {l2List.map((item: any) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
              </TextField>
              <TextField select label="L3 Level" value={selectedL3} onChange={(e) => setSelectedL3(Number(e.target.value) || '')} fullWidth size="small">
                <MenuItem value="">-- Select L3 --</MenuItem>
                {l3List.map((item: any) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
              </TextField>
              <TextField select label="L4 Level" value={selectedL4} onChange={(e) => setSelectedL4(Number(e.target.value) || '')} fullWidth size="small">
                <MenuItem value="">-- Select L4 --</MenuItem>
                {l4List.map((item: any) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
              </TextField>
              <TextField select label="L5 Level" value={selectedL5} onChange={(e) => setSelectedL5(Number(e.target.value) || '')} fullWidth size="small">
                <MenuItem value="">-- Select L5 --</MenuItem>
                {l5List.map((item: any) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
              </TextField>
              <TextField select label="L6 Level" value={selectedL6} onChange={(e) => setSelectedL6(Number(e.target.value) || '')} fullWidth size="small">
                <MenuItem value="">-- Select L6 --</MenuItem>
                {l6List.map((item: any) => <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>)}
              </TextField>

              <TextField
                select
                label="SKU Variant"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                fullWidth
                size="small"
                disabled={!selectedL6 || variants.length === 0}
              >
                <MenuItem value="">-- Select Variant --</MenuItem>
                {variants.map((item: any) => (
                  <MenuItem key={item.id} value={item.name}>
                    {item.name} {item.packSize ? `(${item.packSize})` : ''}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                select
                label="QR Type"
                value={qrType}
                onChange={(e) => setQrType(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value="">-- Select Type --</MenuItem>
                <MenuItem value="inner">Inner</MenuItem>
                <MenuItem value="outer">Outer</MenuItem>
              </TextField>

              <TextField
                type="number"
                label="Quantity"
                placeholder="ENTER QUANTITY"
                value={numberOfQRs}
                onChange={(e) => {
                  const value = e.target.value;
                  // Allow empty or valid number within range
                  if (value === '' || (parseInt(value) >= 1 && parseInt(value) <= 10000)) {
                    setNumberOfQRs(value);
                  }
                }}
                fullWidth
                size="small"
                inputProps={{
                  min: 1,
                  max: 10000
                }}
              />
            </Box>

            <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 3 }}>
              <Button variant="outlined" color="inherit">
                Cancel
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={handleGenerate}
                disabled={generating}
              >
                {generating ? 'Generating...' : 'Generate QR Codes'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* QR Batches Section */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              QR Batches
            </Typography>

            <TableContainer sx={{ mt: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Batch ID</TableCell>
                    <TableCell>SKU Code</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Created Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Download</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {loadingBatches ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        Loading batches...
                      </TableCell>
                    </TableRow>
                  ) : batches.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center">
                        No batches found
                      </TableCell>
                    </TableRow>
                  ) : (
                    batches.map((batch) => (
                      <TableRow key={batch.batchId} hover>
                        <TableCell>{batch.batchId}</TableCell>
                        <TableCell>{batch.skuCode}</TableCell>
                        <TableCell sx={{ textTransform: 'capitalize' }}>{batch.type}</TableCell>
                        <TableCell sx={{ color: 'primary.main', fontWeight: 'medium' }}>
                          {batch.quantity}
                        </TableCell>
                        <TableCell>
                          {batch.createdAt ? new Date(batch.createdAt).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={batch.isActive ? 'Active' : 'Inactive'}
                            size="small"
                            sx={{
                              bgcolor: batch.isActive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)',
                              color: batch.isActive ? 'success.main' : 'error.main',
                              fontWeight: 'medium'
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          {batch.fileUrl ? (
                            <Button
                              color="primary"
                              size="small"
                              onClick={() => handleDownload(batch.batchId)}
                            >
                              Download
                            </Button>
                          ) : (
                            <Typography variant="caption" color="text.secondary">
                              Processing...
                            </Typography>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}