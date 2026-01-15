'use server'

import { db } from "@/db"
import { users, counterSalesTransactionLogs } from "@/db/schema"
import { count } from "drizzle-orm"

export async function getMisAnalyticsAction() {
    // Example of real data fetching mixed with mock data
    // Fetch total active members
    const [userCount] = await db.select({ count: count() }).from(users);

    // We would usually fetch more aggregate data here.
    // For now, we return the structure expected by the UI.

    return {
        executive: {
            totalPoints: 45230, // Mock
            activeMembers: userCount.count, // Real
            engagement: 78.5,
            redemptionRate: 42.3,
            pointsTrend: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                data: [35000, 38000, 42000, 40000, 43500, 45230]
            },
            memberGrowth: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                data: [1200, 1350, 1500, 1800, 2100, 2450]
            }
        },
        performance: {
            txnVolume: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [150, 230, 180, 320, 290, 140, 190]
            },
            categoryPerf: {
                labels: ['Wires', 'Switches', 'Lights', 'Fans', 'MCBs'],
                data: [23.4, 18.7, 15.4, 12.1, 9.8]
            }
        },
        memberAnalytics: {
            segmentation: {
                labels: ['Electricians', 'Retailers', 'Contractors', 'Builders'],
                data: [45, 25, 20, 10]
            },
            lifecycle: {
                new: 2345,
                active: 35678,
                atRisk: 5432,
                churned: 1223
            },
            satisfaction: {
                average: 4.6,
                distribution: [45, 35, 15, 4, 1] // 5 star to 1 star
            },
            recentActivity: [
                { id: 'MEM001234', name: 'Rahul Sharma', type: 'Electrician', lastActivity: '2 hours ago', points: 450, status: 'Active' },
                { id: 'MEM001235', name: 'Amit Patel', type: 'Contractor', lastActivity: '5 hours ago', points: 320, status: 'Active' },
                { id: 'MEM001236', name: 'Vikram Singh', type: 'Distributor', lastActivity: '2 days ago', points: 180, status: 'At Risk' }
            ]
        },
        campaignAnalytics: {
            kpis: {
                activeCampaigns: 12,
                totalReach: '1.2L',
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
            topCampaigns: [
                { name: 'Diwali Special', type: 'Points Multiplier', duration: 'Oct 15-25', reach: '45,678', engagement: '78.5%', conversion: '22.3%', roi: '285%' },
                { name: 'New Member Welcome', type: 'Onboarding', duration: 'Ongoing', reach: '12,345', engagement: '92.1%', conversion: '45.6%', roi: '320%' },
                { name: 'Monsoon Offer', type: 'Seasonal', duration: 'Jul 1-31', reach: '23,456', engagement: '65.4%', conversion: '18.9%', roi: '198%' }
            ]
        },
        reports: {
            qrScanReport: [
                { id: '#12345', stakeholder: 'Retailer A', sku: 'SKU001', geo: 'Delhi', time: '2023-10-01 10:30', type: 'Mono', status: 'Success' },
                { id: '#12346', stakeholder: 'Electrician B', sku: 'SKU002', geo: 'Mumbai', time: '2023-10-01 11:15', type: 'Sub-mono', status: 'Failed' },
                { id: '#12347', stakeholder: 'CSB C', sku: 'SKU003', geo: 'Bangalore', time: '2023-10-01 12:45', type: 'Mono', status: 'Success' },
                { id: '#12348', stakeholder: 'Retailer D', sku: 'SKU001', geo: 'Kolkata', time: '2023-10-01 13:20', type: 'Sub-mono', status: 'Pending' },
                { id: '#12349', stakeholder: 'Electrician E', sku: 'SKU002', geo: 'Chennai', time: '2023-10-01 14:10', type: 'Mono', status: 'Success' }
            ]
        }
    }
}
