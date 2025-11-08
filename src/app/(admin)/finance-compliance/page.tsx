'use client';

import { useState } from 'react';
import { Box, Typography, Card, CardContent, Button, Tab, Tabs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, IconButton } from '@mui/material';
import { AccountBalance, AttachMoney, Receipt, Assignment, Download, Visibility } from '@mui/icons-material';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'credit' | 'debit';
  status: 'completed' | 'pending' | 'failed';
  reference: string;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`finance-tabpanel-${index}`}
      aria-labelledby={`finance-tab-${index}`}
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

const transactions: Transaction[] = [
  {
    id: 'TXN001',
    date: '2023-07-01',
    description: 'Points Redemption - Store #123',
    amount: 5000,
    type: 'debit',
    status: 'completed',
    reference: 'RED123456'
  },
  {
    id: 'TXN002',
    date: '2023-07-02',
    description: 'Points Issuance - Bulk Campaign',
    amount: 10000,
    type: 'credit',
    status: 'completed',
    reference: 'ISS789012'
  },
  {
    id: 'TXN003',
    date: '2023-07-03',
    description: 'Reward Fulfillment - Order #456',
    amount: 2500,
    type: 'debit',
    status: 'pending',
    reference: 'FUL345678'
  }
];

export default function FinanceCompliancePage() {
  const [tabValue, setTabValue] = useState(0);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login');
    }
  });

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Finance & Compliance
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Monitor financial transactions and compliance reports
      </Typography>

      {/* Summary Cards */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 3, mb: 3 }}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AccountBalance color="primary" />
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                Total Points Balance
              </Typography>
            </Box>
            <Typography variant="h4">
              1.2M
            </Typography>
            <Typography variant="body2" color="text.secondary">
              As of today
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <AttachMoney color="success" />
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                Point Value (INR)
              </Typography>
            </Box>
            <Typography variant="h4">
              ₹240K
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Current valuation
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Receipt color="warning" />
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                Pending Redemptions
              </Typography>
            </Box>
            <Typography variant="h4">
              156
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Worth ₹15,600
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Assignment color="error" />
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                Compliance Score
              </Typography>
            </Box>
            <Typography variant="h4">
              98%
            </Typography>
            <Typography variant="body2" color="success.main">
              Above threshold
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Transactions" />
          <Tab label="Redemption Reports" />
          <Tab label="Compliance Reports" />
        </Tabs>
      </Box>

      {/* Transactions Tab */}
      <TabPanel value={tabValue} index={0}>
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
              <Button startIcon={<Download />}>
                Export
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Transaction ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Description</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Reference</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>
                        <Typography
                          color={transaction.type === 'credit' ? 'success.main' : 'error.main'}
                        >
                          {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.type.toUpperCase()}
                          color={transaction.type === 'credit' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={transaction.status.toUpperCase()}
                          color={getStatusColor(transaction.status)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>{transaction.reference}</TableCell>
                      <TableCell>
                        <IconButton size="small">
                          <Visibility />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Redemption Reports Tab */}
      <TabPanel value={tabValue} index={1}>
        <Card>
          <CardContent>
            <Typography variant="h6">Redemption Reports</Typography>
            <Typography variant="body2" color="text.secondary">
              Coming soon...
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>

      {/* Compliance Reports Tab */}
      <TabPanel value={tabValue} index={2}>
        <Card>
          <CardContent>
            <Typography variant="h6">Compliance Reports</Typography>
            <Typography variant="body2" color="text.secondary">
              Coming soon...
            </Typography>
          </CardContent>
        </Card>
      </TabPanel>
    </Box>
  );
}