import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import {Link} from 'react-router-dom';
import {AiOutlineEdit} from 'react-icons/ai';
import {BsInfoCircle} from 'react-icons/bs';
import {MdOutlineAddBox, MdOutlineDelete} from 'react-icons/md';
import styles from "./styles.module.css";

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
            <nav className={styles.navbar}>
                <h1 className='text-3xl my-8'> événements</h1>
                
                <ul>
                    <li>
                        <Link to="/user/Main">Acceuil</Link>
                    </li>
                    <li>
                        <Link to="/user/events">événements</Link>
                    </li>
                </ul>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Déconnexion
                </button>
            </nav>
            </div>,
        <div className={styles.content}>
        {loading ? (
            <Spinner />
        ) : error ? (
            <p className={styles.error}>{error}</p>
        ) : upcomingEvent ? (
            <div className="upcoming-event bg-gray-100 p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Prochain événement:</h2>
                <p><strong>Nom:</strong> {upcomingEvent.nom}</p>
                <p><strong>Date:</strong> {new Date(upcomingEvent.dateDebut).toLocaleDateString()}</p>
                <p><strong>Lieu:</strong> {upcomingEvent.lieu}</p>
                <p><strong>Type:</strong> {upcomingEvent.type}</p>
            </div>
        ) : (
            <p>Aucun événement à venir dans les deux prochaines semaines.</p>
        )}
    </div>
    </div>
    );
    }
  

export default Main