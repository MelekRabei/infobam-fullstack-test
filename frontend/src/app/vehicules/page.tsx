'use client';

import { useState, useEffect } from 'react';
import { Vehicle } from '@/app/types/vehicule.type';
import { format } from 'date-fns';

import styles from '@/app/vehicules/VehiculesList.module.css';

export default function VehiculesList() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [filterBy, setFilterBy] = useState('');
  const [previousFilterBy, setPreviousFilterBy] = useState('');
  const [filterValue, setFilterValue] = useState('');
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
        if (filterValue && filterBy) {
          query.append('filterBy', filterBy);
          query.append('filterValue', filterValue);
        }
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
  }, [filterBy, filterValue, sort]);
  const handleFilterFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setFilterBy(e.target.value);

  const handleFilterValueChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setFilterValue(e.target.value);

  useEffect(() => {
    if (filterBy !== previousFilterBy) {
      setFilterValue('');
      setPreviousFilterBy(filterBy);
    }
  }, [filterBy, previousFilterBy]);

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
        <select
          value={filterBy}
          onChange={handleFilterFieldChange}
          className={styles.filterSortSelect}
        >
          <option value="">Filter By</option>
          <option value="manufacturer">Manufacturer</option>
          <option value="type">Type</option>
          <option value="year">Year</option>
        </select>
        <input
          type="text"
          placeholder={`Filter by ${filterBy || '...'}`}
          value={filterValue}
          onChange={handleFilterValueChange}
          className={styles.filterSortInput}
          disabled={!filterBy}
          ref={(input) => {
            if (input && filterBy && filterValue) {
              input.focus();
            }
          }}
        />
        <select
          value={sort}
          onChange={handleSortChange}
          className={styles.filterSortSelect}
        >
          <option value="">Sort By</option>
          <option value="year">Year</option>
          <option value="-year">Year (Desc)</option>
          <option value="price">Price</option>
          <option value="-price">Price (Desc)</option>
        </select>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Manufacturer</th>
            <th>Model</th>
            <th>Year</th>
            <th>Type</th>
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
              <td>{vehicle.type}</td>
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
