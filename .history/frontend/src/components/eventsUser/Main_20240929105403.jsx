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
            setLoading(true); 
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get('http://localhost:8080/api/events/upcoming-event', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUpcomingEvent(response.data);
            } catch (err) {
                console.error(err.response ? err.response.data : err.message);
                let errorMessage;

                if (err.response && err.response.status === 401) {
                    errorMessage = 'Unauthorized: Invalid or expired token.';
                } else if (err.response && err.response.status === 404) {
                    errorMessage = 'No upcoming events found.';
                } else if (err.response && err.response.status === 400) {
                    errorMessage = 'Invalid Event ID';
                } else {
                    errorMessage = 'An error occurred while fetching events.';
                }

                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchUpcomingEvent();
    }, []);

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
