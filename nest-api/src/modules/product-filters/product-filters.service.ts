import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductFilter } from "./entities/product-filter.entity";

@Injectable()
export class ProductFiltersService {

  constructor(
    @InjectRepository(ProductFilter)
    private readonly productFilterRepo: Repository<ProductFilter>,
  ) { }

  // Get product by optionvalue ids
  async getProductIdsByOptionValueIds(optionValueIds: number[]): Promise<number[]> {
    if (!optionValueIds || optionValueIds.length === 0) {
      return [];
    }

    const rows = await this.productFilterRepo
      .createQueryBuilder('pf')
      .select('pf.productId', 'productId')   // explicit SQL alias
      .where('pf.optionValueId IN (:...optionValueIds)', { optionValueIds })
      .groupBy('pf.productId')
      .having('COUNT(DISTINCT pf.optionValueId) = :count', { count: optionValueIds.length })
      .getRawMany<{ productId: number }>();   // ← type the raw result

    // getRawMany with an aliased select still returns `productId` correctly,
    // but Number() cast is needed because MSSQL may return it as a string
    return rows.map((r) => Number(r.productId)).filter((n) => !isNaN(n));
  }

  // ─── Admin Write operations ──────────────────────────────────────────────────────

  /** Replace all ProductFilter rows for a product with the new set when editing a product or not when creating a new product */
  async setOptionValues(productId: number, optionValueIds: number[]): Promise<void> {
    // Remove existing
    const existing = await this.productFilterRepo.find({ where: { productId } });
    if (existing.length) await this.productFilterRepo.remove(existing);

    // Insert new
    if (optionValueIds.length) {
      const filters = optionValueIds.map((ovId) =>
        this.productFilterRepo.create({ productId, optionValueId: ovId }),
      );
      await this.productFilterRepo.save(filters);
    }
  }
}