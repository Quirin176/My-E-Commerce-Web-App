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
  async getAllProductsByOptionValueIds(optionValueIds: number[]) {
    const filteredProducts = await this.productFilterRepo.find({optionValueIds[]})
  }
}
