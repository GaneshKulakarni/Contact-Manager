import { useState, useEffect } from 'react';
import { validateForm } from '../utils/validation';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

const ContactForm = ({ onSubmit, isSubmitting, editingContact, onCancelEdit, isDarkMode }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    useEffect(() => {
        if (editingContact) {
            setFormData({
                name: editingContact.name,
                email: editingContact.email,
                phone: editingContact.phone,
                message: editingContact.message || ''
            });
        }
    }, [editingContact]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        const validation = validateForm(formData);
        if (validation.errors[name]) {
            setErrors(prev => ({ ...prev, [name]: validation.errors[name] }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setTouched({ name: true, email: true, phone: true, message: true });
        const validation = validateForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }
        onSubmit(formData);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors({});
        setTouched({});
    };

    const handleCancel = () => {
        setFormData({ name: '', email: '', phone: '', message: '' });
        setErrors({});
        setTouched({});
        onCancelEdit();
    };

    const validation = validateForm(formData);
    const isFormValid = validation.isValid;

    return (
        <div className={`rounded-2xl shadow-xl p-8 border transition-colors duration-300 ${
            isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-100'
        }`}>
            <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingContact ? "M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" : "M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"} />
                    </svg>
                </div>
                <div>
                    <h2 className={`text-3xl font-bold transition-colors duration-300 ${
                        isDarkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                        {editingContact ? 'Edit Contact' : 'Add New Contact'}
                    </h2>
                    <p className={`text-sm mt-1 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                        {editingContact ? 'Update contact information' : 'Fill in the details below'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="name" className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                touched.name && errors.name 
                                    ? 'border-red-500 bg-red-50' 
                                    : isDarkMode 
                                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                        : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400'
                            }`}
                            placeholder="John Doe"
                        />
                        {touched.name && errors.name && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="email" className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                                touched.email && errors.email 
                                    ? 'border-red-500 bg-red-50' 
                                    : isDarkMode 
                                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                        : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400'
                            }`}
                            placeholder="john@example.com"
                        />
                        {touched.email && errors.email && (
                            <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                <div>
                    <label htmlFor="phone" className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        Phone <span className="text-red-500">*</span>
                    </label>
                    <PhoneInput
                        country={'us'}
                        value={formData.phone}
                        onChange={(phone) => setFormData(prev => ({ ...prev, phone: '+' + phone }))}
                        onBlur={handleBlur}
                        inputProps={{
                            name: 'phone',
                            required: true,
                            id: 'phone'
                        }}
                        containerClass="phone-input-container"
                        inputClass={`phone-input ${touched.phone && errors.phone ? 'phone-input-error' : ''}`}
                        buttonClass="phone-button"
                        dropdownClass="phone-dropdown"
                        searchClass="phone-search"
                        enableSearch={true}
                        searchPlaceholder="Search country"
                        preferredCountries={['us', 'gb', 'in', 'cn']}
                    />
                    {touched.phone && errors.phone && (
                        <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            {errors.phone}
                        </p>
                    )}
                </div>

                <div>
                    <label htmlFor="message" className={`block text-sm font-semibold mb-2 transition-colors duration-300 ${
                        isDarkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                        Message <span className={`font-normal transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-500' : 'text-gray-400'
                        }`}>(Optional)</span>
                    </label>
                    <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        rows="4"
                        className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none ${
                            touched.message && errors.message 
                                ? 'border-red-500 bg-red-50' 
                                : isDarkMode 
                                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                    : 'border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-400'
                        }`}
                        placeholder="Your message here..."
                    />
                    <div className="flex justify-between items-center mt-2">
                        {touched.message && errors.message ? (
                            <p className="text-sm text-red-600 flex items-center gap-1">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errors.message}
                            </p>
                        ) : <span></span>}
                        <span className={`text-sm transition-colors duration-300 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>{formData.message.length}/500</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting}
                        className="w-full sm:flex-1 py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-4 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? (
                            <>
                                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                {editingContact ? 'Updating...' : 'Submitting...'}
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={editingContact ? "M5 13l4 4L19 7" : "M12 4v16m8-8H4"} />
                                </svg>
                                {editingContact ? 'Update Contact' : 'Add Contact'}
                            </>
                        )}
                    </button>
                    {editingContact && (
                        <button
                            type="button"
                            onClick={handleCancel}
                            className={`w-full sm:w-auto py-4 px-8 font-semibold rounded-xl focus:outline-none focus:ring-4 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                                isDarkMode 
                                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 focus:ring-gray-600' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-300'
                            }`}
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default ContactForm;
