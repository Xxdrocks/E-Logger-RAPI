import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function HomePage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [schedules, setSchedules] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        uniqueParticipants: 0, 
        totalCheckIns: 0,      
    });

    const heroImages = [
        '/images/background-rapi.png',
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        fetchStats();
        fetchSchedules();
    }, []);

    const fetchStats = async () => {
        try {
            const [usersRes, logsRes] = await Promise.all([
                axios.get('http://127.0.0.1:8000/api/users'),
                axios.get('http://127.0.0.1:8000/api/logs'),
            ]);

            const logs = logsRes.data.data || [];
            const uniqueNCS = new Set(
                logs.map(log => log.ncs_1028).filter(ncs => ncs && ncs.trim() !== '')
            );
            const totalCheckIns = logs.length;

            setStats({
                totalUsers: usersRes.data.length,
                uniqueParticipants: uniqueNCS.size,
                totalCheckIns: totalCheckIns,
            });
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const fetchSchedules = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/schedules');
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            const upcoming = res.data
                .filter(s => new Date(s.event_date) >= today)
                .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
                .slice(0, 3);
            setSchedules(upcoming);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    const statsData = [
        { value: `${stats.totalUsers}+`, label: 'Anggota Aktif' },
        { value: `${stats.uniqueParticipants}+`, label: 'NCS Aktif' },
        { value: `${stats.totalCheckIns}+`, label: 'Total Check In' }, 
    ];

    return (
        <div className="min-h-screen">
            <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
                {heroImages.map((img, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            idx === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img src={img} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
                    </div>
                ))}

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                    <img src="/images/logo-rapi.png" alt="Logo RAPI" className="w-48 md:w-64 mb-8" />
                    <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-4 tracking-tight">
                        Radio Antar Republik Indonesia
                    </h1>
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {heroImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                idx === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Stats - Mobile Optimized */}
            <div className="bg-gradient-to-br from-primary-light via-secondary-light to-accent-light py-12 md:py-16 px-3 md:px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6">
                        {statsData.map((stat, idx) => (
                            <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 text-center shadow-md border border-slate-200">
                                <p className="text-2xl md:text-4xl font-extrabold text-primary mb-1 md:mb-2">{stat.value}</p>
                                <p className="text-xs md:text-sm text-slate-600 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Schedule Section */}
            <div className="bg-gradient-to-br from-secondary-light to-accent-light py-12 md:py-16 px-3 md:px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 md:gap-4 mb-6 md:mb-8">
                        <div>
                            <h2 className="text-2xl md:text-5xl font-extrabold text-slate-900 mb-1 md:mb-2">
                                Jadwal NCS On Duty
                            </h2>
                        </div>
                        <Link
                            to="/schedule"
                            className="w-full sm:w-auto px-4 md:px-5 py-2 md:py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:shadow-lg transition-all whitespace-nowrap text-center"
                        >
                            Lihat Semua
                        </Link>
                    </div>

                    {schedules.length === 0 ? (
                        <div className="bg-white/70 backdrop-blur-md rounded-xl md:rounded-2xl p-8 md:p-12 text-center shadow-md">
                            <p className="text-slate-500 text-sm md:text-lg">Belum ada jadwal kegiatan mendatang</p>
                        </div>
                    ) : (
                        <>
                            {/* Mobile Card View */}
                            <div className="md:hidden space-y-3">
                                {schedules.map((schedule, idx) => (
                                    <div key={schedule.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-slate-100">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                                {idx + 1}
                                            </span>
                                            <h3 className="text-sm font-bold text-slate-800 flex-1 line-clamp-1">{schedule.title}</h3>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                            <span>{formatDate(schedule.event_date)}</span>
                                            {schedule.event_time && (
                                                <>
                                                    <span>•</span>
                                                    <span>{schedule.event_time}</span>
                                                </>
                                            )}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500">NCS On Duty</span>
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono font-bold text-primary bg-primary-light border border-primary px-2 py-0.5 rounded-md text-xs">
                                                    {schedule.pencatat_ncs || '-'}
                                                </span>
                                                <span className="text-xs text-slate-700 font-semibold max-w-[100px] truncate">
                                                    {schedule.pencatat_nama || '-'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                            <tr className="bg-slate-50/80 border-b border-slate-100">
                                                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">No</th>
                                                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Tanggal</th>
                                                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Jam</th>
                                                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Judul</th>
                                                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">NCS</th>
                                                <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Nama</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {schedules.map((schedule, idx) => (
                                                <tr key={schedule.id} className="hover:bg-primary-light/30 transition-colors">
                                                    <td className="px-5 py-3.5 text-slate-400 text-xs">{idx + 1}</td>
                                                    <td className="px-5 py-3.5 text-slate-700 font-semibold">{formatDate(schedule.event_date)}</td>
                                                    <td className="px-5 py-3.5 text-slate-600">{schedule.event_time || '-'}</td>
                                                    <td className="px-5 py-3.5 text-slate-700 font-semibold">{schedule.title}</td>
                                                    <td className="px-5 py-3.5">
                                                        <span className="inline-block font-mono font-bold text-primary bg-primary-light border border-primary px-2.5 py-1 rounded-lg text-xs">
                                                            {schedule.pencatat_ncs || '-'}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3.5 text-slate-600 text-sm">{schedule.pencatat_nama || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default HomePage;