import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import styles from "./styles.module.css";

const Event = () => {
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("lastVisitedPath"); // Clear the last visited path
        window.location.href = "/Login";
    };

    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:8080/api/events')
            .then((Response) => {
                setEvents(Response.data.data);
                setLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setLoading(false);
            });
    }, []);

    return (
        <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1 className='text-4xl my-8'>Events</h1>
                <ul className='text-2xl'>
                    <li className='my-2'>
                        <Link to="/Main">Home</Link>
                    </li>
                </ul>
                <button className={`${styles.white_btn} text-xl p-4`} onClick={handleLogout}>
                    Logout
                </button>
            </nav>
            <div className='flex justify-end p-4'>
                <Link to='/events/create'>
                    <MdOutlineAddBox className='text-sky-800 text-4xl' />
                </Link>
            </div>
            {loading ? (
                <Spinner />
            ) : (
                <table className='w-full border-separate border-spacing-2'>
                    <thead>
                        <tr>
                            <th className='border border-slate-600 rounded-md text-lg'>NO</th>
                            <th className='border border-slate-600 rounded-md text-lg'>Nom</th>
                            <th className='border border-slate-600 rounded-md text-lg'>Type</th>
                            <th className='border border-slate-600 rounded-md text-lg'>Lieu</th>
                            <th className='border border-slate-600 rounded-md text-lg max-md:hidden'>Code Postale</th>
                            <th className='border border-slate-600 rounded-md text-lg max-md:hidden'>Date Début</th>
                            <th className='border border-slate-600 rounded-md text-lg max-md:hidden'>Date Fin</th>
                            <th className='border border-slate-600 rounded-md text-lg max-md:hidden'>Budget</th>
                            <th className='border border-slate-600 rounded-md text-lg'>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event, index) => (
                            <tr key={event._id} className='h-10'>
                                <td className='border border-slate-700 rounded-md text-center'>{index + 1}</td>
                                <td className='border border-slate-700 rounded-md text-center'>{event.nom}</td>
                                <td className='border border-slate-700 rounded-md text-center'>{event.type}</td>
                                <td className='border border-slate-700 rounded-md text-center'>{event.lieu}</td>
                                <td className='border border-slate-700 rounded-md text-center max-md:hidden'>{event.codePostale}</td>
                                <td className='border border-slate-700 rounded-md text-center max-md:hidden'>{new Date(event.dateDebut).toLocaleDateString()}</td>
                                <td className='border border-slate-700 rounded-md text-center max-md:hidden'>{new Date(event.dateFin).toLocaleDateString()}</td>
                                <td className='border border-slate-700 rounded-md text-center max-md:hidden'>{event.budget} DT</td>
                                <td className='border border-slate-700 rounded-md text-center'>
                                    <div className='flex justify-center gap-x-6'>
                                        <Link to={`/events/details/${event._id}`}>
                                            <BsInfoCircle className='text-3xl text-green-800'/>
                                        </Link>
                                        <Link to={`/events/edit/${event._id}`}>
                                            <AiOutlineEdit className='text-3xl text-yellow-600'/>
                                        </Link>
                                        <Link to={`/events/delete/${event._id}`}>
                                            <MdOutlineDelete className='text-3xl text-red-600'/>
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

export default Event;
