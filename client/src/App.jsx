import { useState, useEffect } from 'react';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import Notification from './components/Notification';
import { contactAPI } from './services/api';

function App() {
  const [contacts, setContacts] = useState([]);
  const [deletedContacts, setDeletedContacts] = useState([]);
  const [showDeleted, setShowDeleted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);

  const [editingContact, setEditingContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileExport, setShowMobileExport] = useState(false);

  useEffect(() => {
    fetchContacts();
    fetchDeletedContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const response = await contactAPI.getAll(sortBy);
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
      showNotification('Failed to load contacts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [sortBy]);

  const fetchDeletedContacts = async () => {
    try {
      const response = await contactAPI.getDeleted();
      setDeletedContacts(response.data);
    } catch (error) {
      console.error('Error fetching deleted contacts:', error);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setIsSubmitting(true);
      
      if (editingContact) {
        const response = await contactAPI.update(editingContact._id, formData);
        setContacts(prev => prev.map(c => c._id === editingContact._id ? response.data : c));
        showNotification('Contact updated successfully!', 'success');
        setEditingContact(null);
      } else {
        const response = await contactAPI.create(formData);
        setContacts(prev => [response.data, ...prev]);
        showNotification('Contact added successfully!', 'success');
      }
    } catch (error) {
      console.error('Error saving contact:', error);
      showNotification(error.message || 'Failed to save contact', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (contact) => {
    setEditingContact(contact);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingContact(null);
  };

  const handleDelete = async (id) => {
    try {
      await contactAPI.delete(id);
      const deletedContact = contacts.find(c => c._id === id);
      setContacts(prev => prev.filter(contact => contact._id !== id));
      fetchDeletedContacts();
      showNotification('Contact moved to trash!', 'success');
    } catch (error) {
      console.error('Error deleting contact:', error);
      showNotification(error.message || 'Failed to delete contact', 'error');
    }
  };

  const handleRestore = async (id) => {
    try {
      await contactAPI.restore(id);
      setDeletedContacts(prev => prev.filter(contact => contact._id !== id));
      fetchContacts();
      showNotification('Contact restored successfully!', 'success');
    } catch (error) {
      console.error('Error restoring contact:', error);
      showNotification(error.message || 'Failed to restore contact', 'error');
    }
  };

  const handlePermanentDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this contact? This action cannot be undone.')) {
      return;
    }
    try {
      await contactAPI.permanentDelete(id);
      setDeletedContacts(prev => prev.filter(contact => contact._id !== id));
      showNotification('Contact permanently deleted!', 'success');
    } catch (error) {
      console.error('Error permanently deleting contact:', error);
      showNotification(error.message || 'Failed to permanently delete contact', 'error');
    }
  };

  const handleToggleFavorite = async (id) => {
    try {
      const response = await contactAPI.toggleFavorite(id);
      setContacts(prev => prev.map(c => c._id === id ? response.data : c));
      showNotification(response.message, 'success');
    } catch (error) {
      console.error('Error toggling favorite:', error);
      showNotification(error.message || 'Failed to toggle favorite', 'error');
    }
  };

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Message', 'Created At'],
      ...contacts.map(contact => [
        contact.name,
        contact.email,
        contact.phone,
        contact.message || '',
        new Date(contact.createdAt).toLocaleDateString()
      ])
    ].map(row => row.map(field => `"${field}"`).join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('Contacts exported successfully!', 'success');
  };

  const exportToVCard = () => {
    const vCardContent = contacts.map(contact => {
      return [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `FN:${contact.name}`,
        `EMAIL:${contact.email}`,
        `TEL:${contact.phone}`,
        contact.message ? `NOTE:${contact.message}` : '',
        'END:VCARD'
      ].filter(line => line).join('\n');
    }).join('\n\n');
    
    const blob = new Blob([vCardContent], { type: 'text/vcard' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_${new Date().toISOString().split('T')[0]}.vcf`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('vCard exported successfully!', 'success');
  };

  const createBackup = () => {
    const backupData = {
      contacts,
      deletedContacts,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `contacts_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    window.URL.revokeObjectURL(url);
    showNotification('Backup created successfully!', 'success');
  };

  const restoreBackup = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const backupData = JSON.parse(e.target.result);
        if (backupData.contacts) {
          for (const contact of backupData.contacts) {
            await contactAPI.create({
              name: contact.name,
              email: contact.email,
              phone: contact.phone,
              message: contact.message || ''
            });
          }
          fetchContacts();
          showNotification('Backup restored successfully!', 'success');
        }
      } catch (error) {
        showNotification('Error restoring backup', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const importFromCSV = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());
        
        for (let i = 1; i < lines.length; i++) {
          if (!lines[i].trim()) continue;
          const values = lines[i].split(',').map(v => v.replace(/"/g, '').trim());
          const contact = {
            name: values[0],
            email: values[1],
            phone: values[2],
            message: values[3] || ''
          };
          if (contact.name && contact.email && contact.phone) {
            await contactAPI.create(contact);
          }
        }
        fetchContacts();
        showNotification('Contacts imported successfully!', 'success');
      } catch (error) {
        showNotification('Error importing contacts', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const filteredContacts = contacts.filter(contact => {
    const query = searchQuery.toLowerCase();
    return (
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query) ||
      contact.phone.includes(query)
    );
  });

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Navbar */}
      <nav className={`shadow-lg border-b transition-colors duration-300 ${
        isDarkMode 
          ? 'bg-gray-800 border-gray-700' 
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo/Title */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h1 className={`text-2xl font-bold transition-colors duration-300 ${
                isDarkMode ? 'text-white' : 'text-gray-900'
              }`}>Contact Manager</h1>
            </div>

            <div className="flex-1" />

            {/* Desktop actions (hidden on small) */}
            <div className="hidden sm:flex items-center gap-3 ml-auto">
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
                title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>

              <div className="relative">
                <button 
                  onClick={() => setShowExportMenu(!showExportMenu)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-all text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export ▼
                </button>
                {showExportMenu && (
                  <div className={`absolute top-full right-0 mt-1 rounded-lg shadow-lg border z-50 min-w-32 transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <button onClick={() => { exportToCSV(); setShowExportMenu(false); }} className={`w-full px-4 py-2 text-left rounded-t-lg text-sm transition-colors duration-300 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>CSV</button>
                    <button onClick={() => { exportToVCard(); setShowExportMenu(false); }} className={`w-full px-4 py-2 text-left text-sm transition-colors duration-300 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>vCard</button>
                    <button onClick={() => { createBackup(); setShowExportMenu(false); }} className={`w-full px-4 py-2 text-left rounded-b-lg text-sm transition-colors duration-300 ${
                      isDarkMode 
                        ? 'text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}>Backup</button>
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 px-3 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-all cursor-pointer text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                </svg>
                Import CSV
                <input type="file" accept=".csv" onChange={importFromCSV} className="hidden" />
              </label>

              <label className="flex items-center gap-2 px-3 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600 transition-all cursor-pointer text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Restore
                <input type="file" accept=".json" onChange={restoreBackup} className="hidden" />
              </label>

              <div className="relative">
                <button
                  onClick={() => setShowDeleted(!showDeleted)}
                  className={`flex items-center gap-2 px-3 py-2 border rounded-lg font-medium transition-all text-sm ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600' 
                      : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Deleted ({deletedContacts.length})
                </button>

                {showDeleted && deletedContacts.length > 0 && (
                  <div className={`absolute right-0 mt-2 w-96 rounded-xl shadow-2xl border z-50 max-h-96 overflow-y-auto transition-colors duration-300 ${
                    isDarkMode 
                      ? 'bg-gray-800 border-gray-600' 
                      : 'bg-white border-gray-200'
                  }`}>
                    <div className="p-4">
                      <h3 className={`text-lg font-bold mb-3 transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                      }`}>Deleted Contacts</h3>
                      <div className="space-y-3">
                        {deletedContacts.map((contact) => (
                          <div key={contact._id} className={`rounded-lg p-3 border transition-colors duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600' 
                              : 'bg-gray-50 border-gray-200'
                          }`}>
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h4 className={`font-semibold transition-colors duration-300 ${
                                  isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}>{contact.name}</h4>
                                <p className={`text-sm transition-colors duration-300 ${
                                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>{contact.email}</p>
                                <p className={`text-sm transition-colors duration-300 ${
                                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}>{contact.phone}</p>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2">
                              <button
                                onClick={() => handleRestore(contact._id)}
                                className="flex-1 px-3 py-1.5 bg-green-500 text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-all"
                              >
                                Restore
                              </button>
                              <button
                                onClick={() => handlePermanentDelete(contact._id)}
                                className="flex-1 px-3 py-1.5 bg-red-500 text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-all"
                              >
                                Delete Forever
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Mobile hamburger only */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className={`sm:hidden p-2 rounded-lg transition-all duration-300 ${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}
                aria-label="Open menu"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
            
          </div>
        </div>
      </nav>

      {/* Mobile menu dropdown */}
      {showMobileMenu && (
        <div className={`sm:hidden fixed top-16 left-0 right-0 z-40 ${isDarkMode ? 'bg-gray-900' : 'bg-white'} border-b`}>
          <div className="max-w-7xl mx-auto px-4 py-3">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => { setIsDarkMode(prev => !prev); setShowMobileMenu(false); }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-gray-800' : 'hover:bg-gray-100'}`}
                title="Toggle theme"
              >
                {isDarkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
                <span className={`font-medium ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>Theme</span>
              </button>

              <div>
                <button onClick={() => setShowMobileExport(prev => !prev)} className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                  <span>Export</span>
                  <span>{showMobileExport ? '▴' : '▾'}</span>
                </button>
                {showMobileExport && (
                  <div className="mt-1 ml-2 flex flex-col gap-1">
                    <button onClick={() => { exportToCSV(); setShowMobileMenu(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-gray-800' : 'hover:bg-gray-100'}`}>CSV</button>
                    <button onClick={() => { exportToVCard(); setShowMobileMenu(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-gray-800' : 'hover:bg-gray-100'}`}>vCard</button>
                    <button onClick={() => { createBackup(); setShowMobileMenu(false); }} className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-gray-800' : 'hover:bg-gray-100'}`}>Backup</button>
                  </div>
                )}
              </div>

              <label className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                Import CSV
                <input type="file" accept=".csv" onChange={(e) => { importFromCSV(e); setShowMobileMenu(false); }} className="hidden" />
              </label>

              <label className={`w-full text-left px-3 py-2 rounded-lg cursor-pointer transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-gray-800' : 'hover:bg-gray-100'}`}>
                Restore Backup
                <input type="file" accept=".json" onChange={(e) => { restoreBackup(e); setShowMobileMenu(false); }} className="hidden" />
              </label>

              <div>
                <button onClick={() => { setShowDeleted(prev => !prev); }} className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${isDarkMode ? 'text-gray-200 hover:bg-gray-800' : 'hover:bg-gray-100'}`}>Deleted ({deletedContacts.length})</button>
                {showDeleted && (
                  <div className={`mt-2 rounded-lg p-2 border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-100 text-gray-900'}`}>
                    {deletedContacts.length === 0 ? (
                      <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>No deleted contacts</p>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {deletedContacts.map((contact) => (
                          <div key={contact._id} className={`rounded p-2 border ${isDarkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-200'}`}>
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{contact.name}</h4>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{contact.email}</p>
                                <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{contact.phone}</p>
                              </div>
                              <div className="flex gap-2 ml-2">
                                <button onClick={() => { handleRestore(contact._id); }} className="px-2 py-1 bg-green-500 text-white rounded-md text-sm">Restore</button>
                                <button onClick={() => { handlePermanentDelete(contact._id); }} className="px-2 py-1 bg-red-500 text-white rounded-md text-sm">Delete</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <ContactForm 
            onSubmit={handleSubmit} 
            isSubmitting={isSubmitting}
            editingContact={editingContact}
            onCancelEdit={handleCancelEdit}
            isDarkMode={isDarkMode}
          />
        </div>

        <div className="mb-6 flex gap-4 items-center">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search contacts by name, email, or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full px-4 py-3 pl-12 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-200 text-gray-900 placeholder-gray-500'
              }`}
            />
            <svg className={`w-5 h-5 absolute left-4 top-4 transition-colors duration-300 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-400'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={`px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-600 text-white' 
                : 'bg-white border-gray-200 text-gray-900'
            }`}
          >
            <option value="-createdAt">Newest First</option>
            <option value="createdAt">Oldest First</option>
            <option value="name">A-Z</option>
            <option value="-name">Z-A</option>
          </select>
        </div>

        <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <ContactList
            contacts={filteredContacts}
            onDelete={handleDelete}
            onEdit={handleEdit}
            onToggleFavorite={handleToggleFavorite}
            isLoading={isLoading}
            isDarkMode={isDarkMode}
          />
        </div>
      </div>

      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
}

export default App;
