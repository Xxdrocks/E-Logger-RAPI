import React, { useState, useEffect } from 'react';
import axios from 'axios';
import LogForm from './LogForm';
import LogTable from './LogTable';

function LogPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);

    const fetchLogs = async () => {
        try {
            const res = await axios.get("http://127.0.0.1:8000/api/logs");
            setLogs(res.data.data || []);
        } catch (error) {
            console.error("Gagal fetch logs:", error);
            setLogs([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    const stats = [
        {
            label: "Total Log",
            value: logs.length,
            icon: "📋",
            color: "from-indigo-500 to-sky-500",
        },
        {
            label: "Hari Ini",
            value: logs.filter((l) => {
                if (!l.created_at) return false;
                return new Date(l.created_at).toDateString() === now.toDateString();
            }).length,
            icon: "📅",
            color: "from-emerald-500 to-teal-500",
        },
        {
            label: "Frekuensi Unik",
            value: new Set(logs.map((l) => l.frequency)).size,
            icon: "📡",
            color: "from-violet-500 to-purple-600",
        },
    ];

    return (
        <div className="min-h-screen bg-[#f0f4ff] relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-200/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-100/20 rounded-full blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: "linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(to right, #6366f1 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <header className="mb-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-sky-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-300/50 shrink-0">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight tracking-tight">
                                    E-Logger RAPI
                                </h1>
                                <p className="text-slate-500 text-sm mt-0.5">Sistem pencatat Log Rapi</p>
                            </div>
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-1.5">
                            <div className="flex items-center gap-2 bg-white/80 border border-slate-200 rounded-xl px-4 py-2 shadow-sm backdrop-blur-sm">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-md shadow-emerald-300" />
                                <span className="text-xs font-semibold text-slate-600">Online</span>
                                <span className="text-slate-300">·</span>
                                <span className="text-xs text-slate-500 font-medium">{timeStr} WIB</span>
                            </div>
                            <p className="text-xs text-slate-400 px-1">{dateStr}</p>
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {stats.map((stat, i) => (
                            <div key={i} className="bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-base shadow-md`}>
                                    {stat.icon}
                                </div>
                                <div>
                                    <p className="text-xl font-extrabold text-slate-800">{loading ? "—" : stat.value}</p>
                                    <p className="text-xs text-slate-500 font-medium">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </header>

                <section className="mb-6">
                    <LogForm refresh={fetchLogs} session={session} setSession={setSession} />
                </section>

                <section>
                    {loading ? (
                        <div className="bg-white/70 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-16 flex flex-col items-center gap-3 shadow-xl shadow-slate-200/60">
                            <svg className="w-8 h-8 text-indigo-500 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <p className="text-sm text-slate-500 font-medium">Memuat data log...</p>
                        </div>
                    ) : (
                        <LogTable logs={logs} refresh={fetchLogs} session={session} />
                    )}
                </section>

                <footer className="mt-8 text-center text-xs text-slate-400 font-medium">
                    E-Logger System · {new Date().getFullYear()} · Powered by Radio Communication
                </footer>
            </div>
        </div>
    );
}

export default LogPage;