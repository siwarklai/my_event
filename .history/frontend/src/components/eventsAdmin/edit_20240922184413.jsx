import React, { useState, useEffect } from 'react';
import BackButton from '../BackButton';
import Spinner from '../Spinner';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const Editevent = () => {
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
    axios.get(`http://localhost:8080/api/events/${id}`)
      .then((response) => {
        const { nom, type, lieu, codePostale, dateDebut, dateFin, budget } = response.data;
        setNom(nom);
        setType(type);
        setLieu(lieu);
        setCodePostale(codePostale);
        setDateDebut(new Date(dateDebut).toISOString().substring(0, 10)); // Format date for input
        setDateFin(new Date(dateFin).toISOString().substring(0, 10)); // Format date for input
        setBudget(budget);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('An error occurred. Please check the console.', { variant: 'error' });
        window.alert('An error occurred while fetching event details. Please try again later.');
        console.log(error);
      });
  }, [id, enqueueSnackbar]);
  

    const handleEditEvent = () => {
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
      .put(`http://localhost:8080/api/events/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('Event updated successfully', { variant: 'success' });
        window.alert('Événement mis à jour avec succès');
        navigate('/admin/event'); // Navigate to the list of events or any desired route
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error updating event', { variant: 'error' });
        window.alert('Une erreur est produite lors de la mise à jour de lévénement
');
        console.log(error);
      });
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Editer événement</h1>
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

export default Editevent;
