const express = require("express");
const Event = require('../models/eventmodel.js'); 
const router = express.Router();
const auth = require('../middleware/auth.js');
const mongoose = require('mongoose');

// Route for Create Event
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
            creator: req.user.email, // Associate the event with the creator (user's email)
        };

        const event = await Event.create(newEvent);
        return res.status(201).send(event);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for Get All Events
// Route for Get All Events
router.get('/', auth, async (request, response) => {
    try {
        const { role, email } = request.user; // Extract role and email from the authenticated user

        let events;
        if (role === 'admin') {
            // Admin can see all events
            events = await Event.find({});
        } else {
            // Regular users can only see their own events
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

        // Validate if 'id' is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send({ message: 'Invalid Event ID' });
        }

        // Find the event by ID
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        // Check if the user is an admin or the creator of the event
        if (req.user.role !== 'admin' && event.creator !== req.user.email) {
            return res.status(403).send({ message: 'You do not have permission to view this event.' });
        }

        return res.status(200).json(event);
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for Updating Event (User can only update their own events)
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { nom, type, lieu, codePostale, dateDebut, dateFin, budget } = req.body;

        if (!nom || !type || !lieu || !codePostale || !dateDebut || !dateFin || !budget) {
            return res.status(400).send({
                message: 'Please provide all required fields: nom, type, lieu, codePostale, dateDebut, dateFin, budget',
            });
        }

        // Find the event by ID
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        // Check if the user is an admin or the creator of the event
        if (req.user.role !== 'admin' && event.creator !== req.user.email) {
            return res.status(403).send({ message: 'You do not have permission to update this event.' });
        }

        // Update event details
        Object.assign(event, { nom, type, lieu, codePostale, dateDebut, dateFin, budget });
        await event.save();

        return res.status(200).send({ message: 'Event updated successfully', event });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for Deleting Event (User can only delete their own events)
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

        // Find the event by ID
        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).send({ message: 'Event not found' });
        }

        // Check if the user is an admin or the creator of the event
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
router.get('/',auth,async(req,res)=>{
    try{
        const upcomingEvents = events.filter(event => {
            const eventDate = new Date(event.date); // Assuming 'date' is the event date field
            const now = new Date();
            const twoWeeksFromNow = new Date(now);
            twoWeeksFromNow.setDate(now.getDate() + 14);
            return eventDate >= now && eventDate <= twoWeeksFromNow;
        
    }
})

module.exports = router;
