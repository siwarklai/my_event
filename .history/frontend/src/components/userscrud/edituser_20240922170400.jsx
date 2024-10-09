import React, { useState, useEffect } from 'react';
import Spinner from '../Spinner';
import BackButton from '../BackButton';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EditUser = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [ID, setID] = useState('');
  const [status, setStatus] = useState('active');
  const [loading, setLoading] = useState(true); // Start loading as true
  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    axios.get(`http://localhost:8080/api/users/${id}`)
      .then((response) => {
        const userData = response.data;
        setFirstName(userData.firstName);
        setLastName(userData.lastName);
        setEmail(userData.email);
        setPosition(userData.position);
        setPhone(userData.phone);
        
        setID(userData.ID);
        setStatus(userData.status || 'active'); // Default to 'active' if not set
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar('Error loading user data', { variant: 'error' });
        console.log(error);
      });
  }, [id, enqueueSnackbar]);

  const handleEditUser = () => {
    if (!firstName || !lastName || !email || !position || !phone || !ID) {
      window.alert('Veuillez remplir tous les champs');
      enqueueSnackbar('Please fill all fields', { variant: 'warning' });
      return;
    }

    const data = {
      firstName,
      lastName,
      email,
      position,
      phone,
      ID,
      status,
    };

    setLoading(true);
    axios
      .put(`http://localhost:8080/api/users/${id}`, data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('User edited successfully', { variant: 'success' });
        window.alert('Utilisateur modifié avec succès');
        navigate('/admin/user');
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error.response?.data?.message || 'Erreur lors de la modification de l’utilisateur';
        enqueueSnackbar(errorMessage, { variant: 'error' });
        window.alert(`Error: ${errorMessage}`);
        console.log('Error details:', error.response?.data);
      });
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Modifier utilisateur</h1>
      {loading && <Spinner />}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Prénom</label>
          <input
            type='text'
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Nom</label>
          <input
            type='text'
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Numéro carte d'identité</label>
          <input
            type='text'
            value={ID}
            onChange={(e) => setID(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Position</label>
          <input
            type='text'
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Numéro de téléphone</label>
          <input
            type='text'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-2xl mr-4 text-black'>Status</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          >
            <option value='active'>Active</option>
            <option value='suspendu'>Suspendu</option>
          </select>
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleEditUser}>
          Save
        </button>
      </div>
    </div>
  );
};

export default EditUser;
