import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SuperadminPanel() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null);
    const [websiteLocked, setWebsiteLocked] = useState(false);
    const [lockDuration, setLockDuration] = useState(60);
    const [remainingTime, setRemainingTime] = useState(null);
    const [showLockModal, setShowLockModal] = useState(false);
    const [togglingLock, setTogglingLock] = useState(false);
    const navigate = useNavigate();
    const [unlockAt, setUnlockAt] = useState('');

    useEffect(() => {
        fetchStats();
        const interval = setInterval(fetchStats, 30000);
        return () => clearInterval(interval);
    }, []);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('https://rumahrapi.com/backend/api/stats/overview', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setStats(res.data);
            setWebsiteLocked(res.data.website_lock?.is_locked || false);
            setRemainingTime(res.data.website_lock?.locked_until || null);
        } catch (error) {
            console.error('Error fetching stats:', error);

            if (error.response?.status === 403) {
                showToast('Akses ditolak. Hanya superadmin yang bisa mengakses halaman ini.', 'error');
                setTimeout(() => navigate('/dashboard'), 2000);
            }
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleBackup = () => {
        const token = localStorage.getItem('token');
        window.open(`https://rumahrapi.com/backend/api/backup/all?token=${token}`, '_blank');
    };

    const handleToggleLock = async (lock) => {
        setTogglingLock(true);

        try {
            const token = localStorage.getItem('token');
            const res = await axios.post(
                'https://rumahrapi.com/backend/api/website-lock/toggle',
                {
                    locked: lock,
                    unlock_at: lock ? unlockAt : null
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setWebsiteLocked(lock);
            showToast(res.data.message, 'success');
            setShowLockModal(false);
            fetchStats();
        } catch (error) {
            console.error('Toggle lock error:', error);
            showToast('Gagal toggle website lock', 'error');
        } finally {
            setTogglingLock(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-primary-light via-secondary-light to-accent-light flex items-center justify-center">
                <div className="text-center">
                    <svg className="w-12 h-12 mx-auto animate-spin text-primary" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    <p className="mt-4 text-slate-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-light via-secondary-light to-accent-light py-8 px-3 md:px-6">
            <div className="max-w-7xl mx-auto">
                {toast && (
                    <div className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl shadow-xl ${toast.type === 'success' ? 'bg-green-500' : 'bg-red-500'
                        } text-white font-semibold`}>
                        {toast.message}
                    </div>
                )}

                {showLockModal && (
                    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">
                                {websiteLocked ? 'Buka Website' : 'Kunci Website'}
                            </h2>
                            <p className="text-sm text-slate-600 mb-6">
                                {websiteLocked
                                    ? 'Website akan dibuka untuk semua user'
                                    : 'Member tidak akan bisa akses LogPage selama website terkunci'
                                }
                            </p>

                            {!websiteLocked && (
                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-slate-700 mb-2">
                                        Durasi Kunci (menit)
                                    </label>
                                    <input
                                        type="datetime-local"
                                        value={unlockAt}
                                        onChange={(e) => setUnlockAt(e.target.value)}
                                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 focus:border-primary"
                                    />
                                    <p className="text-xs text-slate-500 mt-1">
                                        Website akan otomatis terbuka setelah {lockDuration} menit
                                    </p>
                                </div>
                            )}

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowLockModal(false)}
                                    disabled={togglingLock}
                                    className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    onClick={() => handleToggleLock(!websiteLocked)}
                                    disabled={togglingLock}
                                    className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all ${websiteLocked
                                        ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                        : 'bg-gradient-to-r from-red-500 to-orange-500'
                                        }`}
                                >
                                    {togglingLock ? 'Processing...' : (websiteLocked ? 'Buka Website' : 'Kunci Website')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mb-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-2">
                                🛡️ Superadmin Dashboard
                            </h1>
                            <p className="text-sm text-slate-600">Monitor dan kelola seluruh sistem E-Logger RAPI</p>
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLockModal(true)}
                                className={`px-6 py-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2 ${websiteLocked
                                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                    : 'bg-gradient-to-r from-red-500 to-orange-500 text-white'
                                    }`}
                            >
                                {websiteLocked ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                                        </svg>
                                        Website Terkunci
                                        {remainingTime && (
                                            <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                                sampai {new Date(remainingTime).toLocaleString('id-ID')}
                                            </span>
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        Website Terbuka
                                    </>
                                )}
                            </button>
                            <button
                                onClick={handleBackup}
                                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                Backup
                            </button>
                        </div>
                    </div>
                </div>

                {websiteLocked && (
                    <div className="mb-6 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-2xl p-6 shadow-xl">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-lg">Website Sedang Terkunci</h3>
                                <p className="text-sm text-white/90">
                                    {remainingTime
                                        ? `Member tidak dapat mengakses LogPage. Akan terbuka otomatis dalam ${remainingTime} menit.`
                                        : 'Member tidak dapat mengakses LogPage sampai dibuka manual.'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                    <button
                        onClick={() => navigate('/dashboard/operators')}
                        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-purple-200 hover:border-purple-400 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-all">
                                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-slate-600">Kelola Operator</p>
                                <p className="text-xs text-slate-400">Manage users & roles</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/dashboard/logger')}
                        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-blue-200 hover:border-blue-400 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center group-hover:bg-blue-200 transition-all">
                                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-slate-600">Logger</p>
                                <p className="text-xs text-slate-400">Manage logs</p>
                            </div>
                        </div>
                    </button>

                    <button
                        onClick={() => navigate('/dashboard/schedule')}
                        className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border-2 border-orange-200 hover:border-orange-400 transition-all group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-all">
                                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-semibold text-slate-600">Schedule</p>
                                <p className="text-xs text-slate-400">Manage schedules</p>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Total Users</p>
                        <p className="text-3xl font-bold text-slate-900">{stats?.users?.total || 0}</p>
                        <div className="mt-2 flex items-center gap-2 text-xs">
                            <span className="text-purple-600 font-semibold">{stats?.users?.superadmins || 0} SA</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-blue-600 font-semibold">{stats?.users?.admins || 0} A</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-600 font-semibold">{stats?.users?.members || 0} M</span>
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Total Logs</p>
                        <p className="text-3xl font-bold text-blue-600">{stats?.logs?.total || 0}</p>
                        <p className="text-xs text-slate-400 mt-2">
                            Today: <span className="font-semibold text-blue-600">{stats?.logs?.today || 0}</span>
                        </p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">This Week</p>
                        <p className="text-3xl font-bold text-emerald-600">{stats?.logs?.this_week || 0}</p>
                        <p className="text-xs text-slate-400 mt-2">logs recorded</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-5 border border-slate-200">
                        <p className="text-xs text-slate-500 mb-1">Schedules</p>
                        <p className="text-3xl font-bold text-orange-600">{stats?.schedules?.total || 0}</p>
                        <p className="text-xs text-slate-400 mt-2">
                            Upcoming: <span className="font-semibold text-orange-600">{stats?.schedules?.upcoming || 0}</span>
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h3 className="font-bold text-slate-900">Recent Logs</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {stats?.logs?.recent && stats.logs.recent.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {stats.logs.recent.map((log) => (
                                        <div key={log.id} className="px-6 py-3 hover:bg-slate-50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-mono font-bold text-primary text-sm">{log.ncs_1028}</p>
                                                    <p className="text-xs text-slate-600">{log.nama || 'Belum terdaftar'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-semibold text-slate-700">{log.frequency}</p>
                                                    <p className="text-xs text-slate-400">{formatDate(log.created_at)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-12 text-center text-slate-400 text-sm">
                                    Belum ada log
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-xl border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <h3 className="font-bold text-slate-900">Recent Schedules</h3>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                            {stats?.schedules?.recent && stats.schedules.recent.length > 0 ? (
                                <div className="divide-y divide-slate-100">
                                    {stats.schedules.recent.map((schedule) => (
                                        <div key={schedule.id} className="px-6 py-3 hover:bg-slate-50">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="font-semibold text-slate-900 text-sm">{schedule.title}</p>
                                                    <p className="text-xs text-slate-600">{schedule.pencatat_nama}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-xs font-semibold text-orange-600">{schedule.event_date}</p>
                                                    <p className="text-xs text-slate-400">{schedule.event_time}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="px-6 py-12 text-center text-slate-400 text-sm">
                                    Belum ada schedule
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SuperadminPanel;