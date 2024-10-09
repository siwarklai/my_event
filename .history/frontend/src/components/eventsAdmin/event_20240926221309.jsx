import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import styles from "./styles.module.css";

const Evadmin = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("lastVisitedPath"); // Clear the last visited path
        window.location.href = "/Login";
    };

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true); // Start with loading true
    const [error, setError] = useState(null); // For error handling

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/events');
                setEvents(response.data.data); // Adjust based on your actual API response structure
            } catch (error) {
                console.error(error);
                setError('Failed to fetch events. Please try again later.');
            } finally {
                setLoading(false); // Set loading to false whether the fetch succeeds or fails
            }
        };

        fetchEvents();
    }, []);

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1 className='text-3xl my-8'>Événements</h1>
                <ul>
                    <li>
                        <Link to="/dashboard">Accueil</Link>
                    </li>
                    <li>
                        <Link to="/admin/user">Utilisateurs</Link>
                    </li>
                    <li>
                        <Link to="/admin/event">Événements</Link>
                    </li>
                </ul>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Déconnexion
                </button>
            </nav>
            <div className='flex justify-end p-4'>
                <Link to='/admin/event/create'>
                    <MdOutlineAddBox className='text-sky-800 text-4xl' />
                </Link>
            </div>
            {loading ? (
                <Spinner />
            ) : error ? (
                <div className='text-red-600 text-center'>{error}</div> // Display error message
            ) : (
                <table className='w-full border-separate border-spacing-2'>
                    <thead>
                        <tr>
                            <th className='border border-slate-600 rounded-md'>NO</th>
                            <th className='border border-slate-600 rounded-md'>Nom</th>
                            <th className='border border-slate-600 rounded-md'>Type</th>
                            <th className='border border-slate-600 rounded-md'>Lieu</th>
                            <th className='border border-slate-600 rounded-md max-md:hidden'>Code Postale</th>
                            <th className='border border-slate-600 rounded-md max-md:hidden'>Date Début</th>
                            <th className='border border-slate-600 rounded-md max-md:hidden'>Date Fin</th>
                            <th className='border border-slate-600 rounded-md max-md:hidden'>Budget</th>
                            <th className='border border-slate-600 rounded-md'>Opérations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event, index) => (
                            <tr key={event._id} className='h-8'>
                                <td className='border border-slate-700 rounded-md text-center'>{index + 1}</td>
                                <td className='border border-slate-700 rounded-md text-center'>{event.nom}</td>
                                <td className='border border-slate-700 rounded-md text-center'>{event.type}</td>
                                <td className='border border-slate-700 rounded-md text-center'>{event.lieu}</td>
                                <td className='border border-slate-700 rounded-md text-center max-md:hidden'>{event.codePostale}</td>
                                <td className='border border-slate-700 rounded-md text-center max-md:hidden'>{new Date(event.dateDebut).toLocaleDateString()}</td>
                                <td className='border border-slate-700 rounded-md text-center max-md:hidden'>{new Date(event.dateFin).toLocaleDateString()}</td>
                                <td className='border border-slate-700 rounded-md text-center max-md:hidden'>{event.budget} DT</td>
                                <td className='border border-slate-700 rounded-md text-center'>
                                    <div className='flex justify-center gap-x-4'>
                                        <Link to={`/admin/event/details/${event._id}`}>
                                            <BsInfoCircle className='text-2xl text-green-800' />
                                        </Link>
                                        <Link to={`/admin/event/edit/${event._id}`}>
                                            <AiOutlineEdit className='text-2xl text-yellow-600' />
                                        </Link>
                                        <Link to={`/admin/event/delete/${event._id}`}>
                                            <MdOutlineDelete className='text-2xl text-red-600' />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Evadmin;
