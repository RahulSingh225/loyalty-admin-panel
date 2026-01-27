'use server';

import { db } from '@/db';
import {
    users,
    retailerTransactionLogs,
    redemptions,
    referrals,
    kycDocuments,
    counterSalesTransactions,
    userTypeEntity,
    redemptionChannels,
    redemptionStatuses
} from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';

export interface ReportColumn {
    key: string;
    label: string;
    type?: 'date' | 'number' | 'currency' | 'status' | 'text';
}

export interface ReportData {
    columns: ReportColumn[];
    rows: any[];
}

export async function getReportDataAction(category: string, filters: any = {}): Promise<ReportData> {
    try {
        switch (category) {
            case 'registration':
                return await getRegistrationReport(filters);
            case 'qr-scans':
                return await getQrScanReport(filters);
            case 'redemptions':
                return await getRedemptionReport(filters);
            case 'referrals':
                return await getReferralReport(filters);
            case 'gamification':
                return await getGamificationReport(filters); // Placeholder for now
            case 'compliance':
                return await getComplianceReport(filters);
            case 'stakeholder':
                return await getStakeholderReport(filters);
            case 'sales':
                return await getSalesReport(filters);
            case 'bank':
                return await getBankReport(filters);
            default:
                return { columns: [], rows: [] };
        }
    } catch (error) {
        console.error(`Error fetching report for ${category}:`, error);
        return { columns: [], rows: [] };
    }
}

async function getRegistrationReport(filters: any): Promise<ReportData> {
    const data = await db.select({
        id: users.id,
        name: users.name,
        phone: users.phone,
        email: users.email,
        createdAt: users.createdAt,
        isSuspended: users.isSuspended
    })
        .from(users)
        .limit(50)
        .orderBy(desc(users.createdAt));

    return {
        columns: [
            { key: 'id', label: 'User ID', type: 'text' },
            { key: 'name', label: 'Name', type: 'text' },
            { key: 'phone', label: 'Phone', type: 'text' },
            { key: 'email', label: 'Email', type: 'text' },
            { key: 'createdAt', label: 'Registered On', type: 'date' },
            { key: 'status', label: 'Status', type: 'status' }
        ],
        rows: data.map(r => ({
            ...r,
            status: !r.isSuspended ? 'Active' : 'Suspended'
        }))
    };
}

async function getQrScanReport(filters: any): Promise<ReportData> {
    const data = await db.select({
        id: retailerTransactionLogs.id,
        sku: retailerTransactionLogs.sku,
        qrCode: retailerTransactionLogs.qrCode,
        status: retailerTransactionLogs.status,
        createdAt: retailerTransactionLogs.createdAt,
        points: retailerTransactionLogs.points,
        userId: retailerTransactionLogs.userId
    })
        .from(retailerTransactionLogs)
        .limit(50)
        .orderBy(desc(retailerTransactionLogs.createdAt));

    return {
        columns: [
            { key: 'id', label: 'Txn ID', type: 'text' },
            { key: 'qrCode', label: 'QR Code', type: 'text' },
            { key: 'sku', label: 'SKU', type: 'text' },
            { key: 'points', label: 'Points', type: 'number' },
            { key: 'createdAt', label: 'Scan Time', type: 'date' },
            { key: 'status', label: 'Status', type: 'status' }
        ],
        rows: data
    };
}

async function getRedemptionReport(filters: any): Promise<ReportData> {
    const data = await db.select({
        id: redemptions.redemptionId,
        points: redemptions.pointsRedeemed,
        amount: redemptions.amount,
        status: redemptionStatuses.name,
        createdAt: redemptions.createdAt,
        channel: redemptionChannels.name
    })
        .from(redemptions)
        .leftJoin(redemptionStatuses, eq(redemptions.status, redemptionStatuses.id))
        .leftJoin(redemptionChannels, eq(redemptions.channelId, redemptionChannels.id))
        .limit(50)
        .orderBy(desc(redemptions.createdAt));

    return {
        columns: [
            { key: 'id', label: 'Redemption ID', type: 'text' },
            { key: 'channel', label: 'Channel', type: 'text' },
            { key: 'points', label: 'Points Redeemed', type: 'number' },
            { key: 'amount', label: 'Amount (₹)', type: 'currency' },
            { key: 'createdAt', label: 'Date', type: 'date' },
            { key: 'status', label: 'Status', type: 'status' }
        ],
        rows: data
    };
}

async function getReferralReport(filters: any): Promise<ReportData> {
    const data = await db.select({
        id: referrals.id,
        status: referrals.status,
        bonus: referrals.bonusAwarded,
        createdAt: referrals.createdAt
    })
        .from(referrals)
        .limit(50)
        .orderBy(desc(referrals.createdAt));

    return {
        columns: [
            { key: 'id', label: 'Ref ID', type: 'text' },
            { key: 'status', label: 'Status', type: 'status' },
            { key: 'bonus', label: 'Bonus Awarded', type: 'number' },
            { key: 'createdAt', label: 'Date', type: 'date' }
        ],
        rows: data
    };
}

async function getGamificationReport(filters: any): Promise<ReportData> {
    return {
        columns: [
            { key: 'campaign', label: 'Campaign', type: 'text' },
            { key: 'user', label: 'User', type: 'text' },
            { key: 'achievement', label: 'Achievement', type: 'text' },
            { key: 'date', label: 'Date', type: 'date' }
        ],
        rows: []
    };
}

async function getComplianceReport(filters: any): Promise<ReportData> {
    const data = await db.select({
        id: kycDocuments.id,
        type: kycDocuments.documentType,
        status: kycDocuments.verificationStatus,
        reason: kycDocuments.rejectionReason,
        uploadedAt: kycDocuments.createdAt
    })
        .from(kycDocuments)
        .limit(50)
        .orderBy(desc(kycDocuments.createdAt));

    return {
        columns: [
            { key: 'id', label: 'Doc ID', type: 'text' },
            { key: 'type', label: 'Document Type', type: 'text' },
            { key: 'status', label: 'Verification Status', type: 'status' },
            { key: 'reason', label: 'Rejection Reason', type: 'text' },
            { key: 'uploadedAt', label: 'Uploaded Date', type: 'date' }
        ],
        rows: data
    };
}

async function getStakeholderReport(filters: any): Promise<ReportData> {
    const data = await db.select({
        id: userTypeEntity.id,
        type: userTypeEntity.typeName,
        active: userTypeEntity.isActive,
        kycLevel: userTypeEntity.requiredKycLevel
    })
        .from(userTypeEntity);

    return {
        columns: [
            { key: 'type', label: 'Stakeholder Type', type: 'text' },
            { key: 'kycLevel', label: 'Req. KYC', type: 'text' },
            { key: 'active', label: 'Status', type: 'status' }
        ],
        rows: data.map(r => ({ ...r, active: r.active ? 'Active' : 'Inactive' }))
    };
}

async function getSalesReport(filters: any): Promise<ReportData> {
    const data = await db.select({
        id: counterSalesTransactions.id,
        sku: counterSalesTransactions.sku,
        points: counterSalesTransactions.points,
        status: sql<string>`'Completed'`,
        date: counterSalesTransactions.createdAt,
    })
        .from(counterSalesTransactions)
        .limit(50)
        .orderBy(desc(counterSalesTransactions.createdAt));

    return {
        columns: [
            { key: 'id', label: 'Sale ID', type: 'text' },
            { key: 'sku', label: 'Product SKU', type: 'text' },
            { key: 'points', label: 'Points Earned', type: 'number' },
            { key: 'date', label: 'Date', type: 'date' },
            { key: 'status', label: 'Status', type: 'status' }
        ],
        rows: data
    };
}

async function getBankReport(filters: any): Promise<ReportData> {
    const data = await db.select({
        id: users.id,
        name: users.name,
    })
        .from(users)
        .limit(10);

    return {
        columns: [
            { key: 'id', label: 'User ID', type: 'text' },
            { key: 'name', label: 'Account Holder', type: 'text' },
            { key: 'bank', label: 'Bank Name', type: 'text' },
            { key: 'ifsc', label: 'IFSC', type: 'text' },
            { key: 'status', label: 'Verification', type: 'status' }
        ],
        rows: []
    };
}
