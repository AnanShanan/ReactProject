import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { AppContext } from '../context/AppContext';
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import { divIcon, Icon, point } from 'leaflet';
import "../App.css"

const EmployeeDetails = () => {
    const { id } = useParams();
    const { allEmployees } = useContext(AppContext);
    const [employee, setEmployee] = useState(null);
    const [showMap, setShowMap] = useState(true);

    useEffect(() => {
        const foundEmployee = allEmployees.find(emp => emp.login.uuid === id);
        setEmployee(foundEmployee);
    }, [id, allEmployees]);



    if (!employee) return <div>Loading...</div>;

    // create custom icon
    const customIcon = new Icon({
        iconUrl: require("../icons/placeholder.png"),
        iconSize: [38, 38] // size of the icon
    });

    // custom cluster icon
    const createClusterCustomIcon = (cluster) => {
        return new divIcon({
            html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
            className: "custom-marker-cluster",
            iconSize: point(33, 33, true)
        });
    };

    // Employee's coordinates
    const employeeCoordinates = [
        parseFloat(employee.location.coordinates.latitude) + (Math.random() * 0.02 - 0.01),
        parseFloat(employee.location.coordinates.longitude) + (Math.random() * 0.02 - 0.01)
    ];

    // Component to fit map bounds to marker
    const FitBoundsToMarker = ({ coordinates }) => {
        const map = useMap();
        useEffect(() => {
            map.fitBounds([coordinates]);
        }, [map, coordinates]);
        return null;
    };

    return (
        <div className="employee-container">
            <div className="card shadow-xl rounded-lg overflow-hidden d-flex flex-column justify-content-center mx-auto p-2 border border-secondary">
                <img src={employee.picture.large} alt={employee.name.first} />
                <div className="employee-info">
                    <p><strong>Full Name:</strong> {employee.name.title} {employee.name.first} {employee.name.last}</p>
                    <p><strong>Email:</strong> {employee.email}</p>
                    <p><strong>Phone:</strong> {employee.phone}</p>
                    <p><strong>Address:</strong> {employee.location.street.number} {employee.location.street.name}, {employee.location.city}, {employee.location.country}</p>
                </div>
            </div>

            <button onClick={() => setShowMap(!showMap)} className='btn btn-success mx-auto d-flex' style={{ width: 'fit-content' }}>
                {showMap ? "Hide Map" : "Show Map"}
            </button>
            {showMap && (
                <MapContainer center={[0, 0]} zoom={2}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <MarkerClusterGroup
                        chunkedLoading
                        iconCreateFunction={createClusterCustomIcon}
                    >
                        <Marker position={employeeCoordinates} icon={customIcon}>
                            <Popup>
                                <div>
                                    <img src={employee.picture.thumbnail} alt={`${employee.name.first} ${employee.name.last}`} />
                                    <p>{`${employee.name.title} ${employee.name.first} ${employee.name.last}`}</p>
                                    <p>{employee.location.street.name}, {employee.location.city}</p>
                                    <p>{employee.email}</p>
                                </div>
                            </Popup>
                        </Marker>
                    </MarkerClusterGroup>
                    <FitBoundsToMarker coordinates={employeeCoordinates} />
                </MapContainer>
            )}

        </div>
    );
};

export default EmployeeDetails;
