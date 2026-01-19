import { db } from '@/db';
import { userTypeEntity, skuPointConfig, skuPointRules, skuVariant, skuEntity } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export interface StakeholderType {
    id: string;
    name: string;
    desc: string;
    mult: string;
    status: string;
}

export interface PointsRule {
    id: string;
    stakeholder: string;
    category: string;
    base: number;
    mult: string;
    from: string;
    status: string;
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
            base: Number(c.points) || 0,
            mult: '1.0x', // Configs usually don't have multipliers in this simple schema
            from: c.validFrom ? new Date(c.validFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: 'Active' // Assuming active
        }));

        // 3. Fetch Points Rules (Overrides)
        const rules = await db
            .select({
                id: skuPointRules.id,
                name: skuPointRules.name,
                userType: userTypeEntity.typeName,
                // For category, rules might link to skuEntity directly or skuVariant
                skuEntityName: skuEntity.name,
                skuVariantName: skuVariant.variantName,
                actionType: skuPointRules.actionType,
                actionValue: skuPointRules.actionValue,
                validFrom: skuPointRules.validFrom,
                isActive: skuPointRules.isActive
            })
            .from(skuPointRules)
            .leftJoin(userTypeEntity, eq(skuPointRules.userTypeId, userTypeEntity.id))
            .leftJoin(skuEntity, eq(skuPointRules.skuEntityId, skuEntity.id))
            .leftJoin(skuVariant, eq(skuPointRules.skuVariantId, skuVariant.id));

        const overrideRules: PointsRule[] = rules.map(r => ({
            id: `RULE-${r.id}`,
            stakeholder: r.userType || 'All',
            category: r.skuEntityName || r.skuVariantName || r.name || 'Special Rule',
            base: r.actionType === 'FLAT_OVERRIDE' ? Number(r.actionValue) : 0, // Simplified visualization
            mult: r.actionType === 'PERCENTAGE_ADD' ? `${1 + Number(r.actionValue) / 100}x` : '1.0x', // Visualize % as mult
            from: r.validFrom ? new Date(r.validFrom).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            status: r.isActive ? 'Active' : 'Inactive'
        }));

        // Combine
        const pointsMatrix = [...configRules, ...overrideRules];

        return {
            stakeholderTypes,
            pointsMatrix
        };

    } catch (error) {
        console.error("Error fetching masters data:", error);
        // Returning empty or mock on error to prevent UI crash
        return {
            stakeholderTypes: [],
            pointsMatrix: []
        };
    }
}
