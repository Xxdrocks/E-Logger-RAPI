import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './features/home/HomePage';
import LoginPage from './features/auth/LoginPage';
import RegisterPage from './features/auth/RegisterPage';
import LogPage from './features/log/LogPage';
import OperatorPage from './features/operator/OperatorPage';
import SchedulePage from './features/schedule/SchedulePage';
import ContactPage from './features/contact/ContactPage';
import PointPage from './features/points/PointsPage';
import SuperadminPanel from './superadmin/SuperadminPage';
import LandingPage from './features/Landing/LandingPage';
 
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
 
      
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
 
function DashboardLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/logger" element={<LogPage />} />
          <Route path="/schedule" element={<SchedulePage />} />
          <Route path="/points" element={<PointPage />} />
          
          <Route
            path="/operators"
            element={
              <ProtectedRoute adminOnly>
                <OperatorPage />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/superadmin"
            element={
              <ProtectedRoute superadminOnly>
                <SuperadminPanel />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}



export default App;