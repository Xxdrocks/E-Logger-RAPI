import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduleModal from './ScheduleModal';

function SchedulePage() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingSchedule, setEditingSchedule] = useState(null);

    const fetchSchedules = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/schedules');
            setSchedules(res.data);
        } catch (error) {
            console.error('Error fetching schedules:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchedules();
    }, []);

    const handleAdd = () => {
        setEditingSchedule(null);
        setShowModal(true);
    };

    const handleEdit = (schedule) => {
        setEditingSchedule(schedule);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus jadwal ini?')) return;
        
        try {
            await axios.delete(`http://127.0.0.1:8000/api/schedules/${id}`);
            fetchSchedules();
        } catch (error) {
            console.error('Error deleting schedule:', error);
            alert('Gagal menghapus jadwal');
        }
    };

    const handleSave = () => {
        setShowModal(false);
        fetchSchedules();
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-light via-secondary-light to-accent-light py-6 px-3 md:py-10 md:px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header - Mobile Optimized */}
                <div className="flex flex-col gap-3 mb-6 md:flex-row md:justify-between md:items-center md:mb-8">
                    <div>
                        <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-1">Jadwal NCS On Duty</h1>
                        <p className="text-xs md:text-sm text-slate-600">Kelola jadwal kegiatan dan NCS berikutnya</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="w-full md:w-auto px-4 py-2.5 md:px-6 md:py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Tambah Jadwal
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="text-center py-16 md:py-20 bg-white/80 rounded-2xl">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <p className="text-slate-500 text-sm md:text-lg mb-4">Belum ada jadwal kegiatan</p>
                        <button
                            onClick={handleAdd}
                            className="px-6 py-2 bg-primary text-white text-sm rounded-xl hover:bg-primary-hover transition-all duration-200"
                        >
                            Tambah Jadwal Pertama
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Mobile Card View */}
                        <div className="md:hidden space-y-3">
                            {schedules.map((schedule, idx) => (
                                <div key={schedule.id} className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md border border-slate-100">
                                    {/* Header */}
                                    <div className="flex items-start justify-between mb-3 pb-3 border-b border-slate-100">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                                                    {idx + 1}
                                                </span>
                                                <h3 className="text-sm font-bold text-slate-800 line-clamp-1">{schedule.title}</h3>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-slate-500">
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
                                        </div>
                                    </div>

                                    {/* NCS Info */}
                                    <div className="space-y-2 mb-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500 font-medium">NCS On Duty</span>
                                            <span className="font-mono font-bold text-primary bg-primary-light border border-primary px-2 py-0.5 rounded-md text-xs">
                                                {schedule.pencatat_ncs || '-'}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs text-slate-500 font-medium">Nama</span>
                                            <span className="text-xs text-slate-700 font-semibold">{schedule.pencatat_nama || '-'}</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(schedule)}
                                            className="flex-1 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(schedule.id)}
                                            className="flex-1 px-3 py-2 rounded-lg bg-red-50 text-red-500 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-all flex items-center justify-center gap-1.5"
                                        >
                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            Hapus
                                        </button>
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
                                            <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">10-28</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Nama</th>
                                            <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Aksi</th>
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
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => handleEdit(schedule)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition-all"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(schedule.id)}
                                                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-all"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {showModal && (
                <ScheduleModal
                    schedule={editingSchedule}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                />
            )}
        </div>
    );
}

export default SchedulePage;