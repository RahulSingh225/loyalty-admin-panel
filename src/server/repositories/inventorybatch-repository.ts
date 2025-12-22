import { db } from "@/db/index";
import { InventoryBatch } from "@/db/schema";
import { eq } from "drizzle-orm";
import { CustomError } from "../../types";

class InventoryBatchRepository {
    customError: CustomError;

    constructor() {
        this.customError = new CustomError({
            responseCode: 400,
            responseMessage: "",
        });
    }

    async fetchAllInventoryBatches(): Promise<any[]> {
        try {
            const result = await db.select().from(InventoryBatch);
            return result;
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
