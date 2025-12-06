import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/Layout/DashboardLayout';
import CameraList from './pages/Cameras/CameraList';
import CameraDetails from './pages/Cameras/CameraDetails';
import CreateCamera from './pages/Cameras/CreateCamera';
import EditCamera from './pages/Cameras/EditCamera';
import OwnerList from "./pages/Owners/OwnerList.jsx";
import EditOwner from "./pages/Owners/EditOwner.jsx";
import OwnerDetails from "./pages/Owners/OwnerDetails.jsx";
import CreateOwner from "./pages/Owners/CreateOwner.jsx";
import GateList from "./pages/Gates/GateList.jsx";
import CreateGate from "./pages/Gates/CreateGate.jsx";
import GateDetails from "./pages/Gates/GateDetails.jsx";
import EditGate from "./pages/Gates/EditGate.jsx";
import VehicleList from "./pages/Vehicles/VehicleList.jsx";
import CreateVehicle from "./pages/Vehicles/CreateVehicle.jsx";
import EditVehicle from "./pages/Vehicles/EditVehicle.jsx";
import VehicleDetails from "./pages/Vehicles/VehicleDetails.jsx";
import AccessEventList from "./pages/AccessEvents/AccessEventList.jsx";
import AccessEventDetails from "./pages/AccessEvents/AccessEventDetails.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import './App.css';

function App() {
    return (
        <Router>
            <DashboardLayout>
                <Routes>
                    <Route path="/" element={<Navigate to="/cameras" replace />} />
                    <Route path="/dashboard" element={<Dashboard/>} />
                    <Route path="/cameras" element={<CameraList />} />
                    <Route path="/cameras/create" element={<CreateCamera />} />
                    <Route path="/cameras/:id" element={<CameraDetails />} />
                    <Route path="/cameras/edit/:id" element={<EditCamera />} />
                    <Route path="/vehicles" element={<VehicleList />} />
                    <Route path="/vehicles/create" element={<CreateVehicle />} />
                    <Route path="/vehicles/:id" element={<VehicleDetails />} />
                    <Route path="/vehicles/edit/:id" element={<EditVehicle />} />
                    <Route path="/owners" element={<OwnerList />} />
                    <Route path="/owners/create" element={<CreateOwner />} />
                    <Route path="/owners/:id" element={<OwnerDetails />} />
                    <Route path="/owners/edit/:id" element={<EditOwner />} />
                    <Route path="/gates" element={<GateList />} />
                    <Route path="/gates/create" element={<CreateGate />} />
                    <Route path="/gates/:id" element={<GateDetails />} />
                    <Route path="/gates/edit/:id" element={<EditGate />} />
                    <Route path="/access-events" element={<AccessEventList />} />
                    <Route path="/access-events/:id" element={<AccessEventDetails />} />
                </Routes>
            </DashboardLayout>
        </Router>
    );
}

export default App;