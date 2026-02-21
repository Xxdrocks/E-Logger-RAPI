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
            image: "/images/logger.png",
            color: "from-emerald-500 to-teal-600",
        },
        {
            label: "Hari Ini",
            value: logs.filter((l) => {
                if (!l.created_at) return false;
                return new Date(l.created_at).toDateString() === now.toDateString();
            }).length,
            image: "/images/schedule.png",
            color: "from-teal-500 to-green-600",
        },
        {
            label: "Frekuensi Unik",
            value: new Set(logs.map((l) => l.frequency)).size,
            image: "/images/contact.png",
            color: "from-green-500 to-emerald-600",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50 relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-200/40 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-100/20 rounded-full blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: "linear-gradient(#10b981 1px, transparent 1px), linear-gradient(to right, #10b981 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-10">
                <header className="mb-10">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <img src="/images/logo-rapi.png" alt="Logo" className="w-40 h-25" />
                        </div>

                        <div className="flex flex-col items-start sm:items-end gap-1.5">
                            <div className="flex items-center gap-2 bg-white/80 border border-emerald-200 rounded-xl px-4 py-2 shadow-sm backdrop-blur-sm">
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
                            <div key={i} className="bg-white/70 backdrop-blur-sm border border-emerald-200/80 rounded-2xl px-5 py-4 shadow-sm flex items-center gap-4">
                                <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center shadow-md p-2`}>
                                    <img src={stat.image} alt={stat.label} className="w-full h-full object-contain brightness-0 invert" />
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
                        <div className="bg-white/70 backdrop-blur-sm border border-emerald-200/80 rounded-2xl p-16 flex flex-col items-center gap-3 shadow-xl shadow-emerald-200/60">
                            <svg className="w-8 h-8 text-emerald-500 animate-spin" fill="none" viewBox="0 0 24 24">
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