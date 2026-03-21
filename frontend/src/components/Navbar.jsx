import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [active, setActive] = useState(location.pathname);
    const { user, logout, isAdmin } = useAuth();

    const navItems = [
        { name: 'Home', path: '/', image: '/images/home.png' },
        { name: 'Schedule', path: '/schedule', image: '/images/schedule.png' },
        { name: 'Logger', path: '/logger', image: '/images/logger.png' },
        { name : 'Points', path: '/points', image: '/images/points.png'},
        { name: 'Hubungi Kami', path: '/contact', image: '/images/contact.png' },
    ];



    return (
        <div>
            <nav className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-full shadow-2xl shadow-primary/10 px-3 py-3 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setActive(item.path)}
                                className={`px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300 ${
                                    active === item.path
                                        ? 'bg-white text-primary shadow-lg shadow-primary/20'
                                        : 'text-slate-700 hover:text-primary hover:bg-white/50'
                                }`}
                            >
                                <span className="flex items-center gap-2">
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </div>

                    {user && (
                        <div className="flex items-center gap-2 ml-2 pl-2 border-l border-white/40">
                            <div className="text-xs">
                                <p className="font-semibold text-slate-700">{user.ncs}</p>
                                <p className="text-slate-500 text-[10px]">{user.role}</p>
                            </div>
                           
                        </div>
                    )}
                </div>
            </nav>

            <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
                <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-primary/10 px-2 py-3">
                    <div className="flex items-center justify-around gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setActive(item.path)}
                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${
                                    active === item.path
                                        ? 'bg-white text-primary shadow-lg shadow-primary/20'
                                        : 'text-slate-700'
                                }`}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className={`w-6 h-6 object-contain transition-all duration-300 ${
                                        active === item.path ? 'scale-110' : 'opacity-70'
                                    }`}
                                />
                                <span className={`text-[10px] font-semibold transition-all duration-300 ${
                                    active === item.path ? 'text-primary' : 'text-slate-600'
                                }`}>
                                    {item.name === 'Hubungi Kami' ? 'Contact' : item.name}
                                </span>
                            </Link>
                        ))}
                        
                    </div>
                </div>
            </nav>
        </div>
    );
}

export default Navbar;