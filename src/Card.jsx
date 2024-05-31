import React, { useState } from 'react';
import CardInfo from './CardInfo';

const Card = ({ image, price, assault, heal, shield, level, info, type, onMint }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div
        className="bg-gray-800 text-white p-4 rounded-lg shadow-md cursor-pointer relative min-w-[200px] w-full sm:w-auto"
        onClick={() => setIsModalOpen(true)}
      >
        <img src={image} alt="Hero" className="w-full h-40 object-cover rounded-lg mb-4" />
        <div className="absolute top-2 right-2 bg-blue-600 text-white px-2 py-1 rounded-lg animate-pulse">
          <span className="font-bold">{price}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Assault:</span>
          <span className="font-semibold">Heal:</span>
          <span className="font-semibold">Shield:</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-blue-500">{assault}</span>
          <span className="text-green-500">{heal}</span>
          <span className="text-red-500">{shield}</span>
        </div>
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold">Level:</span>
          <span className="font-bold">{level}</span>
        </div>
        <p className="text-center text-gray-400">Click on the card for more info</p>
      </div>
      {isModalOpen && (
        <CardInfo 
          onClose={() => setIsModalOpen(false)} 
          image={image} 
          info={info}
          price={price}
          type={type}
          assault={assault}
          heal={heal}
          shield={shield}
          level={level}
          onMint={onMint}
        />
      )}
    </>
  );
};

export default Card;
