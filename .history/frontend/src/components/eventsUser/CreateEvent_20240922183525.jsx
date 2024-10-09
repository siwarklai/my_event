import React, { useState } from 'react';
import BackButton from '../BackButton';
import Spinner from '../Spinner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const CreateEvent = () => {
  const [nom, setnom] = useState('');
  const [type, setType] = useState('');
  const [lieu, setLieu] = useState('');
  const [codePostale, setCodePostale] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSaveEvent = () => {
    if (!nom || !type || !lieu || !codePostale || !dateDebut || !dateFin || !budget) {
      window.alert('Please fill in all fields');
      return;
    }

    const data = {
      nom,
      type,
      lieu,
      codePostale,
      dateDebut,
      dateFin,
      budget,
  };
    setLoading(true);
    axios
      .post("http://localhost:8080/api/events", data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Event Created successfully', { variant: 'success' });
        window.alert('Event Created successfully');
        navigate('setLoading(true);
    axios
      .post("http://localhost:8080/api/events", data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Event Created successfully', { variant: 'success' });
        window.alert('Event Created successfully');
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error', { variant: 'error' });
        window.alert('Error occurred while creating event');
        console.log(error);
      });
  };')
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error', { variant: 'error' });
        window.alert('Error occurred while creating event');
        console.log(error);
      });
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Créer événement</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto '>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Objet</label>
          <input
            type='text'
            value={nom}
            onChange={(e) => setnom(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Type</label>
          <input
            type='text'
            value={type}
            onChange={(e) => setType(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Lieu</label>
          <input
            type='text'
            value={lieu}
            onChange={(e) => setLieu(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Code Postale</label>
          <input
            type='number'
            value={codePostale}
            onChange={(e) => setCodePostale(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
            min="1000"
            max="9999"
          />
        </div>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Date Debut</label>
          <input
            type='date'
            value={dateDebut}
            onChange={(e) => setDateDebut(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Date Fin</label>
          <input
            type='date'
            value={dateFin}
            onChange={(e) => setDateFin(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Budget</label>
          <div className='relative'>
            <input
              type='number'
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className='border-2 border-gray-500 px-4 py-2 w-full pr-10' // Added pr-10 for padding-right
            />
            <span className='absolute right-2 top-1/2 transform -translate-y-1/2 text-xl text-gray-500'>DT</span>
          </div>
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleSaveEvent}>
          Save
        </button>
      </div>
    </div>
  );
};

export default CreateEvent;
