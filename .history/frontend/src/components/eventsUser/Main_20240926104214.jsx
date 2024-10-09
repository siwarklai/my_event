import React, {useEffect, useState} from 'react';
import axios from 'axios';
import Spinner from '../Spinner';
import {Link} from 'react-router-dom';
import {AiOutlineEdit} from 'react-icons/ai';
import {BsInfoCircle} from 'react-icons/bs';
import {MdOutlineAddBox, MdOutlineDelete} from 'react-icons/md';
import styles from "./styles.module.css";

function Main() {
    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("lastVisitedPath"); // Clear the last visited path
        window.location.href = "/Login";
    };
    useEffect(() => {
        const token = localStorage.getItem('token'); // Retrieve the token for authenticated requests
        setLoading(true);
        axios
          .get('http://localhost:8080/api/events', {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((response) => {
            setEvents(response.data);
            setLoading(false);
          })
          .catch((error) => {
            console.log(error.response?.data?.message || error.message);
            setLoading(false);
          });
      }, []);
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
            </div>
  )
}

export default Main