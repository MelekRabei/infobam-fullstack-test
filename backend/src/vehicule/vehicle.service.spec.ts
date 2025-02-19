import { Test, TestingModule } from '@nestjs/testing';
import { VehicleService } from './vehicle.service'; // Path to your service
import { mockVehicles } from './mock/vehicules.mock'; // Path to your mock data
import { Vehicle } from './types/vehicule.type'; // Path to your Vehicle type

describe('VehicleService', () => {
  let service: VehicleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VehicleService],
    }).compile();

    service = module.get<VehicleService>(VehicleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return all vehicles when no filter or sort is provided', () => {
    const vehicles = service.getAllVehicules();
    expect(vehicles).toEqual(mockVehicles);
  });

  it('should filter vehicles by field', () => {
    const filteredVehicles = service.getAllVehicules('tesla'); // Filter by "tesla"
    expect(filteredVehicles.length).toBe(1); // Expecting 1 Tesla vehicle
    expect(filteredVehicles[0].manufacturer.toLowerCase()).toContain('tesla');

    const filteredVehicles2 = service.getAllVehicules('2021'); // Filter by "2021"
    expect(filteredVehicles2.length).toBe(4);
    expect(
      filteredVehicles2.every((v) => v.year.toString().includes('2021')),
    ).toBe(true);
  });

  it('should sort vehicles by field in ascending order', () => {
    const sortedVehicles = service.getAllVehicules(undefined, 'manufacturer');
    expect(sortedVehicles[0].manufacturer).toBe('Audi'); // Check the first vehicle after sorting

    const sortedVehicles2 = service.getAllVehicules(undefined, 'year');
    expect(sortedVehicles2[0].year).toBe(2020);
  });

  it('should sort vehicles by field in descending order', () => {
    const sortedVehicles = service.getAllVehicules(undefined, '-manufacturer');
    expect(sortedVehicles[0].manufacturer).toBe('Tesla'); // Check the first vehicle after sorting

    const sortedVehicles2 = service.getAllVehicules(undefined, '-year');
    expect(sortedVehicles2[0].year).toBe(2023);
  });

  it('should filter and sort vehicles', () => {
    const filteredAndSortedVehicles = service.getAllVehicules('2021', '-price'); // Filter and sort

    expect(filteredAndSortedVehicles.length).toBe(4);
    expect(filteredAndSortedVehicles[0].year).toBe(2021);
    expect(filteredAndSortedVehicles[0].price).toBe(74999);
  });

  it('should handle undefined or null values during sorting', () => {
    const vehiclesWithNull = [
      ...mockVehicles,
      {
        id: 11,
        manufacturer: 'Test',
        model: 'Test',
        year: 2021,
        color: 'Test',
        price: 74999,
        fuelType: 'Test',
        transmission: 'Test',
        mileage: 1000,
        features: ['Test'],
        images: ['Test'],
        description: 'Test',
        createdAt: new Date(),
        updatedAt: new Date(),
        type: 'Test',
      },
      {
        id: 12,
        manufacturer: 'Test2',
        model: 'Test2',
        year: 2021,
        color: 'Test2',
        price: null,
        fuelType: 'Test2',
        transmission: 'Test2',
        mileage: 1000,
        features: ['Test2'],
        images: ['Test2'],
        description: 'Test2',
        createdAt: new Date(),
        updatedAt: new Date(),
        type: 'Test2',
      },
    ];

    const sortedVehicles = new VehicleService().getAllVehicules(
      undefined,
      'price',
    );
    expect(sortedVehicles[0].price).toBe(24999);

    const sortedVehicles2 = new VehicleService().getAllVehicules(
      undefined,
      '-price',
    );
    expect(sortedVehicles2[0].price).toBe(89999);

    const sortedVehicles3 = new VehicleService().getAllVehicules(
      '2021',
      '-price',
    );
    expect(sortedVehicles3.length).toBe(4);
    expect(sortedVehicles3[0].price).toBe(74999);
  });
});
