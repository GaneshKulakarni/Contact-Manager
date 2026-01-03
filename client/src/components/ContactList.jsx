import { useState } from 'react';

const ContactList = ({ contacts, onDelete, onEdit, onToggleFavorite, isLoading, isDarkMode }) => {
    const [sortBy, setSortBy] = useState('-createdAt');
    const [deletingId, setDeletingId] = useState(null);
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

    const handleDelete = async (id) => {
        setDeletingId(id);
        await onDelete(id);
        setDeletingId(null);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isLoading) {
        return (
            <div className={`rounded-2xl shadow-xl p-12 border transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
                <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className={`font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-600'
                    }`}>Loading contacts...</p>
                </div>
            </div>
        );
    }

    if (contacts.length === 0) {
        return (
            <div className={`rounded-2xl shadow-xl p-12 border transition-colors duration-300 ${
                isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
            }`}>
                <div className="text-center">
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
                        isDarkMode ? 'bg-gradient-to-br from-gray-700 to-gray-600' : 'bg-gradient-to-br from-blue-100 to-purple-100'
                    }`}>
                        <svg className={`w-12 h-12 transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-400'
                        }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h3 className={`text-2xl font-bold mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>No Contacts Yet</h3>
                    <p className={`transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>Start by adding your first contact above!</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`rounded-2xl shadow-xl p-8 border transition-colors duration-300 ${
            isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'
        }`}>
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <div>
                        <h2 className={`text-3xl font-bold transition-colors duration-300 ${
                            isDarkMode ? 'text-white' : 'text-gray-900'
                        }`}>Your Contacts</h2>
                        <p className={`text-sm mt-1 transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'} saved</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className={`px-4 py-2 border-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                            showFavoritesOnly
                                ? 'bg-yellow-400 border-yellow-500 text-gray-900 shadow-lg shadow-yellow-400/50 animate-pulse'
                                : isDarkMode
                                    ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                                    : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                    >
                        <svg className="w-5 h-5" fill={showFavoritesOnly ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Fav Contacts
                    </button>
                    <label htmlFor="sort" className={`text-sm font-medium transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>Sort by:</label>
                    <select
                        id="sort"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`px-4 py-2 border-2 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            isDarkMode 
                                ? 'bg-gray-700 border-gray-600 text-white' 
                                : 'bg-gray-50 border-gray-200 text-gray-900'
                        }`}
                    >
                        <option value="-createdAt">Newest First</option>
                        <option value="createdAt">Oldest First</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="-name">Name (Z-A)</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contacts
                    .filter(contact => !showFavoritesOnly || contact.isFavorite)
                    .sort((a, b) => {
                        if (sortBy === '-createdAt') return new Date(b.createdAt) - new Date(a.createdAt);
                        if (sortBy === 'createdAt') return new Date(a.createdAt) - new Date(b.createdAt);
                        if (sortBy === 'name') return a.name.localeCompare(b.name);
                        if (sortBy === '-name') return b.name.localeCompare(a.name);
                        return 0;
                    })
                    .map((contact, index) => (
                        <div
                            key={contact._id}
                            className={`border-2 rounded-2xl p-6 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up ${
                                isDarkMode 
                                    ? 'bg-gradient-to-br from-gray-700 to-gray-800 border-gray-600' 
                                    : 'bg-gradient-to-br from-gray-50 to-white border-gray-100'
                            }`}
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                        {contact.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className={`font-bold text-lg transition-colors duration-300 ${
                                            isDarkMode ? 'text-white' : 'text-gray-900'
                                        }`}>{contact.name}</h3>
                                        <p className={`text-xs transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                                        }`}>{formatDate(contact.createdAt)}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => onToggleFavorite(contact._id)}
                                        className={`p-2 ${contact.isFavorite ? 'text-yellow-400' : 'text-gray-300'} hover:bg-yellow-50 rounded-lg transition-all`}
                                        title={contact.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        <svg className="w-6 h-6" fill={contact.isFavorite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => onEdit(contact)}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                        title="Edit contact"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(contact._id)}
                                        disabled={deletingId === contact._id}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                        title="Delete contact"
                                    >
                                        {deletingId === contact._id ? (
                                            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                        isDarkMode ? 'bg-blue-900' : 'bg-blue-100'
                                    }`}>
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <a href={`mailto:${contact.email}`} className={`hover:text-blue-600 transition-colors truncate font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        {contact.email}
                                    </a>
                                </div>

                                <div className="flex items-center gap-3 text-sm">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                        isDarkMode ? 'bg-purple-900' : 'bg-purple-100'
                                    }`}>
                                        <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <a href={`tel:${contact.phone}`} className={`hover:text-purple-600 transition-colors font-medium ${
                                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                                    }`}>
                                        {contact.phone}
                                    </a>
                                </div>

                                {contact.message && (
                                    <div className={`mt-4 pt-4 border-t-2 ${
                                        isDarkMode ? 'border-gray-600' : 'border-gray-100'
                                    }`}>
                                        <p className={`text-sm italic line-clamp-2 transition-colors duration-300 ${
                                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                                        }`}>
                                            "{contact.message}"
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default ContactList;
