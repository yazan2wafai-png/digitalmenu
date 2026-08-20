import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('admin/restaurants/:slug/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  private verifyOwnership(req: any, slug: string) {
    if (req.user.restaurantSlug !== slug) {
      throw new ForbiddenException('You can only access locations for your own restaurant');
    }
  }

  @Get()
  findAll(@Param('slug') slug: string, @Req() req: any) {
    this.verifyOwnership(req, slug);
    return this.locationsService.findAll(req.user.restaurantId);
  }

  @Post()
  create(@Param('slug') slug: string, @Req() req: any, @Body() createLocationDto: CreateLocationDto) {
    this.verifyOwnership(req, slug);
    return this.locationsService.create(req.user.restaurantId, createLocationDto);
  }

  @Patch(':id')
  update(@Param('slug') slug: string, @Param('id') id: string, @Req() req: any, @Body() updateLocationDto: UpdateLocationDto) {
    this.verifyOwnership(req, slug);
    return this.locationsService.update(id, req.user.restaurantId, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('slug') slug: string, @Param('id') id: string, @Req() req: any) {
    this.verifyOwnership(req, slug);
    return this.locationsService.remove(id, req.user.restaurantId);
  }
}
