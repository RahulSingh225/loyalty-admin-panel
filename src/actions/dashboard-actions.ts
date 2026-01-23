'use server'

import { db } from "@/db"
import {
    users,
    counterSalesTransactionLogs,
    retailerTransactions,
    electricianTransactionLogs,
    counterSales,
    approvalStatuses,
    redemptions,
    userAmazonOrders,
    redemptionApprovals,
    physicalRewardsRedemptions
} from "@/db/schema"
import { count, sum, sql, desc, eq, and, gte, lte } from "drizzle-orm"

export async function getDashboardDataAction(dateRange?: { from: string, to: string }) {
    // 1. Total Members
    const [userCount] = await db.select({ count: count() }).from(users);

    // 2. Active Members (not suspended)
    const [activeUserCount] = await db.select({ count: count() })
        .from(users)
        .where(eq(users.isSuspended, false));

    // 3. Blocked Members
    const [blockedUserCount] = await db.select({ count: count() })
        .from(users)
        .where(eq(users.isSuspended, true));

    // 4. Total Points Issued (Sum from all 3 transaction logs)
    const [csPoints] = await db.select({ value: sum(counterSalesTransactionLogs.points) }).from(counterSalesTransactionLogs);
    const [retPoints] = await db.select({ value: sum(retailerTransactions.points) }).from(retailerTransactions);
    const [elecPoints] = await db.select({ value: sum(electricianTransactionLogs.points) }).from(electricianTransactionLogs);

    const totalPointsIssued = (Number(csPoints?.value) || 0) + (Number(retPoints?.value) || 0) + (Number(elecPoints?.value) || 0);

    // 5. Points Redeemed
    const [physRedeem] = await db.select({ value: sum(physicalRewardsRedemptions.pointsDeducted) }).from(physicalRewardsRedemptions);
    const [amzRedeem] = await db.select({ value: sum(userAmazonOrders.pointsDeducted) }).from(userAmazonOrders);
    const totalRedeemed = (Number(physRedeem?.value) || 0) + (Number(amzRedeem?.value) || 0);

    // 6. Total Scans (Sum of rows from all 3 transaction tables that represent activity)
    const [csCount] = await db.select({ count: count() }).from(counterSales);
    const [retCount] = await db.select({ count: count() }).from(retailerTransactions);
    const [elecCount] = await db.select({ count: count() }).from(electricianTransactionLogs);
    const totalScans = (csCount?.count || 0) + (retCount?.count || 0) + (elecCount?.count || 0);

    // 7. KYC Status
    const kycStats = await db.select({
        status: approvalStatuses.name,
        count: count()
    })
        .from(users)
        .leftJoin(approvalStatuses, eq(users.approvalStatusId, approvalStatuses.id))
        .groupBy(approvalStatuses.name);

    const kycApproved = kycStats.find(s => s.status === 'Approved')?.count || 0;
    const kycPending = kycStats.find(s => s.status === 'Pending')?.count || 0;

    // 8. Pending Approvals
    const [pendingApprovals] = await db.select({ count: count() })
        .from(redemptionApprovals)
        .where(eq(redemptionApprovals.approvalStatus, 'PENDING'));


    // 9. Recent Transactions
    const csRecent = await db.select({
        id: counterSalesTransactionLogs.id,
        userId: counterSalesTransactionLogs.userId,
        points: counterSalesTransactionLogs.points,
        createdAt: counterSalesTransactionLogs.createdAt,
        type: sql<string>`'Counter Sale'`,
        user: users.name
    })
        .from(counterSalesTransactionLogs)
        .leftJoin(users, eq(counterSalesTransactionLogs.userId, users.id))
        .orderBy(desc(counterSalesTransactionLogs.createdAt))
        .limit(5);

    const retRecent = await db.select({
        id: retailerTransactions.id,
        userId: retailerTransactions.userId,
        points: retailerTransactions.points,
        createdAt: retailerTransactions.createdAt,
        type: sql<string>`'Retailer'`,
        user: users.name
    })
        .from(retailerTransactions)
        .leftJoin(users, eq(retailerTransactions.userId, users.id))
        .orderBy(desc(retailerTransactions.createdAt))
        .limit(5);

    const elecRecent = await db.select({
        id: electricianTransactionLogs.id,
        userId: electricianTransactionLogs.userId,
        points: electricianTransactionLogs.points,
        createdAt: electricianTransactionLogs.createdAt,
        type: sql<string>`'Electrician'`,
        user: users.name
    })
        .from(electricianTransactionLogs)
        .leftJoin(users, eq(electricianTransactionLogs.userId, users.id))
        .orderBy(desc(electricianTransactionLogs.createdAt))
        .limit(5);

    const allRecent = [...csRecent, ...retRecent, ...elecRecent]
        .sort((a, b) => new Date(b.createdAt as string).getTime() - new Date(a.createdAt as string).getTime())
        .slice(0, 5)
        .map(t => ({
            id: `#TXN-${t.id}`,
            member: t.user || 'Unknown',
            type: t.type,
            points: Number(t.points) > 0 ? `+${t.points}` : `${t.points}`,
            time: new Date(t.createdAt as string).toLocaleDateString(),
            typeClass: 'badge-success',
            ptClass: 'text-green-600'
        }));


    // 10. Top Performers
    const topPerformersData = await db.select({
        name: users.name,
        points: sum(counterSalesTransactionLogs.points)
    })
        .from(counterSalesTransactionLogs)
        .leftJoin(users, eq(counterSalesTransactionLogs.userId, users.id))
        .groupBy(users.id, users.name)
        .orderBy(desc(sum(counterSalesTransactionLogs.points)))
        .limit(5);

    const topPerformers = topPerformersData.map((p, i) => ({
        name: p.name || 'Unknown',
        pts: `${p.points} points`,
        change: '+0%',
        rank: i + 1,
        initial: (p.name || 'U').charAt(0),
        bg: ['bg-yellow-100', 'bg-gray-100', 'bg-orange-100'][i] || 'bg-blue-100',
        text: ['text-yellow-800', 'text-gray-800', 'text-orange-800'][i] || 'text-blue-800'
    }));

    return {
        stats: {
            totalMembers: userCount.count,
            activeMembers: activeUserCount.count,
            blockedMembers: blockedUserCount.count,
            totalPointsIssued: totalPointsIssued,
            pointsRedeemed: totalRedeemed,
            totalScans: totalScans,
            kycApproved: kycApproved,
            kycPending: kycPending
        },
        recentActivity: allRecent,
        topPerformers: topPerformers,
        pendingApprovalsCount: pendingApprovals.count,
        charts: {
            memberGrowth: [10, 15, 8, 12, 20, 18, 25],
            pointsEarned: [5000, 7000, 4500, 8000, 6000, 9500, 8000],
            pointsRedeemed: [2000, 3000, 1500, 4000, 2500, 5000, 3000]
        }
    }
}
