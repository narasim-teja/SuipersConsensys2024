import React from 'react';

const CardInfo = ({ onClose, image, info, price, type, assault, heal, shield, level, onMint }) => {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg shadow-md relative flex flex-col sm:flex-row max-w-2xl w-full mx-4">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <img src={image} alt="Hero" className="w-full sm:w-1/2 h-auto object-cover rounded-lg mb-4 sm:mb-0 sm:mr-4" />
        <div className="flex flex-col justify-between sm:w-1/2">
          <div>
            <h2 className="text-xl font-bold mb-4">Hero Information</h2>
            <p className="mb-4">{info}</p>
            <div className="text-lg font-semibold mb-2">Type: <span className="text-blue-500">{type}</span></div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Assault:</span>
              <span className="text-blue-500">{assault}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Heal:</span>
              <span className="text-green-500">{heal}</span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="font-semibold">Shield:</span>
              <span className="text-red-500">{shield}</span>
            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="font-semibold">Level:</span>
              <span className="font-bold">{level}</span>
            </div>
            <div className="text-lg font-semibold mb-4">Current Price: <span className="text-blue-500">{price}</span></div>
          </div>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 sm:mt-0"
            onClick={() => onMint(type, assault)} // Call onMint with the hero type and assault value
          >
            BUY/Mint
          </button>
        </div>
      </div>
    </div>
  );
};

export default CardInfo;
