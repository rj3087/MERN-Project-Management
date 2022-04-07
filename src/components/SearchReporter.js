import React, { useState, useEffect, forwardRef } from 'react';
import { XIcon } from '@heroicons/react/outline';
import { motion } from 'framer-motion';

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

const SearchReporter = forwardRef(
  (
    {
      id,
      name,
      type,
      placeholder,
      className,
      defaultUser,
      accounts,
      returnAssignee,
      selectedAssigneeId,
    },
    ref
  ) => {
    const [accountInfo, setAccountInfo] = useState(
      JSON.parse(localStorage.getItem('loginAccount')) || ''
    );
    const [defaultAvatar, setDefaultAvatar] = useState(
      'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTMgNTMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUzIDUzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBzdHlsZT0iZmlsbDojRTdFQ0VEOyIgZD0iTTE4LjYxMyw0MS41NTJsLTcuOTA3LDQuMzEzYy0wLjQ2NCwwLjI1My0wLjg4MSwwLjU2NC0xLjI2OSwwLjkwM0MxNC4wNDcsNTAuNjU1LDE5Ljk5OCw1MywyNi41LDUzDQoJYzYuNDU0LDAsMTIuMzY3LTIuMzEsMTYuOTY0LTYuMTQ0Yy0wLjQyNC0wLjM1OC0wLjg4NC0wLjY4LTEuMzk0LTAuOTM0bC04LjQ2Ny00LjIzM2MtMS4wOTQtMC41NDctMS43ODUtMS42NjUtMS43ODUtMi44ODh2LTMuMzIyDQoJYzAuMjM4LTAuMjcxLDAuNTEtMC42MTksMC44MDEtMS4wM2MxLjE1NC0xLjYzLDIuMDI3LTMuNDIzLDIuNjMyLTUuMzA0YzEuMDg2LTAuMzM1LDEuODg2LTEuMzM4LDEuODg2LTIuNTN2LTMuNTQ2DQoJYzAtMC43OC0wLjM0Ny0xLjQ3Ny0wLjg4Ni0xLjk2NXYtNS4xMjZjMCwwLDEuMDUzLTcuOTc3LTkuNzUtNy45NzdzLTkuNzUsNy45NzctOS43NSw3Ljk3N3Y1LjEyNg0KCWMtMC41NCwwLjQ4OC0wLjg4NiwxLjE4NS0wLjg4NiwxLjk2NXYzLjU0NmMwLDAuOTM0LDAuNDkxLDEuNzU2LDEuMjI2LDIuMjMxYzAuODg2LDMuODU3LDMuMjA2LDYuNjMzLDMuMjA2LDYuNjMzdjMuMjQNCglDMjAuMjk2LDM5Ljg5OSwxOS42NSw0MC45ODYsMTguNjEzLDQxLjU1MnoiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiM1NTYwODA7IiBkPSJNMjYuOTUzLDAuMDA0QzEyLjMyLTAuMjQ2LDAuMjU0LDExLjQxNCwwLjAwNCwyNi4wNDdDLTAuMTM4LDM0LjM0NCwzLjU2LDQxLjgwMSw5LjQ0OCw0Ni43Ng0KCQljMC4zODUtMC4zMzYsMC43OTgtMC42NDQsMS4yNTctMC44OTRsNy45MDctNC4zMTNjMS4wMzctMC41NjYsMS42ODMtMS42NTMsMS42ODMtMi44MzV2LTMuMjRjMCwwLTIuMzIxLTIuNzc2LTMuMjA2LTYuNjMzDQoJCWMtMC43MzQtMC40NzUtMS4yMjYtMS4yOTYtMS4yMjYtMi4yMzF2LTMuNTQ2YzAtMC43OCwwLjM0Ny0xLjQ3NywwLjg4Ni0xLjk2NXYtNS4xMjZjMCwwLTEuMDUzLTcuOTc3LDkuNzUtNy45NzcNCgkJczkuNzUsNy45NzcsOS43NSw3Ljk3N3Y1LjEyNmMwLjU0LDAuNDg4LDAuODg2LDEuMTg1LDAuODg2LDEuOTY1djMuNTQ2YzAsMS4xOTItMC44LDIuMTk1LTEuODg2LDIuNTMNCgkJYy0wLjYwNSwxLjg4MS0xLjQ3OCwzLjY3NC0yLjYzMiw1LjMwNGMtMC4yOTEsMC40MTEtMC41NjMsMC43NTktMC44MDEsMS4wM1YzOC44YzAsMS4yMjMsMC42OTEsMi4zNDIsMS43ODUsMi44ODhsOC40NjcsNC4yMzMNCgkJYzAuNTA4LDAuMjU0LDAuOTY3LDAuNTc1LDEuMzksMC45MzJjNS43MS00Ljc2Miw5LjM5OS0xMS44ODIsOS41MzYtMTkuOUM1My4yNDYsMTIuMzIsNDEuNTg3LDAuMjU0LDI2Ljk1MywwLjAwNHoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K'
    );
    const [filteredData, setFilteredData] = useState([]);
    const [enteredData, setEnteredData] = useState();
    const [selectedDataSrc, setSelectedDataSrc] = useState('');
    const [selectedDataAlt, setSelectedDataAlt] = useState('');
    const [returnCreatorName, setReturnCreatorName] = useState();
    const [returnCreatorProfile, setReturnCreatorProfile] = useState();

    const HandleOnFilter = (e) => {
      const data = e.currentTarget.value;
      setSelectedDataAlt(data);

      setEnteredData(data);

      const newFilterName = accounts.filter((account) => {
        const fullname = `${account.firstName} ${account.lastName}`;
        return fullname.toLowerCase().includes(data.toLowerCase());
      });

      const newFilterEmail = accounts.filter((account) => {
        return account.email.toLowerCase().includes(data.toLowerCase());
      });

      if (data === '') {
        setFilteredData([]);
      } else {
        setFilteredData(
          newFilterName.length >= 1 ? newFilterName : newFilterEmail
        );
      }
    };

    const HandleOnSelectedData = (e) => {
      setFilteredData([]);
      setEnteredData('');
      setSelectedDataSrc(e.currentTarget.querySelector('img').src);
      setSelectedDataAlt(e.currentTarget.querySelector('img').alt);
      selectedAssigneeId(e.currentTarget.querySelector('p').id);
    };

    const HandleClearSelectedData = () => {
      setSelectedDataSrc();
      setReturnCreatorName('');
      setSelectedDataAlt('');
      setAccountInfo('');
    };

    const clearSelection = () => {
      setDefaultAvatar('');
      setReturnCreatorName('');
      setReturnCreatorProfile();
      setAccountInfo('');
    };

    useEffect(() => {
      if (accountInfo) {
        selectedAssigneeId(accountInfo._id);
      }
      // if (returnAssignee) {
      //   setReturnCreatorName(
      //     `${returnAssignee.taskCreatorId.firstName} ${returnAssignee.taskCreatorId.lastName}`
      //   );
      //   setReturnCreatorProfile(
      //     returnAssignee.taskCreatorId.accountProfileUploaded
      //   );
      // }
    }, [accountInfo, returnAssignee]);

    return (
      <>
        <div className='flex relative'>
          {accountInfo && accountInfo.accountProfileUploaded ? (
            <img
              className='mt-2.5 ml-3 absolute rounded-full z-30'
              src={accountInfo.accountProfileUploaded}
              alt={`${accountInfo.firstName} ${accountInfo.LastName}`}
              width='28'
              height='28'
            />
          ) : selectedDataSrc ? (
            <img
              className='mt-2.5 ml-3 absolute rounded-full'
              src={selectedDataSrc}
              alt={selectedDataAlt}
              width='28'
              height='28'
            />
          ) : returnCreatorProfile ? (
            <img
              className='mt-2.5 ml-3 absolute rounded-full'
              src={returnCreatorProfile}
              alt='Avatar'
              width='28'
              height='28'
            />
          ) : defaultAvatar ? (
            <img
              className='mt-3 ml-4 absolute rounded-full'
              src={defaultAvatar}
              alt='Avatar'
              width='28'
              height='28'
            />
          ) : null}

          <input
            autocomplete='nope'
            id={id}
            name={name}
            type={type}
            placeholder={placeholder}
            value={
              accountInfo && accountInfo
                ? `${accountInfo.firstName} ${accountInfo.lastName}`
                : selectedDataAlt
                ? selectedDataAlt
                : returnCreatorName
            }
            className={`${className} ${
              selectedDataSrc
                ? 'pl-12'
                : returnCreatorName
                ? 'pl-12'
                : accountInfo
                ? 'pl-12'
                : ''
            }`}
            ref={ref}
            onChange={HandleOnFilter}
            onClick={(e) => clearSelection(e)}
          />
          {accountInfo && accountInfo ? (
            <div
              className='mt-2 mr-2 p-2 absolute top-0 right-0 rounded-full cursor-pointer hover:text-primary hover:bg-primary hover:bg-opacity-10 transition ease-in-out'
              onClick={HandleClearSelectedData}
              title='clear'
            >
              <XIcon
                className='w-4 h-4 font-bold opacity-90'
                aria-hidden='true'
              />
            </div>
          ) : selectedDataSrc ? (
            <div
              className='mt-3 mr-2 p-2 absolute top-0 right-0 rounded-full cursor-pointer hover:text-primary hover:bg-primary hover:bg-opacity-10 transition ease-in-out'
              onClick={HandleClearSelectedData}
              title='clear'
            >
              <XIcon
                className='w-4 h-4 font-bold opacity-90'
                aria-hidden='true'
              />
            </div>
          ) : null}
        </div>
        {enteredData && (
          <motion.div className='bg-white w-full py-2 px-4 absolute shadow-xl rounded-md overflow-hidden'>
            {filteredData &&
              filteredData.map((account, index) => (
                <motion.div
                  key={index}
                  className='mb-2 p-3 flex items-center rounded-md cursor-pointer'
                  initial='rest'
                  whileHover='hover'
                  variants={jobTitleDivMotion}
                  onClick={(e) => HandleOnSelectedData(e)}
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
        )}
      </>
    );
  }
);

export default SearchReporter;
