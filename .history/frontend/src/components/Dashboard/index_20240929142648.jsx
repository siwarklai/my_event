import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import React from 'react';

const Dashboard = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("lastVisitedPath"); 
		window.location.href = "/Login";
	};

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>Dashboard</h1>
				
				<ul>
				<li>
                        <Link to="/dashboard">Acceuil</Link>
                    </li>
					<li>
						<Link to="/admin/user">Utilisateurs</Link>
					</li>
					<li>
						<Link to="/admin/event">événements</Link>
					</li>
				</ul>
				<button className={styles.white_btn} onClick={handleLogout}>
					Déconnexion
				</button>
			</nav>
		</div>
	);
};

export default Dashboard;
