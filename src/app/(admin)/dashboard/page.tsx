"use client"

import { Box, Grid, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material'
import { People, HowToReg, MonetizationOn, Redeem, TrendingUp, ArrowUpward } from '@mui/icons-material'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'

export default function DashboardPage() {
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/login')
    }
  })

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Welcome back, {session?.user.name}! Here's your loyalty program overview
      </Typography>

      {/* 关键指标卡片 */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  Total Members
                </Typography>
                <People color="primary" />
              </Box>
              <Typography variant="h4" component="div" gutterBottom>
                12,847
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowUpward fontSize="small" />
                  +12.5%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  Active Members
                </Typography>
                <HowToReg color="success" />
              </Box>
              <Typography variant="h4" component="div" gutterBottom>
                8,432
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowUpward fontSize="small" />
                  +8.2%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  Total Points Issued
                </Typography>
                <MonetizationOn color="warning" />
              </Box>
              <Typography variant="h4" component="div" gutterBottom>
                2.4M
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="success.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowUpward fontSize="small" />
                  +18.7%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" color="text.secondary">
                  Points Redeemed
                </Typography>
                <Redeem color="secondary" />
              </Box>
              <Typography variant="h4" component="div" gutterBottom>
                1.8M
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Typography variant="body2" color="warning.main" sx={{ display: 'flex', alignItems: 'center' }}>
                  <ArrowUpward fontSize="small" />
                  +5.3%
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                  from last month
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 最近交易表格 */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Recent Transactions
                </Typography>
                <Button size="small">View All</Button>
              </Box>
              <TableContainer component={Paper} elevation={0}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell>Transaction ID</TableCell>
                      <TableCell>Member</TableCell>
                      <TableCell>Type</TableCell>
                      <TableCell>Points</TableCell>
                      <TableCell>Time</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row">#TXN-2847</TableCell>
                      <TableCell>John Doe</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'inline-block', px: 1, py: 0.5, borderRadius: 1, bgcolor: 'success.light', color: 'success.dark' }}>
                          Earned
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'success.main' }}>+250</TableCell>
                      <TableCell>2 mins ago</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row">#TXN-2846</TableCell>
                      <TableCell>Alice Smith</TableCell>
                      <TableCell>
                        <Box sx={{ display: 'inline-block', px: 1, py: 0.5, borderRadius: 1, bgcolor: 'warning.light', color: 'warning.dark' }}>
                          Redeemed
                        </Box>
                      </TableCell>
                      <TableCell sx={{ color: 'error.main' }}>-500</TableCell>
                      <TableCell>5 mins ago</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Quick Actions
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Button variant="contained" startIcon={<i className="fas fa-user-plus"></i>}>
                  Add New Member
                </Button>
                <Button variant="contained" color="success" startIcon={<i className="fas fa-qrcode"></i>}>
                  Generate QR Code
                </Button>
                <Button variant="contained" color="secondary" startIcon={<i className="fas fa-bullhorn"></i>}>
                  Create Campaign
                </Button>
                <Button variant="contained" color="warning" startIcon={<i className="fas fa-chart-line"></i>}>
                  View Reports
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}