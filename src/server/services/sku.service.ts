
import { skuMasterRepository } from "../repositories/skumaster-repository";

class SkuService {
    async getAllSkus() {
        return await skuMasterRepository.fetchAllSkuMasters();
    }
}

export const skuService = new SkuService();
