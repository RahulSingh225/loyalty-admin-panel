'use client';

import React, { useState, useRef } from 'react';
import {
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Avatar,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    CircularProgress,
    Chip,
    Snackbar,
    Alert
} from '@mui/material';
import {
    CloudUpload,
    Download,
    Visibility,
    Edit,
    MoreVert,
    Add as PlusIcon
} from '@mui/icons-material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAmazonProductsAction, uploadAmazonProductsAction } from '@/actions/amazon-actions';

// --- Helper Functions ---
const calculateDiscount = (mrp: any, csp: any) => {
    const mrpNum = parseFloat(mrp);
    const cspNum = parseFloat(csp);
    if (mrpNum > 0 && cspNum > 0) {
        const discount = ((mrpNum - cspNum) / mrpNum) * 100;
        return discount.toFixed(1);
    }
    return "0";
};

export default function AmazonProductsClient() {
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [openUploadDialog, setOpenUploadDialog] = useState(false);
    const [openPreviewDialog, setOpenPreviewDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<any>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const queryClient = useQueryClient();

    // Data Fetching
    const { data: productsData, isLoading } = useQuery({
        queryKey: ['amazon-products', page, pageSize],
        queryFn: () => getAmazonProductsAction(page, pageSize),
    });

    const products = productsData?.success ? productsData.products : [];
    const pagination = productsData?.success ? productsData.pagination : { total: 0, page: 1, totalPages: 1 };

    // Mutation for Upload
    const uploadMutation = useMutation({
        mutationFn: uploadAmazonProductsAction,
        onSuccess: (data) => {
            if (data.success) {
                setSnackbarMessage(`Successfully uploaded ${data.count} products`);
                setSnackbarOpen(true);
                setOpenUploadDialog(false);
                setSelectedFile(null);
                queryClient.invalidateQueries({ queryKey: ['amazon-products'] });
            } else {
                setSnackbarMessage(`Upload failed: ${data.error}`);
                setSnackbarOpen(true);
            }
        },
        onError: (err) => {
            setSnackbarMessage('Upload failed due to an error');
            setSnackbarOpen(true);
        }
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('file', selectedFile);
        uploadMutation.mutate(formData);
    };

    const downloadTemplate = () => {
        const headers = [
            "S.No.", "Category", "Category Image Path", "Sub Category", "Sub Category Image Path",
            "ASIN(SKU)", "Product Image Path", "Product Name", "Model No.", "Product Description",
            "MRP", "Inventory Count", "CSP ON AMAZON", "Discounted Price (incl GST & delivery)",
            "Points", "Diff", "Amazon URL", "Comments / Vendor"
        ];
        const sample = [
            "1", "Electronics", "", "Phones", "", "B00EXAMPLE", "", "Sample Phone", "M123", "Desc", "10000", "10", "9000", "8500", "100", "500", "", "Vendor A"
        ];
        const csvContent = [headers.join(','), sample.join(',')].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'amazon_products_template.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" fontWeight="bold">Amazon Marketplace Products</Typography>
                <Box display="flex" gap={2}>
                    <Button
                        variant="outlined"
                        startIcon={<Download />}
                        onClick={downloadTemplate}
                    >
                        Template
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CloudUpload />}
                        onClick={() => setOpenUploadDialog(true)}
                    >
                        Upload CSV
                    </Button>
                </Box>
            </Box>

            {/* PRODUCT TABLE */}
            <Card className="widget-card">
                <CardContent>
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Image</TableCell>
                                    <TableCell>ASIN/SKU</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Model</TableCell>
                                    <TableCell>MRP</TableCell>
                                    <TableCell>CSP</TableCell>
                                    <TableCell>Points</TableCell>
                                    <TableCell>Inventory</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                                            <CircularProgress />
                                        </TableCell>
                                    </TableRow>
                                ) : products.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={9} align="center" sx={{ py: 3 }}>
                                            <Typography color="text.secondary">No products found</Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    products.map((p: any) => (
                                        <TableRow key={p.id} hover>
                                            <TableCell>
                                                <Avatar
                                                    src={p.image}
                                                    variant="rounded"
                                                    sx={{ width: 40, height: 40 }}
                                                />
                                            </TableCell>
                                            <TableCell>{p.asin_sku}</TableCell>
                                            <TableCell>
                                                <Tooltip title={p.name}>
                                                    <Typography variant="body2" sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                                        {p.name}
                                                    </Typography>
                                                </Tooltip>
                                            </TableCell>
                                            <TableCell>{p.model_no}</TableCell>
                                            <TableCell>₹{p.mrp}</TableCell>
                                            <TableCell>₹{p.csp_price}</TableCell>
                                            <TableCell>{p.points}</TableCell>
                                            <TableCell>{p.inventory}</TableCell>
                                            <TableCell>
                                                <IconButton size="small" onClick={() => { setSelectedProduct(p); setOpenPreviewDialog(true); }}>
                                                    <Visibility fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {/* Simple Pagination Control can be added here if needed */}
                </CardContent>
            </Card>

            {/* UPLOAD DIALOG */}
            <Dialog open={openUploadDialog} onClose={() => setOpenUploadDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Upload Products CSV</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, p: 3, border: '2px dashed #ccc', borderRadius: 2, textAlign: 'center', cursor: 'pointer' }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            accept=".csv"
                            hidden
                            ref={fileInputRef}
                            onChange={handleFileChange}
                        />
                        <CloudUpload sx={{ fontSize: 40, color: 'text.secondary', mb: 1 }} />
                        <Typography>
                            {selectedFile ? selectedFile.name : "Click to select CSV file"}
                        </Typography>
                    </Box>
                    {uploadMutation.isPending && (
                        <Box mt={2} textAlign="center">
                            <CircularProgress size={24} />
                            <Typography variant="caption" display="block">Uploading...</Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenUploadDialog(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        disabled={!selectedFile || uploadMutation.isPending}
                        onClick={handleUpload}
                    >
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>

            {/* PREVIEW DIALOG */}
            <Dialog open={openPreviewDialog} onClose={() => setOpenPreviewDialog(false)} maxWidth="md" fullWidth>
                {selectedProduct && (
                    <>
                        <DialogTitle>Product Details</DialogTitle>
                        <DialogContent dividers>
                            <Box display="flex" gap={3} flexDirection={{ xs: 'column', md: 'row' }}>
                                <Box>
                                    <img
                                        src={selectedProduct.image}
                                        alt={selectedProduct.name}
                                        style={{ width: 200, height: 200, objectFit: 'contain', borderRadius: 8 }}
                                    />
                                </Box>
                                <Box flex={1}>
                                    <Typography variant="h6">{selectedProduct.name}</Typography>
                                    <Typography color="text.secondary" gutterBottom>Model: {selectedProduct.model_no}</Typography>
                                    <Chip label={selectedProduct.category} size="small" sx={{ mr: 1 }} />
                                    <Chip label={selectedProduct.sub_category} size="small" variant="outlined" />

                                    <Grid container spacing={2} sx={{ mt: 2 }}>
                                        <Grid size={{ xs: 4 }} >
                                            <Typography variant="caption" color="text.secondary">MRP</Typography>
                                            <Typography variant="subtitle1" color="error">₹{selectedProduct.mrp}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 4 }} >
                                            <Typography variant="caption" color="text.secondary">CSP</Typography>
                                            <Typography variant="subtitle1" color="success">₹{selectedProduct.csp_price}</Typography>
                                        </Grid>
                                        <Grid size={{ xs: 4 }} >
                                            <Typography variant="caption" color="text.secondary">Points</Typography>
                                            <Typography variant="subtitle1">{selectedProduct.points}</Typography>
                                        </Grid>
                                    </Grid>

                                    <Typography variant="subtitle2" sx={{ mt: 2 }}>Description</Typography>
                                    <Typography variant="body2" sx={{ bgcolor: '#f5f5f5', p: 1, borderRadius: 1, maxHeight: 150, overflow: 'auto' }}>
                                        {selectedProduct.description}
                                    </Typography>

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        sx={{ mt: 2 }}
                                        href={selectedProduct.url}
                                        target="_blank"
                                    >
                                        View on Amazon
                                    </Button>
                                </Box>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setOpenPreviewDialog(false)}>Close</Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={4000}
                onClose={() => setSnackbarOpen(false)}
            >
                <Alert onClose={() => setSnackbarOpen(false)} severity="info">
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}
