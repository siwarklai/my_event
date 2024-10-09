import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const Login = () => {
	const [data, setData] = useState({ email: "", password: "" });
	const [error, setError] = useState("");

	const handleChange = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
		setError(""); // Clear error on input change
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post('http://localhost:8080/api/auth', data);
			const { data: token, role,status } = response.data;
			console.log(role,"role")
			// Store the token
			localStorage.setItem('token', token);

			// Redirect based on role
			if (role === 'admin') {
				// Redirect to the admin dashboard
				window.location.href = '/dashboard';
			} else if (role === 'user') {
				// Redirect to the user dashboard
				window.location.href = '/Main';
			} else {
				console.log('here');
			}
		} catch (error) {
			console.error(error);
			setError("Login failed! Please check your credentials and try again.");
		}
	};

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1 style={{ color: '#13315C' }}>Welcome</h1>

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
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Sign In
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
