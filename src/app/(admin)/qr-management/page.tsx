'use client';

import { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, TextField, FormControl, InputLabel, Select, MenuItem, Grid, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { QrCode2, FileDownload, Print } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface QRCode {
  id: string;
  type: string;
  batch: string;
  status: string;
  createdAt: string;
  expiry: string;
  points: number;
}

const qrCodeData: QRCode[] = [
  {
    id: 'QR001',
    type: 'Product',
    batch: 'B2023-001',
    status: 'active',
    createdAt: '2023-06-01',
    expiry: '2023-12-31',
    points: 100
  },
  {
    id: 'QR002',
    type: 'Event',
    batch: 'B2023-002',
    status: 'expired',
    createdAt: '2023-05-15',
    expiry: '2023-05-30',
    points: 250
  },
  {
    id: 'QR003',
    type: 'Promotional',
    batch: 'B2023-003',
    status: 'pending',
    createdAt: '2023-07-01',
    expiry: '2023-09-30',
    points: 500
  }
];

export default function QRManagementPage() {
  const [selectedType, setSelectedType] = useState('');
  const [batchSize, setBatchSize] = useState('');
  const [points, setPoints] = useState('');
  
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    }
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const handleGenerateQR = () => {
    // Implement QR generation logic
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        QR Code Management
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Generate and manage QR codes for your loyalty program
      </Typography>

      <Grid container spacing={3}>
        {/* QR Generation Form */}
        <Grid item component="div" xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Generate New QR Codes
              </Typography>
              <Box component="form" sx={{ mt: 2 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>QR Code Type</InputLabel>
                  <Select
                    value={selectedType}
                    label="QR Code Type"
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    <MenuItem value="product">Product QR</MenuItem>
                    <MenuItem value="event">Event QR</MenuItem>
                    <MenuItem value="promotional">Promotional QR</MenuItem>
                  </Select>
                </FormControl>

                <TextField
                  fullWidth
                  label="Batch Size"
                  type="number"
                  value={batchSize}
                  onChange={(e) => setBatchSize(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <TextField
                  fullWidth
                  label="Points Value"
                  type="number"
                  value={points}
                  onChange={(e) => setPoints(e.target.value)}
                  sx={{ mb: 2 }}
                />

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<QrCode2 />}
                  onClick={handleGenerateQR}
                >
                  Generate QR Codes
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* QR Codes List */}
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">
                  Recent QR Codes
                </Typography>
                <Box>
                  <Button startIcon={<FileDownload />} sx={{ mr: 1 }}>
                    Export
                  </Button>
                  <Button startIcon={<Print />}>
                    Print
                  </Button>
                </Box>
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>QR Code</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Batch</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell>Expiry</TableCell>
                      <TableCell>Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {qrCodeData.map((qr) => (
                      <TableRow key={qr.id}>
                        <TableCell>{qr.id}</TableCell>
                        <TableCell>{qr.type}</TableCell>
                        <TableCell>{qr.batch}</TableCell>
                        <TableCell>
                          <Chip
                            label={qr.status.toUpperCase()}
                            color={
                              qr.status === 'active' ? 'success' :
                              qr.status === 'expired' ? 'error' : 'warning'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell>{qr.createdAt}</TableCell>
                        <TableCell>{qr.expiry}</TableCell>
                        <TableCell>{qr.points}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}