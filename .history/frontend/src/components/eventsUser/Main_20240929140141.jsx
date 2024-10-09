import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import {Link} from 'react-router-dom';
import {AiOutlineEdit} from 'react-icons/ai';
import {BsInfoCircle} from 'react-icons/bs';
import {MdOutlineAddBox, MdOutlineDelete} from 'react-icons/md';
import styles from "./styles.module.css";

const UpcomingEvents = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true); // State for loading

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/events'); // Adjust to your API route
                const data = response.data;

                // Filter and set upcoming events in state
                const upcoming = data.data.filter(event => { // Assuming your response structure has a 'data' field
                    const eventDate = new Date(event.dateDebut); // Use the correct date field
                    const now = new Date();
                    const twoWeeksFromNow = new Date(now);
                    twoWeeksFromNow.setDate(now.getDate() + 14);
                    return eventDate >= now && eventDate <= twoWeeksFromNow;
                });
                setEvents(upcoming);
            } catch (error) {
                console.error("Error fetching events:", error);
            } finally {
                setLoading(false); // Set loading to false after fetching
            }
        };

        fetchEvents();
    }, []);

    if (loading) {
        return <Spinner />; // Display spinner while loading
    }

    return (
        <div>
            <h2>Upcoming Events</h2>
            <ul>
                {events.map(event => (
                    <li key={event._id}>{event.nom} - {new Date(event.dateDebut).toLocaleDateString()}</li> // Adjust fields as needed
                ))}
            </ul>
        </div>
    );
};

const Main = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("lastVisitedPath"); // Clear the last visited path
        window.location.href = "/Login"; // Redirect to login
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
            <UpcomingEvents />
            </div>
  )
}

export default Main