import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

interface QRStatisticsProps {
    totalGenerated: number;
    totalScanned: number;
}

const QRStatistics: React.FC<QRStatisticsProps> = ({ totalGenerated, totalScanned }) => {
    return (
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            <Card>
                <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total QR Generated
                    </Typography>
                    <Typography variant="h4" component="div">
                        {totalGenerated}
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ mt: 1 }}>
                        +12% from last month
                    </Typography>
                </CardContent>
            </Card>
            <Card>
                <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                        Total Scanned
                    </Typography>
                    <Typography variant="h4" component="div">
                        {totalScanned}
                    </Typography>
                    <Typography variant="body2" color="info.main" sx={{ mt: 1 }}>
                        0% conversion rate
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default QRStatistics;
