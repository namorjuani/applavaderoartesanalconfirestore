// src/App.tsx
// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import VehicleForm from './components/VehicleForm';
import VehicleRegistration from './pages/VehicleRegistration';
import Washers from './pages/Washers';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <br></br>
          <br></br>
          <br></br>
          <br></br>
          <Navigation />
          <Routes>
            <Route path="/" element={<VehicleRegistration />} />
            <Route path="/washers" element={<Washers />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
