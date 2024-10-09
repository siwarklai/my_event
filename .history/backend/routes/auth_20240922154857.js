const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
	try {
		const { error } = validate(req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		const user = await User.findOne({ email: req.body.email });
		if (!user)
			return res.status(401).send({ message: "E-mail ou mot de passe invalide" });

		if (user.status === 'suspendu') {
			return res.status(403).send({ message: "Le compte est verrouillé en raison de plusieurs tentatives de connexion infructueuses. Veuillez contacter l'administrateur." });
		}
		const validPassword = await bcrypt.compare(
			req.body.password,
			user.password
		);
		if (!validPassword) {
			user.failedLoginAttempts += 1;

			// If failed attempts reach 3, lock the account
			if (user.failedAttempts >= 3) {
				user.status = 'off';
				await user.save();
				return res.status(403).send({ message: "Le compte est verrouillé en raison de plusieurs tentatives de connexion infructueuses. Veuillez contacter l'administrateur." });
			}

			await user.save();
			return res.status(401).send({ message: "E-mail ou mot de passe invalide" });
		}

		// If login is successful, reset failedLoginAttempts
		user.faileAttempts = 0;
		await user.save();

		const token = user.generateAuthToken();
        if (user.role === 'admin') {
			// Respond with admin-specific data
			res.status(200).send({ 
				data: token, 
				message: "Admin logged in successfully",
				role: 'admin',
				adminData: { /* Add any admin-specific data here */ }
			});
		} else if (user.role === 'user') {
			// Respond with user-specific data
			res.status(200).send({ 
				data: token, 
				message: "User logged in successfully",
				role: 'user',
				userData: { /* Add any user-specific data here */ }
			});
		} else {
			// Default response for other roles or in case of any unexpected role
			res.status(403).send({ message: "Access Denied: Invalid Role" });
		}

	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
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
