import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ScheduleModal({ schedule, onClose, onSave }) {
    const [form, setForm] = useState({
        title: '',
        location: '',
        event_date: '',
        event_time: '',
        pencatat_ncs: '',
        pencatat_nama: '',
    });
    const [submitting, setSubmitting] = useState(false);
    const token = localStorage.getItem('token');
    
    const [pencatatSuggestions, setPencatatSuggestions] = useState([]);
    const [showPencatatSuggestions, setShowPencatatSuggestions] = useState(false);

    const [showLokasiSuggestions, setShowLokasiSuggestions] = useState(false);
    const lokasiOptions = ['Barat', 'Tengah', 'Timur'];

    useEffect(() => {
        if (schedule) {
            setForm({
                title: schedule.title || '',
                location: schedule.location || '',
                event_date: schedule.event_date || '',
                event_time: schedule.event_time || '',
                pencatat_ncs: schedule.pencatat_ncs || '',
                pencatat_nama: schedule.pencatat_nama || '',
            });
        }
    }, [schedule]);

    const handlePencatatNcsChange = async (e) => {
        const value = e.target.value;
        setForm({ ...form, pencatat_ncs: value, pencatat_nama: '' });

        if (value.length >= 2) {
            try {
                const res = await axios.get(`https://rumahrapi.com/backend/api/logs/search-ncs?q=${value}`);
                setPencatatSuggestions(res.data);
                setShowPencatatSuggestions(true);
            } catch (err) {
                setPencatatSuggestions([]);
            }
        } else {
            setPencatatSuggestions([]);
            setShowPencatatSuggestions(false);
        }
    };

    const handleSelectPencatat = (user) => {
        setForm({ ...form, pencatat_ncs: user.ncs, pencatat_nama: user.nama });
        setPencatatSuggestions([]);
        setShowPencatatSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const payload = {
                title: form.title,
                location: form.location,
                event_date: form.event_date,
                event_time: form.event_time,
                pencatat_ncs: form.pencatat_ncs,
                pencatat_nama: form.pencatat_nama,
            };

            if (schedule) {
                await axios.put(`https://rumahrapi.com/backend/api/schedules/${schedule.id}`, payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            } else {
                await axios.post('https://rumahrapi.com/backend/api/schedules', payload, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            onSave();
        } catch (error) {
            console.error('Error saving schedule:', error);
            alert('Gagal menyimpan jadwal');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    {schedule ? 'Edit Jadwal' : 'Tambah Jadwal Baru'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                        <div className="sm:col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                                Judul Kegiatan
                            </label>
                            <input
                                type="text"
                                value={form.title}
                                onChange={(e) => setForm({ ...form, title: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary-light"
                                placeholder="Contoh: Rapat Bulanan RAPI"
                                required
                            />
                        </div>


                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                                Tanggal
                            </label>
                            <input
                                type="date"
                                value={form.event_date}
                                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary-light"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                                Jam
                            </label>
                            <input
                                type="time"
                                value={form.event_time}
                                onChange={(e) => setForm({ ...form, event_time: e.target.value })}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary-light"
                            />
                        </div>

                        <div className="relative">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                                NCS Pencatat Berikutnya
                            </label>
                            <input
                                type="text"
                                value={form.pencatat_ncs}
                                onChange={handlePencatatNcsChange}
                                onFocus={() => { if (pencatatSuggestions.length > 0) setShowPencatatSuggestions(true); }}
                                onBlur={() => setTimeout(() => setShowPencatatSuggestions(false), 200)}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary-light uppercase"
                                placeholder="Ketik NCS..."
                            />
                            {showPencatatSuggestions && pencatatSuggestions.length > 0 && (
                                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary rounded-xl shadow-2xl z-50 overflow-hidden">
                                    {pencatatSuggestions.map((user) => (
                                        <div
                                            key={user.ncs}
                                            onPointerDown={(e) => {
                                                e.preventDefault();
                                                handleSelectPencatat(user);
                                            }}
                                            className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer hover:bg-primary-light border-b border-slate-50 last:border-b-0"
                                        >
                                            <span className="font-bold text-primary font-mono text-sm">{user.ncs}</span>
                                            <span className="text-slate-400 text-xs">{user.nama}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                                Nama Pencatat
                            </label>
                            <input
                                type="text"
                                value={form.pencatat_nama}
                                readOnly
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 text-sm outline-none cursor-not-allowed"
                                placeholder="Otomatis dari NCS"
                            />
                        </div>

                        <div className="sm:col-span-2 relative">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                                Lokasi
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={form.location}
                                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                                    onFocus={() => setShowLokasiSuggestions(true)}
                                    onBlur={() => setTimeout(() => setShowLokasiSuggestions(false), 200)}
                                    className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm outline-none focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary-light"
                                    placeholder="Contoh: Barat"
                                />
                                <img 
                                    src="/images/arrow-down.png" 
                                    alt="dropdown" 
                                    className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer transition-transform duration-200 ${
                                        showLokasiSuggestions ? 'rotate-180' : ''
                                    }`}
                                    onClick={() => setShowLokasiSuggestions(!showLokasiSuggestions)}
                                />
                                {showLokasiSuggestions && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary rounded-xl shadow-2xl z-50 overflow-hidden">
                                        {lokasiOptions.map((lok, idx) => (
                                            <div
                                                key={idx}
                                                onPointerDown={(e) => {
                                                    e.preventDefault();
                                                    setForm({ ...form, location: lok });
                                                    setShowLokasiSuggestions(false);
                                                }}
                                                className="px-3.5 py-2.5 cursor-pointer hover:bg-primary-light border-b border-slate-50 last:border-b-0 transition-colors duration-100"
                                            >
                                                <span className="font-bold text-primary">{lok}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="flex items-center gap-3 justify-end mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition-all"
                        >
                            Batal
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {submitting ? 'Menyimpan...' : 'Simpan'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ScheduleModal;