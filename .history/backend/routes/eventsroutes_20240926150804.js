const express = require("express");
const Event = require('../models/eventmodel.js'); 
const router = express.Router();
const


router.post('/', async (request, response) => {
    try {
        console.log('Request user:', request.user);
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




// Route for Get All Events from the database
router.get('/', async (request, response) => {
    try {
        const events = await Event.find({});
        return response.status(200).json({
            count: events.length,
            data: events,
        });
    } catch (error) {
        console.log(error.message);
        response.status(500).send({ message: error.message });
    }
});
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
