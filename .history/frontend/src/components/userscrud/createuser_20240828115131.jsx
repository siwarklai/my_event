import React, { useState } from 'react';
import Spinner from '../Spinner';
import BackButton from '../BackButton';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';

const CreateUser = () => {
  const [firstname, setFirstName] = useState('');
  const [lastname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ID, setID] = useState('');
  const [position, setPosition] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleSaveUser = () => {
    if (!firstname || !lastname || !email || !password || !ID || !position || !phone) {
      enqueueSnackbar('Please fill all fields', { variant: 'warning' });
      return;
    }

    const data = {
      firstName: firstname,  // Ensure field names match the backend schema
      lastName: lastname,
      email,
      password,
      ID,
      position,
      phone,
    };

    setLoading(true);
    axios
      .post("http://localhost:8080/api/users", data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar('User Created successfully', { variant: 'success' });
        navigate('/users');
        // Reset form fields
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setID('');
        setPosition('');
        setPhone('');
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error.response?.data?.message || 'Error creating user';
        enqueueSnackbar(errorMessage, { variant: 'error' });
        console.log('Error details:', error.response?.data);
      });
  };

  return (
    <div className='p-4'>
      <BackButton />
      <h1 className='text-3xl my-4'>Create User</h1>
      {loading && <Spinner />}
      <div className='flex flex-col border-2 border-sky-400 rounded-xl w-[600px] p-4 mx-auto'>
        <div className='my-4'>
          <label className='text-xl mr-4 text-black'>First Name</label>
          <input
            type='text'
            value={firstname}
            onChange={(e) => setFirstName(e.target.value)}
            className='border-2 border-black-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-black'>Last Name</label>
          <input
            type='text'
            value={lastname}
            onChange={(e) => setLastName(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-black'>Email</label>
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-black'>Password</label>
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-black'>ID</label>
          <input
            type='text'
            value={ID} // Use ID here
            onChange={(e) => setID(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-black'>Position</label>
          <input
            type='text'
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <div className='my-4'>
          <label className='text-xl mr-4 text-black'>Phone</label>
          <input
            type='text'
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className='border-2 border-gray-500 px-4 py-2 w-full'
          />
        </div>
        <button className='p-2 bg-sky-300 m-8' onClick={handleSaveUser}>
          Save
        </button>
      </div>
    </div>
  );
}

export default CreateUser;
