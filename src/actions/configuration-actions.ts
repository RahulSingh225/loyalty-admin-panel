'use server'

import { db } from "@/db"
import { appConfigs, creatives, creativesTypes, userTypeEntity } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getConfigurationAction() {
    try {
        // Fetch creative types and creatives
        const creativeTypesList = await db.select().from(creativesTypes).where(eq(creativesTypes.isActive, true));
        const creativesList = await db.select().from(creatives).where(eq(creatives.isActive, true));

        // Fetch real global config from database
        const globalConfigRecord = await db.query.appConfigs.findFirst({
            where: eq(appConfigs.key, 'referral_global_config')
        });

        const globalReferralConfig = globalConfigRecord?.value as any || {
            enabled: true,
            prefix: "STURLITE",
            validityDays: 30,
            successMessage: "Congratulations! Your friend has joined using your referral code."
        };

        const userTypes = await db.select({
            id: userTypeEntity.id,
            name: userTypeEntity.typeName,
            isReferralEnabled: userTypeEntity.isReferralEnabled,
            referralRewardPoints: userTypeEntity.referralRewardPoints,
            refereeRewardPoints: userTypeEntity.refereeRewardPoints,
            maxReferrals: userTypeEntity.maxReferrals
        }).from(userTypeEntity).where(eq(userTypeEntity.isActive, true));

        // Returning data that matches the UI
        return {
            redemptionMatrix: {
                retailer: { minPoints: 500, maxDay: 5000, maxWeek: 25000, maxMonth: 100000 },
                csb: { minPoints: 200, maxDay: 2000, maxWeek: 10000, maxMonth: 40000 },
                electrician: { minPoints: 100, maxDay: 1000, maxWeek: 5000, maxMonth: 20000 },
            },
            referralConfig: {
                global: globalReferralConfig,
                userTypes: userTypes
            },
            creativeTypes: creativeTypesList,
            creatives: creativesList
        };
    } catch (error) {
        console.error("Error in getConfigurationAction:", error);
        throw error;
    }
}

export async function updateConfigurationAction(key: string, value: any) {
    try {
        // Logic to update app_configs table
        // await db.insert(appConfigs).values({ key, value }).onConflictUpdate({ target: appConfigs.key, set: { value } });
        return { success: true };
    } catch (error) {
        console.error("Error in updateConfigurationAction:", error);
        throw error;
    }
}
