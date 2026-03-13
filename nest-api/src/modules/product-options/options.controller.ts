import { Controller, Get, Param, Req } from '@nestjs/common';
import { OptionsService } from './options.service';

@Controller('productoptions') // API endpoint: /api/options
export class OptionsController {
  constructor(private readonly optionsService: OptionsService) { }

  // GET /productoptions
  @Get()
  getAll() {
    return this.optionsService.getAll();
  }

  // GET /productoptions/id/:id
  @Get('id/:id')
  getById(@Param('id') id: number) {
    return this.optionsService.getById(id);
  }

  // GET /productoptions/category/slug/:slug
  @Get('category/slug/:slug')
  getAllDataByCategorySlug(@Param('slug') slug: string) {
    return this.optionsService.getAllDataByCategorySlug(slug);
  }
}
