import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import EmployeeList from './components/EmployeeList';
import EmployeeDetails from './components/EmployeeDetails';
import FavoriteEmployees from './components/Favorites';
// import './App.css';
// import './index.css';

function App() {
  return (
    <AppProvider>
      <Router>
        <nav className="mb-4 h-4 p-4 rounded shadow-sm fs-8 text-end" style={{ backgroundImage: 'url(https://www.accelq.com/wp-content/uploads/2023/04/QA-team-towards-test-automation.jpg)', backgroundSize: 'cover', height: "30vh", backgroundPosition: "right" }}>
          <Link to="/" className="me-2 text-white text-decoration-none text-white px-2 py-1 rounded">Home</Link>
          <Link to="/favorites" className="me-2 text-white text-decoration-none text-white px-2 py-1 rounded">Favorites</Link>
        </nav>
        <Routes>
          <Route path="/" element={<EmployeeList />} />
          <Route path="/details/:id" element={<EmployeeDetails />} />
          <Route path="/favorites" element={<FavoriteEmployees />} />
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
