import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const location = useLocation();
    const { user, logout, isAdmin } = useAuth();
    const [active, setActive] = useState(location.pathname);

    const navItems = [
        // { name: 'Home', path: '/dashboard/', image: '/images/home.png' },
        // { name: 'Schedule', path: '/dashboard/schedule', image: '/images/schedule.png' },
        { name: 'Logger', path: '/dashboard/logger', image: '/images/logger.png' },
        { name: 'Points', path: '/dashboard/points', image: '/images/points.png' },
    ];

    const handleLogout = async () => {
        if (window.confirm('Yakin ingin keluar dari akun?')) {
            await logout();
        }
    };

    return (
        <div>
            {/* Desktop Navbar */}
            <nav className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-full shadow-2xl shadow-primary/10 px-3 py-3 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setActive(item.path)}
                                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${active === item.path
                                        ? 'bg-white text-primary shadow-lg shadow-primary/20'
                                        : 'text-slate-700 hover:text-primary hover:bg-white/50'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {user && (
                        <div className="flex items-center gap-3 ml-4 pl-4 border-l border-white/40">
                            <div className="text-right text-xs">
                                <p className="font-semibold text-slate-700">{user.ncs}</p>
                                <p className="text-slate-500 text-[10px] capitalize">{user.role}</p>
                            </div>

                            {/* Tombol Logout */}
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50 hover:text-red-700 rounded-2xl transition-all duration-200"
                                title="Logout"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4V7m-4 4V7" />
                                </svg>
                                <span className="hidden lg:inline">Logout</span>
                            </button>
                        </div>
                    )}
                </div>
            </nav>

            {/* Mobile Navbar */}
            <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
                <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-primary/10 px-2 py-3">
                    <div className="flex items-center justify-around gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setActive(item.path)}
                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${active === item.path
                                        ? 'bg-white text-primary shadow-lg shadow-primary/20'
                                        : 'text-slate-700'
                                    }`}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className={`w-6 h-6 object-contain transition-all duration-300 ${active === item.path ? 'scale-110' : 'opacity-70'
                                        }`}
                                />
                                <span className={`text-[10px] font-semibold transition-all duration-300 ${active === item.path ? 'text-primary' : 'text-slate-600'
                                    }`}>
                                    {item.name}
                                </span>
                            </Link>
                        ))}

                        {/* Logout Button untuk Mobile */}
                        {user && (
                            <button
                                onClick={handleLogout}
                                className="flex flex-col items-center gap-1 px-3 py-2 rounded-2xl text-red-600 hover:bg-red-50 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4V7m-4 4V7" />
                                </svg>
                                <span className="text-[10px] font-semibold">Logout</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;