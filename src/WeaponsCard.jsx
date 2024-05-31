import React from 'react';

const WeaponsCard = ({ image, name, price }) => {
  return (
    <div className="bg-gray-800 text-white p-4 rounded-lg shadow-md cursor-pointer relative min-w-[200px] w-full sm:w-auto">
      <img src={image} alt={name} className="w-full h-60 object-cover rounded-lg mb-4" />
      <div className="text-lg font-bold mb-2">{name}</div>
      <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-lg animate-pulse">
        <span className="font-bold">{price}</span>
      </div>
      <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 w-full">
        Mint
      </button>
    </div>
  );
};

export default WeaponsCard;
