import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import BackButton from '../BackButton';
import Spinner from '../Spinner';

const ShowEvent = () => {
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('token');  

        const response = await axios.get(`http://localhost:8080/api/events/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Set the token in the headers
          },
        });

        setEvent(response.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Informations événements</h1>
      {loading ? (
        <Spinner />
      ) : (
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
              <span>{new Date(event.dateDebut).toDateString()}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Date Fin</span>
              <span>{new Date(event.dateFin).toDateString()}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Budget</span>
              <span>{event.budget}</span>
              <span> DT</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Created At</span>
              <span>{new Date(event.createdAt).toLocaleString()}</span>
            </div>
            <div className='my-4'>
              <span className='text-xl mr-4 text-gray-500'>Last Updated At</span>
              <span>{new Date(event.updatedAt).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowEvent;
