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
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/events/${id}`)
      .then((response) => {
        setEvent(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Show Event</h1>
      {loading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col border-2 border-sky-400 rounded-xl w-fit p-4 '>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>ID</span>
            <span>{event._id}</span>
          </div>
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
            <span>{event.budget }</span>
            <span> DT</span>
          </div>
          
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Created At</span>
            <span>{new Date(event.createdAt).toString()}</span>
          </div>
          <div className='my-4'>
            <span className='text-xl mr-4 text-gray-500'>Last Updated At</span>
            <span>{new Date(event.updatedAt).toString()}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowEvent;
