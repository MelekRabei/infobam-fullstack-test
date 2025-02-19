'use client';

import { useState, useEffect } from 'react';
import { Vehicle } from '@/app/types/vehicule.type';
import { format } from 'date-fns';

import styles from '@/app/vehicules/VehiculesList.module.css';

export default function VehiculesList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filter, setFilter] = useState('');
  const [sort, setSort] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const vehiclesPerPage = 5;

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      setError(null);

      try {
        const query = new URLSearchParams();
        if (filter) query.append('filterBy', filter);
        if (sort) query.append('sortBy', sort);

        const res = await fetch(
          `http://localhost:3000/vehicles?${query.toString()}`,
        );
        if (!res.ok) throw new Error(`Error: ${res.statusText}`);

        setVehicles(await res.json());
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [filter, sort]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilter(e.target.value);
  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setSort(e.target.value);

  const totalPages = Math.ceil(vehicles.length / vehiclesPerPage);
  const currentVehicles = vehicles.slice(
    (currentPage - 1) * vehiclesPerPage,
    currentPage * vehiclesPerPage,
  );

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className={styles.tableContainer}>
      <div className={styles.filterSortContainer}>
        <input
          type="text"
          placeholder="Filter..."
          value={filter}
          onChange={handleFilterChange}
          className={styles.filterSortInput}
        />
        <select
          value={sort}
          onChange={handleSortChange}
          className={styles.filterSortSelect}
        >
          <option value="">Sort By</option>
          <option value="manufacturer">Manufacturer</option>
          <option value="-manufacturer">Manufacturer (Desc)</option>
          <option value="model">Model</option>
          <option value="-model">Model (Desc)</option>
          <option value="year">Year</option>
          <option value="-year">Year (Desc)</option>
          <option value="price">Price</option>
          <option value="-price">Price (Desc)</option>
          <option value="fuelType">Fuel Type</option>
          <option value="transmission">Transmission</option>
          <option value="mileage">Mileage</option>
          <option value="createdAt">Created At</option>
          <option value="updatedAt">Updated At</option>
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Manufacturer</th>
            <th>Model</th>
            <th>Year</th>
            <th>Price</th>
            <th>Fuel Type</th>
            <th>Transmission</th>
            <th>Mileage</th>
            <th>Description</th>
            <th>Created At</th>
            <th>Updated At</th>
          </tr>
        </thead>
        <tbody>
          {currentVehicles.map((vehicle) => (
            <tr key={vehicle.id}>
              <td>{vehicle.manufacturer}</td>
              <td>{vehicle.model}</td>
              <td>{vehicle.year}</td>
              <td>{`${vehicle.price.toLocaleString()}£`}</td>
              <td>{vehicle.fuelType}</td>
              <td>{vehicle.transmission}</td>
              <td>{vehicle.mileage ? `${vehicle.mileage} km` : 'N/A'}</td>
              <td>{vehicle.description}</td>
              <td>{format(new Date(vehicle.createdAt), 'MM/dd/yyyy')}</td>{' '}
              <td>{format(new Date(vehicle.updatedAt), 'MM/dd/yyyy')}</td>{' '}
            </tr>
          ))}
        </tbody>
      </table>

      {totalPages > 1 && (
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`${currentPage === i + 1 ? styles.active : ''}`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
