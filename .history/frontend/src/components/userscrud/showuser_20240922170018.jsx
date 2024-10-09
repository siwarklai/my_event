import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

import Spinner from '../Spinner';
import BackButton from '../BackButton';

const ShowUser = () => {
  const [user, setUser] = useState(null); // Initialize with null for better loading state handling
  const [loading, setLoading] = useState(true); // Start loading as true
  const { id } = useParams();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Show User</h1>
      {loading ? (
        <Spinner />
      ) : user ? ( // Check if user data exists
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4 bg-white'>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Id:</span>
            <span>{user._id}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>First Name:</span>
            <span>{user.firstName}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Last Name:</span>
            <span>{user.lastName}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Email:</span>
            <span>{user.email}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Carte d'identité:</span>
            <span>{user.ID}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Phone:</span>
            <span>{user.phone}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Position:</span>
            <span>{user.position}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Créé à:</span>
            <span>{new Date(user.createdAt).toLocaleString()}</span> {/* Use toLocaleString for better formatting */}
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Last Updated At:</span>
            <span>{new Date(user.updatedAt).toLocaleString()}</span> {/* Use toLocaleString for better formatting */}
          </div>
        </div>
      ) : (
        <p>User not found.</p> // Handle case where user does not exist
      )}
    </div>
  );
};

export default ShowUser;
