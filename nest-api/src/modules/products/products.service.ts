import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, SelectQueryBuilder } from 'typeorm';

import { Product } from './entities/product.entity';
import { ProductOption } from '../product-options/entities/option.entity';
import { ProductOptionValue } from '../product-option-values/entities/option-value.entity';
import { ProductFilter } from '../product-filters/entities/product-filter.entity';

import { ProductFiltersService } from '../product-filters/product-filters.service';

import {
  ProductFilterParams,
  CategoryInfo,
  CreateProductRequest,
  OptionGroupResponse,
  PaginatedResponse,
  ProductDetailResponse,
  ProductSearchParams,
  ProductSummaryResponse,
  SearchResponse,
  UpdateProductRequest,
} from './dtos/products.dtos';

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

    private readonly productFiltersService: ProductFiltersService,
  ) { }

  // ─── Public queries ────────────────────────────────────────────────────────

  async getById(id: number): Promise<ProductDetailResponse | null> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.mapToDetail(product, await this.fetchOptions([product.id]));
  }

  async getBySlug(slug: string): Promise<ProductDetailResponse | null> {
    const product = await this.productRepo.findOne({ where: { slug } });
    if (!product) throw new NotFoundException('Product not found');
    return this.mapToDetail(product, await this.fetchOptions([product.id]));
  }

  /** Newest products in a category */
  async getCategoryNewestProducts(categoryId: number, amount: number): Promise<ProductSummaryResponse[]> {
    const products = await this.productRepo.find({
      take: amount,
      where: { categoryId },
      order: { createdAt: 'DESC' },
    });
    return this.mapToSummaryList(products, await this.fetchOptions(products.map((p) => p.id)));
  }

  /** Full-text search across name / shortDescription / description / category name */
  async search(params: ProductSearchParams): Promise<SearchResponse> {
    const q = (params.queryPhrase ?? '').trim().toLowerCase().slice(0, 200);
    if (!q) throw new NotFoundException('Search query is required');

    const page = Math.max(1, params.page);
    const pageSize = Math.min(Math.max(1, params.pageSize), 100);

    let query = this.productRepo
      .createQueryBuilder('p')
      .where(
        `(LOWER(p.name) LIKE :q
          OR LOWER(p.shortDescription) LIKE :q
          OR LOWER(p.description)       LIKE :q)`,
        { q: `%${q}%` },
      );

    query = this.applyPriceFilter(query, params.minPrice, params.maxPrice);

    switch (params.sortOrder) {
      case 'price_asc':
        query.orderBy('p.basePrice', 'ASC');
        break;
      case 'price_desc':
        query.orderBy('p.basePrice', 'DESC');
        break;
      case 'newest':
        query.orderBy('p.id', 'DESC');
        break;
      case 'name':
        query.orderBy('p.name', 'ASC');
        break;
      default:
        query.orderBy('p.id', 'DESC'); // relevance fallback
    }

    const totalCount = await query.getCount();
    const items = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    const totalPages = Math.ceil(totalCount / pageSize);
    const optionMap = await this.fetchOptions(items.map((p) => p.id));

    return {
      success: true,
      query: params.queryPhrase,
      totalCount,
      pageNumber: page,
      pageSize,
      totalPages,
      hasNextPage: (page - 1) * pageSize + items.length < totalCount,
      hasPreviousPage: page > 1,
      products: this.mapToSummaryList(items, optionMap),
    };
  }

  /** Autocomplete suggestions — returns product names matching the query */
  async getSuggestions(q: string, limit: number = 10): Promise<string[]> {
    if (!q || q.length < 2) return [];

    const items = await this.productRepo
      .createQueryBuilder('p')
      .where('LOWER(p.name) LIKE :q', { q: `%${q.toLowerCase()}%` })
      .orderBy('p.id', 'DESC')
      .take(Math.min(limit, 100))
      .getMany();

    return [...new Set(items.map((p) => p.name))].slice(0, limit);
  }

  /** Paginated list with category / price / option / sort / search filters */
  async getPaginated(params: ProductFilterParams): Promise<PaginatedResponse<ProductSummaryResponse>> {
    console.log(params);
    const page = Math.max(1, params.page);
    const pageSize = Math.min(Math.max(1, params.pageSize), 100);

    let query = this.productRepo.createQueryBuilder('p');

    // ── Search ──────────────────────────────────────────────────────────────
    if (params.search) {
      const term = params.search.trim().toLowerCase();
      query.andWhere(
        '(LOWER(p.name) LIKE :term OR LOWER(p.slug) LIKE :term)',
        { term: `%${term}%` },
      );
    }

    // ── Category filter ──────────────────────────────────────────────────────
    if (params.category) {
      // Join category once to filter by slug
      query
        .innerJoin('Categories', 'cat', 'cat.id = p.categoryId')
        .andWhere('cat.slug = :slug', { slug: params.category });
    }

    // ── Price filter ─────────────────────────────────────────────────────────
    query = this.applyPriceFilter(query, params.minPrice, params.maxPrice);

    // ── Option value filter (AND across option groups, OR within each group) ─
    if (params.options) {
      const optionValueIds = this.parseOptionIds(params.options);
      if (optionValueIds.length > 0) {
        const matchingProductIds =
          await this.productFiltersService.getProductIdsByOptionValueIds(optionValueIds);

        if (matchingProductIds.length === 0) {
          return {
            success: true,
            data: [],
            pagination: {
              currentPage: page,
              pageSize,
              totalCount: 0,
              totalPages: 0,
              hasNextPage: false,
              hasPreviousPage: false,
            },
          };
        }
        query.andWhere('p.id IN (:...matchingProductIds)', { matchingProductIds });
      }
    }

    // ── Sort ─────────────────────────────────────────────────────────────────
    switch (params.sortOrder) {
      case 'ascending':
        query.orderBy('p.basePrice', 'ASC');
        break;
      case 'descending':
        query.orderBy('p.basePrice', 'DESC');
        break;
      case 'oldest':
        query.orderBy('p.id', 'ASC');
        break;
      default:
        query.orderBy('p.id', 'DESC'); // newest
    }

    // ── Pagination ───────────────────────────────────────────────────────────
    const totalCount = await query.getCount();
    const items = await query
      .skip((page - 1) * pageSize)
      .take(pageSize)
      .getMany();

    const totalPages = Math.ceil(totalCount / pageSize);
    const optionMap = await this.fetchOptions(items.map((p) => p.id));

    return {
      success: true,
      data: this.mapToSummaryList(items, optionMap),
      pagination: {
        currentPage: page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      },
    };
  }

  // ─── Admin Write operations ──────────────────────────────────────────────────────

  async create(request: CreateProductRequest): Promise<number> {
    const slugExists = await this.productRepo.findOne({
      where: { slug: request.slug },
    });
    if (slugExists) {
      throw new ConflictException(
        `A product with slug '${request.slug}' already exists.`,
      );
    }

    const product = this.productRepo.create({
      name: request.name,
      slug: request.slug,
      shortDescription: request.shortDescription,
      description: request.description,
      basePrice: request.basePrice,
      thumbnailUrl: request.thumbnailUrl,
      categoryId: request.categoryId,
      hasVariants: request.hasVariants ?? false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const saved = await this.productRepo.save(product);

    if (request.selectedOptionValueIds?.length) {
      await this.productFiltersService.setOptionValues(saved.id, request.selectedOptionValueIds);
    }

    return saved.id;
  }

  async update(id: number, request: UpdateProductRequest): Promise<boolean> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) return false;

    if (request.name) product.name = request.name;
    if (request.slug) product.slug = request.slug;
    if (request.shortDescription !== undefined)
      product.shortDescription = request.shortDescription;
    if (request.description !== undefined) product.description = request.description;
    if (request.basePrice != null && request.basePrice > 0)
      product.basePrice = request.basePrice;
    if (request.thumbnailUrl !== undefined) product.thumbnailUrl = request.thumbnailUrl;
    if (request.categoryId != null) product.categoryId = request.categoryId;
    if (request.hasVariants !== undefined) product.hasVariants = request.hasVariants;
    product.updatedAt = new Date();

    await this.productRepo.save(product);

    if (request.selectedOptionValueIds !== undefined) {
      await this.productFiltersService.setOptionValues(id, request.selectedOptionValueIds);
    }

    return true;
  }

  async delete(id: number): Promise<boolean> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) return false;
    await this.productRepo.remove(product);
    return true;
  }

  // ─── Private helpers ───────────────────────────────────────────────────────

  // Batch-fetch all ProductFilter → OptionValue → Option rows for a list of
  private async fetchOptions(productIds: number[]): Promise<Map<number, OptionGroupResponse[]>> {
    const result = new Map<number, OptionGroupResponse[]>();
    if (!productIds.length) return result;

    // Fetch an array of ProductFilters from the given productIds (ProductId, OptionValueId)[] - Find OptionValueId for each Product
    const filters = await this.productFilterRepo.find({
      where: { productId: In(productIds) },
    });

    // Validate
    if (!filters.length) {
      productIds.forEach((id) => result.set(id, []));
      return result;
    }

    // Get all OptionValueIds and remove duplicates using Set
    const ovIds = [...new Set(filters.map((f) => f.optionValueId))];
    // Fetch an array of ProductOptionValues (Id, Value, ProductOptionId)[] - Find Option for each OptionValue
    const optionValues = await this.optionValueRepo.find({
      where: { id: In(ovIds) },
    });

    // Get all OptionIds and remove duplicates using Set
    const optIds = [...new Set(optionValues.map((v) => v.productOptionId))];
    // Fetch an array of ProductOptions (Id, Name, CategoryId)[]
    const options = await this.optionRepo.find({ where: { id: In(optIds) } });

    // Create lookup maps for OptionValue and Option by their IDs for quick access
    const povMap = new Map(optionValues.map((v) => [v.id, v])); // optionValueId → ProductOptionValue
    const poMap = new Map(options.map((o) => [o.id, o]));       // optionId → ProductOption

    // Group OptionValueIds for each ProductId - productId → ProductFilters[] (productId → (productId, optionValueId)[])
    const byProduct = new Map<number, typeof filters>();
    for (const f of filters) {
      if (!byProduct.has(f.productId)) byProduct.set(f.productId, []);
      byProduct.get(f.productId)!.push(f);
    }

    // Build OptionGroupResponse[] for each product
    for (const productId of productIds) {
      const pFilters = byProduct.get(productId) ?? [];  // Get ProductFilters for product (array of { productId, optionValueId })
      const groupMap = new Map<number, OptionGroupResponse>();

      for (const pf of pFilters) {
        const pov = povMap.get(pf.optionValueId); // Get ProductOptionValue for ProductFilter (optionValueId → { id, value, productOptionId })
        if (!pov) continue;
        const po = poMap.get(pov.productOptionId);  // Get ProductOption for ProductOptionValue (productOptionId → { id, name, categoryId })
        if (!po) continue;

        if (!groupMap.has(po.id)) {
          groupMap.set(po.id, {
            optionName: po.name,
            values: [],
          });
        }
        groupMap.get(po.id)!.values.push(pov.value);
      }

      result.set(productId, [...groupMap.values()]);
    }

    return result;
  }

  private applyPriceFilter(
    query: SelectQueryBuilder<Product>,
    min?: number,
    max?: number,
  ): SelectQueryBuilder<Product> {
    if (min != null && min > 0) query.andWhere('p.basePrice >= :min', { min });
    if (max != null && max < Number.MAX_SAFE_INTEGER)
      query.andWhere('p.basePrice <= :max', { max });
    return query;
  }

  private parseOptionIds(raw?: string): number[] {
    if (!raw) return [];
    return raw
      .split(',')
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n));
  }

  // ─── Private Mapping helpers ───────────────────────────────────────────────────────

  private mapCategory(product: Product): CategoryInfo | undefined {
    if (!product.category) return undefined;
    return {
      id: product.category.id,
      name: product.category.name,
      slug: product.category.slug,
    };
  }

  private mapToDetail(
    product: Product,
    optionMap: Map<number, OptionGroupResponse[]>,
  ): ProductDetailResponse {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      shortDescription: product.shortDescription,
      description: product.description,
      basePrice: Number(product.basePrice),
      thumbnailUrl: product.thumbnailUrl,
      categoryId: product.categoryId,
      category: this.mapCategory(product),
      hasVariants: product.hasVariants,
      options: optionMap.get(product.id) ?? [],
    };
  }

  private mapToSummary(
    product: Product,
    optionMap: Map<number, OptionGroupResponse[]>,
  ): ProductSummaryResponse {
    return {
      id: product.id,
      name: product.name,
      slug: product.slug,
      basePrice: Number(product.basePrice),
      thumbnailUrl: product.thumbnailUrl,
      shortDescription: product.shortDescription,
      categoryId: product.categoryId,
      options: optionMap.get(product.id) ?? [],
    };
  }

  private mapToSummaryList(
    products: Product[],
    optionMap: Map<number, OptionGroupResponse[]>,
  ): ProductSummaryResponse[] {
    return products.map((p) => this.mapToSummary(p, optionMap));
  }
}