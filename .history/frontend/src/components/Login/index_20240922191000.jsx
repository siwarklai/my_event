const handleSubmit = async (e) => {
	e.preventDefault();
	try {
		const response = await axios.post('http://localhost:8080/api/auth', data);
		const { data: token, role, status } = response.data;

		// Check if the account is suspended before storing the token
		if (status === 'suspendu') {
			setError("Votre compte est inactif. Veuillez contacter l'administrateur.");
			return; // Stop further execution if the account is suspended
		}

		// Store the token
		localStorage.setItem('token', token);

		// Redirect based on role
		if (role === 'admin') {
			navigate('/dashboard'); // Redirect to admin dashboard
		} else if (role === 'user') {
			navigate('/Main'); // Redirect to user dashboard
		}
	} catch (error) {
		console.error(error);
		setError("La connexion a échoué! Veuillez vérifier vos informations d'identification et réessayer.");
	}
};
