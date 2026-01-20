'use server'

import { db } from "@/db"
import {
    users,
    retailerTransactions,
    electricianTransactions,
    counterSalesTransactions,
    redemptions,
    userTypeEntity,
    campaigns,
    redemptionStatuses
} from "@/db/schema"
import { count, sum, sql, desc, eq, and, gt, gte, lt } from "drizzle-orm"

export async function getMisAnalyticsAction() {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const ninetyDaysAgo = new Date();
        ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

        // --- 1. EXECUTIVE DASHBOARD DATA ---

        // Total Active Members
        const [memberCount] = await db.select({ value: count() }).from(users);

        // Total Points Allotted (Sum of all 3 earning tables)
        const [rSum] = await db.select({ value: sum(retailerTransactions.points) }).from(retailerTransactions);
        const [eSum] = await db.select({ value: sum(electricianTransactions.points) }).from(electricianTransactions);
        const [csSum] = await db.select({ value: sum(counterSalesTransactions.points) }).from(counterSalesTransactions);
        const totalPointsAllotted = Number(rSum?.value || 0) + Number(eSum?.value || 0) + Number(csSum?.value || 0);

        // Engagement (Recent active members - had a transaction in last 30 days)
        const activeRecentResult = await db.execute(sql`
            SELECT count(DISTINCT user_id) as count FROM (
                SELECT user_id, created_at FROM retailer_transactions
                UNION ALL
                SELECT user_id, created_at FROM electrician_transactions
                UNION ALL
                SELECT user_id, created_at FROM counter_sales_transactions
            ) as activity
            WHERE created_at >= ${thirtyDaysAgo.toISOString()}
        `);
        const activeRecentCount = Number(activeRecentResult.rows[0]?.count || 0);
        const engagementRate = memberCount.value > 0 ? (activeRecentCount / memberCount.value) * 100 : 0;

        // Redemption Rate (Redeemed / Allotted)
        const [redeemSum] = await db.select({ value: sum(redemptions.pointsRedeemed) }).from(redemptions);
        const redemptionRate = totalPointsAllotted > 0 ? (Number(redeemSum?.value || 0) / totalPointsAllotted) * 100 : 0;

        // Points Allotted Trend (Last 6 Months)
        const pointsTrendResult = await db.execute(sql`
            SELECT TO_CHAR(created_at, 'Mon') as month, TO_CHAR(created_at, 'YYYY-MM') as mf, sum(points)::numeric as total
            FROM (
                SELECT created_at, points FROM retailer_transactions
                UNION ALL
                SELECT created_at, points FROM electrician_transactions
                UNION ALL
                SELECT created_at, points FROM counter_sales_transactions
            ) as t
            GROUP BY 1, 2 ORDER BY 2 ASC LIMIT 6
        `);

        // Member Growth (New users count per month)
        const memberGrowthResult = await db.execute(sql`
            SELECT TO_CHAR(created_at, 'Mon') as month, TO_CHAR(created_at, 'YYYY-MM') as mf, count(*)::integer as count
            FROM users
            GROUP BY 1, 2 ORDER BY 2 ASC LIMIT 6
        `);

        // --- 2. PERFORMANCE METRICS ---

        // Transaction Volume (Last 7 Days)
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        const txnVolumeResult = await db.execute(sql`
            SELECT TO_CHAR(created_at, 'Dy') as day, TO_CHAR(created_at, 'YYYY-MM-DD') as df, count(*)::integer as count
            FROM (
                SELECT created_at FROM retailer_transactions
                UNION ALL
                SELECT created_at FROM electrician_transactions
                UNION ALL
                SELECT created_at FROM counter_sales_transactions
            ) as t
            WHERE created_at >= ${sevenDaysAgo.toISOString()}
            GROUP BY 1, 2 ORDER BY 2 ASC
        `);

        // Category Performance (Points per category)
        const categoryPerfResult = await db.execute(sql`
            SELECT COALESCE(category, 'General') as category, sum(points)::numeric as total
            FROM (
                SELECT category, points FROM retailer_transactions
                UNION ALL
                SELECT category, points FROM electrician_transactions
                UNION ALL
                SELECT category, points FROM counter_sales_transactions
            ) as t
            GROUP BY 1 ORDER BY 2 DESC LIMIT 5
        `);

        // --- 3. MEMBER ANALYTICS ---

        // Segmentation (By Stakeholder Type)
        const segmentationResult = await db.select({
            name: userTypeEntity.typeName,
            value: count()
        })
            .from(users)
            .leftJoin(userTypeEntity, eq(users.roleId, userTypeEntity.id))
            .groupBy(userTypeEntity.typeName);

        // Lifecycle
        const [newMembers] = await db.select({ count: count() }).from(users).where(gte(users.createdAt, sql`${thirtyDaysAgo.toISOString()}`));
        const [churnedMembers] = await db.select({ count: count() }).from(users).where(lt(users.createdAt, sql`${ninetyDaysAgo.toISOString()}`)); // Simple churn for registration logic or could check transaction history

        // Recent Activity
        const recentActivitiesResult = await db.execute(sql`
            SELECT u.id, u.name, ut.type_name as type, 
                   TO_CHAR(activity.created_at, 'YYYY-MM-DD HH24:MI') as "lastActivity", 
                   activity.points as points,
                   activity.sku as sku
            FROM (
                SELECT user_id, created_at, points, sku FROM retailer_transactions
                UNION ALL
                SELECT user_id, created_at, points, sku FROM electrician_transactions
                UNION ALL
                SELECT user_id, created_at, points, sku FROM counter_sales_transactions
            ) as activity
            JOIN users u ON activity.user_id = u.id
            JOIN user_type_entity ut ON u.role_id = ut.id
            ORDER BY activity.created_at DESC LIMIT 10
        `);
        const recentRows = recentActivitiesResult.rows as any[];

        // --- 4. CAMPAIGN ANALYTICS ---
        const activeCampaignsCount = await db.select({ count: count() }).from(campaigns).where(eq(campaigns.isActive, true));
        const [totalSpend] = await db.select({ value: sum(campaigns.spentBudget) }).from(campaigns);

        const topCampaignsList = await db.select().from(campaigns).orderBy(desc(campaigns.spentBudget)).limit(3);

        return {
            executive: {
                totalPoints: totalPointsAllotted,
                activeMembers: memberCount.value,
                engagement: Number(engagementRate.toFixed(1)),
                redemptionRate: Number(redemptionRate.toFixed(1)),
                pointsTrend: {
                    labels: pointsTrendResult.rows.map(r => r.month),
                    data: pointsTrendResult.rows.map(r => Number(r.total))
                },
                memberGrowth: {
                    labels: memberGrowthResult.rows.map(r => r.month),
                    data: memberGrowthResult.rows.map(r => Number(r.count))
                }
            },
            performance: {
                txnVolume: {
                    labels: txnVolumeResult.rows.map(r => r.day),
                    data: txnVolumeResult.rows.map(r => Number(r.count))
                },
                categoryPerf: {
                    labels: categoryPerfResult.rows.map(r => r.category),
                    data: categoryPerfResult.rows.map(r => Number(r.total) / 100000) // Scaling to Lakhs as original UI
                }
            },
            memberAnalytics: {
                segmentation: {
                    labels: segmentationResult.map(r => r.name || 'Unknown'),
                    data: segmentationResult.map(r => Number(r.value))
                },
                lifecycle: {
                    new: Number(newMembers?.count || 0),
                    active: activeRecentCount,
                    atRisk: Math.max(0, memberCount.value - activeRecentCount - Number(churnedMembers?.count || 0)),
                    churned: Number(churnedMembers?.count || 0)
                },
                recentActivity: recentRows.map((r: any) => ({
                    ...r,
                    status: 'Active' // Mapping logic simplified
                })),
                satisfaction: { average: 4.6, distribution: [45, 35, 15, 4, 1] } // Mock for now
            },
            campaignAnalytics: {
                kpis: {
                    activeCampaigns: Number(activeCampaignsCount[0]?.count || 0),
                    totalReach: '1.2L', // Placeholder
                    conversionRate: 18.5,
                    roi: 245
                },
                performanceTrend: {
                    labels: ['W1', 'W2', 'W3', 'W4'],
                    datasets: [
                        { label: 'Reach', data: [5000, 12000, 28000, 45000], borderColor: '#3b82f6', tension: 0.4 },
                        { label: 'Conversion', data: [100, 350, 980, 1850], borderColor: '#10b981', tension: 0.4 }
                    ]
                },
                channelEffectiveness: {
                    labels: ['SMS', 'WhatsApp', 'Email', 'Push Notif'],
                    data: [12, 28, 5, 8]
                },
                topCampaigns: topCampaignsList.map(c => ({
                    name: c.name,
                    type: 'Points Multiplier',
                    duration: 'Ongoing',
                    reach: '---',
                    engagement: '---',
                    conversion: '---',
                    roi: '---'
                }))
            },
            reports: {
                qrScanReport: recentRows.map((r: any) => ({
                    id: `#${r.id}`,
                    stakeholder: r.name,
                    sku: r.sku || '---',
                    geo: '---',
                    time: r.lastActivity,
                    type: 'Mono',
                    status: 'Success'
                }))
            }
        }
    } catch (error) {
        console.error("Error fetching MIS analytics:", error);
        return null;
    }
}
