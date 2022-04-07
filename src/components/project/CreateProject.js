import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { UserGroupIcon, UsersIcon } from '@heroicons/react/solid';
import {
  DocumentTextIcon,
  UserIcon,
  CashIcon,
  XIcon,
  ExclamationCircleIcon,
  DesktopComputerIcon,
  DeviceMobileIcon,
  TemplateIcon,
  PencilAltIcon,
} from '@heroicons/react/outline';

import { getAccounts } from '../../redux/actions/accountActions';
import { registerProject } from '../../redux/actions/projectActions';
import { getTeams } from '../../redux/actions/utilitiesActions';
import CreateClient from '../../components/settings/client/CreateClient';
import InputElement from '../ui/InputElement';
import SearchClient from '../settings/client/SearchClient';
import SearchAssignee from '../SearchAssignee';
import { DropDownElement } from '../ui/DropDownElement';

const schema = yup.object().shape({
  projectName: yup.string().required('Please enter project name here'),
  projectClientId: yup
    .string()
    .required('Please choose your client for this project'),
  amount: yup.number().min(1, 'Amount must be greater than 1'),
});

const backdrop = {
  hidden: { display: 'none' },
  visible: { display: 'flex', transition: { delay: 0.2 } },
};

const modal = {
  hidden: { position: 'relative', top: '-120', scale: 0 },
  visible: {
    top: '0',
    scale: 1,
    transition: { delay: 0.5, type: 'spring', stiffness: 120 },
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

const CreateProject = ({ showProjectCreate, showModal, validationError }) => {
  const [accountsList, setAccountsList] = useState({});
  const [teamsList, setTeamsList] = useState({});
  const [projOwner, setProjOwner] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [projectInfo, setProjectInfo] = useState({
    projectCategory: '',
    projectName: '',
    projectClientId: '',
    startDate: new Date(),
    dueDate: new Date(),
    projectType: '',
    rate: 'Hourly rate',
    amount: 0,
    budget: 'Hours per Person',
    projectNote: '',
    whoCanEdit: '',
    whoCanEditId: '',
  });

  const [tabSelected, setTabSelected] = useState(tabArr);
  const [tabActive, setTabActive] = useState(tabArr[0]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [selectedType, setSelectedType] = useState('Time & Material');
  const [selectedCanEdit, setSelectedCanEdit] = useState();
  const [selectedView, setSelectedView] = useState();
  let [tabIndex, setTabIndex] = useState(0);
  const [isModal, setIsModal] = useState();
  const [showModalClient, setShowModalClient] = useState(false);

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const dispatch = useDispatch();

  const accountsGet = useSelector((state) => state.accountsGet);
  const { accounts } = accountsGet;

  const projectRegister = useSelector((state) => state.projectRegister);
  const { project, error } = projectRegister;

  const teamListGet = useSelector((state) => state.teamListGet);
  const { teams } = teamListGet;

  const handleOnChange = (e) => {
    const { name, value } = e.target;

    setProjectInfo((data) => ({ ...data, [name]: value }));
  };

  const handleOnSubmit = () => {
    dispatch(registerProject(projectInfo));
    // if (errors) {
    //   validationError(errors);
    // }
    // if (!projectInfo.whoCanEdit) {
    //   setTabStatusEdit(true);
    // } else if (!projectInfo.viewType) {
    //   setTabStatusView(true);
    // } else {
    //   dispatch(registerProject(projectInfo));
    // }
  };

  const handleNextTab = () => {
    var currentTabIndex;
    currentTabIndex = tabIndex + 1;
    setTabActive(tabArr[currentTabIndex]);
    setTabIndex(currentTabIndex);
  };

  const handleSelectedTab = (e) => {
    setTabIndex(tabArr.indexOf(e));
    setTabActive(tabArr[tabArr.indexOf(e)]);
  };

  const handleOnStartDate = (date) => {
    setProjectInfo((prevState) => ({
      ...prevState,
      startDate: date,
    }));
  };

  const handleOnDueDate = (date) => {
    setProjectInfo((prevState) => ({
      ...prevState,
      dueDate: date,
    }));
  };

  const handleOnCategory = (selected) => {
    setProjectInfo((prevState) => ({
      ...prevState,
      projectCategory: selected,
    }));
    setSelectedCategory(selected);
  };

  const handleOnCanEdit = (selected) => {
    setProjectInfo((prevState) => ({
      ...prevState,
      whoCanEdit: selected,
    }));
    setSelectedCanEdit(selected);
  };

  const handleOnProjectTpye = (selected) => {
    setSelectedType(selected);
  };

  useEffect(() => {
    setProjectInfo((prevState) => ({
      ...prevState,
      projectType: selectedType,
    }));
  }, [selectedType]);

  useEffect(() => {
    if (accounts === undefined || accounts.length === 0) {
      dispatch(getAccounts());
    } else {
      setAccountsList(accounts);
    }
    if (teams === undefined || teams.length === 0) {
      dispatch(getTeams());
    }

    if (project) {
      showModal(true);
      showProjectCreate(false);
    }
  }, [accounts, project, error]);

  useEffect(() => {
    if (projectInfo.whoCanEdit === 'Everyone') {
      setProjectInfo((prevState) => ({
        ...prevState,
        whoCanEditId: '',
      }));
    } else if (projectInfo.whoCanEdit === 'Creator') {
      setProjectInfo((prevState) => ({
        ...prevState,
        whoCanEditId: projOwner._id,
      }));
    }
  }, [projOwner._id, projectInfo.whoCanEdit]);

  // useEffect(() => {
  //   if (Object.entries(errors).length !== 0) {
  //     validationError(errors);
  //   }
  // }, [errors]);

  return (
    <AnimatePresence>
      {showProjectCreate && (
        <motion.div
          className='backdrop bg-darkLight bg-opacity-60 flex items-center fixed top-0 left-0 bottom-0 right-0 z-50'
          variants={backdrop}
          initial='hidden'
          animate='visible'
          exit='hidden'
        >
          <motion.div
            className='modal w-4/12 bg-white mx-auto p-8 flex flex-col rounded-lg'
            variants={modal}
          >
            <form
              className='form-container w-full flex flex-col relative'
              onSubmit={handleSubmit(handleOnSubmit)}
            >
              <div
                className={`w-full ${
                  tabActive === 'Category' ? 'block' : 'hidden'
                }`}
              >
                <div className='relative rounded-tl-lg rounded-tr-lg'>
                  <h4 className='text-grey text-lg font-bold text-center'>
                    SELECT CATEGORY
                  </h4>
                  {error && (
                    <p className='w-full text-xxs text-danger text-center mt-2 absolute'>
                      {error.projectCategory?.msg}
                    </p>
                  )}
                  <XIcon
                    className='w-5 h-5 absolute top-0 right-0 opacity-40 cursor-pointer'
                    aria-hidden='true'
                    onClick={() => showProjectCreate(false)}
                  />
                </div>
                <div className='mt-12 flex justify-center space-x-6'>
                  <div
                    id='Mobile Development'
                    className={`w-2/6 ${
                      selectedCategory === 'Mobile Development'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } py-12 px-6 border rounded-lg cursor-pointer transition duration-500 ease-in-out hover:bg-primary hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleOnCategory(e.currentTarget.id)}
                  >
                    <DeviceMobileIcon
                      className={`${
                        selectedCategory === 'Mobile Development'
                          ? 'text-primary opacity-10'
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
                    } py-12 px-6 border rounded-lg cursor-pointer hover:bg-primary transition duration-500 ease-in-out hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleOnCategory(e.currentTarget.id)}
                  >
                    <DesktopComputerIcon
                      className={`${
                        selectedCategory === 'Web Development'
                          ? 'text-primary opacity-10'
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
                    } py-12 px-8  border rounded-lg cursor-pointer hover:bg-primary transition duration-500 ease-in-out hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleOnCategory(e.currentTarget.id)}
                  >
                    <TemplateIcon
                      className={`${
                        selectedCategory === 'Design'
                          ? 'text-primary opacity-10'
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
                    } py-12 px-8 border rounded-lg cursor-pointer transition duration-500 ease-in-out hover:bg-primary hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleOnCategory(e.currentTarget.id)}
                  >
                    <PencilAltIcon
                      className={`${
                        selectedCategory === 'Branding'
                          ? 'text-primary opacity-10'
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
                className={`w-full ${
                  tabActive === 'Create' ? 'block' : 'hidden'
                }`}
              >
                <div className='relative rounded-tl-lg rounded-tr-lg'>
                  <h4 className='text-grey text-lg font-bold text-center'>
                    CREATE PROJECT
                  </h4>
                  <XIcon
                    className='w-5 h-5 absolute top-0 right-0 opacity-40 cursor-pointer'
                    aria-hidden='true'
                    onClick={() => showProjectCreate(false)}
                  />
                </div>
                <div className='pt-10'>
                  <label className='text-sm font-medium' htmlFor='password'>
                    Project name
                  </label>
                  <div className='mt-2 relative'>
                    <InputElement
                      className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                        errors.projectName ? 'border-danger' : 'border'
                      } ${
                        error && error.projectName ? 'border-danger' : 'border'
                      } focus:border-primary outline-none shadow-outline`}
                      id='projectName'
                      name='projectName'
                      type='text'
                      placeholder='Enter your project name here'
                      ref={register}
                      value={projectInfo.projectName}
                      onChange={handleOnChange}
                    />
                    <DocumentTextIcon
                      className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                      aria-hidden='true'
                    />
                    {errors.projectName ? (
                      <ExclamationCircleIcon
                        className={`w-5 h-5 ${
                          errors.projectName ? 'text-danger' : 'text-correct'
                        } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                        aria-hidden='true'
                      />
                    ) : error?.projectName ? (
                      <ExclamationCircleIcon
                        className={`w-5 h-5 ${
                          error?.projectName ? 'text-danger' : 'text-correct'
                        } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                        aria-hidden='true'
                      />
                    ) : null}
                    <p className='text-xxs text-danger mt-2 absolute'>
                      {errors.projectName?.message}
                      {error && error.projectName?.msg}
                    </p>
                  </div>
                </div>
                <div className='mt-6 flex flex-row items-end'>
                  <div className='w-1/2'>
                    <label
                      className='text-sm font-medium'
                      htmlFor='projectClientId'
                    >
                      Client
                    </label>
                    <div className='mt-2 relative'>
                      <SearchClient
                        className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                          errors.projectClientId ? 'border-danger' : 'border'
                        } ${
                          error && error.projectClientId
                            ? 'border-danger'
                            : 'border'
                        } focus:border-primary outline-none shadow-outline`}
                        id='projectClientId'
                        name='projectClientId'
                        type='text'
                        placeholder='Search client by name or email'
                        ref={register}
                        selectedClientId={(selectedClientId) =>
                          setProjectInfo((prevState) => ({
                            ...prevState,
                            projectClientId: selectedClientId,
                          }))
                        }
                      />
                      {errors.projectClientId ? (
                        <ExclamationCircleIcon
                          className={`w-5 h-5 ${
                            errors.projectClientId
                              ? 'text-danger'
                              : 'text-correct'
                          } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                          aria-hidden='true'
                        />
                      ) : error?.projectClientId ? (
                        <ExclamationCircleIcon
                          className={`w-5 h-5 ${
                            error?.projectClientId
                              ? 'text-danger'
                              : 'text-correct'
                          } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                          aria-hidden='true'
                        />
                      ) : null}
                      <p className='text-xxs text-danger mt-2 absolute'>
                        {errors.projectClientId?.message}
                        {error && error.projectClientId?.msg}
                      </p>
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
                <div className='mt-6 flex flex-row space-x-6'>
                  <div className='w-1/2'>
                    <label className='text-sm font-medium' htmlFor='password'>
                      Start
                    </label>
                    <div className='mt-2'>
                      <DatePicker
                        id='startDate'
                        selected={projectInfo.startDate}
                        minDate={new Date()}
                        onChange={(date) => handleOnStartDate(date)}
                        className={`w-full text-xs p-4 relative ${
                          errors.startDate
                            ? 'border-danger focus:border-danger'
                            : 'border focus:border-primary'
                        } border rounded-md focus:border-primary focus:outline-none focus:shadow-outline`}
                      />
                    </div>
                  </div>
                  <div className='w-1/2'>
                    <label className='text-sm font-medium' htmlFor='password'>
                      End
                    </label>
                    <div className='mt-2'>
                      <DatePicker
                        id='dueDate'
                        selected={projectInfo.dueDate}
                        minDate={new Date()}
                        onChange={(date) => handleOnDueDate(date)}
                        className='w-full text-xs p-4 relative border rounded-md focus:border-primary focus:outline-none focus:shadow-outline'
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-6'>
                  <label className='text-sm font-medium' htmlFor='password'>
                    Notes
                  </label>
                  <div className='mt-2 relative'>
                    <InputElement
                      className={`w-full p-4 text-xs leading-tight border rounded-md appearance-none ${
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
                className={`w-full ${
                  tabActive === 'Type' ? 'block' : 'hidden'
                }`}
              >
                <div className='relative rounded-tl-lg rounded-tr-lg'>
                  <h4 className='text-grey text-lg font-bold text-center'>
                    PROJECT TYPE
                  </h4>
                  <XIcon
                    className='w-5 h-5 absolute top-0 right-0 opacity-40 cursor-pointer'
                    aria-hidden='true'
                    onClick={() => showProjectCreate(false)}
                  />
                </div>
                <div className='pt-10'>
                  <div className='text-center flex items-stretch'>
                    <div
                      id={`Time & Material`}
                      className={`text-xs text-center p-4 ${
                        selectedType === 'Time & Material'
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
                        selectedType === 'fixed'
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
                        selectedType === 'billable'
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
                    selectedType === 'Time & Material' ? 'block' : 'hidden'
                  } `}
                >
                  <div className='mt-6 flex flex-row space-x-6'>
                    <div className='w-1/2'>
                      <label className='text-sm font-medium' htmlFor='rate'>
                        Rate
                        <span className='text-xxs block opacity-60'>
                          We need rates to track your projects billable amount
                        </span>
                      </label>
                      <div className='w-9/12 mt-2 relative z-50'>
                        <DropDownElement
                          className={`w-full p-4 text-xs text-left leading-tight rounded-md appearance-none ${
                            errors.rate
                              ? 'border-danger focus:border-danger'
                              : 'border focus:border-primary'
                          } border focus:border-primary focus:outline-none focus:shadow-outline`}
                          name='rate'
                          data={rateArr}
                          selectedItem={(selectedItem) =>
                            setProjectInfo((prevState) => ({
                              ...prevState,
                              rate: selectedItem,
                            }))
                          }
                          onChange={handleOnChange}
                        />
                      </div>
                    </div>
                    <div className='w-1/2'>
                      <label className='text-sm font-medium' htmlFor='budget'>
                        Budget
                        <span className='text-xxs block opacity-60'>
                          We need set the budget per person.
                        </span>
                      </label>
                      <div className='w-9/12 mt-2 relative z-40'>
                        <DropDownElement
                          className={`w-full p-4 text-xs text-left leading-tight rounded-md appearance-none ${
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
                          label='rate for the project'
                        />
                      </div>
                    </div>
                  </div>
                  <div className='mt-6 flex flex-row'>
                    <div className='w-1/2 relative'>
                      <label className='text-sm font-medium' htmlFor='amount'>
                        Amount
                        <span className='text-xxs block opacity-60'>
                          Specify the amount per person
                        </span>
                      </label>
                      <div className='w-4/12 relative mt-2'>
                        <InputElement
                          className={`w-full text-xs leading-tight py-4 pl-10 pr-4 rounded-md appearance-none ${
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
                        <CashIcon
                          className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                          aria-hidden='true'
                        />
                        <p className='text-xxs text-danger mt-2 absolute'>
                          {errors.amount?.message}
                          {error && error.amount?.msg}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={`w-full ${
                  tabActive === 'Selection' ? 'block' : 'hidden'
                }`}
              >
                <div className='relative rounded-tl-lg rounded-tr-lg'>
                  <h4 className='text-grey text-lg font-bold text-center'>
                    WHO CAN MANAGE THE PROJECT
                  </h4>
                  <p className='w-full text-xxs text-danger text-center mt-2 absolute'>
                    {error && error.whoCanEdit?.msg}
                  </p>
                  <XIcon
                    className='w-5 h-5 absolute top-0 right-0 opacity-40 cursor-pointer'
                    aria-hidden='true'
                    onClick={() => showProjectCreate(false)}
                  />
                </div>
                <div className='w-3/4 mx-auto flex flex-col space-y-6'>
                  <div
                    id='Everyone'
                    className={`${
                      selectedCanEdit === 'Everyone'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } mt-12 py-7 px-5 flex items-center border rounded-lg cursor-pointer hover:bg-primary hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleOnCanEdit(e.currentTarget.id)}
                  >
                    <UserGroupIcon
                      className={`w-8 h-8 ${
                        selectedCanEdit === 'Everyone'
                          ? 'text-primary opacity-10'
                          : ''
                      } ml-2 opacity-20`}
                      aria-hidden='true'
                    />
                    <h4
                      className={`text-md font-bold text-left ${
                        selectedCanEdit === 'Everyone' ? 'text-primary' : ''
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
                    } mt-12 py-7 px-5 flex items-center border rounded-lg cursor-pointer hover:bg-primary hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleOnCanEdit(e.currentTarget.id)}
                  >
                    <UserIcon
                      className={`w-8 h-8 ${
                        selectedCanEdit === 'Creator'
                          ? 'text-primary opacity-10'
                          : ''
                      } ml-2 opacity-20`}
                      aria-hidden='true'
                    />
                    <h4
                      className={`text-md font-bold text-left ${
                        selectedCanEdit === 'Creator' ? 'text-primary' : ''
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
                    } py-7 px-5 flex items-center border rounded-lg cursor-pointer hover:bg-primary hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleOnCanEdit(e.currentTarget.id)}
                  >
                    <UsersIcon
                      className={`w-8 h-8 ${
                        selectedCanEdit === 'Specific'
                          ? 'text-primary opacity-10'
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
                        accounts={accountsList}
                        teams={teams}
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
                    CREATE
                  </button>
                ) : (
                  <div
                    className='bg-primary w-full text-sm text-white text-center font-bold tracking-wider px-2 py-4 rounded-md shadow-lg cursor-pointer'
                    onClick={() => handleNextTab()}
                  >
                    NEXT
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
            {isModal && (
              <CreateClient
                isModal={(isModal) => setIsModal(isModal)}
                showModalClient={(showModal) => showModalClient(showModal)}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateProject;
