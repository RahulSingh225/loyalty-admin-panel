'use server';

import { db } from '@/db';
import { userTypeEntity, skuPointConfig, skuPointRules, skuVariant, skuEntity, skuLevelMaster, retailerTransactions, electricianTransactions, counterSalesTransactions } from '@/db/schema';
import { eq, desc, sql as sqlTag } from 'drizzle-orm';

export interface StakeholderType {
    id: string;
    name: string;
    code?: string;
    desc: string;
    mult: string;
    status: string;
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
            isActive: userTypeEntity.isActive
        }).from(userTypeEntity).orderBy(desc(userTypeEntity.id));

        const stakeholderTypes: StakeholderType[] = stakeholders.map(s => ({
            id: s.id.toString(),
            name: s.typeName,
            desc: s.typeName + ' Role', // Dummy description
            mult: '1.0x', // Dummy multiplier as column doesn't exist yet
            status: s.isActive ? 'Active' : 'Inactive'
        }));

        // 2. Fetch Points Config (Base Points)
        // Join with UserType and SkuVariant to get names
        const configs = await db
            .select({
                id: skuPointConfig.id,
                userType: userTypeEntity.typeName,
                variantName: skuVariant.variantName,
                // We might want SKU Category (Entity) name too?
                entityName: skuEntity.name,
                points: skuPointConfig.pointsPerUnit,
                validFrom: skuPointConfig.validFrom,
                isActive: skuVariant.isActive // approximate status
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
            status: 'Active',
            ruleType: 'Base'
        }));

        // 3. Fetch Points Rules (Now from skuPointConfig as requested)
        const rules = await db
            .select({
                id: skuPointConfig.id,
                name: sqlTag`'Base config'` as any,
                userType: userTypeEntity.typeName,
                skuEntityName: skuEntity.name,
                skuVariantName: skuVariant.variantName,
                skuCode: skuEntity.code,
                actionType: sqlTag`'FLAT_OVERRIDE'` as any,
                actionValue: skuPointConfig.pointsPerUnit,
                validFrom: skuPointConfig.validFrom,
                isActive: sqlTag`true` as any
            })
            .from(skuPointConfig)
            .leftJoin(userTypeEntity, eq(skuPointConfig.userTypeId, userTypeEntity.id))
            .leftJoin(skuVariant, eq(skuPointConfig.skuVariantId, skuVariant.id))
            .leftJoin(skuEntity, eq(skuVariant.skuEntityId, skuEntity.id));
        console.log(rules.length);
        const overrideRules: PointsRule[] = rules.map(r => ({
            id: `RULE-${r.id}`,
            stakeholder: r.userType || 'All',
            category: r.skuEntityName || r.name || r.skuCode || r.skuVariantName || 'Special Rule',
            base: r.actionType === 'FLAT_OVERRIDE' ? `${r.actionValue} Pts` : '---',
            mult: r.actionType === 'PERCENTAGE_ADD' ? `+${r.actionValue}%` : r.actionType === 'FIXED_ADD' ? `+${r.actionValue} Pts` : '1.0x',
            from: r.validFrom ? new Date(r.validFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: r.isActive ? 'Active' : 'Inactive',
            ruleType: 'Override'
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
