import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../BackButton';
import Spinner from '../Spinner';

const ShowEvent = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/events/${id}`)
      .then((response) => {
        setEvent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        setError('An error occurred while fetching event details. Please try again.');
        setLoading(false);
        console.error(error);
      });
  }, [id]);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className='text-red-500'>{error}</div>;
  }

  if (!event) {
    return <div>No event found</div>;
  }

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Informations Événement</h1>
      <div className='flex items-center justify-center min-h-screen'>
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4 bg-white'>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Nom</span>
            <span>{event.nom}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Type</span>
            <span>{event.type}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Lieu</span>
            <span>{event.lieu}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Code Postale</span>
            <span>{event.codePostale}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Date Début</span>
            <span>{new Date(event.dateDebut).toLocaleDateString()}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Date Fin</span>
            <span>{new Date(event.dateFin).toLocaleDateString()}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Budget</span>
            <span>{event.budget} DT</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Créé le</span>
            <span>{new Date(event.createdAt).toLocaleString()}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Dernière mise à jour</span>
            <span>{new Date(event.updatedAt).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowEvent;
