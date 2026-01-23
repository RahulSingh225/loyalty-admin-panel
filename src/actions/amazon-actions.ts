'use server'

import { db } from '@/db';
import { amazonMarketplaceProducts } from '@/db/schema';
import { desc, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getAmazonProductsAction(page: number = 1, pageSize: number = 50) {
    try {
        const offset = (page - 1) * pageSize;

        const products = await db.select()
            .from(amazonMarketplaceProducts)
            .orderBy(desc(amazonMarketplaceProducts.uploadedAt))
            .limit(pageSize)
            .offset(offset);

        // Get total count
        const [{ count }] = await db.select({ count: sql<number>`count(*)` }).from(amazonMarketplaceProducts);

        // Calculate stats / aggregation for categories if needed
        // For now just returning products

        return {
            success: true,
            products: products.map(p => ({
                id: p.amazonMarketplaceProductId,
                asin_sku: p.amazonAsinSku,
                name: p.amazonProductName,
                image: p.amazonProductImagePath,
                description: p.amazonProductDescription,
                mrp: p.amazonMrp,
                csp_price: p.amazonCspOnAmazon,
                discounted_price: p.amazonDiscountedPrice,
                inventory: p.amazonInventoryCount,
                category: p.amazonCategory,
                sub_category: p.amazonSubCategory,
                category_image: p.amazonCategoryImagePath,
                sub_category_image: p.amazonSubCategoryImagePath,
                points: p.amazonPoints,
                diff: p.amazonDiff,
                url: p.amazonUrl,
                model_no: p.amazonModelNo,
                comments_vendor: p.amazonCommentsVendor,
                created_at: p.uploadedAt,
                updated_at: p.updatedAt,
                status: p.isAmzProductActive
            })),
            pagination: {
                total: Number(count),
                page,
                pageSize,
                totalPages: Math.ceil(Number(count) / pageSize)
            }
        };
    } catch (error) {
        console.error('Error fetching amazon products:', error);
        return { success: false, error: 'Failed to fetch products' };
    }
}

export async function uploadAmazonProductsAction(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) {
            throw new Error('No file uploaded');
        }

        const text = await file.text();
        const lines = text.split('\n');
        // Remove header
        const dataLines = lines.slice(1).filter(line => line.trim() !== '');

        const productsToInsert: any[] = [];

        for (const line of dataLines) {
            // Simple CSV split (handling quotes would need a proper parser, but assuming simple CSV for now)
            // Or better, let's try to handle basic quotes if possible, otherwise simple split
            // The template suggests standard values.
            const cols = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.trim().replace(/^"|"$/g, ''));

            if (cols.length < 6) continue; // Skip invalid lines

            // Mapping based on index in template
            const [
                sNo, category, catImg, subCat, subCatImg, asin, prodImg,
                name, model, desc, mrp, inv, csp, discounted, points, diff, url, comments
            ] = cols;

            if (!asin || !name) continue;

            productsToInsert.push({
                amazonAsinSku: asin,
                amazonProductName: name,
                amazonCategory: category,
                amazonCategoryImagePath: catImg,
                amazonSubCategory: subCat,
                amazonSubCategoryImagePath: subCatImg,
                amazonProductImagePath: prodImg,
                amazonModelNo: model,
                amazonProductDescription: desc,
                amazonMrp: mrp,
                amazonInventoryCount: inv ? parseInt(inv) : 0,
                amazonCspOnAmazon: csp,
                amazonDiscountedPrice: discounted,
                amazonPoints: points ? parseInt(points) : 0,
                amazonDiff: diff,
                amazonUrl: url,
                amazonCommentsVendor: comments,
                uploadedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        }

        // Batch insert or upsert
        for (const prod of productsToInsert) {
            await db.insert(amazonMarketplaceProducts)
                .values(prod)
                .onConflictDoUpdate({
                    target: amazonMarketplaceProducts.amazonAsinSku,
                    set: {
                        amazonProductName: prod.amazonProductName,
                        amazonCategory: prod.amazonCategory,
                        amazonCategoryImagePath: prod.amazonCategoryImagePath,
                        amazonSubCategory: prod.amazonSubCategory,
                        amazonSubCategoryImagePath: prod.amazonSubCategoryImagePath,
                        amazonProductImagePath: prod.amazonProductImagePath,
                        amazonModelNo: prod.amazonModelNo,
                        amazonProductDescription: prod.amazonProductDescription,
                        amazonMrp: prod.amazonMrp,
                        amazonInventoryCount: prod.amazonInventoryCount,
                        amazonCspOnAmazon: prod.amazonCspOnAmazon,
                        amazonDiscountedPrice: prod.amazonDiscountedPrice,
                        amazonPoints: prod.amazonPoints,
                        amazonDiff: prod.amazonDiff,
                        amazonUrl: prod.amazonUrl,
                        amazonCommentsVendor: prod.amazonCommentsVendor,
                        updatedAt: new Date().toISOString()
                    }
                });
        }

        revalidatePath('/process');
        return { success: true, count: productsToInsert.length };

    } catch (error: any) {
        console.error('Error uploading amazon products:', error);
        return { success: false, error: error.message };
    }
}
