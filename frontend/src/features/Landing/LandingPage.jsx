import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [activeSection, setActiveSection] = useState('home');

    const scrollToSection = (sectionId) => {
        setActiveSection(sectionId);
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const whatsappNumber = '628128412114';
    const whatsappMessage = 'Halo RAPI, saya ingin bertanya mengenai...';
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    const handleLoggerClick = () => {
        setShowLoginModal(true);
    };

    const navItems = [
        { name: 'Home', key: 'home', image: '/images/home.png' },
        { name: 'Donasi', key: 'donasi', image: '/images/donation.png' },
        { name: 'Agenda', key: 'agenda', image: '/images/schedule.png' },
        { name: 'Logger', key: 'logger', image: '/images/logger.png' },
        { name: 'Contact', key: 'contact', image: '/images/contact.png' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
            <section id="home" className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
                <div className="text-center max-w-4xl mx-auto">
                    <img
                        src="/images/rumahrapi-logo.png"
                        alt="Rumah RAPI Logo"
                        className="w-48 h-48 mx-auto mb-8 object-contain drop-shadow-2xl"
                    />
                    <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                        Rumah RAPI Indonesia
                    </h1>
                    <p className="text-lg md:text-xl text-slate-600 mb-4 leading-relaxed">
                        Organisasi Radio Amatir Pertama Indonesia
                    </p>
                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-slate-200 mt-12">
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">Tentang RAPI</h2>
                        <p className="text-slate-700 leading-relaxed text-left">
                            Radio Amatir Pertama Indonesia (RAPI) adalah organisasi yang menghimpun para penggemar
                            dan praktisi radio amatir di Indonesia. Kami berkomitmen untuk mengembangkan teknologi
                            komunikasi radio, pendidikan, dan pelayanan masyarakat melalui kegiatan radio amatir.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-primary/10 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-1">Komunikasi</h3>
                                <p className="text-sm text-slate-600">Jaringan radio amatir nasional</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-secondary/10 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-1">Edukasi</h3>
                                <p className="text-sm text-slate-600">Pelatihan & sertifikasi operator</p>
                            </div>
                            <div className="text-center">
                                <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-accent/10 flex items-center justify-center">
                                    <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold text-slate-800 mb-1">Komunitas</h3>
                                <p className="text-sm text-slate-600">Kegiatan & kebersamaan anggota</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="donasi" className="min-h-screen flex flex-col items-center justify-center px-6 py-20 bg-white/50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6">Donasi</h2>
                    <p className="text-lg text-slate-600 mb-12">
                        Dukung kegiatan RAPI untuk kemajuan radio amatir Indonesia
                    </p>
                    <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
                        <img
                            src="/images/donasi.png"
                            alt="Donasi RAPI"
                            className="w-full max-w-2xl mx-auto rounded-xl shadow-lg"
                        />
                        <p className="text-sm text-slate-500 mt-6">
                            Scan QR Code atau transfer ke rekening yang tertera
                        </p>
                    </div>
                </div>
            </section>


            <section id="agenda" className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
                <div className="max-w-6xl mx-auto w-full">
                    <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 text-center">Agenda Kegiatan</h2>
                    <p className="text-lg text-slate-600 mb-12 text-center">
                        Kegiatan & acara mendatang RAPI
                    </p>


                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                            <div className="h-48 bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                <div className="text-center text-white">
                                    <p className="text-5xl font-bold">25</p>
                                    <p className="text-lg font-semibold">MAR</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Rapat Bulanan</h3>
                                <p className="text-sm text-slate-500 mb-3">📍 Gedung RAPI Pusat</p>
                                <p className="text-sm text-slate-600">
                                    Rapat koordinasi bulanan pengurus dan anggota RAPI se-Indonesia
                                </p>
                                <p className="text-sm text-primary font-semibold mt-4">🕐 14:00 WIB</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                            <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <p className="text-5xl font-bold">30</p>
                                    <p className="text-lg font-semibold">MAR</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Pelatihan Operator</h3>
                                <p className="text-sm text-slate-500 mb-3">📍 Online via Zoom</p>
                                <p className="text-sm text-slate-600">
                                    Pelatihan dasar untuk calon operator radio amatir pemula
                                </p>
                                <p className="text-sm text-primary font-semibold mt-4">🕐 09:00 WIB</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all">
                            <div className="h-48 bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
                                <div className="text-center text-white">
                                    <p className="text-5xl font-bold">05</p>
                                    <p className="text-lg font-semibold">APR</p>
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-slate-800 mb-2">Kontes Radio</h3>
                                <p className="text-sm text-slate-500 mb-3">📍 Seluruh Indonesia</p>
                                <p className="text-sm text-slate-600">
                                    Kompetisi komunikasi radio amatir tingkat nasional
                                </p>
                                <p className="text-sm text-primary font-semibold mt-4">🕐 06:00 - 18:00 WIB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <div id='contact' className="min-h-screen bg-gradient-to-br from-primary-light via-secondary-light to-accent-light">
                <div className="fixed top-0 right-0 w-96 h-96 bg-primary/20 rounded-full filter blur-3xl opacity-70 -z-10" />
                <div className="fixed bottom-0 left-0 w-80 h-80 bg-secondary/20 rounded-full filter blur-3xl opacity-70 -z-10" />

                <div className="container mx-auto px-4 py-12 max-w-6xl relative z-10">

                    <div className="bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl p-8 mb-12 border border-white">
                        <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className="flex-shrink-0">
                                <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-xl">
                                    <svg className="w-14 h-14 text-white" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Hubungi via WhatsApp</h2>
                                <p className="text-slate-600 mb-4">Respon cepat untuk pertanyaan dan informasi seputar RAPI</p>
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 hover:-translate-y-1 transition-all duration-200"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    Chat di WhatsApp
                                </a>
                            </div>
                        </div>
                    </div>


                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/50">
                        <h3 className="text-2xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                            <img src="/images/location.png" alt="Location" className="w-8 h-8 object-contain" />
                            Lokasi Sekretariat
                        </h3>
                        <div className="aspect-video rounded-xl overflow-hidden bg-slate-200">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d247.89635131546848!2d106.88041560445069!3d-6.21860216141712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sid!4v1773899794455!5m2!1sen!2sid"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </div>

            <nav className="fixed bottom-4 left-4 right-4 z-50 md:hidden">
                <div className="bg-white/30 backdrop-blur-xl border border-white/40 rounded-3xl shadow-2xl shadow-primary/10 px-2 py-3">
                    <div className="flex items-center justify-around gap-1">

                        {navItems.map((item) => {
                            const isActive = activeSection === item.key;

                            return (
                                <button
                                    key={item.key}
                                    onClick={() => {
                                        if (item.key === 'logger') {
                                            handleLoggerClick();
                                        } else {
                                            scrollToSection(item.key);
                                        }
                                    }}
                                    className={`flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-all duration-300 ${isActive
                                        ? 'bg-white shadow-lg shadow-primary/20'
                                        : ''
                                        }`}
                                >
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className={`w-6 h-6 object-contain transition-all duration-300 ${isActive ? 'scale-110 opacity-100' : 'opacity-60'
                                            }`}
                                    />

                                    <span
                                        className={`text-[10px] font-semibold transition-all duration-300 ${isActive ? 'text-primary' : 'text-slate-600'
                                            }`}
                                    >
                                        {item.name}
                                    </span>
                                </button>
                            );
                        })}

                    </div>
                </div>
            </nav>

            {showLoginModal && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl p-8 w-full max-w-md shadow-2xl">
                        <h2 className="text-2xl font-bold text-slate-900 mb-6">Login E-Logger</h2>
                        <p className="text-slate-600 mb-6">Silakan login untuk mengakses sistem logger</p>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowLoginModal(false)}
                                className="flex-1 px-6 py-3 rounded-xl border-2 border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-all"
                            >
                                Batal
                            </button>
                            <Link
                                to="/login"
                                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold text-center hover:shadow-lg transition-all"
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LandingPage;