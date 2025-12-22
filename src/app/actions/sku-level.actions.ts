'use server';

import { skuLevelService } from "@/server/services/sku-level.service";

export async function fetchL1Action() {
    try {
        return await skuLevelService.getL1();
    } catch (error) {
        console.error("Failed to fetch L1:", error);
        return [];
    }
}

export async function fetchL2Action(l1Id?: number) {
    try {
        return await skuLevelService.getL2(l1Id);
    } catch (error) {
        console.error("Failed to fetch L2:", error);
        return [];
    }
}

export async function fetchL3Action(l2Id?: number) {
    try {
        return await skuLevelService.getL3(l2Id);
    } catch (error) {
        console.error("Failed to fetch L3:", error);
        return [];
    }
}

export async function fetchL4Action(l3Id?: number) {
    try {
        return await skuLevelService.getL4(l3Id);
    } catch (error) {
        console.error("Failed to fetch L4:", error);
        return [];
    }
}

export async function fetchL5Action(l4Id?: number) {
    try {
        return await skuLevelService.getL5(l4Id);
    } catch (error) {
        console.error("Failed to fetch L5:", error);
        return [];
    }
}

export async function fetchL6Action(l5Id?: number) {
    try {
        return await skuLevelService.getL6(l5Id);
    } catch (error) {
        console.error("Failed to fetch L6:", error);
        return [];
    }
}
