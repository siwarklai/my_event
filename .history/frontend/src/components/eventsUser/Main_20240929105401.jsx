import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import styles from "./styles.module.css";

function Main() {
    const [upcomingEvent, setUpcomingEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUpcomingEvent = async () => {
    try {
        const token = localStorage.getItem("token"); // Ensure the token exists in localStorage
        if (!token) {
            throw new Error("No token found. Please log in again.");
        }

        const response = await axios.get('http://localhost:8080/api/events/upcoming-event', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        console.log(response.data); // Check the fetched upcoming event data
    } catch (error) {
        console.error("Error fetching upcoming event:", error);
    }
};


    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("lastVisitedPath");
        window.location.href = "/Login";
    };

    return (
        <div className={styles.main_container}>
            {/* Navbar */}
            <nav className={styles.navbar}>
                <h1 className={styles.title}>Événements</h1>
                <ul className={styles.nav_list}>
                    <li>
                        <Link to="/user/Main" className={styles.nav_link}>Acceuil</Link>
                    </li>
                    <li>
                        <Link to="/user/events" className={styles.nav_link}>Événements</Link>
                    </li>
                </ul>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Déconnexion
                </button>
            </nav>

            {/* Bootstrap Card */}
            <div className="card mb-3" style={{ maxWidth: '540px' }}>
                <img className="card-img-top" src="upcoming.png" alt="Card image cap" />
                <div className="card-body">
                    <h5 className="card-title">Upcoming Event</h5>
                    <p className="card-text">
                        {upcomingEvent ? (
                            <>
                                <strong>{upcomingEvent.nom}</strong> 
                                <br />
                                Start Date: {new Date(upcomingEvent.dateDebut).toLocaleDateString()}
                                <br />
                                End Date: {new Date(upcomingEvent.dateFin).toLocaleDateString()}
                            </>
                        ) : (
                            loading ? <Spinner /> : <span>{error || 'No upcoming events found.'}</span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Main;
