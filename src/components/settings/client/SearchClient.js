import React, { useState, useEffect, forwardRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { XIcon, UserIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';
import { getClientList } from '../../../redux/actions/utilitiesActions';

const SearchClient = forwardRef(
  (
    { id, name, type, placeholder, className, returnClient, selectedClientId },
    ref
  ) => {
    const [filteredData, setFilteredData] = useState([]);
    const [enteredData, setEnteredData] = useState();
    const [selectedDataSrc, setSelectedDataSrc] = useState('');
    const [selectedDataAlt, setSelectedDataAlt] = useState('');
    const [returnClientData, setReturnClientData] = useState();

    const dispatch = useDispatch();

    const clientListGet = useSelector((state) => state.clientListGet);
    const { client } = clientListGet;

    const handleOnFilter = (e) => {
      const data = e.currentTarget.value;

      setSelectedDataAlt(data);

      setEnteredData(data);

      if (client) {
        const newFilterClientName = client.filter((client) => {
          const clientName = client.clientName;
          return clientName.toLowerCase().includes(data.toLowerCase());
        });

        const newFilterClientEmail = client.filter((client) => {
          return client.clientEmail.toLowerCase().includes(data.toLowerCase());
        });

        if (data === '') {
          setFilteredData([]);
        } else {
          setFilteredData(
            newFilterClientName.length >= 1
              ? newFilterClientName
              : newFilterClientEmail
          );
        }
      }
    };

    const handleOnSelectedData = (e) => {
      setFilteredData([]);
      setEnteredData('');
      setSelectedDataSrc(e.currentTarget.querySelector('img').src);
      setSelectedDataAlt(e.currentTarget.querySelector('img').alt);
      selectedClientId(e.currentTarget.querySelector('p').id);
    };

    const handleClearSelectedData = () => {
      setSelectedDataSrc();
      setSelectedDataAlt('');
    };

    const handleClearSelection = () => {
      setReturnClientData('');
    };

    useEffect(() => {
      if (client === undefined || client.length === 0) {
        dispatch(getClientList());
      }
      if (returnClient) {
        setReturnClientData(returnClient);
      }
    }, [dispatch, returnClient, selectedDataAlt.length]);

    return (
      <>
        <div className='flex relative'>
          {!selectedDataSrc && (
            <UserIcon
              className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
              aria-hidden='true'
            />
          )}

          {selectedDataSrc && selectedDataSrc ? (
            <img
              className='mt-2 ml-3 absolute rounded-full'
              src={selectedDataSrc}
              alt={selectedDataSrc}
              width='34'
              height='34'
            />
          ) : returnClientData ? (
            <img
              className='mt-2 ml-3 absolute rounded-full'
              src={returnClientData.accountProfileUploaded}
              alt={returnClientData.clientName}
              width='34'
              height='34'
            />
          ) : null}
          <input
            autocomplete='nope'
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={
              selectedDataAlt
                ? selectedDataAlt
                : returnClientData && returnClientData.clientName
            }
            className={`${className} ${
              selectedDataSrc ? 'pl-14' : returnClientData ? 'pl-11' : ''
            }`}
            ref={ref}
            onChange={handleOnFilter}
            onClick={(e) => handleClearSelection(e)}
          />
          {selectedDataAlt && (
            <div
              className='mt-2 mr-2 p-2 absolute top-0 right-0 rounded-full cursor-pointer hover:text-primary hover:bg-primary hover:bg-opacity-10 transition ease-in-out'
              onClick={handleClearSelectedData}
              title='clear'
            >
              <XIcon
                className='w-4 h-4 font-bold opacity-90'
                aria-hidden='true'
              />
            </div>
          )}
        </div>
        {enteredData && (
          <motion.div
            className='w-full bg-white mt-1 mr-4 p-4 absolute shadow-lg rounded-md overflow-hidden'
            style={{ zIndex: '50' }}
          >
            {filteredData &&
              filteredData.map((client) => (
                <motion.div
                  key={client._id}
                  className='flex items-center rounded-md cursor-pointer'
                  onClick={(e) => handleOnSelectedData(e)}
                >
                  <img
                    className='rounded-full'
                    src={client.accountProfileUploaded}
                    alt={client.clientName}
                    width='30'
                    height='30'
                  />
                  <p
                    id={client._id}
                    className='text-xs text-grey font-semibold ml-1 flex flex-col'
                    style={{ lineHeight: '12px' }}
                  >
                    {client.clientName}
                  </p>
                  <motion.p
                    className='bg-primary bg-opacity-20 text-xxs text-primary font-bold ml-auto py-2 px-3 flex flex-col relative rounded-md'
                    style={{ lineHeight: '13px' }}
                  >
                    {client.clientEmail}
                  </motion.p>
                </motion.div>
              ))}
          </motion.div>
        )}
      </>
    );
  }
);

export default SearchClient;
