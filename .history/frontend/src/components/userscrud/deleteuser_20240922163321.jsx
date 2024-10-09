import React, { useState } from 'react';
import Spinner from '../Spinner';
import BackButton from '../BackButton';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DeleteUser = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteUser = () => {
    setLoading(true);
    axios
      .delete(`http://localhost:8080/api/users/${id}`)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('User deleted successfully', { variant: 'success' });
        navigate('frontend/src/App.jsx');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error deleting user', { variant: 'error' });
        console.log(error);
      });
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Delete User</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        <h3 className='text-2xl'>Are you sure you want to delete this user?</h3>

        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteUser}
        >
          Yes, Delete it
        </button>
      </div>
    </div>
  );
};

export default DeleteUser;