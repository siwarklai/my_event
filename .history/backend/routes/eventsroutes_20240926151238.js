const express = require("express");
const Event = require('../models/eventmodel.js'); 
const router = express.Router();
const auth=require('../middleware/auth.js')


router.post('/', auth, async (request, response) => { // Ensure to use the authMiddleware here
    try {
        const { nom, type, lieu, codePostale, dateDebut, dateFin, budget } = request.body;

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
            creator: request.user.email, // Associate the event with the creator
        };

        const event = await Event.create(newEvent);
        return response.status(201).send(event);
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});





// Route for Get All Events from the database
router.get('/', authMiddleware, async (request, response) => {
    try {
        let events;
        if (request.user.role === 'admin') {
            events = await Event.find({}); // Admin can see all events
        } else {
            events = await Event.find({ creator: request.user.email }); // Users see their own events
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


router.put('/:id',auth, async (request, response) => {
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


router.delete('/:id',auth, async (request, response) => {
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
