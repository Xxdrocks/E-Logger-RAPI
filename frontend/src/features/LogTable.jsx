import React, { useState } from "react";
import axios from "axios";

function LogTable({ logs = [], refresh, session }) {
    const [deletingId, setDeletingId] = useState(null);
    const [confirmDeleteAll, setConfirmDeleteAll] = useState(false);

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await axios.delete(`http://127.0.0.1:8000/api/logs/${id}`);
            refresh();
        } catch (error) {
            console.error("Delete error:", error);
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteAll = async () => {
        if (!confirmDeleteAll) {
            setConfirmDeleteAll(true);
            setTimeout(() => setConfirmDeleteAll(false), 3000);
            return;
        }
        try {
            await axios.delete("http://127.0.0.1:8000/api/logs");
            refresh();
        } catch (error) {
            console.error("Delete all error:", error);
        } finally {
            setConfirmDeleteAll(false);
        }
    };

    const handleExport = () => {
        const ket = session?.keterangan ?? '';
        window.open(`http://127.0.0.1:8000/api/logs/export?keterangan=${encodeURIComponent(ket)}`, '_blank');
    };

    const columns = ["Freq", "10/28", "Waktu", "ZZD", "Nama", "Keterangan", "Aksi"];

    return (
        <div className="bg-white/70 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xl shadow-slate-200/60 overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-7 py-5 border-b border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center shadow-md shadow-slate-300">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-slate-800">Riwayat Log</h2>
                        <p className="text-xs text-slate-400 mt-0.5">{logs.length} entri tersedia</p>
                    </div>
                </div>

                <div className="flex items-center gap-2.5">
                    <button
                        onClick={handleDeleteAll}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                            confirmDeleteAll
                                ? "bg-red-600 text-white shadow-md shadow-red-200 scale-105 animate-pulse"
                                : "bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:border-red-300"
                        }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {confirmDeleteAll ? "Yakin hapus semua?" : "Hapus Semua"}
                    </button>

                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-sm font-semibold hover:bg-emerald-100 hover:border-emerald-300 transition-all duration-200"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export Excel
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-100">
                            {columns.map((col, i) => (
                                <th key={i} className="px-5 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {logs.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-16 text-center">
                                    <div className="flex flex-col items-center gap-3 text-slate-400">
                                        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                                            <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-500 text-sm">Belum ada data log</p>
                                            <p className="text-xs text-slate-400 mt-0.5">Tambahkan log baru menggunakan form di atas</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            logs.map((log) => (
                                <tr key={log.id} className="group hover:bg-indigo-50/40 transition-colors duration-150">
                                    <td className="px-5 py-3.5">
                                        <span className="inline-flex items-center gap-1.5 font-mono font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-0.5 rounded-lg text-xs">
                                            📡 {log.frequency ?? "-"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="font-mono text-slate-700 text-xs font-medium bg-slate-100 px-2.5 py-0.5 rounded-lg">
                                            {log.ncs_1028 ?? "-"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-600 text-xs font-medium">
                                        {log.waktu ?? "-"}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <span className="font-mono text-amber-700 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-lg text-xs font-medium">
                                            {log.zzd ?? "-"}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">
                                                {(log.nama ?? "?")[0].toUpperCase()}
                                            </div>
                                            <span className="text-slate-700 font-semibold text-xs">{log.nama ?? "-"}</span>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3.5 text-slate-500 text-xs max-w-[180px] truncate">
                                        {log.keterangan ?? "-"}
                                    </td>
                                    <td className="px-5 py-3.5">
                                        <button
                                            onClick={() => handleDelete(log.id)}
                                            disabled={deletingId === log.id}
                                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 border border-red-100 text-xs font-semibold hover:bg-red-100 hover:border-red-300 hover:text-red-700 transition-all duration-150 disabled:opacity-50"
                                        >
                                            {deletingId === log.id ? (
                                                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                                </svg>
                                            ) : (
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            )}
                                            Hapus
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {logs.length > 0 && (
                <div className="px-7 py-3.5 bg-slate-50/60 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-xs text-slate-400">
                        Menampilkan <span className="font-semibold text-slate-600">{logs.length}</span> entri
                    </p>
                    <div className="flex gap-1">
                        {[...Array(Math.min(3, Math.ceil(logs.length / 10)))].map((_, i) => (
                            <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-indigo-500" : "bg-slate-300"}`} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default LogTable;