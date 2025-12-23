
import { db } from "@/db/index";
import {
    SkuLevel1Master,
    SkuLevel2Master,
    SkuLevel3Master,
    SkuLevel4Master,
    SkuLevel5Master,
    SkuLevel6Master,
    SkuMasterModel
} from "../../db/schema";
import { eq, and, isNotNull, inArray } from "drizzle-orm";

class SkuLevelRepository {
    // Fetch L1 values that exist in tbl_sku_master
    async fetchL1() {
        const distinctL1s = await db
            .selectDistinct({ l1: SkuMasterModel.l1 })
            .from(SkuMasterModel)
            .where(
                and(
                    eq(SkuMasterModel.isSkuActive, true),
                    isNotNull(SkuMasterModel.l1)
                )
            );

        const l1Ids = distinctL1s.map(item => item.l1).filter(id => id !== null);

        if (l1Ids.length === 0) return [];

        return await db
            .select()
            .from(SkuLevel1Master)
            .where(
                and(
                    eq(SkuLevel1Master.isActive, true),
                    inArray(SkuLevel1Master.id, l1Ids)
                )
            );
    }

    // Fetch L2 values that exist in tbl_sku_master for the given L1
    async fetchL2(l1Id?: number) {
        let whereConditions = [
            eq(SkuMasterModel.isSkuActive, true),
            isNotNull(SkuMasterModel.l2)
        ];

        if (l1Id) {
            whereConditions.push(eq(SkuMasterModel.l1, l1Id));
        }

        const distinctL2s = await db
            .selectDistinct({ l2: SkuMasterModel.l2 })
            .from(SkuMasterModel)
            .where(and(...whereConditions));

        const l2Ids = distinctL2s.map(item => item.l2).filter(id => id !== null);

        if (l2Ids.length === 0) return [];

        return await db
            .select()
            .from(SkuLevel2Master)
            .where(
                and(
                    eq(SkuLevel2Master.isActive, true),
                    inArray(SkuLevel2Master.id, l2Ids)
                )
            );
    }

    // Fetch L3 values that exist in tbl_sku_master for the given L1 and L2
    async fetchL3(l1Id?: number, l2Id?: number) {
        let whereConditions = [
            eq(SkuMasterModel.isSkuActive, true),
            isNotNull(SkuMasterModel.l3)
        ];

        if (l1Id) {
            whereConditions.push(eq(SkuMasterModel.l1, l1Id));
        }
        if (l2Id) {
            whereConditions.push(eq(SkuMasterModel.l2, l2Id));
        }

        const distinctL3s = await db
            .selectDistinct({ l3: SkuMasterModel.l3 })
            .from(SkuMasterModel)
            .where(and(...whereConditions));

        const l3Ids = distinctL3s.map(item => item.l3).filter(id => id !== null);

        if (l3Ids.length === 0) return [];

        return await db
            .select()
            .from(SkuLevel3Master)
            .where(
                and(
                    eq(SkuLevel3Master.isActive, true),
                    inArray(SkuLevel3Master.id, l3Ids)
                )
            );
    }

    // Fetch L4 values that exist in tbl_sku_master for the given L1, L2, and L3
    async fetchL4(l1Id?: number, l2Id?: number, l3Id?: number) {
        let whereConditions = [
            eq(SkuMasterModel.isSkuActive, true),
            isNotNull(SkuMasterModel.l4)
        ];

        if (l1Id) {
            whereConditions.push(eq(SkuMasterModel.l1, l1Id));
        }
        if (l2Id) {
            whereConditions.push(eq(SkuMasterModel.l2, l2Id));
        }
        if (l3Id) {
            whereConditions.push(eq(SkuMasterModel.l3, l3Id));
        }

        const distinctL4s = await db
            .selectDistinct({ l4: SkuMasterModel.l4 })
            .from(SkuMasterModel)
            .where(and(...whereConditions));

        const l4Ids = distinctL4s.map(item => item.l4).filter(id => id !== null);

        if (l4Ids.length === 0) return [];

        return await db
            .select()
            .from(SkuLevel4Master)
            .where(
                and(
                    eq(SkuLevel4Master.isActive, true),
                    inArray(SkuLevel4Master.id, l4Ids)
                )
            );
    }

    // Fetch L5 values that exist in tbl_sku_master for the given L1-L4
    async fetchL5(l1Id?: number, l2Id?: number, l3Id?: number, l4Id?: number) {
        let whereConditions = [
            eq(SkuMasterModel.isSkuActive, true),
            isNotNull(SkuMasterModel.l5)
        ];

        if (l1Id) {
            whereConditions.push(eq(SkuMasterModel.l1, l1Id));
        }
        if (l2Id) {
            whereConditions.push(eq(SkuMasterModel.l2, l2Id));
        }
        if (l3Id) {
            whereConditions.push(eq(SkuMasterModel.l3, l3Id));
        }
        if (l4Id) {
            whereConditions.push(eq(SkuMasterModel.l4, l4Id));
        }

        const distinctL5s = await db
            .selectDistinct({ l5: SkuMasterModel.l5 })
            .from(SkuMasterModel)
            .where(and(...whereConditions));

        const l5Ids = distinctL5s.map(item => item.l5).filter(id => id !== null);

        if (l5Ids.length === 0) return [];

        return await db
            .select()
            .from(SkuLevel5Master)
            .where(
                and(
                    eq(SkuLevel5Master.isActive, true),
                    inArray(SkuLevel5Master.id, l5Ids)
                )
            );
    }

    // Fetch L6 values that exist in tbl_sku_master for the given L1-L5
    async fetchL6(l1Id?: number, l2Id?: number, l3Id?: number, l4Id?: number, l5Id?: number) {
        let whereConditions = [
            eq(SkuMasterModel.isSkuActive, true),
            isNotNull(SkuMasterModel.l6)
        ];

        if (l1Id) {
            whereConditions.push(eq(SkuMasterModel.l1, l1Id));
        }
        if (l2Id) {
            whereConditions.push(eq(SkuMasterModel.l2, l2Id));
        }
        if (l3Id) {
            whereConditions.push(eq(SkuMasterModel.l3, l3Id));
        }
        if (l4Id) {
            whereConditions.push(eq(SkuMasterModel.l4, l4Id));
        }
        if (l5Id) {
            whereConditions.push(eq(SkuMasterModel.l5, l5Id));
        }

        const distinctL6s = await db
            .selectDistinct({ l6: SkuMasterModel.l6 })
            .from(SkuMasterModel)
            .where(and(...whereConditions));

        const l6Ids = distinctL6s.map(item => item.l6).filter(id => id !== null);

        if (l6Ids.length === 0) return [];

        return await db
            .select()
            .from(SkuLevel6Master)
            .where(
                and(
                    eq(SkuLevel6Master.isActive, true),
                    inArray(SkuLevel6Master.id, l6Ids)
                )
            );
    }
}

export const skuLevelRepository = new SkuLevelRepository();
