import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { ProductOption } from "../product-options/entities/option.entity";
import { ProductOptionValue } from "../product-option-values/entities/option-value.entity";
import { ProductFilter } from "../product-filters/entities/product-filter.entity";
import { CategoriesService } from "../categories/categories.service";
import { ProductFiltersService } from "../product-filters/product-filters.service";

export interface Filters {
  minPrice: number,
  maxPrice: number,
  sortOrder: string,
  options: string,
}

export interface EnrichedOption {
  optionId: number;
  optionName: string;
  optionValues: { optionValueId: number; value: string }[];
}

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(ProductFilter)
    private readonly productFilterRepo: Repository<ProductFilter>,

    @InjectRepository(ProductOptionValue)
    private readonly optionValueRepo: Repository<ProductOptionValue>,

    @InjectRepository(ProductOption)
    private readonly optionRepo: Repository<ProductOption>,

    private readonly categoriesService: CategoriesService,
    private readonly productFiltersService: ProductFiltersService,
  ) { }

  // Enrich Products with Options Data
  private async enrichWithOptions(products: Product[]): Promise<(Product & { options: EnrichedOption[] })[]> {
    if (!products.length) return [];

    const productIds = products.map((p) => p.id);

    // Fetch all ProductFilter rows for products
    const filters = await this.productFilterRepo.find({
      where: { productId: In(productIds) },
    });

    if (!filters.length) {
      return products.map((p) => ({ ...p, options: [] }));
    }

    // Fetch all ProductOptionValues used by these filters
    const optionValueIds = [...new Set(filters.map((f) => f.optionValueId))];
    const optionValues = await this.optionValueRepo.find({
      where: { id: In(optionValueIds) },
    });

    // Fetch all relevant ProductOptions
    const optionIds = [...new Set(optionValues.map((v) => v.productOptionId))];
    const options = await this.optionRepo.find({
      where: { id: In(optionIds) },
    });

    // Build lookup maps for O(1) access
    const optionValueMap = new Map(optionValues.map((v) => [v.id, v]));
    const optionMap = new Map(options.map((o) => [o.id, o]));

    // Group filters by productId
    const filtersByProduct = new Map<number, ProductFilter[]>();
    for (const f of filters) {
      if (!filtersByProduct.has(f.productId)) {
        filtersByProduct.set(f.productId, []);
      }
      filtersByProduct.get(f.productId)!.push(f);
    }

    // Assemble enriched products
    return products.map((product) => {
      const productFilters = filtersByProduct.get(product.id) ?? [];

      // Group option values under their parent option
      const optionGroupMap = new Map<number, EnrichedOption>();

      for (const pf of productFilters) {
        const ov = optionValueMap.get(pf.optionValueId);
        if (!ov) continue;

        const opt = optionMap.get(ov.productOptionId);
        if (!opt) continue;

        if (!optionGroupMap.has(opt.id)) {
          optionGroupMap.set(opt.id, {
            optionId: opt.id,
            optionName: opt.name,
            optionValues: [],
          });
        }

        optionGroupMap.get(opt.id)!.optionValues.push({
          optionValueId: ov.id,
          value: ov.value,
        });
      }

      return {
        ...product,
        options: [...optionGroupMap.values()],
      };
    });
  }

  // Get all products data
  async getAll() {
    const products = await this.productRepo.find();
    return products;
  }

  // Get all products in a category by category ID
  async getByCategoryId(categoryId: number) {
    const products = await this.productRepo.find({
      where: { categoryId: categoryId }
    });
    return products;
  }

  // Get all products in a category by category slug
  async getByCategorySlug(categorySlug: string) {
    const category = await this.categoriesService.getBySlug(categorySlug);
    return this.getByCategoryId(category.id);
  }

  // Get a product's data by ID
  async getById(id: number) {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  // Get a product's data by slug
  async getBySlug(slug: string) {
    const product = await this.productRepo.findOne({ where: { slug } });
    if (!product) throw new NotFoundException('Product not found');

    const enriched = await this.enrichWithOptions([product]);

    // return the first element from enriched
    return enriched[0];
  }

  // Get products by filters (category, minPrice, maxPrice, sortOrder, options)
  async getByFilters(category: string, filters: Filters) {
    const categoryData = await this.categoriesService.getBySlug(category);

    if (!categoryData) {
      throw new NotFoundException('Category not found');
    }

    // Filter products by category
    const query = this.productRepo.createQueryBuilder('product')
      .where('product.categoryId = :categoryId', { categoryId: categoryData.id })

    // Filter products by price range
    if (filters.minPrice) {
      query.andWhere('product.price >= :minPrice', { minPrice: filters.minPrice });
    }

    if (filters.maxPrice) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: filters.maxPrice });
    }

    // ── Option values filter ──────────────────────────────────────────────────
    // The frontend sends a comma-separated string of optionValueIds, e.g. "3,7,12"
    if (filters.options && filters.options.trim() !== '') {
      const optionValueIds = filters.options
        .split(',')
        .map((v) => parseInt(v.trim(), 10))
        .filter((n) => !isNaN(n));

      if (optionValueIds.length > 0) {
        // Ask ProductFiltersService for the matching product IDs
        const matchingProductIds =
          await this.productFiltersService.getProductIdsByOptionValueIds(optionValueIds);

        if (matchingProductIds.length === 0) {
          // No products match the selected options — return empty early
          return [];
        }

        query.andWhere('product.id IN (:...matchingProductIds)', { matchingProductIds });
      }
    }

    // Filter products by sort order
    let sortField = 'product.id';  // default sort → newest
    let sortDirection: 'ASC' | 'DESC' = 'DESC';

    if (filters.sortOrder) {
      const order = filters.sortOrder.toLowerCase();

      switch (order) {
        case 'ascending':
          sortField = 'product.price';
          sortDirection = 'ASC';
          break;

        case 'descending':
          sortField = 'product.price';
          sortDirection = 'DESC';
          break;

        case 'oldest':
          sortField = 'product.id';
          sortDirection = 'ASC';
          break;
      }
    }
    query.orderBy(sortField, sortDirection);

    // Return products matching the filters
    const products = await query.getMany();
    return this.enrichWithOptions(products);
  }
}
