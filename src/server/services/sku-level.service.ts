
import { skuLevelRepository } from "../repositories/sku-level-repository";

class SkuLevelService {
    async getL1() {
        return await skuLevelRepository.fetchL1();
    }

    async getL2(l1Id?: number) {
        return await skuLevelRepository.fetchL2(l1Id);
    }

    async getL3(l2Id?: number) {
        return await skuLevelRepository.fetchL3(l2Id);
    }

    async getL4(l3Id?: number) {
        return await skuLevelRepository.fetchL4(l3Id);
    }

    async getL5(l4Id?: number) {
        return await skuLevelRepository.fetchL5(l4Id);
    }

    async getL6(l5Id?: number) {
        return await skuLevelRepository.fetchL6(l5Id);
    }
}

export const skuLevelService = new SkuLevelService();
