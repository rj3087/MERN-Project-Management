import React, { useState, useEffect } from 'react';
import { usePagination, DOTS } from './usePagination';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';

const Pagination = (props) => {
  const {
    handleOnPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
  } = props;

  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount,
    pageSize,
  });

  if (currentPage === 0 || paginationRange.length < 2) {
    return null;
  }

  const handleOnNext = () => {
    handleOnPageChange(currentPage + 1);
  };

  const handleOnPrevious = () => {
    handleOnPageChange(currentPage - 1);
  };

  let lastPage = paginationRange[paginationRange.length - 1];

  return (
    <ul className='w-full text-xs mx-auto flex justify-center items-center'>
      <li
        className={`font-bold mr-2 ${
          currentPage === 1
            ? 'text-darkGrey opacity-60 pointer-events-none'
            : 'text-primary opacity-100 pointer-events-auto'
        } cursor-pointer`}
        onClick={handleOnPrevious}
      >
        <ChevronLeftIcon
          title='Next Page'
          className='w-5 h-5'
          aria-hidden='true'
        />
      </li>
      {paginationRange.map((pageNumber, index) => {
        if (pageNumber === DOTS) {
          return (
            <li key={index} className='pagination-item dots'>
              &#8230;
            </li>
          );
        }

        return (
          <li
            key={index}
            className={`text-darkGrey font-bold px-2 ${
              pageNumber === currentPage
                ? 'text-3xl opacity-100'
                : 'text-3xl opacity-40'
            } cursor-pointer`}
            onClick={() => handleOnPageChange(pageNumber)}
          >
            &#x2022;
          </li>
        );
      })}
      <li
        className={`font-bold ml-2 ${
          currentPage === lastPage
            ? 'text-darkGrey opacity-60 pointer-events-none'
            : 'text-primary opacity-100 pointer-events-auto'
        } cursor-pointer`}
        onClick={handleOnNext}
      >
        <ChevronRightIcon
          title='Next Page'
          className='w-5 h-5'
          aria-hidden='true'
        />
      </li>
    </ul>
  );
};

export default Pagination;
