'use server';

import { qrService } from "@/server/services/qr.service";
import { GenerateQrPayload } from "@/lib/types";

export async function generateQrCodeAction(data: {
    quantity: number;
    skuCode: string;
    type: 'inner' | 'outer';
}) {
    try {
        const result = await qrService.generateQr(data as GenerateQrPayload);
        return result;
    } catch (error: any) {
        console.error("Failed to generate QR:", error);
        return { success: false, message: error.message || "Failed to generate QR" };
    }
}

export async function fetchQrHistory() {
    try {
        const result = await qrService.getQrHistory();
        return result;
    } catch (error: any) {
        console.error("Failed to fetch QR history:", error);
        return { success: false, message: error.message || "Failed to fetch QR history", data: [] };
    }
}

export async function fetchQrFileAction(batchId: number) {
    try {
        const result = await qrService.fetchQrFile(batchId);
        return result;
    } catch (error: any) {
        console.error("Failed to fetch QR file:", error);
        return { success: false, message: error.message || "Failed to fetch QR file" };
    }
}
