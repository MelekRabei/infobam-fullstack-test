import { Controller, Get, Query } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './types/vehicule.type';

@Controller('vehicles')
export class VehicleController {
  constructor(private readonly vehiclesService: VehicleService) {}

  @Get()
  async getVehicles(
    @Query('sortBy') sortBy?: string,
    @Query('filterBy') filterBy?: string,
    @Query('filterValue') filterValue?: string,
  ): Promise<Vehicle[]> {
    return this.vehiclesService.getAllVehicules(filterBy, filterValue, sortBy);
  }
}
