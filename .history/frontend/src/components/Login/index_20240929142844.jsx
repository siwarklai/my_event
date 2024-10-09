import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Removed unused `Link`
import styles from "./styles.module.css";

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");
	const navigate = useNavigate(); // Use the navigate hook for redirection

	const handleChange = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
		setError(""); // Clear error on input change
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
		  const response = await axios.post("http://localhost:8080/api/auth", data);
		  const { data: token, role, status } = response.data;
	   
		  if (status === 'suspendu') {
			setError("Votre compte est verrouillé en raison de plusieurs tentatives de connexion infructueuses. Veuillez contacter l'administrateur.");
			return;  
		  }
	   
		  localStorage.setItem('token', token);
	   
		  if (role === 'admin') {
			navigate('/dashboard');  
		  } else if (role === 'user') {
			navigate('/Main'); // Redirect to user dashboard
		  } else {
			setError("Rôle invalide.");
		  }
		} catch (error) {
		  // Handle other errors (e.g. invalid credentials, server errors)
		  if (error.response && error.response.status === 403 && error.response.data.status === 'suspendu') {
			setError("Votre compte est verrouillé. Veuillez contacter l'administrateur.");
		  } else {
			setError("La connexion a échoué! Veuillez vérifier vos informations d'identification et réessayer.");
		  }
		}
	  };
	  
	  

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1 style={{ color: '#13315C' }}>Bienvenue</h1>

						<input
							type="email"
							placeholder="Email"
							name="email"
							onChange={handleChange}
							value={data.email}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Mot de passe"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Connexion
						</button>
					</form>
				</div>
				<div className={styles.right}>
					{/* You can add additional content here if needed */}
				</div>
			</div>
		</div>
	);
};

export default Login;
