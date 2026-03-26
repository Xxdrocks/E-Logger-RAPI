import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';
import LogForm from './LogForm';
import LogTable from './LogTable';

function LogPage() {
    const { user, isSuperadmin } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [session, setSession] = useState(null);
    const [websiteLocked, setWebsiteLocked] = useState(false);
    const [remainingTime, setRemainingTime] = useState(null);

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

    const checkWebsiteLock = async () => {
        try {
            const res = await axios.get('http://127.0.0.1:8000/api/website-lock/status');
            setWebsiteLocked(res.data.is_locked);
            setRemainingTime(res.data.remaining_minutes);
        } catch (error) {
            console.error('Failed to check lock status:', error);
        }
    };

    useEffect(() => {
        fetchLogs();
        checkWebsiteLock();

        const interval = setInterval(checkWebsiteLock, 30000);
        return () => clearInterval(interval);
    }, []);

    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
    const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    const isLockedForUser = websiteLocked && !isSuperadmin();

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary-light via-secondary-light to-accent-light relative overflow-hidden">
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-secondary/20 rounded-full blur-3xl" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
                <div
                    className="absolute inset-0 opacity-[0.025]"
                    style={{
                        backgroundImage: "linear-gradient(var(--color-primary) 1px, transparent 1px), linear-gradient(to right, var(--color-primary) 1px, transparent 1px)",
                        backgroundSize: "40px 40px",
                    }}
                />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-3 md:px-6 py-6 md:py-10">
                <header className="mb-6 md:mb-10">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between md:gap-5">
                        <div className="flex items-center gap-3 md:gap-4">
                            <img src="/images/logo-rapi.png" alt="Logo" className="w-16 md:w-20" />
                        </div>

                        <div className="flex flex-col items-start md:items-end gap-1.5">
                            <div className="flex items-center gap-2 bg-white/80 border border-primary/30 rounded-xl px-3 md:px-4 py-2 shadow-sm backdrop-blur-sm">
                                <div className={`w-2 h-2 rounded-full ${isLockedForUser ? 'bg-red-500' : 'bg-green-500'} animate-pulse shadow-md shadow-primary/30`} />
                                <span className="text-xs font-semibold text-slate-600">
                                    {isLockedForUser ? 'Locked' : 'Online'}
                                </span>
                                <span className="text-slate-300">·</span>
                                <span className="text-xs text-slate-500 font-medium">{timeStr} WIB</span>
                            </div>
                            <p className="text-xs text-slate-400 px-1">{dateStr}</p>
                        </div>
                    </div>
                </header>

                {isLockedForUser ? (
                    <div className="bg-white/80 backdrop-blur-sm border-2 border-red-300 rounded-2xl p-12 md:p-16 flex flex-col items-center gap-4 shadow-xl">
                        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
                            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Website Sedang Terkunci</h2>
                            <p className="text-slate-600 mb-4">
                                Logger tidak dapat diakses saat ini. Silakan hubungi admin.
                            </p>
                            {remainingTime && (
                                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                                    sampai {new Date(remainingTime).toLocaleString('id-ID')}
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        <section className="mb-4 md:mb-6 z-[99] relative">
                            <LogForm refresh={fetchLogs} session={session} setSession={setSession} />
                        </section>

                        <section>
                            {loading ? (
                                <div className="bg-white/70 backdrop-blur-sm border border-slate-200 rounded-2xl p-12 md:p-16 flex flex-col items-center gap-3 shadow-xl">
                                    <svg className="w-8 h-8 text-primary animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    <p className="text-sm text-slate-500 font-medium">Memuat data log...</p>
                                </div>
                            ) : (
                                <LogTable logs={logs} refresh={fetchLogs} session={session} />
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    );
}

export default LogPage;