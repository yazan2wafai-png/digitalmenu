import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, ForbiddenException } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import type { AuthenticatedRequest } from '../auth/strategies/jwt.strategy';
import type { Location } from '@prisma/client';

@UseGuards(JwtAuthGuard)
@Controller('admin/restaurants/:slug/locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  private verifyOwnership(req: AuthenticatedRequest, slug: string): void {
    if (req.user.restaurantSlug !== slug) {
      throw new ForbiddenException('You can only access locations for your own restaurant');
    }
  }

  @Get()
  findAll(@Param('slug') slug: string, @Req() req: AuthenticatedRequest): Promise<Location[]> {
    this.verifyOwnership(req, slug);
    return this.locationsService.findAll(req.user.restaurantId ?? '');
  }

  @Post()
  create(
    @Param('slug') slug: string,
    @Req() req: AuthenticatedRequest,
    @Body() createLocationDto: CreateLocationDto,
  ): Promise<Location> {
    this.verifyOwnership(req, slug);
    return this.locationsService.create(req.user.restaurantId ?? '', createLocationDto);
  }

  @Patch(':id')
  update(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
    @Body() updateLocationDto: UpdateLocationDto,
  ): Promise<Location> {
    this.verifyOwnership(req, slug);
    return this.locationsService.update(id, req.user.restaurantId ?? '', updateLocationDto);
  }

  @Delete(':id')
  remove(
    @Param('slug') slug: string,
    @Param('id') id: string,
    @Req() req: AuthenticatedRequest,
  ): Promise<Location> {
    this.verifyOwnership(req, slug);
    return this.locationsService.remove(id, req.user.restaurantId ?? '');
  }
}
