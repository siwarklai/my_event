import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeft } from 'react-icons/bs';

const BackButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <div className='flex'>
      <button
        onClick={handleClick}
        className='bg-sky-800 text-white px-4 py-1 rounded-lg w-fit'
      >
        <BsArrowLeft className='text-2xl' />
      </button>
    </div>
  );
};

export default BackButton;