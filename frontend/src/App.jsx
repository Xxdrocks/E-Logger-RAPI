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

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/contact" element={<ContactPage />} />

              <Route
                path="/logger"
                element={
                  <ProtectedRoute>
                    <LogPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/schedule"
                element={
                  <ProtectedRoute>
                    <SchedulePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/points"
                element={
                  <ProtectedRoute>
                    <PointPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/operators"
                element={
                  <ProtectedRoute adminOnly>
                    <OperatorPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;