import React, { useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Link } from 'react-router-dom';

const FavoriteEmployees = () => {
    const { favorites, removeFavorite } = useContext(AppContext);

    return (
        <div className='container mx-auto p-4'>
            <h2 className='heading-fav'>Favorites</h2>
            <ul className="list-unstyled d-grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {favorites.map(employee => (
                    <li key={employee.login.uuid} className="card bg-white shadow-xl rounded-lg overflow-hidden border border-secondary mb-4 p-3">
                        <img src={employee.picture.large} alt={employee.name.first} className=" mb-2" />
                        <h3 className="text-xl font-bold">{employee.name.first} {employee.name.last}</h3>
                        <p>Age: {employee.dob.age}</p>
                        <p>Location: {employee.location.city}, {employee.location.country}</p>
                        <div className='btn-container p-1.3 d-flex justify-between'>
                            <Link to={`/details/${employee.login.uuid}`}>
                                <button className='btn btn-success  p-1.4'>
                                    More Details
                                </button>
                            </Link>
                            <button onClick={() => removeFavorite(employee)} className='btn btn-success  p-0'>Remove Favorites</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default FavoriteEmployees;