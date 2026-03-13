import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductFilter } from './entities/product-filter.entity';
import { ProductFiltersService } from './product-filters.service';
import { ProductFiltersController } from './product-filters.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductFilter])],
  controllers: [ProductFiltersController],
  providers: [ProductFiltersService],
  exports: [ProductFiltersService],
})

export class ProductFiltersModule {}