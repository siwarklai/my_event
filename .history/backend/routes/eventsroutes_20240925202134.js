const express = require("express");
const Event = require('../models/eventmodel.js'); 
const router = express.Router();


// Route to save a new event
router.post('/', async (request, response) => {
    try {
        const {
            nom,
            type,
            lieu,
            codePostale,
            dateDebut,
            dateFin,
            budget
        } = request.body;
        if (!nom || !type || !lieu || !codePostale || !dateDebut || !dateFin || !budget) {
            return response.status(400).send({
                message: 'Send all required fields: nom, type, lieu, codePostale, dateDebut, dateFin, budget',
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
        };

        const event = await Event.create(newEvent);
        return response.status(201).send(event);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});


router.get('/', async (request, response) => {
    try {
        const userRole = request.user.role; 
        const userEmail = request.user.email; 

        let events;
        if (userRole === 'admin') {
            events = await Event.find({});
        } else {
            events = await Event.find({ creator: userEmail });
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
router.get('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const event = await Event.findById(id);

        if (!event) {
            return response.status(404).json({ message: 'Event not found' });
        }

        return response.status(200).json(event);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route to update an event
router.put('/:id', async (request, response) => {
    try {
        const {
            nom,
            type,
            lieu,
            codePostale,
            dateDebut,
            dateFin,
            budget
        } = request.body;

        // Validate required fields
        if (!nom || !type || !lieu || !codePostale || !dateDebut || !dateFin || !budget) {
            return response.status(400).send({
                message: 'Send all required fields: nom, type, lieu, codePostale, dateDebut, dateFin, budget',
            });
        }

        const { id } = request.params;
        const result = await Event.findByIdAndUpdate(id, request.body, { new: true });

        if (!result) {
            return response.status(404).json({ message: 'Event not found' });
        }

        return response.status(200).send({ message: 'Event updated successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

// Route for deleting an event
router.delete('/:id', async (request, response) => {
    try {
        const { id } = request.params;
        const result = await Event.findByIdAndDelete(id);

        if (!result) {
            return response.status(404).json({ message: 'Event not found' });
        }

        return response.status(200).send({ message: 'Event deleted successfully' });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});

module.exports = router;
