import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spinner from '../Spinner';

import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';
import styles from './styles.module.css';

const UserHome = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
        
		window.location.href = "/Login";
	};
    useEffect(() => {
        setLoading(true);
        axios
            .get('http://localhost:8080/api/users')
            .then((response) => {
                setUsers(response.data.data);
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
                <h1 className='text-3xl my-8'> Utilisateurs </h1>
                
                <ul>
					<li>
						<Link to="/dashboard">Acceuil</Link>
					</li>
                    <li>
						<Link to="/admin/user">Utilisateurs</Link>
					</li>
					<li>
						<Link to="/admin/event">événement</Link>
					</li>
				</ul>
				<button className={styles.white_btn} onClick={handleLogout}>
					Déconnexion
				</button>
            </nav>
                <div className='flex justify-end p-4'>
                <Link to='/admin/user/create'>
                    <MdOutlineAddBox className='text-sky-800 text4x1' />
                </Link>
                </div>

            {loading ? (
                <Spinner />
            ) : (
                <table className='w-full border-separate border-spacing-2'>
                    <thead>
                        <tr>
                            <th className='border border-slate-600 rounded-md'>Num</th>
                            <th className='border border-slate-600 rounded-md max-md:hidden'>Status</th>
                            <th className='border border-slate-600 rounded-md'>Nom</th>
                            <th className='border border-slate-600 rounded-md '>Position</th>
                            <th className='border border-slate-600 rounded-md '>Numéro de téléphone</th>
                            <th className='border border-slate-600 rounded-md max-md:hidden'>Email</th>
                            <th className='border border-slate-600 rounded-md'>Operations</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className='h-8'>
                                <td className='border border-slate-700 rounded-md text-center'>{index + 1}</td>
                                <td className='border border-slate-700 rounded-md text-center '>{user.email}</td>
                                <td className='border border-slate-700 rounded-md text-center'>{user.firstName} {user.lastName}</td>
                                <td className='border border-slate-700 rounded-md text-center '>{user.position}</td>
                                <td className='border border-slate-700 rounded-md text-center '>{user.phone}</td>
                                <td className='border border-slate-700 rounded-md text-center '>{user.email}</td>
                                <td className='border border-slate-700 rounded-md text-center'>
                                    <div className='flex justify-center gap-x-4'>
                                        <Link to={`/admin/user/details/${user._id}`}>
                                            <BsInfoCircle className='text-2x1 text-green-800' />
                                        </Link>
                                        <Link to={`/admin/user/edit/${user._id}`}>
                                            <AiOutlineEdit className='text-2x1 text-yellow-600' />
                                        </Link>
                                        <Link to={`/admin/user/delete/${user._id}`}>
                                            <MdOutlineDelete className='text-2x1 text-red-600' />
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

export default UserHome;
