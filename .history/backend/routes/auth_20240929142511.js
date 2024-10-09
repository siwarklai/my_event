const express = require("express");
const router = express.Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const jwt = require("jsonwebtoken"); // Import the JWT library

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error) {
			return res.status(400).send({ message: error.details[0].message });
		}
		
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(401).send({ message: "Invalid email or password." });
		}
		
		if (user.status === 'suspended') {
			return res.status(403).send({ 
				message: "Your account is locked due to multiple unsuccessful login attempts. Please contact the administrator.",
				status: 'suspended' 
			});
		}
		
		const validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword) {
			user.failedAttempts += 1;

			if (user.failedAttempts >= 3) {
				user.status = 'suspended';
				await user.save(); 
				return res.status(403).send({ 
					message: "Your account is locked due to multiple unsuccessful login attempts. Please contact the administrator.",
					status: 'suspended' 
				});
			}

			await user.save(); 
			return res.status(401).send({ message: "Invalid email or password." });
		}

		user.failedAttempts = 0;
		await user.save();

		// Generate the JWT token including user role
		const token = jwt.sign(
			{ email: user.email, id: user._id, role: user.role },
			process.env.JWTPRIVATEKEY, 
			{ expiresIn: '50h' }
		);

		if (user.role === 'admin') {
			return res.status(200).send({ 
				data: token, 
				message: "Admin login successful.",
				role: 'admin',
			});
		} else if (user.role === 'user') {
			return res.status(200).send({ 
				data: token, 
				message: "User login successful.",
				role: 'user',
			});
		} else {
			return res.status(403).send({ message: "Access denied: invalid role." });
		}

	} catch (error) {
		res.status(500).send({ message: "Internal server error." });
	}
});

const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Password"),
	});
	return schema.validate(data);
};

module.exports = router;
