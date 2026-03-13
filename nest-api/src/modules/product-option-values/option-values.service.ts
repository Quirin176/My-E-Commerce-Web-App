import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductOptionValue } from "./entities/option-value.entity";

@Injectable()
export class OptionValuesService {

  constructor(
    @InjectRepository(ProductOptionValue)
    private readonly optionValueRepo: Repository<ProductOptionValue>,
  ) { }

  // Get all option values
  async getAll() {
    const optionValues = await this.optionValueRepo.find();
    return optionValues;
  }

  // Get an option value by ID
  async getById(id: number) {
    const optionValue = await this.optionValueRepo.findOne({ where: { id } });
    if (!optionValue) throw new NotFoundException('Option value not found');
    return optionValue;
  }

  // // Get an option value by slug
  // async getBySlug(slug: string) {
  //   const optionValue = await this.optionValueRepo.findOne({ where: { slug } });
  //   if (!optionValue) throw new NotFoundException('Option value not found');
  //   return optionValue;
  // }

  // Get option values by option IDs
  async getByOptionIds(productOptionId: number) {
    const optionValues = await this.optionValueRepo.find({ where: { productOptionId } });
    return optionValues;
  }
}
