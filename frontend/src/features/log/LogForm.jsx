import React, { useState, useEffect } from 'react';
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
    const [toast, setToast] = useState(null);
    
    const [pencatatSuggestions, setPencatatSuggestions] = useState([]);
    const [showPencatatSuggestions, setShowPencatatSuggestions] = useState(false);
    const [notes, setNotes] = useState('');

    const [showFreqSuggestions, setShowFreqSuggestions] = useState(false);
    const frequencyOptions = ['27.375mhz'];
    const [showKetSuggestions, setShowKetSuggestions] = useState(false);
    const keteranganOptions = ['Net RAPI 27Mhz 2026'];

    const [bulkFile, setBulkFile] = useState(null);
    const [bulkImporting, setBulkImporting] = useState(false);
    const [bulkResult, setBulkResult] = useState(null);

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (!e.target.closest('.dropdown-container')) {
                setShowFreqSuggestions(false);
                setShowKetSuggestions(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

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
        setNotes('');
    };

    const handleNcsChange = async (e) => {
        const value = e.target.value.toUpperCase();
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
        if (e.key === 'Enter') {
            e.preventDefault();
            
            if (!ncs) return;

            try {
                const res = await axios.get(`http://127.0.0.1:8000/api/logs/search-ncs?q=${ncs}`);
                
                const exactMatch = res.data.find(op => op.ncs.toLowerCase() === ncs.toLowerCase());
                const partialMatch = res.data.find(op => op.ncs.toLowerCase().includes(ncs.toLowerCase()));
                
                if (exactMatch) {
                    handleSelectSuggestion(exactMatch);
                } else if (partialMatch) {
                    handleSelectSuggestion(partialMatch);
                } else {
                    showToast('NCS belum terdaftar di database', 'error');
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
            if (err.response?.data?.message) {
                showToast(err.response.data.message, 'error');
            } else {
                const errors = err.response?.data?.errors;
                if (errors) {
                    showToast('Validasi gagal: ' + Object.values(errors).flat().join(', '), 'error');
                } else {
                    showToast('Terjadi kesalahan, coba lagi.', 'error');
                }
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBulkFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
            if (!validTypes.includes(file.type)) {
                showToast('Format file harus .xlsx, .xls, atau .csv', 'error');
                return;
            }
            setBulkFile(file);
        }
    };

    const handleBulkImport = async () => {
        if (!bulkFile || !session) {
            showToast('Pilih file dan pastikan sesi aktif', 'error');
            return;
        }

        setBulkImporting(true);
        setBulkResult(null);

        try {
            const formData = new FormData();
            formData.append('file', bulkFile);
            formData.append('frequency', session.frequency);
            formData.append('keterangan', session.keterangan || '');
            formData.append('pencatat_ncs', session.pencatat_ncs);
            formData.append('pencatat_nama', session.pencatat_nama || '');

            const res = await axios.post('http://127.0.0.1:8000/api/logs/bulk-import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setBulkResult(res.data);
            if (res.data.success) {
                showToast(res.data.message, 'success');
                refresh();
                setBulkFile(null);
                setBulkResult(null);
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Gagal import';
            showToast(errorMsg, 'error');
            setBulkResult({ success: false, message: errorMsg });
        } finally {
            setBulkImporting(false);
        }
    };

    const handleNotesKeyDown = (e) => {
        if (e.key === 'Enter') {
            const cursorPos = e.target.selectionStart;
            const currentLine = notes.substring(0, cursorPos).split('\n').pop();
            
            if (currentLine.trim().startsWith('-')) {
                e.preventDefault();
                const beforeCursor = notes.substring(0, cursorPos);
                const afterCursor = notes.substring(cursorPos);
                setNotes(beforeCursor + '\n- ' + afterCursor);
                
                setTimeout(() => {
                    e.target.selectionStart = e.target.selectionEnd = cursorPos + 3;
                }, 0);
            }
        }
    };

    return (
        <div className="bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl">
            {toast && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[999] px-5 py-2.5 rounded-full shadow-lg text-white text-sm font-semibold ${
                    toast.type === 'error' ? 'bg-red-500' : 'bg-primary'
                }`}>
                    {toast.message}
                </div>
            )}

            {(!session || editSession) && (
                <div className="p-5 md:p-7">
                    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                            <svg width="18" height="18" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-slate-900">{editSession ? 'Ganti Sesi' : 'Sesi Aktif'}</h2>
                            <p className="text-xs text-slate-500 mt-0.5">
                                {editSession ? 'Ubah konfigurasi sesi' : 'Atur frequency dan keterangan'}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleStartSession} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="dropdown-container">
                                <label className="block text-xs font-bold text-slate-600 mb-2">Frequency</label>
                                <div className="relative">
                                    <input
                                        placeholder="Pilih frequency..."
                                        value={sessionDraft.frequency}
                                        onClick={() => setShowFreqSuggestions(!showFreqSuggestions)}
                                        readOnly
                                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-800 text-sm cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        required
                                    />
                                    <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-transform ${showFreqSuggestions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                    {showFreqSuggestions && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-primary rounded-xl shadow-xl z-50 overflow-hidden">
                                            {frequencyOptions.map((freq, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        setSessionDraft({ ...sessionDraft, frequency: freq });
                                                        setShowFreqSuggestions(false);
                                                    }}
                                                    className="px-4 py-3 cursor-pointer hover:bg-primary/10 transition-colors border-b border-slate-100 last:border-0"
                                                >
                                                    <span className="font-semibold text-primary">{freq}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="dropdown-container">
                                <label className="block text-xs font-bold text-slate-600 mb-2"> Kegaiatan </label>
                                <div className="relative">
                                    <input
                                        placeholder="Pilih kegiatan..."
                                        value={sessionDraft.keterangan}
                                        onClick={() => setShowKetSuggestions(!showKetSuggestions)}
                                        readOnly
                                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-800 text-sm cursor-pointer focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    <svg className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 transition-transform ${showKetSuggestions ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                    </svg>
                                    {showKetSuggestions && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-primary rounded-xl shadow-xl z-50 overflow-hidden">
                                            {keteranganOptions.map((ket, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        setSessionDraft({ ...sessionDraft, keterangan: ket });
                                                        setShowKetSuggestions(false);
                                                    }}
                                                    className="px-4 py-3 cursor-pointer hover:bg-primary/10 transition-colors border-b border-slate-100 last:border-0"
                                                >
                                                    <span className="font-semibold text-primary">{ket}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="relative">
                                <label className="block text-xs font-bold text-slate-600 mb-2">NCS On Duty</label>
                                <input
                                    placeholder="Ketik 10-28..."
                                    value={sessionDraft.pencatat_ncs}
                                    onChange={handlePencatatNcsChange}
                                    onFocus={() => { if (pencatatSuggestions.length > 0) setShowPencatatSuggestions(true); }}
                                    onBlur={() => setTimeout(() => setShowPencatatSuggestions(false), 200)}
                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-800 text-sm uppercase focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                    required
                                />
                                {showPencatatSuggestions && pencatatSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-primary rounded-xl shadow-xl z-50 max-h-48 overflow-y-auto">
                                        {pencatatSuggestions.map((op) => (
                                            <div
                                                key={op.ncs}
                                                onPointerDown={(e) => {
                                                    e.preventDefault();
                                                    handleSelectPencatat(op);
                                                }}
                                                className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-primary/10 transition-colors border-b border-slate-100 last:border-0"
                                            >
                                                <span className="font-bold text-primary font-mono">{op.ncs}</span>
                                                <span className="text-slate-500 text-sm">{op.nama}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-600 mb-2"> Operator </label>
                                <input
                                    value={sessionDraft.pencatat_nama}
                                    readOnly
                                    placeholder="Otomatis terisi"
                                    className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-slate-50 text-slate-600 text-sm cursor-not-allowed"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            {editSession && (
                                <button
                                    type="button"
                                    onClick={() => setEditSession(false)}
                                    className="flex-1 px-5 py-2.5 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all"
                                >
                                    Batal
                                </button>
                            )}
                            <button
                                type="submit"
                                className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                            >
                                {editSession ? 'Simpan' : 'Mulai Sesi'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {session && !editSession && (
                <>
                    <div className="px-5 md:px-7 py-4 bg-gradient-to-r from-primary/10 to-secondary/10 border-b border-slate-200/50">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-xs font-bold text-slate-600 uppercase">Sesi Aktif</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border border-primary shadow-sm">
                                        <span className="text-xs font-semibold text-primary">{session.frequency}</span>
                                    </span>
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white rounded-lg border border-secondary shadow-sm">
                                        <span className="text-xs font-mono font-semibold text-secondary">{session.pencatat_ncs}</span>
                                    </span>
                                    {session.keterangan && (
                                        <span className="inline-flex items-center px-3 py-1 bg-white rounded-lg border border-slate-200 shadow-sm">
                                            <span className="text-xs font-semibold text-slate-600">{session.keterangan}</span>
                                        </span>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={() => { setEditSession(true); setSessionDraft({ ...session }); }}
                                className="text-xs font-semibold text-primary hover:text-primary-dark transition-colors flex items-center gap-1"
                            >
                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Ganti Sesi
                            </button>
                        </div>
                    </div>

                    <div className="p-5 md:p-7 space-y-6">
                        <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Catatan NCS 
                            </label>
                            <textarea
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                onKeyDown={handleNotesKeyDown}
                                className="w-full px-4 py-3 rounded-xl border-2 border-amber-200 bg-amber-50 text-slate-700 text-sm focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all resize-none"
                                rows="4"
                                placeholder="Untuk mencatat 10-28 yang didengar oleh NCS"
                            />
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 relative">
                            {success && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-5 py-2 bg-green-500 text-white text-sm font-semibold rounded-full shadow-lg z-10">
                                    ✓ Log tersimpan!
                                </div>
                            )}

                            <div className="flex items-center gap-3 pb-3 border-b border-slate-200">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                    </svg>
                                </div>
                                <h3 className="text-sm font-bold text-slate-900">Input NCS</h3>
                            </div>

                            <div className="space-y-3">
                                <div className="relative">
                                    <label className="block text-xs font-bold text-slate-600 mb-2">10/28</label>
                                    <input
                                        placeholder="Ketik NCS → Enter"
                                        value={ncs}
                                        onChange={handleNcsChange}
                                        onKeyDown={handleNcsKeyDown}
                                        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                        className="w-full px-4 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-800 text-sm uppercase font-mono focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                                        autoFocus
                                    />
                                    {showSuggestions && suggestions.length > 0 && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border-2 border-primary rounded-xl shadow-xl z-[9999] max-h-48 overflow-y-auto">
                                            {suggestions.map((op) => (
                                                <div
                                                    key={op.ncs}
                                                    onPointerDown={(e) => {
                                                        e.preventDefault();
                                                        handleSelectSuggestion(op);
                                                    }}
                                                    className="flex justify-between items-center px-4 py-3 cursor-pointer hover:bg-primary/10 transition-colors border-b border-slate-100 last:border-0"
                                                >
                                                    <span className="font-bold text-primary font-mono">{op.ncs}</span>
                                                    <span className="text-slate-500 text-sm">{op.nama}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {selectedOperator && (
                                    <div className="flex items-center gap-3 px-4 py-3 bg-primary/5 border border-primary/20 rounded-xl">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                                            {selectedOperator.nama[0].toUpperCase()}
                                        </div>
                                        <span className="font-semibold text-slate-800">{selectedOperator.nama}</span>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={loading || !ncs}
                                    className="w-full px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold shadow-lg hover:shadow-xl disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                                <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.25" />
                                                <path fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                            </svg>
                                            Menyimpan...
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                            </svg>
                                            Simpan Log
                                        </>
                                    )}
                                </button>
                            </div>
                             <div className="space-y-3">
                            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                                Import Excel
                            </label>
    
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleBulkFileChange}
                                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:font-semibold hover:file:bg-primary-dark"
                            />
                            {bulkFile && (
                                <p className="text-xs text-slate-600">📄 {bulkFile.name}</p>
                            )}
                            <button
                                onClick={handleBulkImport}
                                disabled={!bulkFile || bulkImporting}
                                className="w-full px-4 py-2.5 rounded-xl bg-primary text-white font-semibold hover:bg-hover disabled:opacity-50 transition-all"
                            >
                                {bulkImporting ? 'Importing...' : 'Import Sekarang'}
                            </button>
                        </div>  
                        </form>
                    </div>
                </>
            )}
        </div>
    );
}

export default LogForm; 