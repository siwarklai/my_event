import styles from "./styles.module.css";
import { Link } from "react-router-dom";
import React from 'react';

const Dashboard = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("lastVisitedPath"); // Clear the last visited path
		window.location.href = "/Login";
	};

	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>Dashboard</h1>
				
				<ul>
				<li>
                        <Link to="/dashboard">Home</Link>
                    </li>
					<li>
						<Link to="/admin/user">Users</Link>
					</li>
					<li>
						<Link to="/admin/event">Events</Link>
					</li>
				</ul>
				<button className={styles.white_btn} onClick={handleLogout}>
					Logout
				</button>
			</nav>
		</div>
	);
};

export default Dashboard;
