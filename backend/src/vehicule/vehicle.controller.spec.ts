import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller'; // Path to your controller
import { VehicleService } from './vehicle.service'; // Path to your service
import { mockVehicles } from './mock/vehicules.mock'; // Path to your mock data

describe('VehicleController', () => {
  let controller: VehicleController;
  let service: VehicleService; // Add service variable for mocking

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService, // Provide the service
          useValue: {
            getAllVehicules: jest.fn().mockReturnValue(mockVehicles), // Mock the service method
          },
        },
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    service = module.get<VehicleService>(VehicleService); // Get the mocked service
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call the service with correct parameters', async () => {
    const mockQuery: { sortBy?: string; filterBy?: string } = {
      sortBy: 'manufacturer',
      filterBy: 'tesla',
    };

    await controller.getVehicles(mockQuery.filterBy, mockQuery.sortBy);
    expect(service.getAllVehicules).toHaveBeenCalledWith(
      mockQuery.sortBy,
      mockQuery.filterBy,
    );

    const mockQuery2: { sortBy?: string; filterBy?: string } = {
      sortBy: '-price',
      filterBy: '2021',
    };

    await controller.getVehicles(mockQuery2.filterBy, mockQuery2.sortBy);
    expect(service.getAllVehicules).toHaveBeenCalledWith(
      mockQuery2.sortBy,
      mockQuery2.filterBy,
    );
  });

  it('should return the data from the service', async () => {
    const mockQuery: { sortBy?: string; filterBy?: string } = {
      sortBy: 'manufacturer',
      filterBy: 'tesla',
    };

    const result = await controller.getVehicles(
      mockQuery.sortBy,
      mockQuery.filterBy,
    );
    expect(result).toEqual(mockVehicles);
  });

  it('should handle no query parameters', async () => {
    // Call getVehicles with no query parameters
    const result = await controller.getVehicles(undefined, undefined);

    // Expect the service to be called with undefined for both parameters
    expect(service.getAllVehicules).toHaveBeenCalledWith(undefined, undefined);

    // Expect the result to be the mockVehicles array
    expect(result).toEqual(mockVehicles);
  });
});
