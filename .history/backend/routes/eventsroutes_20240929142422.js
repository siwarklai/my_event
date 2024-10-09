const express = require("express");
const Event = require('../models/eventmodel.js'); 
const router = express.Router();
const auth = require('../middleware/auth.js');
const mongoose = require('mongoose');


router.post('/', auth, async (req, res) => {
    try {
        const { nom, type, lieu, codePostale, dateDebut, dateFin, budget } = req.body;

        if (!nom || !type || !lieu || !codePostale || !dateDebut || !dateFin || !budget) {
            return res.status(400).send({
                message: 'Please provide all required fields: nom, type, lieu, codePostale, dateDebut, dateFin, budget',
            });
        }

        const newEvent = {
            nom,
            type,
            lieu,
            codePostale,
            dateDebut,
            dateFin,
            budget,
            creator: req.user.email,
        };

        const event = await Event.create(newEvent);
        return res.status(201).send(event);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for Get All Events
router.get('/', auth, async (request, response) => {
    try {
        const { role, email } = request.user;

        let events;
        if (role === 'admin') {
            events = await Event.find({});
        } else {
            events = await Event.find({ creator: email });
        }

        return response.status(200).json({
            count: events.length,
            data: events,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for Get Event by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'Invalid Event ID' });
        }

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        if (req.user.role !== 'admin' && event.creator !== req.user.email) {
            return res.status(403).send({ message: 'You do not have permission to view this event.' });
        }

        return res.status(200).json(event);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for Updating Event
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, type, lieu, codePostale, dateDebut, dateFin, budget } = req.body;

        if (!nom || !type || !lieu || !codePostale || !dateDebut || !dateFin || !budget) {
            return res.status(400).send({
                message: 'Please provide all required fields: nom, type, lieu, codePostale, dateDebut, dateFin, budget',
            });
        }

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        if (req.user.role !== 'admin' && event.creator !== req.user.email) {
            return res.status(403).send({ message: 'You do not have permission to update this event.' });
        }

        Object.assign(event, { nom, type, lieu, codePostale, dateDebut, dateFin, budget });
        await event.save();

        return res.status(200).send({ message: 'Event updated successfully', event });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for Deleting Event
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        if (req.user.role !== 'admin' && event.creator !== req.user.email) {
            return res.status(403).send({ message: 'You do not have permission to delete this event.' });
        }

        await Event.findByIdAndDelete(id);
        return res.status(200).send({ message: 'Event deleted successfully' });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
