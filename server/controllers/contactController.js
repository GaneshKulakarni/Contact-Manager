import Contact from '../models/Contact.js';

// @desc    Get all contacts
// @route   GET /api/contacts
// @access  Public
export const getContacts = async (req, res) => {
    try {
        const { sort = '-createdAt' } = req.query;
        const contacts = await Contact.find({ $or: [{ isDeleted: false }, { isDeleted: { $exists: false } }] }).sort(sort);

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch contacts',
            error: error.message
        });
    }
};

// @desc    Get deleted contacts
// @route   GET /api/contacts/deleted
// @access  Public
export const getDeletedContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ isDeleted: true }).sort('-deletedAt');

        res.status(200).json({
            success: true,
            count: contacts.length,
            data: contacts
        });
    } catch (error) {
        console.error('Error fetching deleted contacts:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch deleted contacts',
            error: error.message
        });
    }
};

// @desc    Create new contact
// @route   POST /api/contacts
// @access  Public
export const createContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        // Create contact
        const contact = await Contact.create({
            name,
            email,
            phone,
            message
        });

        res.status(201).json({
            success: true,
            message: 'Contact created successfully',
            data: contact
        });
    } catch (error) {
        console.error('Error creating contact:', error);

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create contact',
            error: error.message
        });
    }
};

// @desc    Update contact
// @route   PUT /api/contacts/:id
// @access  Public
export const updateContact = async (req, res) => {
    try {
        const { name, email, phone, message } = req.body;

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        contact.name = name || contact.name;
        contact.email = email || contact.email;
        contact.phone = phone || contact.phone;
        contact.message = message !== undefined ? message : contact.message;

        const updatedContact = await contact.save();

        res.status(200).json({
            success: true,
            message: 'Contact updated successfully',
            data: updatedContact
        });
    } catch (error) {
        console.error('Error updating contact:', error);

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: messages
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to update contact',
            error: error.message
        });
    }
};

// @desc    Delete contact (soft delete)
// @route   DELETE /api/contacts/:id
// @access  Public
export const deleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        contact.isDeleted = true;
        contact.deletedAt = new Date();
        await contact.save();

        res.status(200).json({
            success: true,
            message: 'Contact moved to trash',
            data: {}
        });
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete contact',
            error: error.message
        });
    }
};

// @desc    Restore deleted contact
// @route   PUT /api/contacts/:id/restore
// @access  Public
export const restoreContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        contact.isDeleted = false;
        contact.deletedAt = null;
        await contact.save();

        res.status(200).json({
            success: true,
            message: 'Contact restored successfully',
            data: contact
        });
    } catch (error) {
        console.error('Error restoring contact:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to restore contact',
            error: error.message
        });
    }
};

// @desc    Permanently delete contact
// @route   DELETE /api/contacts/:id/permanent
// @access  Public
export const permanentDeleteContact = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        await contact.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Contact permanently deleted',
            data: {}
        });
    } catch (error) {
        console.error('Error permanently deleting contact:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to permanently delete contact',
            error: error.message
        });
    }
};

// @desc    Toggle favorite status
// @route   PUT /api/contacts/:id/favorite
// @access  Public
export const toggleFavorite = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        contact.isFavorite = !contact.isFavorite;
        await contact.save();

        res.status(200).json({
            success: true,
            message: contact.isFavorite ? 'Added to favorites' : 'Removed from favorites',
            data: contact
        });
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle favorite',
            error: error.message
        });
    }
};

// @desc    Toggle favorite status
// @route   PUT /api/contacts/:id/favorite
// @access  Public
export const toggleFavorite = async (req, res) => {
    try {
        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({
                success: false,
                message: 'Contact not found'
            });
        }

        contact.isFavorite = !contact.isFavorite;
        await contact.save();

        res.status(200).json({
            success: true,
            message: contact.isFavorite ? 'Added to favorites' : 'Removed from favorites',
            data: contact
        });
    } catch (error) {
        console.error('Error toggling favorite:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to toggle favorite',
            error: error.message
        });
    }
};
