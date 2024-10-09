const express = require("express");
const { User, validate } = require("../models/user");
const bcrypt = require("bcrypt");
const router = express.Router();

// Route to save a new user
router.post("/", async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        const user = await User.findOne({ email: req.body.email });
        if (user) return res.status(409).send({ message: "L'utilisateur avec l'e-mail donné existe déjà !" });

        const idNumberExists = await User.findOne({ ID: req.body.ID });
        if (idNumberExists) return res.status(409).send({ message: "L'utilisateur avec le numéro d'identification donné existe déjà !" });

        const salt = await bcrypt.genSalt(Number(process.env.SALT));
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashPassword }).save();
        res.status(201).send({ message: "Utilisateur créé avec succès" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
});

// Route for getting all users
router.get("/", async (req, res) => {
    try {
        const users = await User.find({});
        return res.status(200).json({
            count: users.length,
            data: users,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});


// Route for updating a user
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const requiredFields = ["firstName", "lastName", "email", "phone", "position", "ID"];
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).send({ message: `Please provide ${field}` });
            }
        }

        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (req.body.idNumber && req.body.idNumber !== user.idNumber) {
            const idNumberExists = await User.findOne({ idNumber: req.body.idNumber });
            if (idNumberExists) return res.status(409).send({ message: "User with given ID number already exists!" });
        }

        Object.assign(user, req.body);
        await user.save();
        return res.status(200).send({ message: "User updated successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

// Route for deleting a user
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await User.findByIdAndDelete(id);

        if (!result) return res.status(404).json({ message: "User not found" });
        return res.status(200).send({ message: "User deleted successfully" });
    } catch (error) {
        console.log(error.message);
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
