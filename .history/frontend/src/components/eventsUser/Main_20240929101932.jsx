import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import styles from "./styles.module.css"; // Ensure the file name is correct
const mongoose = require('mongoose');

function Main() {
    const [upcomingEvent, setUpcomingEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch the upcoming event within two weeks
    useEffect(() => {
        const fetchUpcomingEvent = async () => {
          setLoading(true); // Set loading to true before the fetch
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
      
            // Provide more specific error messages based on API response codes
            if (err.response && err.response.status === 401) {
              errorMessage = 'Unauthorized: Invalid or expired token.';
            } else if (err.response && err.response.status === 404) {
              errorMessage = 'No upcoming events found.';
            } else {
              errorMessage = 'An error occurred while fetching events.';
            }
      
            setError(errorMessage);
          } finally {
            setLoading(false); // Set loading to false after the fetch
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
            <div  className="card" style={{ width: '18rem' }}>
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
