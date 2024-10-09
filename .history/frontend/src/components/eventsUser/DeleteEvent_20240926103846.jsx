import React, { useState } from 'react';
import BackButton from '../BackButton';
import Spinner from '../Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const DeleteEvent = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get the event ID from URL parameters
  const { enqueueSnackbar } = useSnackbar();

  const handleDeleteEvent = () => {
    const token = localStorage.getItem('token'); // Get the token from localStorage

    setLoading(true);
    axios
      .delete(`http://localhost:8080/api/events/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Événement supprimé avec succès', { variant: 'success' });
        navigate('/user/events'); // Navigate to the events listing page
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Erreur lors de la suppression de l\'événement', { variant: 'error' });
        console.log(error.response?.data?.message || error.message); // Log the error details for debugging
      });
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Supprimer événement</h1>
      {loading && <Spinner />} {/* Conditionally render the spinner */}
      <div className='flex flex-col items-center border-2 border-sky-400 rounded-xl w-[600px] p-8 mx-auto'>
        <h3 className='text-2xl'>Êtes-vous sûr de vouloir supprimer cet événement ?</h3>
        <button
          className='p-4 bg-red-600 text-white m-8 w-full'
          onClick={handleDeleteEvent}
          disabled={loading} // Disable button when loading
        >
          Oui, supprimez-le
        </button>
      </div>
    </div>
  );
};

export default DeleteEvent;
