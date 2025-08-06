import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Scanner from './pages/Scanner';
import EmergencyInfo from './pages/EmergencyInfo';
import EmergencyDisplay from './pages/EmergencyDisplay';
import Admin from './pages/Admin';
import { storage } from './utils/storage';
import { generateMockQRCodes } from './utils/mockData';

function App() {
  useEffect(() => {
    // Initialize mock data on first load
    generateMockQRCodes();

    // Create demo accounts if they don't exist
    const users = storage.getUsers();
    const adminExists = users.find(u => u.email === 'admin@lifelink.com');
    const userExists = users.find(u => u.email === 'user@lifelink.com');

    if (!adminExists) {
      storage.saveUser({
        id: 'admin-1',
        email: 'admin@lifelink.com',
        name: 'Admin User',
        qrCodes: [],
      });
    }

    if (!userExists) {
      storage.saveUser({
        id: 'user-1',
        email: 'user@lifelink.com',
        name: 'Demo User',
        qrCodes: [],
      });
    }
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scanner" element={<Scanner />} />
            <Route path="/emergency-info" element={<EmergencyInfo />} />
            <Route path="/emergency/:qrCode" element={<EmergencyDisplay />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
