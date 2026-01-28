'use server'

import { db } from "@/db"
import { fileMiddleware } from "@/server/middlewares/file-middleware"
import {
    electricians,
    retailers,
    counterSales,
    users,
    userTypeEntity,
    approvalStatuses,
    userTypeLevelMaster,
    kycDocuments
} from "@/db/schema"
import { desc, eq, and, sql, ilike, count, or } from "drizzle-orm"

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
    joinedDate?: string;
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

export interface MemberFilters {
    searchQuery?: string;
    kycStatus?: string;
    region?: string;
    page?: number;
    limit?: number;
    roleId?: number;
}

export interface MemberHierarchy {
    levels: {
        id: number;
        name: string;
        entities: {
            id: number;
            name: string;
            members: {
                list: MemberBase[];
                stats: MemberStats;
            };
        }[];
    }[];
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

export async function getMembersDataAction(filters?: MemberFilters): Promise<MemberHierarchy> {
    try {
        const { searchQuery, kycStatus, region } = filters || {};

        // 1. Fetch Levels and Entities
        const levels = await db.select().from(userTypeLevelMaster).orderBy(userTypeLevelMaster.levelNo);
        const entities = await db.select().from(userTypeEntity).where(eq(userTypeEntity.isActive, true));

        // 2. Prepare hierarchical structure
        const hierarchy: MemberHierarchy = {
            levels: levels.map(l => ({
                id: l.id,
                name: l.levelName,
                entities: entities
                    .filter(e => e.levelId === l.id)
                    .map(e => ({
                        id: e.id,
                        name: e.typeName,
                        members: { list: [], stats: { total: 0, totalTrend: '', kycPending: 0, kycPendingTrend: '', kycApproved: 0, kycApprovedRate: '', activeToday: 0, activeTodayTrend: '' } }
                    }))
            }))
        };

        // 3. Fetch users and group them
        let usersQuery = db.select({
            id: users.id,
            name: users.name,
            phone: users.phone,
            email: users.email,
            roleId: users.roleId,
            isSuspended: users.isSuspended,
            createdAt: users.createdAt,
        })
            .from(users)
            .$dynamic();

        const conditions = [];
        if (searchQuery) {
            conditions.push(or(
                ilike(users.name, `%${searchQuery}%`),
                ilike(users.phone, `%${searchQuery}%`),
                ilike(users.email, `%${searchQuery}%`)
            ));
        }

        if (conditions.length > 0) {
            usersQuery = usersQuery.where(and(...conditions));
        }

        const allUsers = await usersQuery.limit(500);

        // 4. Populate hierarchy
        hierarchy.levels.forEach(level => {
            level.entities.forEach(entity => {
                const entityUsers = allUsers.filter(u => u.roleId === entity.id);

                entity.members.list = entityUsers.map(u => ({
                    id: `USR${u.id.toString().padStart(3, '0')}`,
                    dbId: u.id,
                    name: u.name || 'Unknown',
                    initials: getInitials(u.name || 'Unknown'),
                    avatarColor: getRandomColor(u.id),
                    phone: u.phone || '',
                    email: u.email || '',
                    kycStatus: 'Approved',
                    status: u.isSuspended ? 'Inactive' : 'Active',
                    regions: '---',
                    joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '---'
                }));

                entity.members.stats = {
                    total: entityUsers.length,
                    totalTrend: '+0',
                    kycPending: 0,
                    kycPendingTrend: '0',
                    kycApproved: entityUsers.length,
                    kycApprovedRate: '100%',
                    activeToday: Math.floor(entityUsers.length * 0.3),
                    activeTodayTrend: '+0'
                };
            });
        });

        return hierarchy;
    } catch (error) {
        console.error("Error in getMembersDataAction:", error);
        throw error;
    }
}

export async function getMemberDetailsAction(type: string, id: number) {
    try {
        const normalizedType = type.toLowerCase();
        let specificRecord = null;

        // 1. Fetch base user record
        const userRecords = await db.select().from(users).where(eq(users.id, id));
        const userRecord = userRecords[0];

        if (!userRecord) return null;

        // 2. Fetch specific details based on type
        if (normalizedType.includes('retailer')) {
            const records = await db.select().from(retailers).where(eq(retailers.userId, id));
            if (records.length > 0) specificRecord = records[0];
        } else if (normalizedType.includes('electrician')) {
            const records = await db.select().from(electricians).where(eq(electricians.userId, id));
            if (records.length > 0) specificRecord = records[0];
        } else if (normalizedType.includes('counter sales')) {
            const records = await db.select().from(counterSales).where(eq(counterSales.userId, id));
            if (records.length > 0) specificRecord = records[0];
        }

        // 3. Return specific record if found, otherwise fallback to user record
        if (specificRecord) {
            return specificRecord;
        }

        return userRecord;
    } catch (error) {
        console.error("Error in getMemberDetailsAction:", error);
        throw error;
    }
}

export async function getMemberKycDocumentsAction(userId: number) {
    try {
        const result = await db.select().from(kycDocuments).where(eq(kycDocuments.userId, userId));

        const signedDocs = await Promise.all(result.map(async (doc) => {
            // Extract key from s3:// URI if present
            const fileKey = doc.documentValue.replace(/^s3:\/\/[^\/]+\//, '');
            // Use 'direct' type to avoid getFileUrl adding prefixes
            const signedUrl = await fileMiddleware.getFileSignedUrl(fileKey, 'direct') || '';
            return {
                ...doc,
                signedUrl
            };
        }));

        return signedDocs;
    } catch (error) {
        console.error("Error in getMemberKycDocumentsAction:", error);
        throw error;
    }
}

export async function updateKycDocumentStatusAction(documentId: number, status: 'verified' | 'rejected', rejectionReason?: string) {
    try {
        await db.update(kycDocuments)
            .set({
                verificationStatus: status,
                rejectionReason: rejectionReason || null,
                verifiedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            .where(eq(kycDocuments.id, documentId));

        return { success: true };
    } catch (error) {
        console.error("Error in updateKycDocumentStatusAction:", error);
        throw error;
    }
}

export async function getApprovalStatusesAction() {
    try {
        const statuses = await db.select().from(approvalStatuses).where(eq(approvalStatuses.isActive, true));
        return statuses;
    } catch (error) {
        console.error("Error in getApprovalStatusesAction:", error);
        throw error;
    }
}

export async function getMemberHierarchyAction(): Promise<MemberHierarchy> {
    try {
        const levels = await db.select().from(userTypeLevelMaster).orderBy(userTypeLevelMaster.levelNo);
        const entities = await db.select().from(userTypeEntity).where(eq(userTypeEntity.isActive, true));

        const hierarchy: MemberHierarchy = {
            levels: levels.map(l => ({
                id: l.id,
                name: l.levelName,
                entities: entities
                    .filter(e => e.levelId === l.id)
                    .map(e => ({
                        id: e.id,
                        name: e.typeName,
                        members: { list: [], stats: { total: 0, totalTrend: '', kycPending: 0, kycPendingTrend: '', kycApproved: 0, kycApprovedRate: '', activeToday: 0, activeTodayTrend: '' } }
                    }))
            }))
        };
        return hierarchy;
    } catch (error) {
        console.error("Error in getMemberHierarchyAction:", error);
        throw error;
    }
}

export async function getMembersListAction(filters: MemberFilters): Promise<{ list: MemberBase[], stats: MemberStats }> {
    try {
        const { searchQuery, kycStatus, region, page = 1, limit = 10, roleId } = filters;

        if (!roleId) {
            return { list: [], stats: { total: 0, totalTrend: '', kycPending: 0, kycPendingTrend: '', kycApproved: 0, kycApprovedRate: '', activeToday: 0, activeTodayTrend: '' } };
        }

        let baseConditions = [eq(users.roleId, roleId)];

        if (searchQuery) {
            baseConditions.push(or(
                ilike(users.name, `%${searchQuery}%`),
                ilike(users.phone, `%${searchQuery}%`),
                ilike(users.email, `%${searchQuery}%`)
            ));
        }

        const listQuery = db.select({
            id: users.id,
            name: users.name,
            phone: users.phone,
            email: users.email,
            roleId: users.roleId,
            isSuspended: users.isSuspended,
            createdAt: users.createdAt,
        })
            .from(users)
            .where(and(...baseConditions))
            .limit(limit)
            .offset((page - 1) * limit)
            .orderBy(desc(users.createdAt));

        const fetchedUsers = await listQuery;

        const list = fetchedUsers.map(u => ({
            id: `USR${u.id.toString().padStart(3, '0')}`,
            dbId: u.id,
            name: u.name || 'Unknown',
            initials: getInitials(u.name || 'Unknown'),
            avatarColor: getRandomColor(u.id),
            phone: u.phone || '',
            email: u.email || '',
            kycStatus: 'Approved' as const,
            status: u.isSuspended ? 'Inactive' as const : 'Active' as const,
            regions: '---',
            joinedDate: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '---'
        }));

        const totalResult = await db.select({ count: count() })
            .from(users)
            .where(and(...baseConditions));

        const total = totalResult[0]?.count || 0;

        const stats: MemberStats = {
            total: total,
            totalTrend: '+0',
            kycPending: 0,
            kycPendingTrend: '0',
            kycApproved: total,
            kycApprovedRate: '100%',
            activeToday: Math.floor(total * 0.3),
            activeTodayTrend: '+0'
        };

        return { list, stats };

    } catch (error) {
        console.error("Error in getMembersListAction:", error);
        throw error;
    }
}

export async function updateMemberApprovalStatusAction(userId: number, statusId: number) {
    try {
        await db.update(users)
            .set({
                approvalStatusId: statusId,
                updatedAt: new Date().toISOString()
            })
            .where(eq(users.id, userId));

        return { success: true };
    } catch (error) {
        console.error("Error in updateMemberApprovalStatusAction:", error);
        throw error;
    }
}

export async function updateMemberDetailsAction(userId: number, type: string, data: any) {
    try {
        const normalizedType = type.toLowerCase();

        // Define location fields to update
        const locationUpdates = {
            addressLine1: data.addressLine1,
            addressLine2: data.addressLine2, // Add if captured in form
            city: data.city,
            state: data.state,
            pincode: data.pincode,
        };

        // Update specific table based on type
        if (normalizedType.includes('retailer')) {
            await db.update(retailers)
                .set({
                    ...locationUpdates,
                    shopName: data.shopName,
                })
                .where(eq(retailers.userId, userId));
        } else if (normalizedType.includes('electrician')) {
            await db.update(electricians)
                .set({
                    ...locationUpdates,
                })
                .where(eq(electricians.userId, userId));
        } else if (normalizedType.includes('counter sales')) {
            await db.update(counterSales)
                .set({
                    ...locationUpdates,
                })
                .where(eq(counterSales.userId, userId));
        }

        return { success: true };

    } catch (error) {
        console.error("Error in updateMemberDetailsAction:", error);
        throw error;
    }
}
