import React, { useState } from 'react';
import axios from 'axios';

function LogForm({ refresh, session, setSession }) {
    const [sessionDraft, setSessionDraft] = useState({ 
        frequency: '', 
        keterangan: '', 
        pencatat_ncs: '', 
        pencatat_nama: '' 
    });
    const [ncs, setNcs] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedOperator, setSelectedOperator] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [editSession, setEditSession] = useState(false);
    
    const [pencatatSuggestions, setPencatatSuggestions] = useState([]);
    const [showPencatatSuggestions, setShowPencatatSuggestions] = useState(false);

    const extractZzd = (ncs) => {
        if (!ncs || ncs.length < 4) return '';
        return ncs.slice(2, 4);
    };

    const handlePencatatNcsChange = async (e) => {
        const value = e.target.value;
        setSessionDraft({ ...sessionDraft, pencatat_ncs: value, pencatat_nama: '' });

        if (value.length >= 2) {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/logs/search-ncs?q=${value}`);
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

    const handleSelectPencatat = (op) => {
        setSessionDraft({ ...sessionDraft, pencatat_ncs: op.ncs, pencatat_nama: op.nama });
        setPencatatSuggestions([]);
        setShowPencatatSuggestions(false);
    };

    const handleStartSession = (e) => {
        e.preventDefault();
        if (!sessionDraft.frequency || !sessionDraft.pencatat_ncs) return;
        setSession({ ...sessionDraft });
        setEditSession(false);
    };

    const handleNcsChange = async (e) => {
        const value = e.target.value;
        setNcs(value);
        setSelectedOperator(null);

        if (value.length >= 2) {
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/logs/search-ncs?q=${value}`);
                setSuggestions(res.data);
                setShowSuggestions(true);
            } catch (err) {
                setSuggestions([]);
            }
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleNcsKeyDown = async (e) => {
        if (e.key === 'Enter' && ncs && !selectedOperator) {
            e.preventDefault();
            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/logs/search-ncs?q=${ncs}`);
                const exactMatch = res.data.find(op => op.ncs.toLowerCase() === ncs.toLowerCase());
                if (exactMatch) {
                    handleSelectSuggestion(exactMatch);
                }
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleSelectSuggestion = (op) => {
        setNcs(op.ncs);
        setSelectedOperator(op);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!session || !ncs) return;
        setLoading(true);
        try {
            await axios.post('http://127.0.0.1:8000/api/logs', {
                frequency: session.frequency,
                keterangan: session.keterangan,
                ncs_1028: ncs,
                nama: selectedOperator?.nama || '',
                zzd: extractZzd(ncs),
                pencatat_ncs: session.pencatat_ncs,
                pencatat_nama: session.pencatat_nama,
            });
            setNcs('');
            setSelectedOperator(null);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 2000);
            refresh();
        } catch (err) {
            const errors = err.response?.data?.errors;
            if (errors) {
                alert('Validasi gagal:\n' + Object.values(errors).flat().join('\n'));
            } else {
                alert('Terjadi kesalahan, coba lagi.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/60">
            {(!session || editSession) && (
                <div className="p-7">
                    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                            <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-800 m-0 leading-tight">
                                {editSession ? 'Ganti Sesi' : 'Mulai Sesi Baru'}
                            </p>
                            <p className="text-xs text-slate-400 mt-0.5">Isi frequency, pencatat, dan keterangan</p>
                        </div>
                    </div>

                    <form onSubmit={handleStartSession}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                    📡 Frequency
                                </label>
                                <input
                                    placeholder="Contoh: 175.200"
                                    value={sessionDraft.frequency}
                                    onChange={(e) => setSessionDraft({ ...sessionDraft, frequency: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 text-sm placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    required
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 relative">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                    👮 NCS Pencatat
                                </label>
                                <input
                                    placeholder="Ketik NCS pencatat..."
                                    value={sessionDraft.pencatat_ncs}
                                    onChange={handlePencatatNcsChange}
                                    onFocus={() => { if (pencatatSuggestions.length > 0) setShowPencatatSuggestions(true); }}
                                    onBlur={() => setTimeout(() => setShowPencatatSuggestions(false), 200)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 text-sm placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    required
                                />
                                {showPencatatSuggestions && pencatatSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 overflow-hidden">
                                        {pencatatSuggestions.map((op) => (
                                            <div
                                                key={op.ncs}
                                                onPointerDown={(e) => {
                                                    e.preventDefault();
                                                    handleSelectPencatat(op);
                                                }}
                                                className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer hover:bg-indigo-50 border-b border-slate-50 last:border-b-0 transition-colors duration-100"
                                            >
                                                <span className="font-bold text-indigo-600 font-mono text-sm">{op.ncs}</span>
                                                <span className="text-slate-400 text-xs">{op.nama}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                    👤 Nama Pencatat
                                </label>
                                <input
                                    placeholder="Otomatis dari NCS"
                                    value={sessionDraft.pencatat_nama}
                                    readOnly
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 text-sm placeholder:text-slate-300 outline-none cursor-not-allowed"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                    📝 Keterangan
                                </label>
                                <input
                                    placeholder="Contoh: Check in pagi"
                                    value={sessionDraft.keterangan}
                                    onChange={(e) => setSessionDraft({ ...sessionDraft, keterangan: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 text-sm placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-3 justify-end">
                            {editSession && (
                                <button
                                    type="button"
                                    onClick={() => setEditSession(false)}
                                    className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm font-semibold hover:bg-slate-50 transition-all duration-200"
                                >
                                    Batal
                                </button>
                            )}
                            <button
                                type="submit"
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-200"
                            >
                                <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Mulai Sesi
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {session && !editSession && (
                <>
                    <div className="flex items-center justify-between px-7 py-4 bg-indigo-50/60 border-b border-indigo-100">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-300 animate-pulse" />
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sesi Aktif</span>
                                <span className="inline-flex items-center gap-1.5 bg-white border border-indigo-200 text-indigo-700 font-bold font-mono text-xs px-3 py-1 rounded-lg shadow-sm">
                                    📡 {session.frequency}
                                </span>
                                <span className="inline-flex items-center gap-1.5 bg-white border border-emerald-200 text-emerald-700 font-bold font-mono text-xs px-3 py-1 rounded-lg shadow-sm">
                                    👮 {session.pencatat_ncs}
                                </span>
                                {session.keterangan && (
                                    <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-xs px-3 py-1 rounded-lg shadow-sm">
                                        📝 {session.keterangan}
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => { setEditSession(true); setSessionDraft({ ...session }); }}
                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-indigo-600 transition-colors duration-150"
                        >
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Ganti Sesi
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-7 relative">
                        {success && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-emerald-500 text-white text-sm font-semibold px-5 py-2 rounded-full shadow-lg whitespace-nowrap">
                                <span>✓</span> Log berhasil disimpan!
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 flex items-center justify-center shadow-md shadow-indigo-200 shrink-0">
                                <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 m-0 leading-tight">Input NCS</p>
                                <p className="text-xs text-slate-400 mt-0.5">Ketik NCS, nama akan terisi otomatis</p>
                            </div>
                        </div>

                        <div className="flex gap-3 items-end">
                            <div className="flex flex-col gap-1.5 flex-1 relative">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                    🔢 10/28
                                </label>
                                <input
                                    placeholder="Ketik NCS... contoh: VAG"
                                    value={ncs}
                                    onChange={handleNcsChange}
                                    onKeyDown={handleNcsKeyDown}
                                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 text-sm placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-indigo-400 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                                    autoFocus
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-indigo-200 rounded-xl shadow-2xl z-[9999] overflow-hidden">
                                        {suggestions.map((op) => (
                                            <div
                                                key={op.ncs}
                                                onPointerDown={(e) => {
                                                    e.preventDefault();
                                                    handleSelectSuggestion(op);
                                                }}
                                                className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer hover:bg-indigo-50 border-b border-slate-50 last:border-b-0 transition-colors duration-100"
                                            >
                                                <span className="font-bold text-indigo-600 font-mono text-sm">{op.ncs}</span>
                                                <span className="text-slate-400 text-xs">{op.nama}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {selectedOperator && (
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                                        👤 Nama
                                    </label>
                                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-50/60 text-emerald-700 text-sm font-semibold">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                            {selectedOperator.nama[0].toUpperCase()}
                                        </div>
                                        {selectedOperator.nama}
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !ncs}
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white text-sm font-semibold shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 whitespace-nowrap"
                            >
                                {loading ? (
                                    <>
                                        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" className="animate-spin">
                                            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.25" />
                                            <path fill="white" fillOpacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                        Simpan Log
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}

export default LogForm;