import React, { useState, useEffect, useRef, forwardRef } from 'react';
import { motion } from 'framer-motion';

import { XIcon } from '@heroicons/react/outline';

const jobTitleDivMotion = {
  // rest: { background: '#fff' },
  // hover: {
  //   background: '#f5f5f5',
  //   transition: {
  //     duration: 0.4,
  //     type: 'spring',
  //     stiffness: 120,
  //     ease: 'easeInOut',
  //   },
  // },
};

const jobTitleIconMotion = {
  rest: { right: '-130px' },
  hover: {
    position: 'relative',
    right: '0px',
    transition: {
      duration: 0.4,
      type: 'spring',
      stiffness: 110,
      ease: 'easeInOut',
    },
  },
};

const hoverMotion = {
  rest: { background: '#fff' },
  hover: {
    background: '#fafafa',
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 120,
      ease: 'easeInOut',
    },
  },
};

const slideDownMotion = {
  visible: { height: '52px', opacity: 1 },
  hidden: { height: '0', opacity: 0.4 },
};

const InvitePeople = forwardRef(
  (
    {
      id,
      name,
      type,
      placeholder,
      className,
      accounts,
      selectedPeopleId,
      returnInvitedId,
      showAddInput,
    },
    ref
  ) => {
    const [listAccount, setListAccount] = useState();
    const [filteredData, setFilteredData] = useState([]);
    const [enteredData, setEnteredData] = useState();
    const [selectedDataSrc, setSelectedDataSrc] = useState('');
    const [selectedDataAlt, setSelectedDataAlt] = useState('');
    const [selectedPeople, setSelectedPeople] = useState([]);
    const [selectedId, setSelectedId] = useState();
    const [returnNotFilterName, setReturnNotFilterName] = useState();

    const handleOnFilter = (e) => {
      const data = e.currentTarget.value;
      setSelectedDataAlt(data);

      setEnteredData(data);

      const newFilterName = listAccount.filter((account) => {
        const fullname = `${account.firstName} ${account.lastName}`;
        return (
          fullname.toLowerCase().includes(data.toLowerCase()) &&
          account.status !== 'existing'
        );
      });

      const newFilterEmail = listAccount.filter((account) => {
        return (
          account.email.toLowerCase().includes(data.toLowerCase()) &&
          account.status !== 'existing'
        );
      });

      if (listAccount.filter((account) => account.status !== 'existing')) {
      }

      if (data === '') {
        setFilteredData([]);
      } else {
        setFilteredData(
          newFilterName.length >= 1 ? newFilterName : newFilterEmail
        );
      }
    };

    const handleOnSelectedData = (e) => {
      const selectedId = e.currentTarget.id;
      const selectedAvatar = e.currentTarget.querySelector('img').src;
      const selectedName = e.currentTarget.querySelector('img').alt;
      setFilteredData([]);
      setEnteredData('');
      if (
        selectedPeople.filter((i) => selectedId.includes(i.invitedId))
          .length === 0
      ) {
        setSelectedPeople((prevData) => [
          ...prevData,
          {
            invitedId: selectedId,
            invitedAvatar: selectedAvatar,
            invitedName: selectedName,
          },
        ]);
      }
    };

    const handleClearSelectedData = () => {
      setSelectedDataSrc();
      setSelectedDataAlt('');
      setFilteredData([]);
    };

    const handleAddPeople = (e) => {
      selectedPeopleId(selectedPeople.map((id) => id.invitedId));
      setSelectedId(selectedPeople.map((id) => id.invitedId));
      let updatedSelectedList = selectedPeople.map((people) => {
        if (people.invitedId === e) {
          return { ...people, status: 'existing' };
        }
        return people;
      });

      setSelectedPeople(updatedSelectedList);

      let updatedList = listAccount.map((people) => {
        if (people._id === e) {
          return { ...people, status: 'existing' };
        }
        return people;
      });

      setListAccount(updatedList);
    };

    const handleRemovePeople = (e) => {
      selectedPeopleId(selectedPeople.filter((id) => id.invitedId !== e));
      setSelectedPeople(selectedPeople.filter((id) => id.invitedId !== e));
      let updatedList = listAccount.map((people) => {
        if (people._id === e) {
          return { ...people, status: null };
        }
        return people;
      });
      setListAccount(updatedList);
    };

    useEffect(() => {
      if (accounts) {
        setListAccount(accounts);
      }
    }, [accounts]);

    useEffect(() => {
      if (returnInvitedId) {
        setSelectedPeople(
          returnInvitedId.invitedPeopleId.map((profile) => ({
            invitedId: profile._id,
            invitedAvatar: profile.accountProfileUploaded,
            invitedName: `${profile.firstName} ${profile.lastName}`,
            status: 'existing',
          }))
        );
      }
    }, [returnInvitedId]);

    useEffect(() => {
      for (let i = 0; i < selectedPeople.length; i++) {
        let updatedList = listAccount.map((people) => {
          if (people._id === selectedPeople[i].invitedId) {
            return { ...people, status: 'existing' };
          }
          return people;
        });

        setListAccount(updatedList);
      }
    }, [selectedPeople]);

    return (
      <>
        <div className='flex relative'>
          {selectedDataSrc && (
            <img
              className='mt-3 ml-4 absolute rounded-full'
              src={selectedDataSrc}
              alt={selectedDataAlt}
              width='28'
              height='28'
            />
          )}
          {showAddInput && (
            <motion.input
              autocomplete='nope'
              id={id}
              name={name}
              type={type}
              placeholder={placeholder}
              value={selectedDataAlt}
              className={`mb-4 ${className} ${
                selectedDataSrc ? 'pl-14' : ''
              } overflow-hidden`}
              ref={ref}
              onChange={handleOnFilter}
              initial='hidden'
              animate='visible'
              variants={slideDownMotion}
              transition={{
                delay: 0.2,
                duration: 0.4,
                type: 'spring',
                stiffness: 60,
                ease: 'easeInOut',
              }}
            />
          )}

          {selectedDataAlt && (
            <div
              className='mt-3 mr-4 p-2 absolute top-0 right-0 rounded-full cursor-pointer hover:text-primary hover:bg-primary hover:bg-opacity-10 transition ease-in-out'
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
        {enteredData && filteredData.length >= 1 ? (
          <motion.div className='bg-white w-full py-2 px-4 absolute shadow-xl rounded-md overflow-hidden'>
            {filteredData &&
              filteredData.map((account) => (
                <motion.div
                  key={account._id}
                  id={account._id}
                  className='mb-2 p-3 flex items-center rounded-md cursor-pointer'
                  initial='rest'
                  whileHover='hover'
                  variants={hoverMotion}
                  onClick={(e) => handleOnSelectedData(e)}
                >
                  <img
                    className='rounded-full'
                    src={account.accountProfileUploaded}
                    alt={`${account.firstName} ${account.lastName}`}
                    width='40'
                    height='40'
                  />
                  <p
                    id={account._id}
                    className='text-xs text-grey font-semibold ml-2 flex flex-col'
                    style={{ lineHeight: '13px' }}
                  >
                    {`${account.firstName} ${account.lastName}`}
                    <span className='text-xxs text-lightGrey'>
                      {account.email}
                    </span>
                  </p>
                  <motion.p
                    className='bg-primary bg-opacity-20 text-xxs text-primary font-bold ml-auto py-2 px-3 flex flex-col relative rounded-md'
                    style={{ lineHeight: '13px' }}
                    variants={jobTitleIconMotion}
                  >
                    {account.workInfo.jobTitle}
                  </motion.p>
                </motion.div>
              ))}
          </motion.div>
        ) : null}
        <motion.ul
          className='w-full max-h-13vh mb-2 rounded-md overflow-y-auto'
          style={{ background: '#f5f5f5' }}
        >
          {selectedPeople &&
            selectedPeople.map((selected, index) => (
              <motion.li
                key={index}
                id={selected.invitedId}
                className='py-3 pl-4 pr-4 flex items-center rounded-md cursor-pointer'
                initial='rest'
                whileHover='hover'
                variants={jobTitleDivMotion}
              >
                <img
                  className='rounded-full'
                  src={selected.invitedAvatar}
                  alt={selected.invitedName}
                  width='34'
                  height='34'
                />
                <p
                  className='text-xs text-grey font-semibold ml-2 flex flex-col'
                  style={{ lineHeight: '13px' }}
                >
                  {selected.invitedName}
                </p>

                {selected.status === 'existing' ? (
                  <button
                    type='button'
                    className='text-danger text-xxs text-center w-5rem ml-auto py-1 border border-danger rounded-md outline-none focus:outline-none hover:bg-danger hover:text-white hover:border-0 delay-150 duration-300 ease-in-out'
                    onClick={() => handleRemovePeople(selected.invitedId)}
                  >
                    Remove
                  </button>
                ) : (
                  <button
                    type='button'
                    className='text-primary text-xxs text-center w-5rem ml-auto py-1 border border-primary rounded-md outline-none focus:outline-none hover:bg-primary hover:text-white hover:border-0 delay-150 duration-300 ease-in-out'
                    onClick={() => handleAddPeople(selected.invitedId)}
                  >
                    Add
                  </button>
                )}
              </motion.li>
            ))}
        </motion.ul>
      </>
    );
  }
);

export default InvitePeople;
