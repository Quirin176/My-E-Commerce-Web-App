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

    // Raw query: group by productId, count how many of the requested
    // option values are matched, then keep only products that match all of them.
    const rows = await this.productFilterRepo
      .createQueryBuilder('pf')
      .select('pf.productId', 'productId')
      .where('pf.optionValueId IN (:...optionValueIds)', { optionValueIds })
      .groupBy('pf.productId')
      .having('COUNT(DISTINCT pf.optionValueId) = :count', { count: optionValueIds.length })
      .getRawMany();

    return rows.map((r) => Number(r.productId));
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