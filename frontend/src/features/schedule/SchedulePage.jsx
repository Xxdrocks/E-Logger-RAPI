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
        <div className="min-h-screen bg-gradient-to-br from-primary-light via-secondary-light to-accent-light py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Jadwal NCS On Duty</h1>
                        <p className="text-slate-600">Kelola jadwal kegiatan dan NCS berikutnya</p>
                    </div>
                    <button
                        onClick={handleAdd}
                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg transition-all duration-200"
                    >
                        Tambah Jadwal
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : schedules.length === 0 ? (
                    <div className="text-center py-20 bg-white/80 rounded-2xl">
                        <p className="text-slate-500 text-lg">Belum ada jadwal kegiatan</p>
                        <button
                            onClick={handleAdd}
                            className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-all duration-200"
                        >
                            Tambah Jadwal Pertama
                        </button>
                    </div>
                ) : (
                    <div className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden">
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