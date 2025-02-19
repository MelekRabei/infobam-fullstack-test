import { Injectable } from '@nestjs/common';
import { mockVehicles } from './mock/vehicules.mock';
import { Vehicle } from './types/vehicule.type';

@Injectable()
export class VehicleService {
  getAllVehicules(
    filterBy?: string,
    filterValue?: string,
    sortBy?: string,
  ): Vehicle[] {
    let filteredVehicles = [...mockVehicles];

    if (filterBy && filterValue) {
      const lowerCaseFilterValue = filterValue.toLowerCase();

      filteredVehicles = filteredVehicles.filter((vehicle) => {
        const vehicleValue = vehicle[filterBy as keyof Vehicle];

        if (vehicleValue === null || vehicleValue === undefined) return false;

        const strValue = vehicleValue.toString().toLowerCase();
        return strValue.includes(lowerCaseFilterValue);
      });
    }

    if (sortBy) {
      const [field, order] = sortBy.startsWith('-')
        ? [sortBy.slice(1), -1]
        : [sortBy, 1];

      filteredVehicles.sort((a, b) => {
        const aValue = a[field as keyof Vehicle];
        const bValue = b[field as keyof Vehicle];

        if (aValue === undefined || aValue === null) return -1 * order;
        if (bValue === undefined || bValue === null) return 1 * order;

        const comparison =
          (aValue > bValue ? 1 : aValue < bValue ? -1 : 0) * order;

        return comparison;
      });
    }

    return filteredVehicles;
  }
}
