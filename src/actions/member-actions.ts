'use server'

import { db } from "@/db"
import {
    electricians,
    retailers,
    counterSales,
    users,
    userTypeEntity,
    approvalStatuses
} from "@/db/schema"
import { desc, eq, and, sql, ilike, count } from "drizzle-orm"

export interface MemberBase {
    id: string;
    dbId: number;
    name: string;
    initials: string;
    avatarColor: string;
    phone: string;
    email: string;
    kycStatus: 'Pending' | 'Approved' | 'Rejected';
    status: 'Active' | 'Inactive' | 'Blocked';
    regions?: string;
}

export interface ElectricianMember extends MemberBase {
    joinedDate: string;
}

export interface RetailerMember extends MemberBase {
    storeName: string;
    location: string;
}

export interface CSBMember extends MemberBase {
    companyName: string;
    location: string;
}

export interface StaffMember extends MemberBase {
    role: string;
}

export interface MemberStats {
    total: number;
    totalTrend: string;
    kycPending: number;
    kycPendingTrend: string;
    kycApproved: number;
    kycApprovedRate: string;
    activeToday: number;
    activeTodayTrend: string;
}

export interface MembersData {
    electricians: {
        list: ElectricianMember[];
        stats: MemberStats;
    };
    retailers: {
        list: RetailerMember[];
        stats: MemberStats;
    };
    csb: {
        list: CSBMember[];
        stats: MemberStats;
    };
    staff: {
        list: StaffMember[];
        stats: MemberStats;
    };
}

function getInitials(name: string) {
    if (!name) return '??';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
}

const colors = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ef4444', '#ec4899'];
function getRandomColor(id: number) {
    return colors[id % colors.length];
}

export async function getMembersDataAction(): Promise<MembersData> {
    try {
        // 1. Fetch Electricians
        const electricList = await db.select({
            id: electricians.id,
            uniqueId: electricians.uniqueId,
            name: electricians.name,
            phone: electricians.phone,
            email: electricians.email,
            isKycVerified: electricians.isKycVerified,
            state: electricians.state,
            city: electricians.city,
        })
            .from(electricians)
            .limit(50);

        const mappedElectricians: ElectricianMember[] = electricList.map(e => ({
            id: e.uniqueId || `ELE-${e.id}`,
            dbId: e.id,
            name: e.name || 'Unknown',
            initials: getInitials(e.name || 'Unknown'),
            avatarColor: getRandomColor(e.id),
            phone: e.phone,
            email: e.email || '',
            kycStatus: e.isKycVerified ? 'Approved' : 'Pending',
            status: 'Active',
            regions: `${e.city || ''}, ${e.state || ''}`,
            joinedDate: 'Oct 24, 2023'
        }));

        // 2. Fetch Retailers
        const retailList = await db.select({
            id: retailers.id,
            uniqueId: retailers.uniqueId,
            name: retailers.name,
            phone: retailers.phone,
            email: retailers.email,
            isKycVerified: retailers.isKycVerified,
            state: retailers.state,
            city: retailers.city,
        })
            .from(retailers)
            .limit(50);

        const mappedRetailers: RetailerMember[] = retailList.map(r => ({
            id: r.uniqueId || `RET-${r.id}`,
            dbId: r.id,
            name: r.name || 'Unknown',
            initials: getInitials(r.name || 'Unknown'),
            avatarColor: getRandomColor(r.id),
            phone: r.phone,
            email: r.email || '',
            kycStatus: r.isKycVerified ? 'Approved' : 'Pending',
            status: 'Active',
            storeName: 'Unknown Store',
            location: `${r.city || ''}, ${r.state || ''}`
        }));

        // 3. Fetch CSB (Counter Sales)
        const csbList = await db.select({
            id: counterSales.id,
            uniqueId: counterSales.uniqueId,
            name: counterSales.name,
            phone: counterSales.phone,
            email: counterSales.email,
            isKycVerified: counterSales.isKycVerified,
            state: counterSales.state,
            city: counterSales.city,
        })
            .from(counterSales)
            .limit(50);

        const mappedCSB: CSBMember[] = csbList.map(c => ({
            id: c.uniqueId || `CSB-${c.id}`,
            dbId: c.id,
            name: c.name || 'Unknown',
            initials: getInitials(c.name || 'Unknown'),
            avatarColor: getRandomColor(c.id),
            phone: c.phone,
            email: c.email || '',
            kycStatus: c.isKycVerified ? 'Approved' : 'Pending',
            status: 'Active',
            companyName: 'Unknown Company',
            location: `${c.city || ''}, ${c.state || ''}`
        }));

        // 4. Fetch Staff (Admin Users)
        const staffList = await db.select({
            id: users.id,
            name: users.name,
            email: users.email,
            phone: users.phone,
            role: userTypeEntity.typeName
        })
            .from(users)
            .leftJoin(userTypeEntity, eq(users.roleId, userTypeEntity.id))
            .where(sql`${userTypeEntity.typeName} NOT IN ('Retailer', 'Electrician', 'Counter Sales')`)
            .limit(50);

        const mappedStaff: StaffMember[] = staffList.map(s => ({
            id: `STF-${s.id}`,
            dbId: s.id,
            name: s.name || 'Unknown Staff',
            initials: getInitials(s.name || 'Unknown Staff'),
            avatarColor: getRandomColor(s.id),
            phone: s.phone || '',
            email: s.email || '',
            kycStatus: 'Approved',
            status: 'Active',
            role: s.role || 'Staff'
        }));

        // Stats Real Counts
        const [eleCount] = await db.select({ count: count() }).from(electricians);
        const [retCount] = await db.select({ count: count() }).from(retailers);
        const [csCount] = await db.select({ count: count() }).from(counterSales);
        const [stfCount] = await db.select({ count: count() }).from(users).leftJoin(userTypeEntity, eq(users.roleId, userTypeEntity.id)).where(sql`${userTypeEntity.typeName} NOT IN ('Retailer', 'Electrician', 'Counter Sales')`);


        return {
            electricians: {
                list: mappedElectricians,
                stats: {
                    total: Number(eleCount.count),
                    totalTrend: '+47',
                    kycPending: 28,
                    kycPendingTrend: '+5',
                    kycApproved: 1189,
                    kycApprovedRate: '95.3%',
                    activeToday: 342,
                    activeTodayTrend: '+12%'
                }
            },
            retailers: {
                list: mappedRetailers,
                stats: {
                    total: Number(retCount.count),
                    totalTrend: '+23',
                    kycPending: 15,
                    kycPendingTrend: '+3',
                    kycApproved: 831,
                    kycApprovedRate: '97.1%',
                    activeToday: 428,
                    activeTodayTrend: '+8%'
                }
            },
            csb: {
                list: mappedCSB,
                stats: {
                    total: Number(csCount.count),
                    totalTrend: '+8',
                    kycPending: 5,
                    kycPendingTrend: '+2',
                    kycApproved: 119,
                    kycApprovedRate: '96%',
                    activeToday: 87,
                    activeTodayTrend: '+5%'
                }
            },
            staff: {
                list: mappedStaff,
                stats: {
                    total: Number(stfCount.count),
                    totalTrend: '+2',
                    kycPending: 0,
                    kycPendingTrend: '0',
                    kycApproved: Number(stfCount.count),
                    kycApprovedRate: '100%',
                    activeToday: 12,
                    activeTodayTrend: '+2%'
                }
            }
        };

    } catch (error) {
        console.error("Error in getMembersDataAction:", error);
        throw error;
    }
}

// Deprecated old action for compatibility
export async function getMembersAction() {
    const data = await getMembersDataAction();
    return data.electricians.list;
}
