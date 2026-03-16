import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
    const currentYear = new Date().getFullYear();

    const links = [
        { name: 'Home', path: '/' },
        { name: 'Schedule', path: '/schedule' },
        { name: 'Logger', path: '/logger' },
        { name: 'Hubungi Kami', path: '/contact' },
    ];

    return (
        <footer className="bg-slate-900 text-white py-8">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo-rapi.png" alt="Logo RAPI" className="w-24" />
                        <div className="text-sm text-slate-400">
                            <p className="font-semibold text-white">Radio Antar Republik Indonesia</p>
                            <p>Melayani dengan komunikasi</p>
                        </div>
                    </div>

                    <div className="flex flex-wrap justify-center gap-6">
                        {links.map((link) => (
                            <Link 
                                key={link.path}
                                to={link.path} 
                                className="text-slate-400 hover:text-primary transition-colors duration-200 text-sm"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>

                <div className="border-t border-slate-800 mt-6 pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-slate-400">
                    <p>{currentYear} RAPI. All rights reserved.</p>
                    <p>
                        Made with love by <span className="text-primary font-semibold">Winata</span>
                    </p>
                </div>

                <div>
                    <p>
                        Versi 1.0
                    </p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;