import React, { Fragment, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Popover, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import {
  SearchIcon,
  FilterIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  DesktopComputerIcon,
  DeviceMobileIcon,
  TemplateIcon,
  PencilAltIcon,
  XIcon,
  CodeIcon,
  ColorSwatchIcon,
  CreditCardIcon,
} from '@heroicons/react/outline';

import InputElement from './ui/InputElement';

const Searchbar = ({ searchId }) => {
  const [accountInfo, setAccountInfo] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [teamInfo, setTeamInfo] = useState(
    JSON.parse(localStorage.getItem('accountCurrentTeamList')) || ''
  );
  const [search, setSearch] = useState();
  const [isActiveMenu, setIsActiveMenu] = useState('');
  const [isActiveSubMenu, setIsActiveSubMenu] = useState('');
  const [filterParameters, setFilterParameters] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [enteredData, setEnteredData] = useState('');

  let location = useLocation();
  let pathArr = location.pathname.split('/');

  const projectListGet = useSelector((state) => state.projectListGet);
  const { projects } = projectListGet;

  const taskListGet = useSelector((state) => state.taskListGet);
  const { tasks } = taskListGet;

  const handleOnChangeFilter = (e) => {
    if (e === 'Project') {
      setIsActiveMenu(e);
    } else {
      setIsActiveMenu(e);
    }
  };

  const handleOnFilter = (e) => {
    const data = e.currentTarget.value;

    setEnteredData(data);

    let newFilter;

    console.log(isActiveMenu);

    if (isActiveMenu === 'Project') {
      newFilter = filterParameters.filter((filtered) => {
        return filtered.projectName.toLowerCase().includes(data.toLowerCase());
      });
    } else if (isActiveMenu === 'Task') {
      newFilter = filterParameters.filter((filtered) => {
        return filtered.taskName.toLowerCase().includes(data.toLowerCase());
      });
    }

    if (data === '') {
      setFilteredData([]);
    } else {
      setFilteredData(newFilter);
    }
  };

  const handleOnSelectedData = (e) => {
    searchId(e);
  };

  const handleClearSearch = () => {
    searchId('');
    setEnteredData('');
  };

  useEffect(() => {
    if (isActiveMenu === 'Project') {
      if (isActiveSubMenu === 'My Project') {
        setFilterParameters(
          projects.filter(
            (project) => project.projectCreatorId === accountInfo._id
          )
        );
      } else if (isActiveSubMenu === 'Team Project') {
        const leadId = teamInfo.currentTeam.map((id) => id.teamLeadId);
        const InvitedId = teamInfo.currentTeam.map((id) => id.invitedPeopleId);
        const filterLeadid = leadId.filter((id) => id === accountInfo._id);

        const filterInvitedid = InvitedId.filter(
          (id) => id === accountInfo._id
        );
        const filterByTeamLeadId = projects.filter(
          (project) => project.whoCanEditId === filterLeadid[0]
        );
        const filterByInvitedId = projects.filter(
          (project) => project.whoCanEditId === filterInvitedid
        );

        let combineArr = [];

        if (filterByTeamLeadId.length >= 1 || filterByInvitedId.length >= 1) {
          combineArr = [...filterByTeamLeadId, ...filterByInvitedId];
          setFilterParameters(
            combineArr.filter((element, index) => {
              return combineArr.indexOf(element) === index;
            })
          );
        }
      }
    } else {
      if (isActiveMenu === 'Task') {
        if (isActiveSubMenu === 'My Task') {
          setFilterParameters(
            tasks.filter((task) => task.taskAssigneeId === accountInfo._id)
          );
        } else if (isActiveSubMenu === 'Team Task') {
          const leadId = teamInfo.currentTeam.map((id) => id.teamLeadId);
          const InvitedId = teamInfo.currentTeam.map(
            (id) => id.invitedPeopleId
          );
          const filterLeadid = leadId.filter((id) => id === accountInfo._id);

          const filterInvitedid = InvitedId.filter(
            (id) => id === accountInfo._id
          );

          const filterByAccoundId = tasks.filter(
            (task) => task.projectCreatorId === accountInfo._id
          );
          const filterByTeamLeadId = tasks.filter(
            (task) => task.taskAssigneeId === filterLeadid[0]
          );
          const filterByInvitedId = tasks.filter(
            (task) => task.taskAssigneeId === filterInvitedid
          );

          let combineArr = [];

          if (filterByTeamLeadId.length >= 1 || filterByInvitedId.length >= 1) {
            combineArr = [...filterByTeamLeadId, ...filterByInvitedId];
            setFilterParameters(
              combineArr.filter((element, index) => {
                return combineArr.indexOf(element) === index;
              })
            );
          }
        }
      }
    }
  }, [
    accountInfo._id,
    isActiveMenu,
    isActiveSubMenu,
    projects,
    tasks,
    teamInfo.currentTeam,
  ]);

  return (
    <>
      <motion.div style={{ width: '94%' }}>
        <div className='w-3/5 relative flex'>
          <div className='relative' style={{ width: '26%' }}>
            <InputElement
              className='bg-lightGrey w-full px-10 py-3 text-xs leading-tight border rounded-md appearance-none
               focus:border-primary hover:bg-white focus:outline-none focus:shadow-outline transition duration-250 ease-in-out'
              id='email'
              name='email'
              type='text'
              placeholder={`${
                pathArr[1] === 'projects' || location.pathname === '/'
                  ? 'Search Projects...'
                  : 'Search Tasks...'
              }`}
              onChange={handleOnFilter}
              value={enteredData}
            />
            <SearchIcon
              className='w-4 h-4 mt-3 ml-4 absolute top-0 opacity-40'
              aria-hidden='true'
            />

            <XIcon
              className='w-4 h-4 mt-3 mr-4 absolute top-0 right-0 cursor-pointer opacity-40'
              aria-hidden='true'
              onClick={handleClearSearch}
            />
          </div>
          <div className='w-full px-4'>
            <Popover className='relative'>
              {({ open }) => (
                <>
                  <Popover.Button
                    className={`bg-primary text-xs text-white
                ${open ? 'bg-darkPrimary' : 'bg-primary'}
               group px-4 py-3 rounded-md inline-flex items-center font-semibold hover:bg-darkPrimary focus:outline-none transition duration-250 ease-in-out`}
                  >
                    <span>FILTER</span>
                    <FilterIcon
                      className='w-3.5 h-3.5 ml-2 -mr-1'
                      aria-hidden='true'
                    />
                  </Popover.Button>
                  <Transition
                    as={Fragment}
                    enter='transition ease-out duration-200'
                    enterFrom='opacity-0 translate-y-1'
                    enterTo='opacity-100 translate-y-0'
                    leave='transition ease-in duration-150'
                    leaveFrom='opacity-100 translate-y-0'
                    leaveTo='opacity-0 translate-y-1'
                  >
                    <Popover.Panel className='absolute z-10 w-1/3 mt-4 transform -translate-x-1/2 right-1/2'>
                      <div className='bg-white overflow-hidden rounded-md shadow-md'>
                        <div className='relative'>
                          <div className='w-full'>
                            <ul className='text-xs font-semibold'>
                              {pathArr[1] === 'projects' ||
                              location.pathname === '/' ? (
                                <li>
                                  <div
                                    id='Project'
                                    className='p-4 flex cursor-pointer hover:bg-lightGrey transition duration-250 ease-in-out'
                                    onClick={(e) =>
                                      handleOnChangeFilter(e.currentTarget.id)
                                    }
                                  >
                                    <h3>Project</h3>
                                    {isActiveMenu === 'Project' ? (
                                      <ChevronUpIcon
                                        className='w-3.5 h-3.5 ml-auto'
                                        aria-hidden='true'
                                      />
                                    ) : (
                                      <ChevronDownIcon
                                        className='w-3.5 h-3.5 ml-auto'
                                        aria-hidden='true'
                                      />
                                    )}
                                  </div>
                                  {isActiveMenu === 'Project' ? (
                                    <ul className='bg-lightGrey'>
                                      <li
                                        id='My Project'
                                        className='p-4 flex relative cursor-pointer hover:bg-primary hover:text-white transition duration-250 ease-in-out'
                                        onClick={(e) =>
                                          setIsActiveSubMenu(e.currentTarget.id)
                                        }
                                      >
                                        <input
                                          type='checkbox'
                                          className='bg-primary mt-0.5 mr-2'
                                          checked={
                                            isActiveSubMenu === 'My Project'
                                              ? true
                                              : false
                                          }
                                        />
                                        <p className='ml-5 absolute'>
                                          My Project
                                        </p>
                                      </li>
                                      <li
                                        id='Team Project'
                                        className='p-4 flex relative cursor-pointer hover:bg-primary hover:text-white transition duration-250 ease-in-out'
                                        onClick={(e) =>
                                          setIsActiveSubMenu(e.currentTarget.id)
                                        }
                                      >
                                        <input
                                          type='checkbox'
                                          className='bg-primary mt-0.5 mr-2'
                                          checked={
                                            isActiveSubMenu === 'Team Project'
                                              ? true
                                              : false
                                          }
                                        />
                                        <p className='ml-5 absolute'>
                                          Team Project
                                        </p>
                                      </li>
                                    </ul>
                                  ) : null}
                                </li>
                              ) : null}
                              {pathArr[1] === 'tasks' ||
                              pathArr[1] === 'project' ||
                              pathArr[2] === 'board' ? (
                                <li>
                                  <div
                                    id='Task'
                                    className='p-4 flex cursor-pointer hover:bg-lightGrey transition duration-250 ease-in-out'
                                    onClick={(e) =>
                                      handleOnChangeFilter(e.currentTarget.id)
                                    }
                                  >
                                    <h3>Task</h3>
                                    {isActiveMenu === 'Task' ? (
                                      <ChevronUpIcon
                                        className='w-3.5 h-3.5 ml-auto'
                                        aria-hidden='true'
                                      />
                                    ) : (
                                      <ChevronDownIcon
                                        className='w-3.5 h-3.5 ml-auto'
                                        aria-hidden='true'
                                      />
                                    )}
                                  </div>
                                  {isActiveMenu === 'Task' ? (
                                    <ul className='bg-lightGrey'>
                                      <li
                                        id='My Task'
                                        className='p-4 flex relative cursor-pointer hover:bg-primary hover:text-white transition duration-250 ease-in-out'
                                        onClick={(e) =>
                                          setIsActiveSubMenu(e.currentTarget.id)
                                        }
                                      >
                                        <input
                                          type='checkbox'
                                          className='bg-primary mt-0.5 mr-2'
                                          checked={
                                            isActiveSubMenu === 'My Task'
                                              ? true
                                              : false
                                          }
                                        />
                                        <p className='ml-5 absolute'>My Task</p>
                                      </li>
                                      <li
                                        id='Team Task'
                                        className='p-4 flex relative cursor-pointer hover:bg-primary hover:text-white transition duration-250 ease-in-out'
                                        onClick={(e) =>
                                          setIsActiveSubMenu(e.currentTarget.id)
                                        }
                                      >
                                        <input
                                          type='checkbox'
                                          className='bg-primary mt-0.5 mr-2'
                                          checked={
                                            isActiveSubMenu === 'Team Task'
                                              ? true
                                              : false
                                          }
                                        />
                                        <p className='ml-5 absolute'>
                                          Team Task
                                        </p>
                                      </li>
                                    </ul>
                                  ) : null}
                                </li>
                              ) : null}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </Popover.Panel>
                  </Transition>
                </>
              )}
            </Popover>
          </div>
          {enteredData && isActiveMenu ? (
            <>
              <div
                className='w-4/12 bg-white px-4 py-3 top-14 rounded-md shadow-md absolute'
                style={{ zIndex: '9' }}
              >
                {filteredData.map((item) => (
                  <div
                    key={item._od}
                    id={item._id}
                    className='flex items-center cursor-pointer'
                    onClick={(e) => handleOnSelectedData(e.currentTarget.id)}
                  >
                    <div
                      key={item._od}
                      id={item._id}
                      className='mb-2 flex items-center cursor-pointer'
                      onClick={(e) => handleOnSelectedData(e.currentTarget.id)}
                    >
                      {isActiveMenu === 'Project' ? (
                        item.projectCategory === 'Web Development' ? (
                          <div
                            className='bg-primary mr-3 p-1'
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '5px',
                            }}
                          >
                            <DesktopComputerIcon
                              className='w-4 h-4 text-white'
                              aria-hidden='true'
                            />
                          </div>
                        ) : item.projectCategory === 'Mobile Development' ? (
                          <div
                            className='bg-correct mr-3 p-1'
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '5px',
                            }}
                          >
                            <DeviceMobileIcon
                              className='w-4 h-4 text-white'
                              aria-hidden='true'
                            />
                          </div>
                        ) : item.projectCategory === 'Design' ? (
                          <div
                            className='bg-danger bg-opacity-50 mr-3 p-1'
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '5px',
                            }}
                          >
                            <TemplateIcon
                              className='w-4 h-4 text-white'
                              aria-hidden='true'
                            />
                          </div>
                        ) : (
                          <div
                            className='bg-yellow mr-3 p-1'
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '5px',
                            }}
                          >
                            <PencilAltIcon
                              className='w-4 h-4 text-white'
                              aria-hidden='true'
                            />
                          </div>
                        )
                      ) : isActiveMenu === 'Task' ? (
                        item.taskType === 'Coding' ? (
                          <div
                            className='bg-primary mr-3 p-1'
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '5px',
                            }}
                          >
                            <CodeIcon
                              className='w-4 h-4 text-white'
                              aria-hidden='true'
                            />
                          </div>
                        ) : item.projectCategory === 'Design' ? (
                          <div
                            className='bg-correct mr-3 p-1'
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '5px',
                            }}
                          >
                            <ColorSwatchIcon
                              className='w-4 h-4 text-white'
                              aria-hidden='true'
                            />
                          </div>
                        ) : item.projectCategory === 'Web Design' ? (
                          <div
                            className='bg-danger bg-opacity-50 mr-3 p-1'
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '5px',
                            }}
                          >
                            <DesktopComputerIcon
                              className='w-4 h-4 text-white'
                              aria-hidden='true'
                            />
                          </div>
                        ) : (
                          <div
                            className='bg-yellow mr-3 p-1'
                            style={{
                              width: '24px',
                              height: '24px',
                              borderRadius: '5px',
                            }}
                          >
                            <CreditCardIcon
                              className='w-4 h-4 text-white'
                              aria-hidden='true'
                            />
                          </div>
                        )
                      ) : null}

                      <p className='text-xs py-1'>
                        {isActiveMenu === 'Project'
                          ? item.projectName
                          : item.taskName}
                      </p>
                    </div>
                  </div>
                ))}
                <div>
                  <h4 className='text-xs font-bold opacity-50 mt-1 mb-1'>
                    Suggested item:
                  </h4>
                  {filterParameters &&
                    filterParameters.map((item) => (
                      <p className='text-xs mb-1'>
                        {isActiveMenu === 'Project'
                          ? item.projectName
                          : item.taskName}
                      </p>
                    ))}
                </div>
              </div>
            </>
          ) : !isActiveMenu && enteredData.length >= 1 ? (
            <div
              className='w-3/12 bg-white px-4 py-3 top-14 rounded-md shadow-md absolute'
              style={{ zIndex: '99' }}
            >
              <p className='text-xs py-1'>Please select a filter parameters.</p>
            </div>
          ) : null}
        </div>
      </motion.div>
    </>
  );
};

export default Searchbar;
