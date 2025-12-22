import { NextResponse } from 'next/server';
import { Broker } from '@/server/rabbitMq/broker';
import { GenerateQrPayload, CustomError } from '@/lib/types';
import { customValidators } from '@/lib/utils/custom-validators';
import { skuMasterRepository, inventoryBatchRepository } from '@/server/repositories';
import { fileMiddleware } from '@/server/middlewares/file-middleware';

class QrService {
    async generateQr(req: GenerateQrPayload) {
        try {
            const payload = new GenerateQrPayload(req); // Validate using constructor
            const doesSkuExist = await skuMasterRepository.doesSkuExist(payload.skuCode);
            if (!doesSkuExist) {
                return { success: false, message: 'SKU not present', status: 404 };
            }
            const brokerObject = new Broker();
            await brokerObject.publish({
                exchange: 'qrExchange',
                binding_key: 'relaxwell',
                type: 'direct',
                payload: { payload }
            });

            return { success: true, message: 'Qr Generation In progress please check after some time' };
        } catch (error: any) {
            console.log(error);
            return {
                success: false,
                message: error.message || 'Internal Server Error',
                status: error.responseCode || 500
            };
        }
    }

    async getQrHistory(page: number = 0, limit: number = 10) {
        try {
            const result = await inventoryBatchRepository.fetchAllInventoryBatches(page, limit);
            return {
                success: true,
                data: result.batches,
                total: result.total
            };
        } catch (error: any) {
            console.log(error);
            return {
                success: false,
                message: error.message || 'Failed to fetch QR history',
                data: [],
                total: 0
            };
        }
    }

    async fetchQrFile(batchId: number) {
        try {
            const batch = await inventoryBatchRepository.fetchInventoryBatchById(batchId);
            console.log(batch);

            if (!batch || !batch.fileUrl) {
                return {
                    success: false,
                    code: 404,
                    message: "Batch not found or file URL not available."
                };
            }

            const fileUrl = batch.fileUrl;
            const filePath = await fileMiddleware.getFileSignedUrl(fileUrl, 'qrFile');
            console.log(filePath);

            if (!filePath) {
                return {
                    success: false,
                    code: 404,
                    message: "File not found."
                };
            }

            return {
                success: true,
                code: 200,
                message: "File fetched successfully.",
                fileUrl: filePath
            };
        } catch (error: any) {
            console.log(error);
            return {
                success: false,
                code: 500,
                message: error.message || 'Failed to fetch QR file'
            };
        }
    }
}

export const qrService = new QrService();
