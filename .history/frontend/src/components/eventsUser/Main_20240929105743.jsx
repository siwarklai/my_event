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

    useEffect(() => {
        const fetchUpcomingEvent = async () => {
            try {
                const token = localStorage.getItem("token");
                console.log("Token:", token);
                if (!token) {
                    throw new Error("No token found. Please log in again.");
                }

                const response = await axios.get('http://localhost:8080/api/events/upcoming-event', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUpcomingEvent(response.data); // Set the upcoming event data
                setLoading(false); // Stop loading
            } catch (error) {
                console.error("Error fetching upcoming event:", error);
                setError(error.response?.data?.message || "An error occurred while fetching the event.");
                setLoading(false); // Stop loading even on error
            }
        };

        fetchUpcomingEvent(); // Call the fetch function
    }, []); // Run once on component mount

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
                        {loading ? (
                            <Spinner /> // Show spinner while loading
                        ) : error ? (
                            <span>{error}</span> // Show error message
                        ) : (
                            upcomingEvent ? (
                                <>
                                    <strong>{upcomingEvent.nom}</strong>
                                    <br />
                                    Start Date: {new Date(upcomingEvent.dateDebut).toLocaleDateString()}
                                    <br />
                                    End Date: {new Date(upcomingEvent.dateFin).toLocaleDateString()}
                                </>
                            ) : (
                                <span>No upcoming events found.</span> // No events case
                            )
                        )}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Main;
