import React, { useState } from 'react'

import { Link, useLocation } from 'react-router';

function Navbar() {
    const location = useLocation();
    const [active, setActive] = useState(location.pathname);

    const navItems = [
        { name: 'Home', path: '/', image: '/images/home.png' },
        { name: 'Schedule', path: '/schedule', image: '/images/schedule.png' },
        { name: 'Logger', path: '/logger', image: '/images/logger.png' },
        { name: 'Hubungi Kami', path: '/contact', image: '/images/contact.png' },
    ];
    return (
        <div>
            <nav className="hidden md:block fixed top-6 left-1/2 -translate-x-1/2 z-50">
                <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-full shadow-2xl shadow-indigo-200/50 px-3 py-3">
                    <div className="flex items-center gap-2">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setActive(item.path)}
                                className={`
                                    relative px-8 py-3 rounded-full text-sm font-semibold transition-all duration-300
                                    ${active === item.path
                                        ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100'
                                        : 'text-indigo-800/70 hover:text-indigo-900 hover:bg-white/50'
                                    }
                                `}
                            >
                                <span className="flex items-center gap-2">
                                    <span className="text-base">{item.icon}</span>
                                    {item.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

            <nav className="md:hidden fixed bottom-4 left-4 right-4 z-50">
                <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-indigo-200/50 px-1 py-2">
                    <div className="flex items-center justify-around gap-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setActive(item.path)}
                                className={`
                                    relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-2xl transition-all duration-300
                                    ${active === item.path
                                        ? 'bg-white text-indigo-600 shadow-lg shadow-indigo-100'
                                        : 'text-indigo-800/70'
                                    }
                                `}
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className={`w-6 h-6 object-contain transition-all duration-300 ${active === item.path ? 'scale-110' : 'opacity-70'
                                        }`}
                                 />
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>

        </div>
    )
}

export default Navbar
