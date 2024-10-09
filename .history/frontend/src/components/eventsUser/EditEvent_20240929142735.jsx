import React, { useState, useEffect } from 'react';
import BackButton from '../BackButton';
import Spinner from '../Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditEvent = () => {
  const [nom, setNom] = useState('');
  const [type, setType] = useState('');
  const [lieu, setLieu] = useState('');
  const [codePostale, setCodePostale] = useState('');
  const [dateDebut, setDateDebut] = useState('');
  const [dateFin, setDateFin] = useState('');
  const [budget, setBudget] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem('token'); 
    axios.get(`http://localhost:8080/api/events/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    })
      .then((response) => {
        const { nom, type, lieu, codePostale, dateDebut, dateFin, budget } = response.data;
        setNom(nom);
        setType(type);
        setLieu(lieu);
        setCodePostale(codePostale);
        setDateDebut(new Date(dateDebut).toISOString().substring(0, 10)); 
        setDateFin(new Date(dateFin).toISOString().substring(0, 10)); 
        setBudget(budget);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error.response?.data?.message || 'Une erreur s\'est produite lors de la récupération des détails de l\'événement.';
        enqueueSnackbar(errorMessage, { variant: 'error' });
        console.log(error);
      });
  }, [id, enqueueSnackbar]);

  const handleEditEvent = () => {
    if (!nom || !type || !lieu || !codePostale || !dateDebut || !dateFin || !budget) {
      window.alert('Please fill in all fields');
      return;
    }

    
    if (isNaN(codePostale) || isNaN(budget)) {
      window.alert('Code Postale and Budget must be numeric values');
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
    const token = localStorage.getItem('token'); // Get token from local storage

    axios
      .put(`http://localhost:8080/api/events/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`, // Add Authorization header with JWT token
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar('L\'événement a été mis à jour avec succès', { variant: 'success' });
        navigate('/user/events');
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error.response?.data?.message || 'Une erreur s\'est produite lors de la mise à jour de l\'événement.';
        enqueueSnackbar(errorMessage, { variant: 'error' });
        console.log(error);
      });
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Éditer événement</h1>
      {loading ? <Spinner /> : ''}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Nom</label>
          <input
            type='text'
            value={nom}
            onChange={(e) => setNom(e.target.value)}
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
          <label className='text-2xl mr-4 text-black'>Date Début</label>
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

        <button className='p-2 bg-sky-300 m-8' onClick={handleEditEvent}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditEvent;
