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

import { fetchSkus } from '@/app/actions/sku.actions';
import { generateQrCodeAction, fetchQrHistory, fetchQrFileAction } from '@/app/actions/qr.actions';
import {
  fetchL1Action,
  fetchL2Action,
  fetchL3Action,
  fetchL4Action,
  fetchL5Action,
  fetchL6Action
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

  const [sku, setSku] = useState('');
  const [qrType, setQrType] = useState('inner');
  const [numberOfQRs, setNumberOfQRs] = useState('100');
  const [skus, setSkus] = useState<any[]>([]);
  const [filteredSkus, setFilteredSkus] = useState<any[]>([]);

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

  useEffect(() => {
    const getSkus = async () => {
      try {
        const data = await fetchSkus();
        setSkus(data);
        setFilteredSkus(data);
      } catch (error) {
        console.error('Failed to fetch SKUs', error);
      }
    };
    getSkus();

    // Fetch ALL levels initially since there is no strict mapping
    fetchL1Action().then(setL1List);
    fetchL2Action().then(setL2List);
    fetchL3Action().then(setL3List);
    fetchL4Action().then(setL4List);
    fetchL5Action().then(setL5List);
    fetchL6Action().then(setL6List);
  }, []);

  // Filter SKUs when selections change
  useEffect(() => {
    let result = skus;
    if (selectedL1) result = result.filter(s => s.l1 === selectedL1);
    if (selectedL2) result = result.filter(s => s.l2 === selectedL2);
    if (selectedL3) result = result.filter(s => s.l3 === selectedL3);
    if (selectedL4) result = result.filter(s => s.l4 === selectedL4);
    if (selectedL5) result = result.filter(s => s.l5 === selectedL5);
    if (selectedL6) result = result.filter(s => s.l6 === selectedL6);
    setFilteredSkus(result);
  }, [skus, selectedL1, selectedL2, selectedL3, selectedL4, selectedL5, selectedL6]);

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
    if (!sku || !qrType || !numberOfQRs) {
      alert('Please fill all fields');
      return;
    }

    setGenerating(true);
    try {
      const result = await generateQrCodeAction({
        skuCode: sku,
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
        setNumberOfQRs('100');
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
      {/* <Typography variant="h4" gutterBottom>
        QR Generation
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Generate and manage QR codes for your inventory
      </Typography> */}

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
                label="SKU"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                fullWidth
                size="small"
              >
                <MenuItem value="">-- Select SKU --</MenuItem>
                {filteredSkus.map((item: any) => (
                  <MenuItem key={item.skuId} value={item.skuCode}>
                    {item.skuCode}
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
                value={numberOfQRs}
                onChange={(e) => setNumberOfQRs(e.target.value)}
                fullWidth
                size="small"
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