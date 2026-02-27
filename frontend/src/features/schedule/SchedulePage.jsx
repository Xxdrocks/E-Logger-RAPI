import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduleCard from './ScheduleCard';
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

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-light via-secondary-light to-accent-light py-10 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    {/* <div>
                        <h1 className="text-4xl font-bold text-slate-900 mb-2">Jadwal Kegiatan</h1>
                        <p className="text-slate-600">Kelola jadwal kegiatan dan acara RAPI</p>
                    </div> */}
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
                    <div className="space-y-4">
                        {schedules.map((schedule) => (
                            <ScheduleCard
                                key={schedule.id}
                                schedule={schedule}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))}
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