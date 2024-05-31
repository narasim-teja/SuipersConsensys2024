import React from 'react';

const Spinner = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex">
      <div className="font-bold m-auto animate-spin bg-white p-2 rounded text-gray-900">
        Loading
      </div>
    </div>
  );
};

export default Spinner;
