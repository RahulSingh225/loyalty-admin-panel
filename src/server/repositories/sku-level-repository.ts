
import { db } from "@/db/index";
import {
    SkuLevel1Master,
    SkuLevel2Master,
    SkuLevel3Master,
    SkuLevel4Master,
    SkuLevel5Master,
    SkuLevel6Master
} from "../../db/schema";
import { eq } from "drizzle-orm";

class SkuLevelRepository {
    async fetchL1() {
        return await db.select().from(SkuLevel1Master).where(eq(SkuLevel1Master.isActive, true));
    }

    async fetchL2(l1Id?: number) {
        const query = db.select().from(SkuLevel2Master).where(eq(SkuLevel2Master.isActive, true));
        if (l1Id) {
            return await query.where(eq(SkuLevel2Master.l1Id, l1Id));
        }
        return await query;
    }

    async fetchL3(l2Id?: number) {
        const query = db.select().from(SkuLevel3Master).where(eq(SkuLevel3Master.isActive, true));
        if (l2Id) {
            return await query.where(eq(SkuLevel3Master.l2Id, l2Id));
        }
        return await query;
    }

    async fetchL4(l3Id?: number) {
        const query = db.select().from(SkuLevel4Master).where(eq(SkuLevel4Master.isActive, true));
        if (l3Id) {
            return await query.where(eq(SkuLevel4Master.l3Id, l3Id));
        }
        return await query;
    }

    async fetchL5(l4Id?: number) {
        const query = db.select().from(SkuLevel5Master).where(eq(SkuLevel5Master.isActive, true));
        if (l4Id) {
            return await query.where(eq(SkuLevel5Master.l4Id, l4Id));
        }
        return await query;
    }

    async fetchL6(l5Id?: number) {
        const query = db.select().from(SkuLevel6Master).where(eq(SkuLevel6Master.isActive, true));
        if (l5Id) {
            return await query.where(eq(SkuLevel6Master.l5Id, l5Id));
        }
        return await query;
    }
}

export const skuLevelRepository = new SkuLevelRepository();
