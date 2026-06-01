import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

// ─── Requests ──────────────────────────────────────────────────────────────

export class CreateProductRequest {
  @IsString()
  name!: string;

  @IsString()
  slug!: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  basePrice!: number;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsNumber()
  categoryId!: number;

  @IsArray()
  @IsNumber({}, { each: true })
  selectedOptionValueIds: number[] = [];

  @IsBoolean()
  hasVariants: boolean = false;
}

export class UpdateProductRequest {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  shortDescription?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  basePrice?: number;

  @IsOptional()
  @IsString()
  thumbnailUrl?: string;

  @IsOptional()
  @IsNumber()
  categoryId?: number;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  selectedOptionValueIds?: number[];

  @IsOptional()
  @IsBoolean()
  hasVariants?: boolean;
}

/** Query params for the public filter / admin paginated endpoint */
export class AdminProductFilterParams {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice: number = Number.MAX_SAFE_INTEGER;

  /** Comma-separated ProductOptionValue IDs, e.g. "1,3,7" */
  @IsOptional()
  @IsString()
  options?: string;

  @IsOptional()
  @IsString()
  sortOrder: string = 'newest';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize: number = 10;

  @IsOptional()
  @IsString()
  search?: string;
}

/** Query params for the public search endpoint */
export class ProductSearchParams {
  @IsString()
  queryPhrase: string = '';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  pageSize: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minPrice: number = 0;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice: number = Number.MAX_SAFE_INTEGER;

  @IsOptional()
  @IsString()
  sortOrder: string = 'relevance';
}

// ─── Nested response shapes ─────────────────────────────────────────────────

export interface CategoryInfo {
  id: number;
  name: string;
  slug: string;
}

export interface OptionValueItem {
  optionValueId: number;
  value: string;
}

export interface OptionGroupResponse {
  optionId: number;
  optionName: string;
  optionValues: OptionValueItem[];
}

// ─── Response shapes ────────────────────────────────────────────────────────

/** Full product detail — used on product detail page and admin edit */
export interface ProductDetailResponse {
  id: number;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  basePrice: number;
  thumbnailUrl?: string;
  categoryId: number;
  category?: CategoryInfo;
  hasVariants: boolean;
  options: OptionGroupResponse[];
}

/** Lightweight summary — used in list / filter / search results */
export interface ProductSummaryResponse {
  id: number;
  name: string;
  slug: string;
  basePrice: number;
  thumbnailUrl?: string;
  shortDescription?: string;
  categoryId: number;
  options: OptionGroupResponse[];
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface SearchResponse {
  success: boolean;
  query: string;
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  products: ProductSummaryResponse[];
}