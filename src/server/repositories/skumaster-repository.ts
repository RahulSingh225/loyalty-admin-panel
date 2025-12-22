
import { db } from "@/db/index"; // your drizzle instance
import { SkuMasterModel } from "../../db/schema";
import { eq, sql, inArray } from "drizzle-orm";
import { CustomError, Sku } from "../../types";


class SkuMasterRepository {
    customError: CustomError;

    constructor() {
        this.customError = new CustomError({
            responseCode: 400,
            responseMessage: "",
        });
    }

    async fetchAllSkuMasters(): Promise<any[]> {
        try {
            const result = await db.select().from(SkuMasterModel);
            return result;
        } catch (error: any) {
            this.customError.responseMessage = error.message || "Failed to fetch SKU Master list.";
            throw this.customError;
        }
    }

    async doesSkuExist(skuCode: string): Promise<boolean> {
        try {
            const result = await db
                .select({ id: SkuMasterModel.skuId })
                .from(SkuMasterModel)
                .where(eq(SkuMasterModel.skuCode, skuCode))
                .limit(1); // Optimization: fetch only one row

            return result.length > 0;
        } catch (error: any) {
            this.customError.responseMessage = error.message || "Failed to check SKU existence.";
            throw this.customError;
        }
    }
}

export const skuMasterRepository = new SkuMasterRepository();
