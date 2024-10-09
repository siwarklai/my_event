import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import styles from "./styles.module.css"; // Ensure the file name is correct

function Main() {
    const [upcomingEvent, setUpcomingEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the upcoming event within two weeks
    useEffect(() => {
        const fetchUpcomingEvent = async () => {
            const token = localStorage.getItem("token"); // Retrieve the token from local storage
    
            try {
                const response = await axios.get('http://localhost:8080/api/events/upcoming-event', {
                    headers: {
                        Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                    },
                });
                setUpcomingEvent(response.data);
            } catch (err) {
                // Log the error to see the actual response from the server
                console.error(err.response ? err.response.data : err.message);
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

            {/* Bootstrap Card */}
            <div center className="card" style={{ width: '18rem' }}>
                <div className="card-body">
                    <h5 className="card-title">Card title</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Card subtitle</h6>
                    <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
                    <a href="#" className="card-link">Card link</a>
                    <a href="#" className="card-link">Another link</a>
                </div>
            </div>
        </div>
    );
}

export default Main;
