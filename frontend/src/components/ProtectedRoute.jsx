import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, adminOnly = false, superadminOnly = false }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-secondary-light">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (superadminOnly && user.role !== 'superadmin') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-secondary-light px-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl text-red-500">!</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Akses Ditolak</h2>
                    <p className="text-slate-600 mb-6">Halaman ini hanya dapat diakses oleh superadmin</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    if (adminOnly && !['admin', 'superadmin'].includes(user.role)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-light to-secondary-light px-4">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 text-center max-w-md">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl text-red-500">!</span>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Akses Ditolak</h2>
                    <p className="text-slate-600 mb-6">Halaman ini hanya dapat diakses oleh admin atau superadmin</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all"
                    >
                        Kembali
                    </button>
                </div>
            </div>
        );
    }

    return children;
}

export default ProtectedRoute;