const express = require("express");
const Event = require('../models/eventmodel.js'); 
const router = express.Router();
const auth = require('../middleware/auth.js');

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
router.get('/', auth, async (req, res) => {
    try {
        let events;

        // Admins can see all events
        if (req.user.role === 'admin') {
            events = await Event.find({});
        } 
        // Regular users can only see the events they created
        else {
            events = await Event.find({ creator: req.user.email });
        }

        return res.status(200).json({
            count: events.length,
            data: events,
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for Get Event by ID
router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;

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
// Backend (Node.js / Express)
router.get('/upcoming-event', async (req, res) => {
    try {
        const currentDate = new Date();
        const twoWeeksLater = new Date();
        twoWeeksLater.setDate(currentDate.getDate() + 14);

        // Find events that start between today and 2 weeks from today
        const event = await Event.findOne({
            dateDebut: {
                $gte: currentDate,    // Event must start after or on today
                $lte: twoWeeksLater   // Event must start before or on two weeks from now
            }
        })
        .sort({ dateDebut: 1 })  // Sort by the nearest upcoming event
        .limit(1);               // Only get the nearest event

        if (!event) {
            return res.status(404).send({ message: 'No upcoming events within the next two weeks.' });
        }

        res.status(200).send(event);
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Error fetching upcoming event.' });
    }
});


module.exports = router;
