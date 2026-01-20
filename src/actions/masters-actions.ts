'use server';

import { db } from '@/db';
import { userTypeEntity, skuPointConfig, skuPointRules, skuVariant, skuEntity, skuLevelMaster, retailerTransactions, electricianTransactions, counterSalesTransactions } from '@/db/schema';
import { eq, desc, sql as sqlTag } from 'drizzle-orm';

export interface StakeholderType {
    id: string;
    name: string;
    code?: string;
    desc: string;
    status: string;
    maxDailyScans: number;
    requiredKycLevel: string;
    allowedRedemptionChannels: number[];
}

export interface PointsRule {
    id: string;
    stakeholder: string;
    category: string;
    base: string;
    mult: string;
    from: string;
    status: string;
    ruleType: 'Base' | 'Override';
    maxScansPerDay?: number;
    description?: string;
}

export interface SkuNode {
    id: string;
    label: string;
    code?: string;
    levelName: string;
    children?: SkuNode[];
}

export interface SkuPerformance {
    name: string;
    scans: number;
    category: string;
}

export async function getMastersDataAction() {
    try {
        // 1. Fetch Stakeholders from userTypeEntity
        const stakeholders = await db.select({
            id: userTypeEntity.id,
            typeName: userTypeEntity.typeName,
            isActive: userTypeEntity.isActive,
            maxDailyScans: userTypeEntity.maxDailyScans,
            requiredKycLevel: userTypeEntity.requiredKycLevel,
            allowedRedemptionChannels: userTypeEntity.allowedRedemptionChannels
        }).from(userTypeEntity).orderBy(desc(userTypeEntity.id));

        const stakeholderTypes: StakeholderType[] = stakeholders.map(s => ({
            id: s.id.toString(),
            name: s.typeName,
            desc: s.typeName + ' Role',
            status: s.isActive ? 'Active' : 'Inactive',
            maxDailyScans: s.maxDailyScans || 50,
            requiredKycLevel: s.requiredKycLevel || 'Basic',
            allowedRedemptionChannels: (s.allowedRedemptionChannels as number[]) || []
        }));

        // 2. Fetch Points Config (Base Points)
        // Join with UserType and SkuVariant to get names
        const configs = await db
            .select({
                id: skuPointConfig.id,
                userType: userTypeEntity.typeName,
                variantName: skuVariant.variantName,
                entityName: skuEntity.name,
                points: skuPointConfig.pointsPerUnit,
                validFrom: skuPointConfig.validFrom,
                isActive: skuPointConfig.isActive,
                maxScansPerDay: skuPointConfig.maxScansPerDay
            })
            .from(skuPointConfig)
            .leftJoin(userTypeEntity, eq(skuPointConfig.userTypeId, userTypeEntity.id))
            .leftJoin(skuVariant, eq(skuPointConfig.skuVariantId, skuVariant.id))
            .leftJoin(skuEntity, eq(skuVariant.skuEntityId, skuEntity.id));

        const configRules: PointsRule[] = configs.map(c => ({
            id: `CFG-${c.id}`,
            stakeholder: c.userType || 'All',
            category: c.entityName || c.variantName || 'General',
            base: c.points ? `${c.points} Pts` : '0 Pts',
            mult: '1.0x',
            from: c.validFrom ? new Date(c.validFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: c.isActive ? 'Active' : 'Inactive',
            ruleType: 'Base',
            maxScansPerDay: c.maxScansPerDay || 5
        }));

        // 3. Fetch Points Rules (Override Rules)
        const rules = await db
            .select({
                id: skuPointRules.id,
                name: skuPointRules.name,
                userType: userTypeEntity.typeName,
                skuEntityName: skuEntity.name,
                skuVariantName: skuVariant.variantName,
                actionType: skuPointRules.actionType,
                actionValue: skuPointRules.actionValue,
                validFrom: skuPointRules.validFrom,
                isActive: skuPointRules.isActive,
                description: skuPointRules.description
            })
            .from(skuPointRules)
            .leftJoin(userTypeEntity, eq(skuPointRules.userTypeId, userTypeEntity.id))
            .leftJoin(skuVariant, eq(skuPointRules.skuVariantId, skuVariant.id))
            .leftJoin(skuEntity, eq(skuPointRules.skuEntityId, skuEntity.id));
        console.log(rules.length);
        const overrideRules: PointsRule[] = rules.map(r => ({
            id: `RULE-${r.id}`,
            stakeholder: r.userType || 'All',
            category: r.skuEntityName || r.skuVariantName || 'General',
            base: r.actionType === 'FLAT_OVERRIDE' ? `${r.actionValue} Pts` : '---',
            mult: r.actionType === 'PERCENTAGE_ADD' ? `+${r.actionValue}%` : r.actionType === 'FIXED_ADD' ? `+${r.actionValue} Pts` : '---',
            from: r.validFrom ? new Date(r.validFrom).toISOString().split('T')[0] : '---',
            status: r.isActive ? 'Active' : 'Inactive',
            ruleType: 'Override',
            description: r.description || ''
        }));

        // Combine
        const pointsMatrix = [...configRules, ...overrideRules];

        // 4. Fetch SKU Hierarchy (skuEntity joined with skuLevelMaster)
        const skuEntities = await db
            .select({
                id: skuEntity.id,
                name: skuEntity.name,
                code: skuEntity.code,
                parentEntityId: skuEntity.parentEntityId,
                levelName: skuLevelMaster.levelName
            })
            .from(skuEntity)
            .leftJoin(skuLevelMaster, eq(skuEntity.levelId, skuLevelMaster.id));

        // Build tree recursively or via map
        const buildSkuTree = (items: any[], parentId: number | null = null): SkuNode[] => {
            return items
                .filter(item => item.parentEntityId === parentId)
                .map(item => ({
                    id: item.id.toString(),
                    label: item.name,
                    code: item.code,
                    levelName: item.levelName || 'Unknown',
                    children: buildSkuTree(items, item.id)
                }));
        };

        const skuHierarchy = buildSkuTree(skuEntities);

        // 5. Fetch SKU Performance (Aggregate scans from all transaction tables)
        const performanceData = await db
            .select({
                skuCode: sqlTag.raw('sku') as any,
                count: sqlTag.raw('count(*)') as any
            })
            .from(sqlTag.raw(`(
                SELECT sku FROM retailer_transactions
                UNION ALL
                SELECT sku FROM electrician_transactions
                UNION ALL
                SELECT sku FROM counter_sales_transactions
            ) as t`))
            .groupBy(sqlTag.raw('sku'))
            .orderBy(sqlTag.raw('count(*) DESC'))
            .limit(5);

        // Join with skuEntity to get names (assuming t.sku matches skuEntity.code)
        const topSkus = await Promise.all(performanceData.map(async (p) => {
            const entity = await db.select({
                name: skuEntity.name,
                category: skuLevelMaster.levelName
            })
                .from(skuEntity)
                .leftJoin(skuLevelMaster, eq(skuEntity.levelId, skuLevelMaster.id))
                .where(eq(skuEntity.code, p.skuCode))
                .limit(1);

            return {
                name: entity[0]?.name || p.skuCode,
                scans: p.count,
                category: entity[0]?.category || 'General'
            };
        }));

        return {
            stakeholderTypes,
            pointsMatrix,
            skuHierarchy,
            topSkus
        };

    } catch (error) {
        console.error("Error fetching masters data:", error);
        // Returning empty or mock on error to prevent UI crash
        return {
            stakeholderTypes: [],
            pointsMatrix: [],
            skuHierarchy: [],
            topSkus: []
        };
    }
}

export async function updateStakeholderConfigAction(data: {
    id: number;
    maxDailyScans: number;
    requiredKycLevel: string;
    allowedRedemptionChannels: number[];
}) {
    try {
        await db.update(userTypeEntity)
            .set({
                maxDailyScans: data.maxDailyScans,
                requiredKycLevel: data.requiredKycLevel,
                allowedRedemptionChannels: data.allowedRedemptionChannels
            })
            .where(eq(userTypeEntity.id, data.id));
        return { success: true };
    } catch (error) {
        console.error("Error updating stakeholder config:", error);
        return { success: false, error: "Failed to update configuration" };
    }
}

export async function upsertPointsMatrixRuleAction(data: {
    id?: number;
    name: string;
    clientId: number;
    userTypeId?: number;
    skuEntityId?: number;
    skuVariantId?: number;
    actionType: string;
    actionValue: number;
    description?: string;
    isActive: boolean;
    validFrom?: string;
    validTo?: string;
}) {
    try {
        if (data.id) {
            await db.update(skuPointRules)
                .set({
                    name: data.name,
                    userTypeId: data.userTypeId,
                    skuEntityId: data.skuEntityId,
                    skuVariantId: data.skuVariantId,
                    actionType: data.actionType as any,
                    actionValue: data.actionValue.toString(),
                    description: data.description,
                    isActive: data.isActive,
                    validFrom: data.validFrom ? new Date(data.validFrom) : null,
                    validTo: data.validTo ? new Date(data.validTo) : null
                })
                .where(eq(skuPointRules.id, data.id));
        } else {
            await db.insert(skuPointRules).values({
                name: data.name,
                clientId: data.clientId,
                userTypeId: data.userTypeId,
                skuEntityId: data.skuEntityId,
                skuVariantId: data.skuVariantId,
                actionType: data.actionType as any,
                actionValue: data.actionValue.toString(),
                description: data.description,
                isActive: data.isActive,
                validFrom: data.validFrom ? new Date(data.validFrom) : null,
                validTo: data.validTo ? new Date(data.validTo) : null
            });
        }
        return { success: true };
    } catch (error) {
        console.error("Error upserting points matrix rule:", error);
        return { success: false, error: "Failed to save rule" };
    }
}
