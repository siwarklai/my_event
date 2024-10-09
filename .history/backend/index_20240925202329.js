require("dotenv").config();
const express = require("express");

const cors = require("cors");
const connection = require("./db");
const userRoutes = require("./routes/usersroutes");
const authRoutes = require("./routes/auth");
const eventRoutes = require("./routes/eventsroutes"); // Updated import for event routes

const app = express();

connection();

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/events', eventRoutes); // Updated route for events

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));
