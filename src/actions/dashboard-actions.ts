'use server'

import { db } from "@/db"
import { users, counterSalesTransactionLogs, retailers } from "@/db/schema"
import { count, sum } from "drizzle-orm"

export async function getDashboardDataAction() {
    // 1. Total Users
    const [userCount] = await db.select({ count: count() }).from(users);

    // 2. Total Revenue (Earnings) - Proxy via Retailer Earnings or similar
    // Note: In real app, this might come from a dedicated 'transactions' table or similar.
    // Using retailers.totalEarnings sum as a proxy for "Revenue" or "Total Distributed"
    const [totalEarnings] = await db.select({ value: sum(retailers.totalEarnings) }).from(retailers);

    // 3. Points Distributed
    const [totalPoints] = await db.select({ value: sum(counterSalesTransactionLogs.points) }).from(counterSalesTransactionLogs);


    return {
        stats: {
            totalRevenue: Number(totalEarnings?.value || 12345678),
            activeMembers: userCount.count,
            totalScans: 45230, // Mock for now, would be count(counterSalesTransactionLogs)
            pendingRedemptions: 125, // Mock
        },
        revenueTrend: {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            data: [35000, 38000, 42000, 40000, 43500, 45230]
        },
        recentActivity: [
            { id: 1, user: 'Rahul Sharma', action: 'Scanned QR Code', time: '2 mins ago', points: '+50' },
            { id: 2, user: 'Amit Patel', action: 'Redeemed Points', time: '15 mins ago', points: '-200' },
            { id: 3, user: 'Priya Singh', action: 'Updated Profile', time: '1 hour ago', points: '0' },
            { id: 4, user: 'Vikram Malhotra', action: 'Registered', time: '2 hours ago', points: '0' },
        ],
        topPerformers: [
            { name: 'Rahul Sharma', points: '12,500', role: 'Electrician' },
            { name: 'Amit Patel', points: '10,200', role: 'Retailer' },
            { name: 'Vikram Singh', points: '9,800', role: 'Electrician' },
        ]
    }
}
