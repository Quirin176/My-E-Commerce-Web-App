import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ProductOption } from "./entities/option.entity";
import { CategoriesService } from "../categories/categories.service";
import { OptionValuesService } from "../product-option-values/option-values.service";

@Injectable()
export class OptionsService {

  constructor(
    @InjectRepository(ProductOption)
    private readonly optionRepo: Repository<ProductOption>,
    private readonly categoriesService: CategoriesService,
    private readonly optionValuesService: OptionValuesService,
  ) { }

  // Get all options data
  async getAll() {
    const options = await this.optionRepo.find();
    return options;
  }

  // Get an option's data by ID
  async getById(id: number) {
    const option = await this.optionRepo.findOne({ where: { id } });
    if (!option) throw new NotFoundException('Option not found');
    return option;
  }

  // Get options data from a category id
  async getByCategoryId(categoryId: number) {
    const options = await this.optionRepo.find({ where: { categoryId } });
    return options;
  }

  // Get all options and optionvalues data from a category slug
  async getAllDataByCategorySlug(categorySlug: string) {
    const category = await this.categoriesService.getBySlug(categorySlug);
    if (!category) throw new NotFoundException('Category not found');

    const options = await this.optionRepo.find({ where: { categoryId: category.id } });
    // console.log("Options for category slug", categorySlug, ":", options);

    const optionsWithValues = await Promise.all(options.map(async (option) => {
      const optionValues = await this.optionValuesService.getByOptionIds(option.id);
      return { ...option, optionValues: optionValues };
    }));
    // console.log(optionsWithValues);

    return optionsWithValues;
  }
  
}
