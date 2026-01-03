import { useEffect } from 'react';

const Notification = ({ message, type = 'success', onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 4000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = type === 'success'
        ? 'bg-gradient-to-r from-green-500 to-emerald-600'
        : 'bg-gradient-to-r from-red-500 to-rose-600';

    const icon = type === 'success' ? (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ) : (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    );

    return (
        <div className="fixed top-4 right-4 left-4 sm:right-6 sm:left-auto z-50 animate-slide-in">
            <div className={`${styles} text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3 w-auto max-w-full sm:max-w-md break-words`}>
                <div className="flex-shrink-0">
                    {icon}
                </div>
                <p className="flex-1 font-semibold">{message}</p>
                <button
                    onClick={onClose}
                    className="flex-shrink-0 text-white/80 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default Notification;
