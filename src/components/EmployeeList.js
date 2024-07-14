import React, { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';

const EmployeeList = () => {
    const { favorites, addFavorite, employees, allEmployees, setEmployees, setSearchTerm, searchTerm } = useContext(AppContext);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(5);

    const [filterGroup, setFilterGroup] = useState('all');
    const [genderFilter, setGenderFilter] = useState('all');

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = employees.slice(indexOfFirstEmployee, indexOfLastEmployee);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const debouncedSearch = useCallback(debounce((searchValue) => {
        filterEmployees(searchValue, filterGroup, genderFilter);
    }, 300), [allEmployees, filterGroup, genderFilter]);

    const filterEmployees = (searchValue, group, gender) => {
        let filteredEmployees = allEmployees;

        if (group !== 'all') {
            filteredEmployees = allEmployees.filter(employee => {
                return group === 'manager' ? employee.dob.age >= 40 :
                    group === 'worker' ? employee.dob.age >= 25 && employee.dob.age < 40 :
                        group === 'junior' ? employee.dob.age < 25 : true;
            });
        }

        if (gender !== 'all') {
            filteredEmployees = filteredEmployees.filter(employee => employee.gender === gender);
        }

        setEmployees(filteredEmployees);
    };

    const handleSearchChange = (e) => {
        const { value } = e.target;
        setSearchTerm(value);
        debouncedSearch(value);
        setCurrentPage(1);
    };

    const handleGroupChange = (group) => {
        setFilterGroup(group);
        filterEmployees(searchTerm, group, genderFilter);
    };

    const handleGenderChange = (gender) => {
        setGenderFilter(gender);
        filterEmployees(searchTerm, filterGroup, gender);
    };

    return (
        <div className="container mx-auto p-4">
            <div className="d-flex gap-3 flex-wrap fs-0.2">

                <div className="input-group flex-grow-1 text-align align-self-center w-100 d-flex justify-content-between text-white">
                    <label htmlFor="employeeSearch" className="form-label w-100">Search Employees</label>
                    <input
                        id="employeeSearch"
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={handleSearchChange}
                        className="form-control w-100"
                    />
                </div>
                <div role="toolbar" className='flex-grow-1' aria-label="Toolbar with button groups m-2 ">
                    <div className="btn-group w-100 text-align align-self-center d-flex justify-content-between text-white justify-item-center" role="group" aria-label="First group">
                        <label htmlFor="groupFilter" className="form-label w-100">Filter by Group</label>
                        <select id="groupFilter" className="form-select w-100" aria-label="Filter by group" onChange={(event) => handleGroupChange(event.target.value)}>
                            <option value="manager" selected={filterGroup === 'manager'}>Manager</option>
                            <option value="worker" selected={filterGroup === 'worker'}>Workers</option>
                            <option value="junior" selected={filterGroup === 'junior'}>Juniors</option>
                            <option value="all" selected={filterGroup === 'all'}>All</option>
                        </select>
                    </div>
                </div>
                <div className="flex-grow-1" role="toolbar" aria-label="Toolbar with button groups">
                    <div className="btn-group w-100 mb-3 align-self-center d-flex justify-content-between text-white" role="group" aria-label="Gender group">
                        <label htmlFor="genderFilter" className="form-label w-100 ">Filter by Gender</label>
                        <select id="genderFilter" className="form-select w-100" aria-label="Filter by gender" onChange={(event) => handleGenderChange(event.target.value)}>
                            <option value="male" selected={genderFilter === 'male'}>Male</option>
                            <option value="female" selected={genderFilter === 'female'}>Female</option>
                            <option value="all" selected={genderFilter === 'all'}>All</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className='flex items-center justify-center min-h-screen'>
                <ul className="list-unstyled d-grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                    {currentEmployees.map(employee => (
                        <li key={employee.login.uuid} className="card border border-secondary mb-4 p-3">
                            <img src={employee.picture.large} alt={employee.name.first} className="img-fluid mb-2" />
                            <h3 className="text-xl font-bold">{employee.name.first} {employee.name.last}</h3>
                            <p className="text-gray-600">Age: {employee.dob.age}</p>
                            <p className="text-gray-600">Location: {employee.location.city}, {employee.location.country}</p>
                            <div className='btn-container'>
                                <button
                                    onClick={() => addFavorite(employee)}
                                    className={`btn btn-success mr-2 ${favorites.find(fav => fav.login.uuid === employee.login.uuid) ? 'btn-success' : ''}`}
                                >
                                    {favorites.find(fav => fav.login.uuid === employee.login.uuid) ? 'Favorited' : 'Save as Favorite'}
                                </button>

                                <Link to={`/details/${employee.login.uuid}`} className="">
                                    <button className="btn btn-success">
                                        More Details
                                    </button>

                                </Link>
                            </div>

                        </li>
                    ))}
                </ul>
            </div>

            <div className="pagination d-flex justify-content-center mt-4">
                {Array.from({ length: Math.ceil(employees.length / employeesPerPage) }, (_, index) => (
                    <button key={index + 1} onClick={() => paginate(index + 1)} className="m-1 px-3 bg-black rounded">
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmployeeList;