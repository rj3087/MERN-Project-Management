import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import 'react-datepicker/dist/react-datepicker.css';

import { UserGroupIcon, UserIcon, UsersIcon } from '@heroicons/react/solid';
import {
  XIcon,
  ExclamationCircleIcon,
  DesktopComputerIcon,
  DeviceMobileIcon,
  TemplateIcon,
  PencilAltIcon,
} from '@heroicons/react/outline';

import { getAccountById, getAccounts } from '../redux/actions/accountActions';
import { getTeamById, getTeams } from '../redux/actions/utilitiesActions';
import { updateProjectById } from '../redux/actions/projectActions';
import InputElement from './ui/InputElement';
import CreateClient from './settings/client/CreateClient';
import SearchClient from './settings/client/SearchClient';
import SearchAssignee from './SearchAssignee';
import { DropDownElement } from './ui/DropDownElement';

const schema = yup.object().shape({
  projectName: yup.string().required('Please enter project name here'),
  startDate: yup.string().required('Please enter project name here'),
  dueDate: yup.string().required('Please enter project name here'),
});

const slideModal = {
  hidden: {
    position: 'fixed',
    right: '-700px',
  },
  visible: {
    right: '0px',
    transition: {
      delay: 0.1,
      type: 'spring',
    },
  },
};

const buttonBlueVariants = {
  initial: {
    backgroundColor: '#EBEDFC',
    color: '#3F52E3',
    scale: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 60,
      ease: 'easeInOut',
    },
  },
  hover: {
    backgroundColor: '#c5cbf6',
    scale: 1.1,
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 60,
      ease: 'easeInOut',
    },
  },
};

const tabArr = ['Category', 'Create', 'Type', 'Selection'];
const rateArr = [
  { item: 'Hourly rate' },
  { item: 'Daily rate' },
  { item: 'Weekly rate' },
  { item: 'Monthly rate' },
];
const personArr = [
  { item: 'Hours per Person' },
  { item: 'Days per Person' },
  { item: 'Weekly per Person' },
];

const ProjectView = ({ showProjectView, projectByIdInfo, showModal }) => {
  const [accountsList, setAccountsList] = useState({});
  const [teamsList, setTeamsList] = useState({});
  const [projOwner, setProjOwner] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [accountInfo, setAccountInfo] = useState();
  const [projectInfo, setProjectInfo] = useState({
    projectCreator: `${projOwner.firstName} ${projOwner.lastName}`,
    projectCategory: '',
    projectName: '',
    projectClientId: '',
    startDate: new Date(),
    dueDate: new Date(),
    projectType: '',
    rate: '',
    amount: '',
    budget: '',
    projectNote: '',
    whoCanEdit: '',
    whoCanEditId: '',
  });
  const [tabSelected, setTabSelected] = useState(tabArr);
  const [tabActive, setTabActive] = useState(tabArr[0]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedType, setSelectedType] = useState();
  const [selectedCanEdit, setSelectedCanEdit] = useState();
  const [selectedView, setSelectedView] = useState();
  const [showModalClient, setShowModalClient] = useState(false);
  const [tabsStatus, setTabsStatus] = useState({
    tabStatusCategory: '',
    tabStatusEdit: '',
  });
  const [isModal, setIsModal] = useState();
  let [tabIndex, setTabIndex] = useState(0);

  const { register, errors, handleSubmit } = useForm({
    // resolver: yupResolver(schema),
    mode: 'all',
  });

  const dispatch = useDispatch();

  const accountGetById = useSelector((state) => state.accountGetById);
  const { accountById } = accountGetById;

  const accountsGet = useSelector((state) => state.accountsGet);
  const { accounts } = accountsGet;

  const projectUpdateById = useSelector((state) => state.projectUpdateById);
  const { updatedProject } = projectUpdateById;

  const teamByIdGet = useSelector((state) => state.teamByIdGet);
  const { teamById } = teamByIdGet;

  const teamListGet = useSelector((state) => state.teamListGet);
  const { teams } = teamListGet;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setProjectInfo((data) => ({ ...data, [name]: value }));
  };

  const handleOnSubmit = () => {
    dispatch(updateProjectById(projectInfo));
  };

  const handleCheckTabStatus = () => {
    if (!projectInfo.projectCategory && tabIndex === 0) {
      setTabsStatus((prevState) => ({ ...prevState, tabStatusCategory: true }));
    }
    if (!projectInfo.whoCanEdit && tabIndex === 3) {
      setTabsStatus((prevState) => ({ ...prevState, tabStatusEdit: true }));
    }
  };

  const handleNextTab = () => {
    var currentTabIndex;
    currentTabIndex = tabIndex + 1;
    setTabActive(tabArr[currentTabIndex]);
    setTabIndex(currentTabIndex);
    handleCheckTabStatus();
  };

  const handleSelectedTab = (e) => {
    setTabIndex(tabArr.indexOf(e));
    setTabActive(tabArr[tabArr.indexOf(e)]);
    handleCheckTabStatus();
  };

  const handleOnStartDate = (date) => {
    setProjectInfo((prevData) => ({
      ...prevData,
      startDate: date,
    }));
  };

  const handleOnDueDate = (date) => {
    setProjectInfo((prevData) => ({
      ...prevData,
      dueDate: date,
    }));
  };

  const handleOnCategory = (selected) => {
    setProjectInfo((prevData) => ({
      ...prevData,
      projectCategory: selected,
    }));
    setSelectedCategory(selected);
    setTabsStatus((prevState) => ({ ...prevState, tabStatusCategory: false }));
  };

  const handleOnCanEdit = (selected) => {
    setProjectInfo((prevData) => ({
      ...prevData,
      whoCanEdit: selected,
    }));
    setSelectedCanEdit(selected);
    setTabsStatus((prevState) => ({ ...prevState, tabStatusEdit: false }));
  };

  const handleOnProjectTpye = (selected) => {
    setSelectedType(selected);
  };

  useEffect(() => {
    if (projectByIdInfo) {
      setProjectInfo((prevData) => ({
        ...prevData,
        _id: projectByIdInfo._id,
        projectCategory: projectByIdInfo.projectCategory,
        projectName: projectByIdInfo.projectName,
        projectClientId: projectByIdInfo.projectClientId,
        startDate: new Date(Date.parse(projectByIdInfo.startDate)),
        dueDate: new Date(Date.parse(projectByIdInfo.dueDate)),
        projectNote: projectByIdInfo.projectNote,
        projectType: projectByIdInfo.projectType,
        rate: projectByIdInfo.rate,
        amount: projectByIdInfo.amount,
        budget: projectByIdInfo.budget,
        whoCanEdit: projectByIdInfo.whoCanEdit,
        whoCanEditId: projectByIdInfo.whoCanEditId,
      }));
    }
  }, [accountInfo, projectByIdInfo]);

  useEffect(() => {
    if (accounts === undefined || accounts.length === 0) {
      dispatch(getAccounts());
    } else {
      setAccountsList(accounts);
    }

    if (teams === undefined || teams.length === 0) {
      dispatch(getTeams());
    } else {
      setTeamsList(teams);
    }
  }, [accounts, teams]);

  useEffect(() => {
    if (updatedProject) {
      showModal(true);
      showProjectView(false);
    }
  }, [updatedProject]);

  useEffect(() => {
    if (projectInfo.whoCanEdit === 'Specific') {
      if (projectInfo.whoCanEditId && !accountById) {
        dispatch(getAccountById(projectInfo.whoCanEditId));
      }

      if (projectInfo.whoCanEditId && !teamById) {
        dispatch(getTeamById(projectInfo.whoCanEditId));
      }
    }
  }, [dispatch, projectInfo.whoCanEditId, teamById]);

  return (
    <AnimatePresence>
      {showProjectView && (
        <motion.div className='w-full h-screen bg-darkLight bg-opacity-60 fixed top-0 z-50 '>
          <motion.div
            className='w-4/12 h-screen bg-white mx-auto p-8 flex flex-col fixed top-0 right-0 shadow-primary'
            variants={slideModal}
            initial='hidden'
            animate='visible'
            exit='hidden'
          >
            <form
              className='form-container w-full flex flex-col relative'
              onSubmit={handleSubmit(handleOnSubmit)}
            >
              <div
                className={`w-full h-82vh ${
                  tabActive === 'Category' ? 'block' : 'hidden'
                }`}
              >
                <div className='relative rounded-tl-lg rounded-tr-lg'>
                  <h4 className='text-grey text-lg font-bold text-center tracking-wider'>
                    Project Category
                  </h4>
                  {tabsStatus.tabStatusCategory && (
                    <p className='w-full text-xs text-danger text-center mt-1 absolute flex items-center justify-center'>
                      Please select the project category
                    </p>
                  )}
                  <XIcon
                    className='w-5 h-5 absolute top-0 right-0 opacity-40 cursor-pointer'
                    aria-hidden='true'
                    onClick={() => showProjectView(false)}
                  />
                </div>
                <div className='mt-12 flex justify-center space-x-6'>
                  <div
                    id='Mobile Development'
                    className={`w-2/6 ${
                      selectedCategory === 'Mobile Development'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } ${
                      projectInfo.projectCategory === 'Mobile Development'
                        ? 'fill-current text-primary opacity-100'
                        : ''
                    } ${
                      projectInfo.projectCategory === 'Mobile Development'
                        ? 'bg-primary bg-opacity-10'
                        : ''
                    } py-12 px-6 border rounded-lg cursor-pointer transition duration-500 ease-in-out hover:bg-primary hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleOnCategory(e.currentTarget.id)}
                  >
                    <DeviceMobileIcon
                      className={`${
                        selectedCategory === 'Mobile Development'
                          ? 'text-primary opacity-10'
                          : ''
                      } ${
                        projectInfo.projectCategory === 'Mobile Development'
                          ? 'text-primary opacity-100'
                          : ''
                      } w-8 h-8 mx-auto mb-3 opacity-20`}
                      aria-hidden='true'
                    />
                    <h4
                      className={`${
                        selectedCategory === 'Mobile'
                          ? 'text-primary'
                          : 'text-grey'
                      } text-sm font-bold text-center`}
                    >
                      Mobile Development
                    </h4>
                  </div>
                  <div
                    id='Web Development'
                    className={`w-2/6 ${
                      selectedCategory === 'Web Development'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } ${
                      projectInfo.projectCategory === 'Web Development'
                        ? 'bg-primary bg-opacity-10'
                        : ''
                    } py-12 px-6 border rounded-lg cursor-pointer hover:bg-primary transition duration-500 ease-in-out hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleOnCategory(e.currentTarget.id)}
                  >
                    <DesktopComputerIcon
                      className={`${
                        selectedCategory === 'Web Development'
                          ? 'text-primary opacity-10'
                          : ''
                      } ${
                        projectInfo.projectCategory === 'Web Development'
                          ? 'text-primary opacity-100'
                          : ''
                      } w-8 h-8 mx-auto mb-3 opacity-20`}
                      aria-hidden='true'
                    />
                    <h4
                      className={`${
                        selectedCategory === 'Web Development'
                          ? 'text-primary'
                          : 'text-grey'
                      } text-sm font-bold text-center`}
                    >
                      Web Development
                    </h4>
                  </div>
                </div>
                <div className='mt-6 flex justify-center space-x-6'>
                  <div
                    id='Design'
                    className={`w-2/6 ${
                      selectedCategory === 'Design'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } ${
                      projectInfo.projectCategory === 'Design'
                        ? 'bg-primary bg-opacity-10'
                        : ''
                    } py-12 px-8  border rounded-lg cursor-pointer hover:bg-primary transition duration-500 ease-in-out hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleOnCategory(e.currentTarget.id)}
                  >
                    <TemplateIcon
                      className={`${
                        selectedCategory === 'Design'
                          ? 'text-primary opacity-10'
                          : ''
                      } ${
                        projectInfo.projectCategory === 'Design'
                          ? 'text-primary opacity-100'
                          : ''
                      } w-8 h-8 mx-auto mb-3 opacity-20`}
                      aria-hidden='true'
                    />
                    <h4
                      className={`${
                        selectedCategory === 'Design'
                          ? 'text-primary'
                          : 'text-grey'
                      } text-md font-bold text-center`}
                    >
                      Design
                    </h4>
                  </div>
                  <div
                    id='Branding'
                    className={`w-2/6 ${
                      selectedCategory === 'Branding'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } ${
                      projectInfo.projectCategory === 'Branding'
                        ? 'bg-primary bg-opacity-10'
                        : ''
                    } py-12 px-8 border rounded-lg cursor-pointer transition duration-500 ease-in-out hover:bg-primary hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleOnCategory(e.currentTarget.id)}
                  >
                    <PencilAltIcon
                      className={`${
                        selectedCategory === 'Branding'
                          ? 'text-primary opacity-10'
                          : ''
                      } ${
                        projectInfo.projectCategory === 'Branding'
                          ? 'text-primary opacity-100'
                          : ''
                      } w-8 h-8 mx-auto mb-3 opacity-20`}
                      aria-hidden='true'
                    />
                    <h4
                      className={`${
                        selectedCategory === 'Branding'
                          ? 'text-primary'
                          : 'text-grey'
                      } text-sm font-bold text-center`}
                    >
                      Branding
                    </h4>
                  </div>
                </div>
              </div>
              <div
                className={`w-full h-82vh ${
                  tabActive === 'Create' ? 'block' : 'hidden'
                }`}
              >
                <div className='relative rounded-tl-lg rounded-tr-lg'>
                  <h4 className='text-grey text-lg font-bold text-center tracking-wider'>
                    Project information
                  </h4>
                  <XIcon
                    className='w-5 h-5 absolute top-0 right-0 opacity-40 cursor-pointer'
                    aria-hidden='true'
                    onClick={() => showProjectView(false)}
                  />
                </div>
                <div className='pt-10'>
                  <label className='text-sm font-medium' htmlFor='password'>
                    Project name
                  </label>
                  <div className='mt-2 relative'>
                    <InputElement
                      className={`w-full px-4 py-5 text-sm leading-tight rounded-md appearance-none ${
                        errors.projectName
                          ? 'border-danger focus:border-danger'
                          : 'border focus:border-primary'
                      } border focus:border-primary focus:outline-none focus:shadow-outline`}
                      id='projectName'
                      name='projectName'
                      type='text'
                      placeholder='Enter your project name here'
                      ref={register}
                      value={projectInfo.projectName}
                      onChange={handleOnChange}
                    />
                    <p className='text-xxs text-danger mt-2'>
                      {errors.projectName?.message}
                    </p>
                  </div>
                </div>
                <div className='pt-8 flex flex-row items-end'>
                  <div className='w-1/2 mr-4'>
                    <label
                      className='text-sm font-medium'
                      htmlFor='projectClientId'
                    >
                      Client
                    </label>
                    <div className='mt-2 relative'>
                      <SearchClient
                        className={`w-full text-sm leading-tight p-4 rounded-md appearance-none ${
                          errors.projectClientId
                            ? 'border-danger focus:border-danger'
                            : 'border focus:border-primary'
                        } border focus:border-primary focus:outline-none focus:shadow-outline`}
                        id='projectClientId'
                        name='projectClientId'
                        type='text'
                        placeholder='Search client by name or email'
                        ref={register}
                        returnClient={
                          projectInfo && projectInfo.projectClientId
                        }
                        selectedClientId={(selectedClientId) =>
                          setProjectInfo((prevState) => ({
                            ...prevState,
                            projectClientId: selectedClientId,
                          }))
                        }
                      />
                      {errors.projectClientId && (
                        <ExclamationCircleIcon
                          className={`w-5 h-5 ${
                            errors.projectClientId
                              ? 'text-danger'
                              : 'text-correct'
                          } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                          aria-hidden='true'
                        />
                      )}
                      {errors.projectClientId && (
                        <p className='text-xxs text-danger mt-2 absolute'>
                          {errors.projectClientId.message}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className='w-1/2 ml-4 mb-3'>
                    <motion.div
                      className='w-2/5 text-primary text-xs text-center font-bold px-4 py-3 rounded-md cursor-pointer'
                      onClick={() => setIsModal(!isModal)}
                      whileHover='hover'
                      animate='initial'
                      variants={buttonBlueVariants}
                    >
                      Add Client
                    </motion.div>
                  </div>
                </div>
                <div className='pt-8 flex flex-row'>
                  <div className='w-1/2 mr-4'>
                    <label className='text-sm font-medium' htmlFor='password'>
                      Start Date
                    </label>
                    <div className='mt-2'>
                      <DatePicker
                        selected={projectInfo.startDate}
                        onChange={(date) => handleOnStartDate(date)}
                        className='w-full px-4 py-5 relative border rounded-md focus:border-primary focus:outline-none focus:shadow-outline'
                      />
                    </div>
                  </div>
                  <div className='w-1/2 ml-4'>
                    <label className='text-sm font-medium' htmlFor='password'>
                      End Date
                    </label>
                    <div className='mt-2'>
                      <DatePicker
                        selected={projectInfo.dueDate}
                        onChange={(date) => handleOnDueDate(date)}
                        className='w-full px-4 py-5 relative border rounded-md focus:border-primary focus:outline-none focus:shadow-outline'
                      />
                    </div>
                  </div>
                </div>
                <div className='pt-8'>
                  <label className='text-sm font-medium' htmlFor='password'>
                    Notes
                  </label>
                  <div className='mt-2 relative'>
                    <InputElement
                      className={`w-full px-4 py-5 text-sm leading-tight border rounded-md appearance-none ${
                        errors.projectNote
                          ? 'focus:border-danger'
                          : 'focus:border-primary'
                      } focus:border-primary focus:outline-none focus:shadow-outline`}
                      id='projectNote'
                      name='projectNote'
                      type='textarea'
                      placeholder='Optional'
                      ref={register}
                      value={projectInfo.projectNote}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
              </div>
              <div
                className={`w-full h-82vh ${
                  tabActive === 'Type' ? 'block' : 'hidden'
                }`}
              >
                <div className='relative rounded-tl-lg rounded-tr-lg'>
                  <h4 className='text-grey text-lg font-bold text-center tracking-wider'>
                    Project Type
                  </h4>
                  <XIcon
                    className='w-5 h-5 absolute top-0 right-0 opacity-40 cursor-pointer'
                    aria-hidden='true'
                    onClick={() => showProjectView(false)}
                  />
                </div>
                <div className='pt-10'>
                  <div className='text-center flex items-stretch'>
                    <div
                      id={`Time & Material`}
                      className={`text-xs text-center p-4 ${
                        projectInfo.projectType === 'Time & Material'
                          ? 'bg-primary bg-opacity-10 text-primary font-bold border-primary'
                          : ''
                      } border rounded-tl-md rounded-bl-md flex-1 cursor-pointer`}
                      onClick={(e) => handleOnProjectTpye(e.currentTarget.id)}
                    >
                      Time & Material
                    </div>
                    <div
                      id='fixed'
                      className={`text-xs text-center p-4 ${
                        projectInfo.projectType === 'fixed'
                          ? 'bg-primary bg-opacity-10 text-primary font-bold border-primary border-l border-r'
                          : ''
                      } border-t border-b flex-1 cursor-pointer`}
                      onClick={(e) => handleOnProjectTpye(e.currentTarget.id)}
                    >
                      Fixed Fee
                    </div>
                    <div
                      id='billable'
                      className={`text-xs text-center p-4 ${
                        projectInfo.projectType === 'billable'
                          ? 'bg-primary bg-opacity-10 text-primary font-bold border-primary'
                          : ''
                      } border rounded-tr-md rounded-br-md flex-1 cursor-pointer`}
                      onClick={(e) => handleOnProjectTpye(e.currentTarget.id)}
                    >
                      Non-Billable
                    </div>
                  </div>
                </div>
                <div
                  className={`${
                    projectInfo.projectType === 'Time & Material'
                      ? 'block'
                      : 'hidden'
                  } `}
                >
                  <div className='pt-8 flex flex-row space-x-6'>
                    <div className='w-1/2'>
                      <label className='text-sm font-medium' htmlFor='password'>
                        Rate
                        <span className='text-xxs block opacity-60'>
                          We need rates to track your projects billable amount
                        </span>
                      </label>
                      <div className='w-9/12 mt-2 relative z-50'>
                        <DropDownElement
                          className={`w-full p-4 text-sm text-left leading-tight rounded-md appearance-none ${
                            errors.rate
                              ? 'border-danger focus:border-danger'
                              : 'border focus:border-primary'
                          } border focus:border-primary focus:outline-none focus:shadow-outline`}
                          data={rateArr}
                          selectedItem={(selectedItem) =>
                            setProjectInfo((prevState) => ({
                              ...prevState,
                              rate: selectedItem,
                            }))
                          }
                          returnSelectedItem={projectInfo.rate}
                          onChange={handleOnChange}
                        />
                        {errors.rate && (
                          <ExclamationCircleIcon
                            className={`w-5 h-5 ${
                              errors.rate ? 'text-danger' : 'text-correct'
                            } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                            aria-hidden='true'
                          />
                        )}
                        {errors.rate && (
                          <p className='text-xxs text-danger mt-2 absolute'>
                            {errors.rate.message}
                          </p>
                        )}
                      </div>
                    </div>
                    <div
                      className='w-1/2 relative'
                      style={{ marginTop: '3.3rem' }}
                    >
                      <InputElement
                        className={`w-7/12 p-4 text-sm leading-tight rounded-md appearance-none ${
                          errors.amount
                            ? 'border-danger focus:border-danger'
                            : 'border focus:border-primary'
                        } border focus:border-primary focus:outline-none focus:shadow-outline`}
                        id='amount'
                        name='amount'
                        type='number'
                        placeholder='Enter the amount'
                        ref={register}
                        value={projectInfo.amount}
                        onChange={handleOnChange}
                      />
                      {errors.amount && (
                        <ExclamationCircleIcon
                          className={`w-5 h-5 ${
                            errors.amount ? 'text-danger' : 'text-correct'
                          } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                          aria-hidden='true'
                        />
                      )}
                    </div>
                  </div>
                  <div className='pt-8 flex flex-row'>
                    <div className='w-1/2'>
                      <label className='text-sm font-medium' htmlFor='password'>
                        Budget
                        <span className='text-xxs block opacity-60'>
                          We need set the budget per person.
                        </span>
                      </label>
                      <div className='w-9/12 relative z-40'>
                        <DropDownElement
                          className={`w-full p-4 text-sm text-left leading-tight rounded-md appearance-none ${
                            errors.budget
                              ? 'border-danger focus:border-danger'
                              : 'border focus:border-primary'
                          } border focus:border-primary focus:outline-none focus:shadow-outline`}
                          placeholder='Hours per person'
                          data={personArr}
                          selectedItem={(selectedItem) =>
                            setProjectInfo((prevState) => ({
                              ...prevState,
                              budget: selectedItem,
                            }))
                          }
                          returnSelectedItem={projectInfo.budget}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`w-full h-82vh ${
                  tabActive === 'Selection' ? 'block' : 'hidden'
                }`}
              >
                <div className='relative rounded-tl-lg rounded-tr-lg'>
                  <h4 className='text-grey text-lg font-bold text-center tracking-wider'>
                    Who can manage the project
                  </h4>
                  {tabsStatus.tabStatusEdit && (
                    <p className='w-full text-xs text-danger text-center mt-1 absolute flex items-center justify-center'>
                      Please select who can manage the project
                    </p>
                  )}
                  <XIcon
                    className='w-5 h-5 absolute top-0 right-0 opacity-40 cursor-pointer'
                    aria-hidden='true'
                    onClick={() => showProjectView(false)}
                  />
                </div>
                <div className='w-3/4 mx-auto flex flex-col space-y-6'>
                  <div
                    id='Everyone'
                    className={`${
                      selectedCanEdit === 'Everyone'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } ${
                      projectInfo.whoCanEdit === 'Everyone'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } mt-12 py-7 px-5 flex items-center border rounded-lg cursor-pointer hover:bg-primary hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleOnCanEdit(e.currentTarget.id)}
                  >
                    <UserGroupIcon
                      className={`w-8 h-8 ${
                        selectedCanEdit === 'Everyone'
                          ? 'text-primary opacity-100'
                          : ''
                      } ${
                        projectInfo.whoCanEdit === 'Everyone'
                          ? 'text-primary opacity-100'
                          : ''
                      } ml-2 opacity-20`}
                      aria-hidden='true'
                    />
                    <h4
                      className={`text-md font-bold text-left ${
                        selectedCanEdit === 'Everyone' ? 'text-grey' : ''
                      } ml-6`}
                    >
                      Everyone
                      <p className='text-grey text-xs opacity-40'>
                        All users from same department can access this project.
                      </p>
                    </h4>
                  </div>
                  <div
                    id='Creator'
                    className={`${
                      selectedCanEdit === 'Creator'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } ${
                      projectInfo.whoCanEdit === 'Creator'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } mt-12 py-7 px-5 flex items-center border rounded-lg cursor-pointer hover:bg-primary hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleOnCanEdit(e.currentTarget.id)}
                  >
                    <UserIcon
                      className={`w-8 h-8 ${
                        selectedCanEdit === 'Creator'
                          ? 'text-primary opacity-100'
                          : ''
                      } ${
                        projectInfo.whoCanEdit === 'Creator'
                          ? 'text-primary opacity-100'
                          : ''
                      } ml-2 opacity-20`}
                      aria-hidden='true'
                    />
                    <h4
                      className={`text-md font-bold text-left ${
                        selectedCanEdit === 'Creator' ? 'text-grey' : ''
                      } ml-6`}
                    >
                      Only Creator's
                      <p className='text-grey text-xs opacity-40'>
                        Only the creator's can manage this project.
                      </p>
                    </h4>
                  </div>
                  <div
                    id='Specific'
                    className={`${
                      selectedCanEdit === 'Specific'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } ${
                      projectInfo.whoCanEdit === 'Specific'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } py-7 px-5 flex items-center border rounded-lg cursor-pointer hover:bg-primary hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleOnCanEdit(e.currentTarget.id)}
                  >
                    <UsersIcon
                      className={`w-8 h-8 ${
                        selectedCanEdit === 'Specific'
                          ? 'text-primary opacity-100'
                          : ''
                      } ${
                        projectInfo.whoCanEdit === 'Specific'
                          ? 'text-primary opacity-100'
                          : ''
                      } ml-2 opacity-20`}
                      aria-hidden='true'
                    />
                    <h4
                      className={`text-md font-bold text-left ${
                        selectedCanEdit === 'Specific' ? 'text-primary' : ''
                      } ml-6`}
                    >
                      Only to Specific People or Team
                      <p className='text-grey text-xs opacity-40'>
                        Only some specific people or team can manage this
                        project.
                      </p>
                    </h4>
                  </div>
                  {projectInfo.whoCanEdit === 'Specific' ? (
                    <div className='w-full mx-auto relative z-40'>
                      <h5 className='text-xs text-leftz font-bold mb-2 opacity-60'>
                        Assigned the people or team for this project.
                      </h5>
                      <SearchAssignee
                        className={`w-full px-4 py-5 text-xs leading-tight rounded-md appearance-none ${
                          errors.taskName
                            ? 'border-danger focus:border-danger'
                            : 'border focus:border-primary'
                        } border focus:border-primary focus:outline-none focus:shadow-outline`}
                        id='taskName'
                        name='taskName'
                        type='text'
                        placeholder='Search people/team by name or email'
                        ref={register}
                        returnAccount={accountById}
                        accounts={accountsList}
                        returnTeam={teamById}
                        teams={teamsList}
                        selectedAssigneeId={(selectedAssigneeId) =>
                          setProjectInfo((prevState) => ({
                            ...prevState,
                            whoCanEditId: selectedAssigneeId,
                          }))
                        }
                      />
                    </div>
                  ) : null}
                </div>
              </div>

              <div className='w-1/4 absolute right-0 bottom-0'>
                {tabIndex === tabArr.length - 1 ? (
                  <button
                    type='submit'
                    className='bg-primary w-full text-sm text-white font-bold tracking-wider px-2 py-4 rounded-md shadow-lg hover:bg-dark'
                  >
                    Update Project
                  </button>
                ) : (
                  <div
                    className='bg-primary w-full text-sm text-white text-center font-bold tracking-wider px-2 py-4 rounded-md shadow-lg cursor-pointer'
                    onClick={() => handleNextTab()}
                  >
                    Next
                  </div>
                )}
              </div>
              <div className='w-full mt-16 mb-6'>
                <ul className='flex flex-row items-center justify-center'>
                  {tabSelected.map((option, index) => (
                    <li
                      key={index}
                      id={option}
                      className={`${
                        tabActive === option
                          ? 'bg-primary w-22px'
                          : 'bg-darkGrey w-8px'
                      } h-8px text-lg text-primary text-center m-1 rounded-full cursor-pointer`}
                      onClick={() => handleSelectedTab(option)}
                    >
                      <span className='hidden'>{option}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      {isModal && (
        <CreateClient
          isModal={(isModal) => setIsModal(isModal)}
          showModalClient={(showModal) => showModalClient(showModal)}
        />
      )}
    </AnimatePresence>
  );
};

export default ProjectView;
