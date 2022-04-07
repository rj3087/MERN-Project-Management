import React, { useState, useEffect, Fragment } from 'react';

export const SmartFilter = ({ filterArr, smartFilteredAttr }) => {
  const [activeFilter, SetActiveFilter] = useState();

  const handleSortItems = (e) => {
    if (e.id === 1) {
      smartFilteredAttr(e.label);
      SetActiveFilter(e.label);
    } else if (e.id === 2) {
      smartFilteredAttr(e.label);
      SetActiveFilter(e.label);
    } else if (e.id === 3) {
      smartFilteredAttr(e.label);
      SetActiveFilter(e.label);
    }

    if (e.label === activeFilter) {
      smartFilteredAttr('');
      SetActiveFilter('');
    }
  };

  return (
    <div className='pl-10 flex items-center mr-auto'>
      <h1 className='text-xs font-semibold opacity-60 mr-4'>Smart filter</h1>
      <div className='flex'>
        {filterArr.map((item) => (
          <div
            className={`${
              activeFilter === item.label
                ? 'bg-primary bg-opacity-10 text-primary border-primary opacity-100'
                : null
            } text-xxs font-semibold mr-4 py-2 px-4 border rounded-md cursor-pointer opacity-60 hover:bg-primary hover:opacity-100 hover:bg-opacity-10 hover:text-primary hover:border-primary transition duration-150 ease-in-out`}
            onClick={() => handleSortItems(item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
};
