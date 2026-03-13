import { Controller, Get, Param, Req } from '@nestjs/common';
import { OptionValuesService } from './option-values.service';

@Controller('optionvalues') // API endpoint: /api/optionvalues
export class OptionValuesController {
  constructor(private readonly optionValuesService: OptionValuesService) { }

  // GET /optionvalues
  @Get()
  getAll() {
    return this.optionValuesService.getAll();
  }

  // GET /optionvalues/id/:id
  @Get('id/:id')
  getById(@Param('id') id: number) {
    return this.optionValuesService.getById(id);
  }

  // // GET /optionvalues/slug/:slug
  // @Get('slug/:slug')
  // getBySlug(@Param('slug') slug: string) {
  //   return this.optionValuesService.getBySlug(slug);
  // }

  // GET /optionvalues/option/id/:id - Get option values by option ID
  @Get('option/id/:id')
  getByOptionIds(@Param('id') id: number) {
    return this.optionValuesService.getByOptionIds(id);
  }
}
