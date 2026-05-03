import React from 'react';

function ScheduleCard({ schedule, onEdit, onDelete }) {
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
        return { day, month };
    };

    const { day, month } = formatDate(schedule.event_date);
    const imageUrl = schedule.image 
        ? `http://127.0.0.1:8000/storage/${schedule.image}`
        : '/images/default-event.jpg';

    const colors = [
        'from-red-500 to-red-600',
        'from-slate-700 to-slate-800',
        'from-primary to-secondary',
        'from-blue-600 to-blue-700',
    ];
    
    const colorIndex = schedule.id % colors.length;

    return (
        <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
            <div className="hidden md:flex">
                <div className={`w-32 flex-shrink-0 bg-gradient-to-br ${colors[colorIndex]} flex flex-col items-center justify-center text-white`}>
                    <p className="text-5xl font-bold leading-none">{day}</p>
                    <p className="text-lg font-semibold tracking-wider">{month}</p>
                </div>

                <div className="w-40 flex-shrink-0">
                    <img 
                        src={imageUrl} 
                        alt={schedule.title}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="flex-1 p-6 flex items-center">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-800 mb-1">{schedule.title}</h3>
                        <p className="text-sm text-slate-500 mb-2">{schedule.location || 'Lokasi belum ditentukan'}</p>
                        {schedule.description && (
                            <p className="text-sm text-slate-600 line-clamp-2">{schedule.description}</p>
                        )}
                        {schedule.event_time && (
                            <p className="text-sm text-primary font-semibold mt-2">{schedule.event_time} WIB</p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                        <button
                            onClick={() => onEdit(schedule)}
                            className="px-4 py-2 bg-primary-light text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200 text-sm font-semibold"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => onDelete(schedule.id)}
                            className="px-4 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 text-sm font-semibold"
                        >
                            Hapus
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Layout */}
            <div className="md:hidden">
                <div className="flex">
                    {/* Date Box - Smaller on Mobile */}
                    <div className={`w-20 flex-shrink-0 bg-gradient-to-br ${colors[colorIndex]} flex flex-col items-center justify-center text-white`}>
                        <p className="text-3xl font-bold leading-none">{day}</p>
                        <p className="text-xs font-semibold tracking-wider">{month}</p>
                    </div>

                    {/* Image - Smaller on Mobile */}
                    <div className="w-24 flex-shrink-0">
                        <img 
                            src={imageUrl} 
                            alt={schedule.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3">
                        <h3 className="text-sm font-bold text-slate-800 mb-1 line-clamp-1">{schedule.title}</h3>
                        <p className="text-xs text-slate-500 mb-1 line-clamp-1">{schedule.location || 'Lokasi belum ditentukan'}</p>
                        {schedule.description && (
                            <p className="text-xs text-slate-600 line-clamp-2 mb-1">{schedule.description}</p>
                        )}
                        {schedule.event_time && (
                            <p className="text-xs text-primary font-semibold">{schedule.event_time} WIB</p>
                        )}
                    </div>
                </div>

                {/* Buttons - Full Width on Mobile */}
                <div className="flex gap-2 p-3 border-t border-slate-100">
                    <button
                        onClick={() => onEdit(schedule)}
                        className="flex-1 px-3 py-2 bg-primary-light text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-200 text-xs font-semibold"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => onDelete(schedule.id)}
                        className="flex-1 px-3 py-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-200 text-xs font-semibold"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ScheduleCard;