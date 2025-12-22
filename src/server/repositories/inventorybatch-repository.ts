import { db } from "@/db/index";
import { InventoryBatch } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { CustomError } from "../../types";

class InventoryBatchRepository {
    customError: CustomError;

    constructor() {
        this.customError = new CustomError({
            responseCode: 400,
            responseMessage: "",
        });
    }

    async fetchAllInventoryBatches(page: number, limit: number): Promise<{ batches: any[], total: number }> {
        try {
            const offset = (page) * limit;

            return await db.transaction(async (tx) => {
                const totalResult = await tx.select({ count: sql<number>`count(*)` }).from(InventoryBatch);
                const total = Number(totalResult[0]?.count || 0);

                const batches = await tx.select()
                    .from(InventoryBatch)
                    .orderBy(desc(InventoryBatch.createdAt))
                    .limit(limit)
                    .offset(offset);

                return { batches, total };
            });
        } catch (error: any) {
            this.customError.responseMessage = error.message || "Failed to fetch Inventory Batch list.";
            throw this.customError;
        }
    }

    async fetchInventoryBatchById(batchId: number): Promise<any> {
        try {
            const result = await db
                .select()
                .from(InventoryBatch)
                .where(eq(InventoryBatch.batchId, batchId))
                .limit(1);

            return result.length > 0 ? result[0] : null;
        } catch (error: any) {
            this.customError.responseMessage = error.message || "Failed to fetch Inventory Batch.";
            throw this.customError;
        }
    }
}

export const inventoryBatchRepository = new InventoryBatchRepository();
