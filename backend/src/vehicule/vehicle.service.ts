import { Injectable } from '@nestjs/common';
import { mockVehicles } from './mock/vehicules.mock';
import { Vehicle } from './types/vehicule.type';

@Injectable()
export class VehicleService {
  getAllVehicules(filterField?: string, sortingField?: string): Vehicle[] {
    let filtredVehicles = [...mockVehicles];
    if (filterField) {
      const filter = filterField.toLowerCase();
      filtredVehicles = filtredVehicles.filter((vehicle) =>
        Object.values(vehicle).some((value) => {
          if (value === null || value === undefined) return false;

          const strValue = value.toString().toLowerCase();
          return strValue.includes(filter);
        }),
      );
    }

    if (sortingField) {
      const [field, order] = sortingField.startsWith('-')
        ? [sortingField.slice(1), -1]
        : [sortingField, 1];

      filtredVehicles.sort((a, b) => {
        const aValue = a[field as keyof Vehicle];
        const bValue = b[field as keyof Vehicle];

        if (aValue === undefined || aValue === null) return -1 * order;
        if (bValue === undefined || bValue === null) return 1 * order;

        const comparison =
          (aValue > bValue ? 1 : aValue < bValue ? -1 : 0) * order;

        return comparison;
      });
    }

    return filtredVehicles;
  }
}
