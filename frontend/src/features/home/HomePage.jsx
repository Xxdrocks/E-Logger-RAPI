import React, { useState, useEffect } from 'react';

function HomePage() {
    const [currentSlide, setCurrentSlide] = useState(0);

    const heroImages = [
        '/images/gallery-1.jpeg',
        '/images/gallery-2.png',
        '/images/gallery-1.jpeg',
    ];

    const upcomingEvents = [
        {
            date: '15',
            month: 'Mar',
            title: 'Pertemuan Rutin Bulanan',
            time: '19:00 WIB',
            location: 'Sekretariat RAPI',
            description: 'Pertemuan rutin anggota untuk membahas program kerja dan kegiatan mendatang',
        },
        {
            date: '22',
            month: 'Mar',
            title: 'Pelatihan Morse Code',
            time: '14:00 WIB',
            location: 'Online via Zoom',
            description: 'Workshop morse code untuk pemula hingga tingkat lanjut',
        },
        {
            date: '05',
            month: 'Apr',
            title: 'Fox Hunting Competition',
            time: '08:00 WIB',
            location: 'Lapangan Merdeka',
            description: 'Lomba fox hunting terbuka untuk umum dengan hadiah menarik',
        },
    ];

    const recentActivities = [
        {
            title: 'Bakti Sosial Bencana Alam',
            date: '28 Februari 2026',
            image: '/images/activity-1.jpg',
            description: 'Tim komunikasi RAPI membantu korban bencana dengan menyediakan layanan komunikasi darurat',
        },
        {
            title: 'Perayaan HUT RAPI ke-70',
            date: '15 Februari 2026',
            image: '/images/activity-2.jpg',
            description: 'Peringatan hari jadi RAPI dengan berbagai lomba dan kegiatan kekeluargaan',
        },
        {
            title: 'Workshop Teknologi Radio Digital',
            date: '10 Februari 2026',
            image: '/images/activity-3.jpg',
            description: 'Pelatihan penggunaan teknologi radio digital untuk anggota RAPI',
        },
    ];

    const stats = [
        { value: '500+', label: 'Anggota Aktif' },
        { value: '50+', label: 'Kegiatan/Tahun' },
        { value: '70', label: 'Tahun Berdiri' },
        { value: '24/7', label: 'Siaga Darurat' },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="min-h-screen">
            <div className="relative w-full h-[70vh] md:h-[85vh] overflow-hidden">
                {heroImages.map((img, idx) => (
                    <div
                        key={idx}
                        className={`absolute inset-0 transition-opacity duration-1000 ${
                            idx === currentSlide ? 'opacity-100' : 'opacity-0'
                        }`}
                    >
                        <img src={img} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
                    </div>
                ))}

                <div className="absolute inset-0 flex flex-col items-center justify-center text-white px-4">
                    <img src="/images/logo-rapi.png" alt="Logo RAPI" className="w-48 md:w-64 mb-8" />
                    <h1 className="text-4xl md:text-6xl font-extrabold text-center mb-4 tracking-tight">
                        Radio Antar Republik Indonesia
                    </h1>
                    
                </div>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {heroImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentSlide(idx)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                idx === currentSlide ? 'bg-white w-8' : 'bg-white/50'
                            }`}
                        />
                    ))}
                </div>
            </div>

            <div className="bg-gradient-to-br from-primary-light via-secondary-light to-accent-light py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 text-center shadow-md">
                                <p className="text-3xl md:text-4xl font-extrabold text-primary mb-2">{stat.value}</p>
                                <p className="text-sm text-slate-600 font-medium">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-br from-primary-light to-secondary-light py-16 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-4">
                            Kegiatan Terkini
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Dokumentasi kegiatan dan momen berharga bersama keluarga besar RAPI
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {recentActivities.map((activity, idx) => (
                            <div key={idx} className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
                                <div className="relative overflow-hidden h-48">
                                    <img src={activity.image} alt={activity.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    <p className="absolute bottom-3 left-3 text-white text-xs font-semibold bg-primary px-3 py-1 rounded-full">
                                        {activity.date}
                                    </p>
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-slate-800 mb-2">{activity.title}</h3>
                                    <p className="text-sm text-slate-600 leading-relaxed">{activity.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

           
        </div>
    );
}

export default HomePage;