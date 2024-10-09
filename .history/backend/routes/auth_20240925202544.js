const router = require("express").Router();
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");

router.post("/", async (req, res) => {
	try {
		// Validation des données d'entrée
		const { error } = validate(req.body);
		if (error) {
			return res.status(400).send({ message: error.details[0].message });
		}

		// Vérification si l'utilisateur existe
		const user = await User.findOne({ email: req.body.email });
		if (!user) {
			return res.status(401).send({ message: "E-mail ou mot de passe invalide." });
		}

		// Vérification si le compte est verrouillé
		if (user.status === 'suspendu') {
			return res.status(403).send({ 
				message: "Votre compte est verrouillé en raison de plusieurs tentatives de connexion infructueuses. Veuillez contacter l'administrateur.",
				status: 'suspendu' // Include the account status in the response
			});
		}

		// Validation du mot de passe
		const validPassword = await bcrypt.compare(req.body.password, user.password);
		if (!validPassword) {
			
			user.failedAttempts += 1;

			
			if (user.failedAttempts >= 3) {
				user.status = 'suspendu';
				await user.save(); 
				return res.status(403).send({ 
					message: "Votre compte est verrouillé en raison de plusieurs tentatives de connexion infructueuses. Veuillez contacter l'administrateur.",
					status: 'suspendu' 
				});
			}

			await user.save(); 
			return res.status(401).send({ message: "E-mail ou mot de passe invalide." });
		}

		
		user.failedAttempts = 0;
		await user.save();

		const token = user.generateAuthToken();

		
		if (user.role === 'admin') {
			return res.status(200).send({ 
				data: token, 
				message: "Connexion administrateur réussie.",
				role: 'admin',
			});
		} else if (user.role === 'user') {
			return res.status(200).send({ 
				data: token, 
				message: "Connexion utilisateur réussie.",
				role: 'user',
			});
		} else {
			return res.status(403).send({ message: "Accès refusé : rôle invalide." });
		}

	} catch (error) {
		res.status(500).send({ message: "Erreur interne du serveur." });
	}
});


const validate = (data) => {
	const schema = Joi.object({
		email: Joi.string().email().required().label("Email"),
		password: Joi.string().required().label("Mot de passe"),
	});
	return schema.validate(data);
};

module.exports = router;
