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
    const frequencyOptions = ['175.00', '200.00', '300.00'];
    const [showKetSuggestions, setShowKetSuggestions] = useState(false);
    const keteranganOptions = ['Sesi 1', 'Sesi 2'];

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
        <div className="bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/60">
            {toast && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[999] px-5 py-2.5 rounded-full shadow-lg text-white text-sm font-semibold ${
                    toast.type === 'error' ? 'bg-red-500' : 'bg-primary'
                }`}>
                    {toast.message}
                </div>
            )}

            {(!session || editSession) && (
                <div className="p-7">
                    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md shadow-primary/20">
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
                            <div className="flex flex-col gap-1.5 relative dropdown-container">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <img src="/images/logger.png" alt="Frequency" className="w-3.5 h-3.5 object-contain" />
                                    Frequency
                                </label>
                                <div className="relative">
                                    <input
                                        placeholder="Pilih frequency..."
                                        value={sessionDraft.frequency}
                                        onClick={() => setShowFreqSuggestions(!showFreqSuggestions)}
                                        readOnly
                                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 text-sm placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary-light cursor-pointer"
                                        required
                                    />
                                    <img 
                                        src="/images/arrow-down.png" 
                                        alt="dropdown" 
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer transition-transform duration-200 pointer-events-none ${
                                            showFreqSuggestions ? 'rotate-180' : ''
                                        }`}
                                    />
                                    {showFreqSuggestions && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary rounded-xl shadow-2xl z-50 overflow-hidden">
                                            {frequencyOptions.map((freq, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        setSessionDraft({ ...sessionDraft, frequency: freq });
                                                        setShowFreqSuggestions(false);
                                                    }}
                                                    className="px-3.5 py-2.5 cursor-pointer hover:bg-primary-light border-b border-slate-50 last:border-b-0 transition-colors duration-100"
                                                >
                                                    <span className="font-bold text-primary">{freq}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex flex-col gap-1.5 relative">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <img src="/images/ncspencatat.png" alt="NCS Pencatat" className="w-3.5 h-3.5 object-contain" />
                                    NCS Pencatat
                                </label>
                                <input
                                    placeholder="Ketik NCS pencatat..."
                                    value={sessionDraft.pencatat_ncs}
                                    onChange={handlePencatatNcsChange}
                                    onFocus={() => { if (pencatatSuggestions.length > 0) setShowPencatatSuggestions(true); }}
                                    onBlur={() => setTimeout(() => setShowPencatatSuggestions(false), 200)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 text-sm placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary-light uppercase"
                                    required
                                />
                                {showPencatatSuggestions && pencatatSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary rounded-xl shadow-2xl z-50 overflow-hidden">
                                        {pencatatSuggestions.map((op) => (
                                            <div
                                                key={op.ncs}
                                                onPointerDown={(e) => {
                                                    e.preventDefault();
                                                    handleSelectPencatat(op);
                                                }}
                                                className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer hover:bg-primary-light border-b border-slate-50 last:border-b-0 transition-colors duration-100"
                                            >
                                                <span className="font-bold text-primary font-mono text-sm">{op.ncs}</span>
                                                <span className="text-slate-400 text-xs">{op.nama}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <img src="/images/namapencatat.png" alt="Nama Pencatat" className="w-3.5 h-3.5 object-contain" />
                                    Nama Pencatat
                                </label>
                                <input
                                    placeholder="Otomatis dari NCS"
                                    value={sessionDraft.pencatat_nama}
                                    readOnly
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100 text-slate-600 text-sm placeholder:text-slate-300 outline-none cursor-not-allowed"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5 relative dropdown-container">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <img src="/images/keterangan.png" alt="Keterangan" className="w-3.5 h-3.5 object-contain" />
                                    Keterangan
                                </label>
                                <div className="relative">
                                    <input
                                        placeholder="Pilih keterangan..."
                                        value={sessionDraft.keterangan}
                                        onClick={() => setShowKetSuggestions(!showKetSuggestions)}
                                        readOnly
                                        className="w-full px-3.5 py-2.5 pr-10 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 text-sm placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary-light cursor-pointer"
                                    />
                                    <img 
                                        src="/images/arrow-down.png" 
                                        alt="dropdown" 
                                        className={`absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 cursor-pointer transition-transform duration-200 pointer-events-none ${
                                            showKetSuggestions ? 'rotate-180' : ''
                                        }`}
                                    />
                                    {showKetSuggestions && (
                                        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary rounded-xl shadow-2xl z-50 overflow-hidden">
                                            {keteranganOptions.map((ket, idx) => (
                                                <div
                                                    key={idx}
                                                    onClick={() => {
                                                        setSessionDraft({ ...sessionDraft, keterangan: ket });
                                                        setShowKetSuggestions(false);
                                                    }}
                                                    className="px-3.5 py-2.5 cursor-pointer hover:bg-primary-light border-b border-slate-50 last:border-b-0 transition-colors duration-100"
                                                >
                                                    <span className="font-bold text-primary">{ket}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
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
                                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
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
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 sm:px-7 py-4 bg-primary-light/60 border-b border-primary/10">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-md shadow-primary/30 animate-pulse" />
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Sesi Aktif</span>
                                <span className="inline-flex items-center gap-1.5 bg-white border border-primary text-primary font-bold font-mono text-xs px-2 sm:px-3 py-1 rounded-lg shadow-sm">
                                    <img src="/images/logger.png" alt="Frequency" className="w-3 h-3 object-contain" />
                                    {session.frequency}
                                </span>
                                <span className="inline-flex items-center gap-1.5 bg-white border border-secondary text-secondary font-bold font-mono text-xs px-2 sm:px-3 py-1 rounded-lg shadow-sm">
                                    <img src="/images/ncspencatat.png" alt="NCS Pencatat" className="w-3 h-3 object-contain" />
                                    {session.pencatat_ncs}
                                </span>
                                {session.keterangan && (
                                    <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 text-slate-600 text-xs px-2 sm:px-3 py-1 rounded-lg shadow-sm">
                                        <img src="/images/keterangan.png" alt="Keterangan" className="w-3 h-3 object-contain" />
                                        <span className="max-w-[80px] sm:max-w-none truncate">{session.keterangan}</span>
                                    </span>
                                )}
                            </div>
                        </div>
                        <button
                            onClick={() => { setEditSession(true); setSessionDraft({ ...session }); }}
                            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-primary transition-colors duration-150 whitespace-nowrap"
                        >
                            <svg width="12" height="12" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Ganti Sesi</span>
                        </button>
                    </div>

                    <div className="px-4 md:px-7 pt-4 md:pt-6 pb-3 md:pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                Import Excel (Multiple NCS)
                            </label>
                        </div>
                        
                        <div className="space-y-2 md:space-y-3">
                            <div className="bg-blue-50 border border-blue-200 rounded-lg md:rounded-xl p-2 md:p-3">
                                <p className="text-xs text-blue-800">
                                    📄 <strong>Format:</strong> 1 kolom (NCS saja), tanpa header<br/>
                                    <strong>Contoh:</strong> JZ09VAG, JZ01AEJ (satu per baris)
                                </p>
                            </div>
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleBulkFileChange}
                                className="w-full px-2 md:px-3 py-1.5 md:py-2 rounded-lg md:rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-xs outline-none file:mr-2 md:file:mr-3 file:py-1 md:file:py-1.5 file:px-2 md:file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white"
                            />
                            {bulkFile && (
                                <p className="text-xs text-slate-600">
                                    📄 {bulkFile.name} ({(bulkFile.size / 1024).toFixed(2)} KB)
                                </p>
                            )}
                            {bulkResult && (
                                <div className={`rounded-lg md:rounded-xl p-2 md:p-3 text-xs ${
                                    bulkResult.success ? 'bg-green-50 border border-green-200 text-green-800' : 'bg-red-50 border border-red-200 text-red-800'
                                }`}>
                                    <p className="font-bold">{bulkResult.message}</p>
                                    {bulkResult.errors && bulkResult.errors.length > 0 && (
                                        <div className="mt-1 md:mt-2 max-h-16 md:max-h-20 overflow-y-auto">
                                            {bulkResult.errors.slice(0, 5).map((err, idx) => (
                                                <p key={idx}>Baris {err.row}: {err.ncs} - {err.message}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                            <button
                                onClick={handleBulkImport}
                                disabled={!bulkFile || bulkImporting}
                                className="w-full px-3 md:px-4 py-2 md:py-2.5 rounded-lg md:rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs md:text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {bulkImporting ? (
                                    <>
                                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="4" strokeOpacity="0.25" />
                                            <path fill="white" fillOpacity="0.75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                        Importing...
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                        </svg>
                                        Import Sekarang
                                    </>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="px-7 pt-6 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                                Catatan Peserta 
                            </label>
                        </div>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            onKeyDown={handleNotesKeyDown}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-amber-50/50 text-slate-700 text-sm placeholder:text-slate-400 outline-none transition-all duration-200 focus:border-amber-400 focus:bg-amber-50 focus:ring-2 focus:ring-amber-100 font-mono resize-none"
                            rows="4"
                            placeholder="Ketik catatan di sini... (ketik '-' lalu Enter untuk buat list)"
                        />
                    </div>

                    <form onSubmit={handleSubmit} className="p-7 relative">
                        {success && (
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 bg-primary text-white text-sm font-semibold px-5 py-2 rounded-full shadow-lg whitespace-nowrap">
                                <span>✓</span> Log berhasil disimpan!
                            </div>
                        )}

                        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center shadow-md shadow-primary/20">
                                <svg width="16" height="16" fill="none" stroke="white" strokeWidth="2.2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-800 m-0 leading-tight">Input NCS</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 md:flex-row md:gap-3 md:items-end">
                            <div className="flex flex-col gap-1.5 flex-1 relative">
                                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                    <img src="/images/home.png" alt="10/28" className="w-3.5 h-3.5 object-contain" />
                                    10/28
                                </label>
                                <input
                                    placeholder="Ketik VAG → Enter"
                                    value={ncs}
                                    onChange={handleNcsChange}
                                    onKeyDown={handleNcsKeyDown}
                                    onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 text-sm placeholder:text-slate-300 outline-none transition-all duration-200 focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary-light uppercase font-mono"
                                    autoFocus
                                />
                                {showSuggestions && suggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-primary rounded-xl shadow-2xl z-[9999] overflow-hidden">
                                        {suggestions.map((op) => (
                                            <div
                                                key={op.ncs}
                                                onPointerDown={(e) => {
                                                    e.preventDefault();
                                                    handleSelectSuggestion(op);
                                                }}
                                                className="flex items-center justify-between px-3.5 py-2.5 cursor-pointer hover:bg-primary-light border-b border-slate-50 last:border-b-0 transition-colors duration-100"
                                            >
                                                <span className="font-bold text-primary font-mono text-sm">{op.ncs}</span>
                                                <span className="text-slate-400 text-xs">{op.nama}</span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {selectedOperator && (
                                <div className="flex flex-col gap-1.5 flex-1">
                                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5">
                                        <img src="/images/namapencatat.png" alt="Nama" className="w-3.5 h-3.5 object-contain" />
                                        Nama
                                    </label>
                                    <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-primary bg-primary-light/60 text-primary text-sm font-semibold">
                                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                            {selectedOperator.nama[0].toUpperCase()}
                                        </div>
                                        <span className="truncate">{selectedOperator.nama}</span>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={loading || !ncs}
                                className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-secondary to-primary text-white text-sm font-semibold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
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