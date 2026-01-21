'use server'

import { db } from "@/db"
import { appConfigs } from "@/db/schema"
import { eq } from "drizzle-orm"

export async function getConfigurationAction() {
    try {
        // In a real app, you would fetch from database
        // const configs = await db.select().from(appConfigs);

        // Returning mock data that matches the UI for now
        return {
            redemptionMatrix: {
                retailer: { minPoints: 500, maxDay: 5000, maxWeek: 25000, maxMonth: 100000 },
                csb: { minPoints: 200, maxDay: 2000, maxWeek: 10000, maxMonth: 40000 },
                electrician: { minPoints: 100, maxDay: 1000, maxWeek: 5000, maxMonth: 20000 },
            },
            referralConfig: {
                enabled: true,
                referralPoints: 100,
                refereePoints: 50,
                successMessage: "Congratulations! Your friend has joined using your referral code.",
                prefix: "STURLITE",
                maxReferrals: 10,
                validityDays: 30
            }
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
