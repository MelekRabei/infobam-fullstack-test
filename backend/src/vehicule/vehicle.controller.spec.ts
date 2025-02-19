import { Test, TestingModule } from '@nestjs/testing';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { mockVehicles } from './mock/vehicules.mock';

describe('VehicleController', () => {
  let controller: VehicleController;
  let service: VehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VehicleController],
      providers: [
        {
          provide: VehicleService,
          useValue: {
            getAllVehicules: jest.fn().mockReturnValue(mockVehicles),
          },
        },
      ],
    }).compile();

    controller = module.get<VehicleController>(VehicleController);
    service = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call the service with correct parameters (filterBy and filterValue)', async () => {
    const mockQuery = {
      sortBy: 'manufacturer',
      filterBy: 'type',
      filterValue: 'suv',
    };

    await controller.getVehicles(
      mockQuery.sortBy,
      mockQuery.filterBy,
      mockQuery.filterValue,
    );
    expect(service.getAllVehicules).toHaveBeenCalledWith(
      mockQuery.filterBy,
      mockQuery.filterValue,
      mockQuery.sortBy,
    );

    const mockQuery2 = {
      sortBy: '-price',
      filterBy: 'year',
      filterValue: '2021',
    };

    await controller.getVehicles(
      mockQuery2.sortBy,
      mockQuery2.filterBy,
      mockQuery2.filterValue,
    );
    expect(service.getAllVehicules).toHaveBeenCalledWith(
      mockQuery2.filterBy,
      mockQuery2.filterValue,
      mockQuery2.sortBy,
    );
  });

  it('should call the service with correct parameters (no filter)', async () => {
    const mockQuery = {
      sortBy: 'manufacturer',
    };

    await controller.getVehicles(mockQuery.sortBy, undefined, undefined);
    expect(service.getAllVehicules).toHaveBeenCalledWith(
      undefined,
      undefined,
      mockQuery.sortBy,
    );
  });

  it('should return the data from the service', async () => {
    const mockQuery = {
      sortBy: 'manufacturer',
      filterBy: 'type',
      filterValue: 'suv',
    };

    const result = await controller.getVehicles(
      mockQuery.sortBy,
      mockQuery.filterBy,
      mockQuery.filterValue,
    );
    expect(result).toEqual(mockVehicles);
  });

  it('should handle no query parameters', async () => {
    const result = await controller.getVehicles(
      undefined,
      undefined,
      undefined,
    );

    expect(service.getAllVehicules).toHaveBeenCalledWith(
      undefined,
      undefined,
      undefined,
    );
    expect(result).toEqual(mockVehicles);
  });
});
