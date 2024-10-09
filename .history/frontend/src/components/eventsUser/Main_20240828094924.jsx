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
  return (
    <div className={styles.main_container}>
            <nav className={styles.navbar}>
                <h1 className='text-3xl my-8'> Events </h1>
                
                <ul>
                    <li>
                        <Link to="/Main">E</Link>
                    </li>
                </ul>
                <button className={styles.white_btn} onClick={handleLogout}>
                    Logout
                </button>
            </nav>
            </div>
  )
}

export default Main