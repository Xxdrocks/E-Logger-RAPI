import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OperatorPage() {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ ncs: '', nama: '', role: 'member' });
    const [submitting, setSubmitting] = useState(false);
    const [toast, setToast] = useState(null);
    const [editTarget, setEditTarget] = useState(null);
    const [editForm, setEditForm] = useState({ ncs: '', nama: '', role: '' });
    const [deletingId, setDeletingId] = useState(null);
    const [showImportModal, setShowImportModal] = useState(false);
    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);

    const showToast = (message, color = 'bg-primary') => {
        setToast({ message, color });
        setTimeout(() => setToast(null), 2500);
    };

    const fetchUsers = async () => {
        try {
            const res = await axios.get('https://rumahrapi.com/backend/api/users');
            setUsers(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        filterAndSortUsers();
    }, [users, searchQuery]);

    const filterAndSortUsers = () => {
        let filtered = users;

        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(user => 
                user.nama.toLowerCase().includes(query) || 
                user.ncs.toLowerCase().includes(query)
            );
        }

        filtered.sort((a, b) => {
            const roleOrder = { superadmin: 0, admin: 1, member: 2 };
            const roleA = roleOrder[a.role] || 3;
            const roleB = roleOrder[b.role] || 3;

            if (roleA !== roleB) {
                return roleA - roleB;
            }

            return a.nama.localeCompare(b.nama);
        });

        setFilteredUsers(filtered);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await axios.post('https://rumahrapi.com/backend/api/users', form);
            setForm({ ncs: '', nama: '', role: 'member' });
            showToast('✓ Operator berhasil ditambahkan');
            fetchUsers();
        } catch (err) {
            const msg = err.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join(', ')
                : 'Terjadi kesalahan';
            showToast('✕ ' + msg, 'bg-red-500');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = (user) => {
        setEditTarget(user);
        setEditForm({ ncs: user.ncs, nama: user.nama, role: user.role });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://rumahrapi.com/backend/api/users/${editTarget.id}`, editForm);
            showToast('✓ Operator berhasil diupdate');
            setEditTarget(null);
            fetchUsers();
        } catch (err) {
            const msg = err.response?.data?.errors
                ? Object.values(err.response.data.errors).flat().join(', ')
                : 'Terjadi kesalahan';
            showToast('✕ ' + msg, 'bg-red-500');
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Yakin ingin menghapus operator ini?')) return;
        
        setDeletingId(id);
        try {
            await axios.delete(`https://rumahrapi.com/backend/api/users/${id}`);
            showToast('✓ Operator berhasil dihapus');
            fetchUsers();
        } catch (err) {
            showToast('✕ Gagal menghapus', 'bg-red-500');
        } finally {
            setDeletingId(null);
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', 'text/csv'];
            if (!validTypes.includes(file.type)) {
                showToast('✕ Format file harus .xlsx, .xls, atau .csv', 'bg-red-500');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                showToast('✕ Ukuran file maksimal 5MB', 'bg-red-500');
                return;
            }
            setImportFile(file);
        }
    };

    const handleImport = async () => {
        if (!importFile) {
            showToast('✕ Pilih file terlebih dahulu', 'bg-red-500');
            return;
        }

        setImporting(true);
        setImportResult(null);

        try {
            const formData = new FormData();
            formData.append('file', importFile);

            const res = await axios.post('https://rumahrapi.com/backend/api/users/bulk-import', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setImportResult(res.data);
            
            if (res.data.success) {
                showToast(`✓ ${res.data.message}`);
                fetchUsers();
            }
        } catch (error) {
            const errorMsg = error.response?.data?.message || 'Gagal melakukan import';
            showToast(`✕ ${errorMsg}`, 'bg-red-500');
            setImportResult({
                success: false,
                message: errorMsg
            });
        } finally {
            setImporting(false);
        }
    };

    const closeImportModal = () => {
        setShowImportModal(false);
        setImportFile(null);
        setImportResult(null);
    };

    const getRoleBadgeColor = (role) => {
        const colors = {
            superadmin: 'bg-purple-50 text-purple-700 border-purple-200',
            admin: 'bg-blue-50 text-blue-700 border-blue-200',
            member: 'bg-slate-50 text-slate-700 border-slate-200'
        };
        return colors[role] || colors.member;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-light via-secondary-light to-accent-light relative overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />

            {toast && (
                <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-[999] flex items-center gap-2 ${toast.color} text-white text-sm font-semibold px-5 py-2.5 rounded-full shadow-lg whitespace-nowrap`}>
                    {toast.message}
                </div>
            )}

            {editTarget && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-lg font-bold text-slate-900 mb-1">Edit Operator</h2>
                        <p className="text-sm text-slate-500 mb-6">Ubah data operator</p>
                        
                        <form onSubmit={handleUpdate}>
                            <div className="flex flex-col gap-3.5">
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                                        NCS
                                    </label>
                                    <input
                                        value={editForm.ncs}
                                        onChange={(e) => setEditForm({ ...editForm, ncs: e.target.value.toUpperCase() })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-primary bg-white text-slate-800 text-sm outline-none uppercase shadow-sm ring-4 ring-primary-light/30"
                                        required
                                        disabled
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                                        Nama
                                    </label>
                                    <input
                                        value={editForm.nama}
                                        onChange={(e) => setEditForm({ ...editForm, nama: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-primary bg-white text-slate-800 text-sm outline-none shadow-sm ring-4 ring-primary-light/30"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                                        Role
                                    </label>
                                    <select
                                        value={editForm.role}
                                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                                        className="w-full px-3.5 py-2.5 rounded-xl border border-primary bg-white text-slate-800 text-sm outline-none shadow-sm ring-4 ring-primary-light/30"
                                    >
                                        <option value="member">Member</option>
                                        <option value="admin">Admin</option>
                                        <option value="superadmin">Superadmin</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2.5 mt-6 justify-end">
                                <button
                                    type="button"
                                    onClick={() => setEditTarget(null)}
                                    className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold border border-slate-200 hover:bg-slate-200 transition-all"
                                >
                                    Batal
                                </button>
                                <button
                                    type="submit"
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all"
                                >
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showImportModal && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h2 className="text-lg font-bold text-slate-900 mb-1">Import Data Excel</h2>
                        <p className="text-sm text-slate-500 mb-6">Upload file Excel untuk import massal</p>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                            <h3 className="font-bold text-blue-900 mb-2 text-sm flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Format File Excel
                            </h3>
                            <ul className="text-xs text-blue-800 space-y-1">
                                <li>• <strong>Kolom A:</strong> NCS (wajib)</li>
                                <li>• <strong>Kolom B:</strong> Nama (wajib)</li>
                                <li>• <strong>Kolom C:</strong> Role (superadmin/admin/member)</li>
                                <li>• <strong>Format:</strong> .xlsx / .xls / .csv (max 5MB)</li>
                                <li>• Tidak perlu header, langsung data dari baris pertama</li>
                            </ul>
                        </div>

                        <div className="mb-6">
                            <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-2">
                                Pilih File
                            </label>
                            <input
                                type="file"
                                accept=".xlsx,.xls,.csv"
                                onChange={handleFileChange}
                                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 text-sm outline-none focus:border-primary focus:bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary file:text-white hover:file:bg-primary-hover"
                            />
                            {importFile && (
                                <p className="mt-2 text-xs text-slate-600">
                                    📄 <strong>{importFile.name}</strong> ({(importFile.size / 1024).toFixed(2)} KB)
                                </p>
                            )}
                        </div>

                        {importResult && (
                            <div className={`rounded-xl p-4 mb-6 ${
                                importResult.success 
                                    ? 'bg-green-50 border border-green-200' 
                                    : 'bg-red-50 border border-red-200'
                            }`}>
                                <h3 className={`font-bold mb-2 text-sm ${
                                    importResult.success ? 'text-green-900' : 'text-red-900'
                                }`}>
                                    {importResult.success ? '✓ Import Berhasil' : '✗ Import Gagal'}
                                </h3>
                                <p className={`text-xs mb-2 ${
                                    importResult.success ? 'text-green-800' : 'text-red-800'
                                }`}>
                                    {importResult.message}
                                </p>
                                
                                {importResult.success && (
                                    <div className="text-xs text-green-800">
                                        <p>• Berhasil: <strong>{importResult.imported}</strong> data</p>
                                        <p>• Dilewati: <strong>{importResult.skipped}</strong> data</p>
                                    </div>
                                )}

                                {importResult.errors && importResult.errors.length > 0 && (
                                    <div className="mt-3 max-h-32 overflow-y-auto">
                                        <p className="text-xs font-bold text-red-900 mb-1">Detail Error:</p>
                                        {importResult.errors.slice(0, 10).map((err, idx) => (
                                            <p key={idx} className="text-xs text-red-700">
                                                Baris {err.row}: {err.message}
                                            </p>
                                        ))}
                                        {importResult.errors.length > 10 && (
                                            <p className="text-xs text-red-600 italic">+ {importResult.errors.length - 10} error lainnya</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex items-center gap-2.5 justify-end">
                            <button
                                type="button"
                                onClick={closeImportModal}
                                className="px-5 py-2.5 rounded-xl bg-slate-100 text-slate-600 text-sm font-semibold hover:bg-slate-200 transition-all"
                            >
                                Tutup
                            </button>
                            <button
                                onClick={handleImport}
                                disabled={!importFile || importing}
                                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {importing ? (
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
                                        Import
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-10">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3.5">
                        <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/30">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 leading-tight">Manajemen Operator</h1>
                            <p className="text-xs text-slate-500 mt-0.5">Kelola data operator RAPI</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowImportModal(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-semibold hover:shadow-lg transition-all"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <span className="hidden sm:inline">Import</span>
                        </button>
                        <a
                            href="/"
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-white transition-all"
                        >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="hidden sm:inline">Kembali</span>
                        </a>
                    </div>
                </div>

                <div className="bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl p-7 mb-6">
                    <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-md">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-800 leading-tight">Tambah Operator Baru</h2>
                            <p className="text-xs text-slate-400 mt-0.5">Input NCS dan nama operator</p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-3">
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                                    NCS
                                </label>
                                <input
                                    placeholder="JZ09VAG"
                                    value={form.ncs}
                                    onChange={(e) => setForm({ ...form, ncs: e.target.value.toUpperCase() })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 text-sm placeholder:text-slate-300 outline-none transition-all uppercase focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary-light"
                                    required
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide block mb-1.5">
                                    Nama Operator
                                </label>
                                <input
                                    placeholder="Ahmad Fauzi"
                                    value={form.nama}
                                    onChange={(e) => setForm({ ...form, nama: e.target.value })}
                                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50/80 text-slate-800 text-sm placeholder:text-slate-300 outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary-light"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                Tambah
                            </button>
                        </div>
                    </form>
                </div>

                <div className="bg-white/75 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl p-5 mb-4">
                    <div className="relative">
                        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Cari nama atau NCS..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary-light"
                        />
                    </div>
                </div>

                <div className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden">
                    <div className="flex items-center gap-3 px-7 py-5 border-b border-slate-100">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-sm font-bold text-slate-800 leading-tight">Daftar Operator</h2>
                            <p className="text-xs text-slate-400 mt-0.5">{filteredUsers.length} operator ditampilkan</p>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-slate-50/80 border-b border-slate-100">
                                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">#</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">NCS</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Nama</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Role</th>
                                    <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wide">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                                            Memuat data...
                                        </td>
                                    </tr>
                                ) : filteredUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-slate-400 text-sm">
                                            {searchQuery ? 'Tidak ada hasil pencarian' : 'Belum ada operator terdaftar'}
                                        </td>
                                    </tr>
                                ) : (
                                    filteredUsers.map((user, idx) => (
                                        <tr key={user.id} className="hover:bg-primary-light/30 transition-colors">
                                            <td className="px-5 py-3.5 text-slate-400 text-xs w-10">
                                                {idx + 1}
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className="inline-block font-mono font-bold text-primary bg-primary-light border border-primary px-2.5 py-1 rounded-lg text-xs">
                                                    {user.ncs}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                                        {user.nama?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <span className="text-slate-700 font-semibold text-sm">{user.nama}</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <span className={`inline-block font-semibold px-2.5 py-1 rounded-lg text-xs border ${getRoleBadgeColor(user.role)}`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="px-5 py-3.5">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => handleEdit(user)}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200 text-xs font-semibold hover:bg-blue-100 transition-all"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(user.id)}
                                                        disabled={deletingId === user.id}
                                                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 border border-red-200 text-xs font-semibold hover:bg-red-100 transition-all disabled:opacity-50"
                                                    >
                                                        Hapus
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <footer className="mt-8 text-center text-xs text-slate-400 font-medium">
                    E-Logger System · {new Date().getFullYear()} · Manajemen Operator
                </footer>
            </div>
        </div>
    );
}

export default OperatorPage;