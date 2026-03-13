import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductOptionValue } from './entities/option-value.entity';
import { OptionValuesService } from './option-values.service';
import { OptionValuesController } from './option-values.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductOptionValue])],
  controllers: [OptionValuesController],
  providers: [OptionValuesService],
  exports: [OptionValuesService],
})

export class OptionValuesModule {}