import React, { useState, useEffect } from "react";
import axios from "axios";

function LogTable({ logs = [], refresh, session }) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showDeleteAllModal, setShowDeleteAllModal] = useState(false);
    const [targetDeleteId, setTargetDeleteId] = useState(null);
    const [displayedLogs, setDisplayedLogs] = useState(logs);
    const [isProcessing, setIsProcessing] = useState(false);
    const [deletingId, setDeletingId] = useState(null);

    useEffect(() => {
        const sorted = [...logs].sort((a, b) => {
            return new Date(a.created_at) - new Date(b.created_at);
        });
        setDisplayedLogs(sorted);
    }, [logs]);

    const confirmDelete = (id) => {
        setTargetDeleteId(id);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        if (!targetDeleteId) return;
        setIsProcessing(true);
        setDeletingId(targetDeleteId);
        try {
            await axios.delete(`https://rumahrapi.com/backend/api/logs/${targetDeleteId}`);
            setDisplayedLogs(prev => prev.filter(log => log.id !== targetDeleteId));
            showToast("Log berhasil dihapus", "success");
        } catch {
            showToast("Gagal menghapus log", "error");
        } finally {
            setIsProcessing(false);
            setShowDeleteModal(false);
            setTargetDeleteId(null);
            setDeletingId(null);
        }
    };

    const handleDeleteAll = async () => {
        setIsProcessing(true);
        try {
            await axios.post('https://rumahrapi.com/backend/api/logs/delete-all');
            setDisplayedLogs([]);
            if (refresh) await refresh();
            showToast("Semua log berhasil dihapus", "success");
        } catch {
            showToast("Gagal menghapus semua log", "error");
        } finally {
            setIsProcessing(false);
            setShowDeleteAllModal(false);
        }
    };

    const showToast = (message, type = "success") => {
        const toast = document.createElement("div");
        toast.className = `fixed top-6 left-1/2 -translate-x-1/2 z-[999] px-5 py-2.5 rounded-xl shadow-lg text-white text-sm font-semibold ${type === "error" ? "bg-red-500" : "bg-emerald-500"
            }`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = "0";
            setTimeout(() => document.body.removeChild(toast), 400);
        }, 2500);
    };

    const handleExport = async () => {
        const ket = session?.keterangan || "semua_data";
        const pencatatNcs = session?.pencatat_ncs || "";
        const token = localStorage.getItem("token");
        const today = new Date();
        const fileName = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}-${pencatatNcs}-${ket}.xlsx`;
        try {
            const response = await axios.post("https://rumahrapi.com/backend/api/logs/export", {
                session_id : session?.sessionId,
                keterangan: ket,
                frequency: session?.frequency,
                pencatat_ncs: pencatatNcs,
            }, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: "blob",
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => { document.body.removeChild(link); window.URL.revokeObjectURL(url); }, 100);
        } catch {
            showToast("Gagal export file", "error");
        }
    };

    const getInitials = (name = "") =>
        name.trim().split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);

    const columns = ["Freq", "10/28", "Waktu", "Nama", "ZZD", "Aksi"];

    return (
        <div className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl overflow-hidden">

            {/* Delete Single Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-xs border border-slate-100 shadow-md">
                        <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-1">Hapus log ini?</h3>
                        <p className="text-xs text-slate-400 mb-5 leading-relaxed">
                            Data yang dihapus tidak dapat dipulihkan kembali.
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isProcessing}
                                className="flex-1 px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
                            >
                                {isProcessing ? "Menghapus..." : "Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Clear All Modal */}
            {showDeleteAllModal && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-xs border border-slate-100 shadow-md">
                        <div className="w-9 h-9 rounded-xl bg-orange-50 flex items-center justify-center mb-4">
                            <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M10 6V4h4v2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" />
                            </svg>
                        </div>
                        <h3 className="text-sm font-semibold text-slate-800 mb-4">Hapus semua log?</h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setShowDeleteAllModal(false)}
                                className="flex-1 px-3 py-2 rounded-xl bg-slate-100 text-slate-600 text-xs font-medium hover:bg-slate-200 transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleDeleteAll}
                                disabled={isProcessing}
                                className="flex-1 px-3 py-2 rounded-xl bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-60"
                            >
                                {isProcessing ? "Memproses..." : "Hapus"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-100">
                <div>
                    <h2 className="text-sm font-semibold text-slate-800">Riwayat Log</h2>
                    <p className="text-xs text-slate-400 mt-0.5">{displayedLogs.length} entri tercatat</p>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowDeleteAllModal(true)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-500 text-white text-xs font-medium hover:bg-red-600 transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M10 6V4h4v2M5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14" />
                        </svg>
                        Clear
                    </button>
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-white text-xs font-medium hover:opacity-90 transition-opacity"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                        </svg>
                        Export
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                {displayedLogs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 gap-2">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-slate-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776" />
                            </svg>
                        </div>
                        <p className="text-sm text-slate-400">Belum ada log tercatat</p>
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-100 bg-slate-50/50">
                                {columns.map((col, i) => (
                                    <th key={i} className="px-5 py-3 text-left text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                                        {col}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {displayedLogs.map(log => (
                                <tr
                                    key={log.id}
                                    className={`group hover:bg-slate-50/60 transition-colors ${deletingId === log.id ? "opacity-40 pointer-events-none" : ""
                                        }`}
                                >
                                    <td className="px-5 py-3.5">
                                        <span className="inline-block px-2 py-0.5 rounded-md bg-indigo-50 text-xs font-mono font-medium">
                                            {log.frequency}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 font-mono text-xs text-slate-600">
                                        {log.ncs_1028}
                                    </td>
                                    <td className="px-5 py-3.5 text-xs text-slate-400 font-mono">
                                        {new Date(log.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2.5">

                                            <span className="text-sm text-slate-700">{log.nama}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 font-mono text-xs font-medium text-slate-700">
                                        {log.zzd}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <button
                                            onClick={() => confirmDelete(log.id)}
                                            className="px-3 py-1.5 rounded-lg border border-red-100 text-red-400 text-xs font-medium hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors"
                                        >
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default LogTable;