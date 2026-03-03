import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LoginPage() {
    const [ncs, setNcs] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(ncs);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.errors?.ncs?.[0] || 'NCS tidak ditemukan');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-light via-secondary-light to-accent-light flex items-center justify-center px-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <img src="/images/logo-rapi.png" alt="Logo RAPI" className="w-32 mx-auto mb-4" />
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">Selamat Datang</h1>
                    <p className="text-slate-600">Login ke sistem E-Logger RAPI</p>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">
                                NCS (10-28)
                            </label>
                            <input
                                type="text"
                                value={ncs}
                                onChange={(e) => setNcs(e.target.value.toUpperCase())}
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary-light outline-none transition-all uppercase"
                                placeholder="Contoh: JZ09VAG"
                                autoFocus
                            />
                            <p className="text-xs text-slate-500 mt-1">Masukkan NCS terdaftar untuk login</p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-600">
                            NCS belum terdaftar?{' '}
                            <Link to="/register" className="text-primary font-semibold hover:text-primary-hover">
                                Daftar disini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;