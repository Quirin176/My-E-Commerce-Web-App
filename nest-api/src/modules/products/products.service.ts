import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Product } from "./entities/product.entity";
import { CategoriesService } from "../categories/categories.service";
import { ProductFiltersService } from "../product-filters/product-filters.service";

export interface Filters {
  minPrice: number,
  maxPrice: number,
  sortOrder: string,
  options: string,
}

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
    private readonly categoriesService: CategoriesService,
    private readonly productFiltersService: ProductFiltersService,
  ) { }

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
    return product;
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

    // Return products matching the filters
    return query.getMany();
  }
}
