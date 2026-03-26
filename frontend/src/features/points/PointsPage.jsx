import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PointPage() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [loadingDetail, setLoadingDetail] = useState(false);

    const fetchLeaderboard = async (filterType = 'all') => {
        setLoading(true);
        try {
            const res = await axios.get(`https://rumahrapi.com/backend/api/points/leaderboard?filter=${filterType}`);
            setLeaderboard(res.data);
        } catch (error) {
            console.error('Error fetching leaderboard:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUserDetail = async (ncs) => {
        setLoadingDetail(true);
        try {
            const res = await axios.get(`https://rumahrapi.com/backend/api/points/user/${ncs}?filter=${filter}`);
            setUserDetail(res.data);
        } catch (error) {
            console.error('Error fetching user detail:', error);
        } finally {
            setLoadingDetail(false);
        }
    };

    useEffect(() => {
        fetchLeaderboard(filter);
    }, [filter]);

    const handleFilterChange = (newFilter) => {
        setFilter(newFilter);
    };

    const handleUserClick = (user) => {
        setSelectedUser(user);
        fetchUserDetail(user.ncs);
    };

    const closeModal = () => {
        setSelectedUser(null);
        setUserDetail(null);
    };

    const getFilterLabel = () => {
        if (filter === 'month') return 'Bulan Ini';
        if (filter === 'year') return 'Tahun Ini';
        return 'Semua Waktu';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-light via-secondary-light to-accent-light py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Leaderboard Points</h1>
                        <p className="text-slate-600">Urutan berdasarkan aktivitas pencatat dan Check in</p>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-white/70 backdrop-blur-md border border-slate-200 rounded-xl p-1 shadow-sm">
                        <button
                            onClick={() => handleFilterChange('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                filter === 'all'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            All Time
                        </button>
                        <button
                            onClick={() => handleFilterChange('year')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                filter === 'year'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Tahun Ini
                        </button>
                        <button
                            onClick={() => handleFilterChange('month')}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                                filter === 'month'
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            Bulan Ini
                        </button>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="bg-white/70 backdrop-blur-md border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="bg-slate-50/80 border-b border-slate-100">
                                        <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Urutan</th>
                                        <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">10-28</th>
                                        <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Nama</th>
                                        <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Total Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {leaderboard.map((user) => (
                                        <tr 
                                            key={user.ncs} 
                                            onClick={() => handleUserClick(user)}
                                            className="hover:bg-primary-light/30 transition-colors cursor-pointer"
                                        >
                                            <td className="px-5 py-3.5">
                                                {user.rank <= 3 ? (
                                                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                                        user.rank === 1 ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-400' :
                                                        user.rank === 2 ? 'bg-slate-100 text-slate-600 border-2 border-slate-400' :
                                                        'bg-orange-100 text-orange-700 border-2 border-orange-400'
                                                    }`}>
                                                        {user.rank}
                                                    </span>
                                                ) : (
                                                    <span className="text-slate-400 font-semibold">{user.rank}</span>
                                                )}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="font-mono font-bold text-primary">{user.ncs}</span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xs font-bold">
                                                        {user.nama?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <span className="text-slate-700 font-semibold">{user.nama}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="inline-block px-3 py-1.5 rounded-lg bg-primary text-white font-bold text-sm">
                                                    {user.points} pts
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {selectedUser && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl">
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900">{selectedUser.nama}</h2>
                                <p className="text-slate-500 font-mono">{selectedUser.ncs}</p>
                            </div>
                            <button
                                onClick={closeModal}
                                className="text-slate-400 hover:text-slate-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {loadingDetail ? (
                            <div className="flex justify-center py-12">
                                <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : userDetail && (
                            <>
                                <div className="grid grid-cols-3 gap-4 mb-6">
                                    <div className="bg-primary-light/50 border border-primary/30 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-primary">{userDetail.stats.total_pencatat}</p>
                                        <p className="text-xs text-slate-600 mt-1">Sebagai NCS</p>
                                    </div>
                                    <div className="bg-secondary-light/50 border border-secondary/30 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-secondary">{userDetail.stats.total_hadir}</p>
                                        <p className="text-xs text-slate-600 mt-1"> Check in </p>
                                    </div>
                                    <div className="bg-accent-light/50 border border-accent/30 rounded-xl p-4 text-center">
                                        <p className="text-2xl font-bold text-accent">{userDetail.stats.points}</p>
                                        <p className="text-xs text-slate-600 mt-1">Total Points</p>
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <h3 className="font-bold text-slate-800 mb-3">Riwayat Sebagai NCS</h3>
                                    <div className="max-h-48 overflow-y-auto space-y-2">
                                        {userDetail.breakdown.pencatat.length > 0 ? (
                                            userDetail.breakdown.pencatat.map((log) => (
                                                <div key={log.id} className="bg-slate-50 rounded-lg p-3 text-sm">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <span className="font-mono text-primary font-semibold">{log.frequency}</span>
                                                            {log.keterangan && (
                                                                <span className="text-slate-500 ml-2">- {log.keterangan}</span>
                                                            )}
                                                        </div>
                                                        <span className="text-xs text-slate-400">
                                                            {new Date(log.created_at).toLocaleDateString('id-ID')}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-slate-400 text-sm text-center py-4">Belum ada riwayat sebagai NCS</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-slate-800 mb-3">Riwayat Check in</h3>
                                    <div className="max-h-48 overflow-y-auto space-y-2">
                                        {userDetail.breakdown.hadir.length > 0 ? (
                                            userDetail.breakdown.hadir.map((log) => (
                                                <div key={log.id} className="bg-slate-50 rounded-lg p-3 text-sm">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <span className="font-mono text-secondary font-semibold">{log.frequency}</span>
                                                            <span className="text-slate-500 ml-2">
                                                                oleh {log.pencatat_nama || log.pencatat_ncs}
                                                            </span>
                                                        </div>
                                                        <span className="text-xs text-slate-400">
                                                            {new Date(log.created_at).toLocaleDateString('id-ID')}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-slate-400 text-sm text-center py-4">Belum ada riwayat Check in</p>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default PointPage;