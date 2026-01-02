import express from 'express';
import {
    getContacts,
    getDeletedContacts,
    createContact,
    updateContact,
    deleteContact,
    restoreContact,
    permanentDeleteContact,
    toggleFavorite
} from '../controllers/contactController.js';

const router = express.Router();

// GET all contacts & POST new contact
router.route('/')
    .get(getContacts)
    .post(createContact);

// GET deleted contacts
router.get('/deleted', getDeletedContacts);

// PUT update contact & DELETE contact by ID
router.route('/:id')
    .put(updateContact)
    .delete(deleteContact);

// Restore deleted contact
router.put('/:id/restore', restoreContact);

// Toggle favorite
router.put('/:id/favorite', toggleFavorite);

// Permanently delete contact
router.delete('/:id/permanent', permanentDeleteContact);

export default router;
