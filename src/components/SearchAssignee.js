import React, { useState, useEffect, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { XIcon } from '@heroicons/react/outline';

const jobTitleDivMotion = {
  rest: { background: '#fff' },
  hover: {
    background: '#f5f5f5',
    transition: {
      duration: 0.4,
      type: 'spring',
      stiffness: 120,
      ease: 'easeInOut',
    },
  },
};

const jobTitleIconMotion = {
  rest: { right: '-120px' },
  hover: {
    position: 'relative',
    right: '1px',
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 120,
      ease: 'easeInOut',
    },
  },
};

const SearchAssignee = forwardRef(
  (
    {
      id,
      name,
      type,
      placeholder,
      className,
      defaultUser,
      returnAccount,
      accounts,
      returnTeam,
      teams,
      returnAssignee,
      selectedAssigneeId,
    },
    ref
  ) => {
    const [filteredData, setFilteredData] = useState([]);
    const [enteredData, setEnteredData] = useState();
    const [selectedDataSrc, setSelectedDataSrc] = useState('');
    const [selectedDataAlt, setSelectedDataAlt] = useState('');
    const [returnAccountData, setReturnAccountData] = useState('');

    const handleOnFilter = (e) => {
      const data = e.currentTarget.value;
      let newFilterTeamName;
      let newFilterTeamEmail;

      setSelectedDataAlt(data);

      setEnteredData(data);

      const newFilterPeopleName = accounts.filter((account) => {
        const fullname = `${account.firstName} ${account.lastName}`;
        return fullname.toLowerCase().includes(data.toLowerCase());
      });

      console.log(newFilterPeopleName);

      const newFilterPeopleEmail = accounts.filter((account) => {
        return account.email.toLowerCase().includes(data.toLowerCase());
      });

      newFilterTeamName = teams.filter((team) => {
        return team.teamName.toLowerCase().includes(data.toLowerCase());
      });
      newFilterTeamEmail = teams.filter((team) => {
        return team.teamEmail.toLowerCase().includes(data.toLowerCase());
      });

      if (data === '') {
        setFilteredData([]);
      } else {
        setFilteredData(
          newFilterPeopleName.length >= 1
            ? newFilterPeopleName
            : newFilterPeopleEmail.length >= 1
            ? newFilterPeopleEmail
            : newFilterTeamName.length >= 1
            ? newFilterTeamName
            : newFilterTeamEmail
        );
      }
    };

    const handleOnSelectedData = (e) => {
      setFilteredData([]);
      setEnteredData('');
      if (filteredData[0].firstName && filteredData[0].lastName) {
        setSelectedDataSrc(e.currentTarget.querySelector('img').src);
        setSelectedDataAlt(e.currentTarget.querySelector('img').alt);
        selectedAssigneeId(e.currentTarget.querySelector('p').id);
      } else {
        setSelectedDataAlt(
          e.currentTarget.querySelector('p').attributes['data-name'].value
        );
        selectedAssigneeId(e.currentTarget.querySelector('p').id);
      }
    };

    const handleClearSelectedData = () => {
      setSelectedDataSrc('');
      setSelectedDataAlt();
      setReturnAccountData('');
    };

    const handleClearSelection = () => {
      setSelectedDataSrc('');
      setSelectedDataAlt('');
      setReturnAccountData('');
    };

    useEffect(() => {
      if (defaultUser) {
        setReturnAccountData(
          accounts &&
            accounts.find((account) => {
              return account._id === defaultUser;
            })
        );
      }

      if (returnAssignee) {
        setReturnAccountData(
          accounts.filter((account) => {
            return account._id === returnAssignee;
          })[0]
        );
      }
    }, [accounts, defaultUser, returnAssignee]);

    return (
      <>
        <div className='flex relative'>
          {selectedDataSrc && selectedDataSrc ? (
            <img
              className='mt-3 ml-3 absolute rounded-full'
              src={selectedDataSrc}
              alt={selectedDataSrc}
              width='28'
              height='28'
            />
          ) : returnAccount ? (
            <img
              className='mt-3 ml-3 absolute rounded-full'
              src={returnAccount.accountProfileUploaded}
              alt={`${returnAccount.firstName} ${returnAccount.lastName}`}
              width='28'
              height='28'
            />
          ) : returnAccountData ? (
            <img
              className='mt-3 ml-3 absolute rounded-full'
              src={returnAccountData.accountProfileUploaded}
              alt={`${returnAccountData.firstName} ${returnAccountData.lastName}`}
              width='28'
              height='28'
            />
          ) : null}

          <input
            autocomplete='nope'
            className={`${
              selectedDataSrc ? 'pl-12' : returnAccountData ? 'pl-12' : 'pl-4'
            } ${className}`}
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={
              selectedDataAlt
                ? selectedDataAlt
                : returnAccountData
                ? `${returnAccountData.firstName} ${returnAccountData.lastName}`
                : returnTeam
                ? returnTeam.teamName
                : ''
            }
            ref={ref}
            onChange={handleOnFilter}
            onClick={(e) => handleClearSelection(e)}
          />

          {selectedDataAlt && (
            <div
              className='mt-2 mr-3 p-2 absolute top-0 right-0 rounded-full cursor-pointer hover:text-primary hover:bg-primary hover:bg-opacity-10 transition ease-in-out'
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
          <motion.div className='bg-white w-full py-2 px-4 absolute shadow-xl rounded-md overflow-hidden'>
            {filteredData &&
              filteredData.map((data, index) => (
                <motion.div
                  key={index}
                  className='mb-2 p-3 flex items-center rounded-md cursor-pointer'
                  initial='rest'
                  whileHover='hover'
                  variants={jobTitleDivMotion}
                  onClick={(e) => handleOnSelectedData(e)}
                >
                  {data.firstName && data.lastName ? (
                    <>
                      <img
                        className='rounded-full'
                        src={data.accountProfileUploaded}
                        alt={`${data.firstName} ${data.lastName}`}
                        width='40'
                        height='40'
                      />
                      <p
                        id={data._id}
                        className='text-xs text-grey font-semibold ml-2 flex flex-col'
                        style={{ lineHeight: '13px' }}
                      >
                        {`${data.firstName} ${data.lastName}`}
                        <span className='text-xxs text-lightGrey'>
                          {data.email}
                        </span>
                      </p>
                      {/* {data.workInfo.jobTitle && (
                        <motion.p
                          className='bg-primary bg-opacity-20 text-xxs text-primary font-bold ml-auto py-2 px-3 flex flex-col relative rounded-md'
                          style={{ lineHeight: '13px' }}
                          variants={jobTitleIconMotion}
                        >
                          {data.workInfo.jobTitle}
                        </motion.p>
                      )} */}
                    </>
                  ) : (
                    <>
                      <p
                        id={data._id}
                        data-name={data.teamName}
                        className='text-xs text-grey font-semibold ml-2 flex flex-col'
                        style={{ lineHeight: '13px' }}
                      >
                        {data.teamName}
                        <span className='text-xxs text-lightGrey'>
                          {data.teamEmail}
                        </span>
                      </p>
                    </>
                  )}
                </motion.div>
              ))}
          </motion.div>
        )}
      </>
    );
  }
);

export default SearchAssignee;
