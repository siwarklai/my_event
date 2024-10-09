import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import { Link } from 'react-router-dom';
import styles from "./styles.module.css"; // Ensure the file name is correct

function Main() {
    const [upcomingEvent, setUpcomingEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the upcoming event within two weeks
    useEffect(() => {
        const fetchUpcomingEvent = async () => {
            try {
                const response = await axios.get('/api/upcoming-event');
                setUpcomingEvent(response.data);
            } catch (err) {
                setError('No upcoming events within the next two weeks.');
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

            {/* Upcoming Event Content */}
            <div className={styles.content}>
                {loading ? (
                    <Spinner />
                ) : error ? (
                    <p className={styles.error}>{error}</p>
                ) : upcomingEvent ? (
                    <div className={styles.upcoming_event}>
                        <h2 className={styles.event_title}>Prochain événement:</h2>
                        <p><strong>Nom:</strong> {upcomingEvent.nom}</p>
                        <p><strong>Date:</strong> {new Date(upcomingEvent.dateDebut).toLocaleDateString()}</p>
                        <p><strong>Lieu:</strong> {upcomingEvent.lieu}</p>
                    </div>
                ) : (
                    <p>Aucun événement à venir dans les deux prochaines semaines.</p>
                )}
            </div>
        </div>
    );
}

export default Main;
