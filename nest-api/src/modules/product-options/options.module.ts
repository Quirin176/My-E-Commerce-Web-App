import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOption } from './entities/option.entity';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { CategoriesModule } from '../categories/categories.module';
import { OptionValuesModule } from '../product-option-values/option-values.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOption]), CategoriesModule, OptionValuesModule],
  controllers: [OptionsController],
  providers: [OptionsService],
  exports: [OptionsService],
})

export class OptionsModule {}