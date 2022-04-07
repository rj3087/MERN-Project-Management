import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  XIcon,
  ChevronRightIcon,
  OfficeBuildingIcon,
  ExclamationCircleIcon,
  UserGroupIcon,
  MailIcon,
} from '@heroicons/react/outline';

import { getAccounts } from '../../redux/actions/accountActions';
import { registerTeam } from '../../redux/actions/utilitiesActions';
import InputElement from '../ui/InputElement';
import SearchAssignee from '../SearchReporter';
import SearchDepartment from './department/SearchDepartment';
import InvitePeople from '../InvitePeople';
import SuccessConfirmation from '../notifications/SuccessConfirmation';

const schema = yup.object().shape({
  teamName: yup
    .string()
    .min(6, 'Name must be at least 8 characters.')
    .required('Please enter team name'),
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
    backgroundColor: '#3F52E3',
    scale: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 60,
      ease: 'easeInOut',
    },
  },
  hover: {
    backgroundColor: '#2e3db0',
    scale: 1.1,
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 60,
      ease: 'easeInOut',
    },
  },
};

const tabArr = ['Create', 'Members'];

const CreateTeam = ({ isModal, showTeamModal }) => {
  const [accountInfo, setAccountInfo] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [accountsList, setAccountsList] = useState();
  const [teamInfo, setTeamInfo] = useState({
    teamName: '',
    teamEmail: '',
    teamDepartmentId: '',
    teamLeadId: '',
    teamDescription: '',
    invitedPeopleId: [],
  });
  const [tabSelected, setTabSelected] = useState(tabArr);
  const [tabActive, setTabActive] = useState(tabArr[0]);
  let [tabIndex, setTabIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const accountsGet = useSelector((state) => state.accountsGet);
  const { accounts } = accountsGet;

  const teamRegister = useSelector((state) => state.teamRegister);
  const { team, error } = teamRegister;

  const dispatch = useDispatch();

  const { register, errors, handleSubmit } = useForm({
    // resolver: yupResolver(schema),
    mode: 'all',
  });

  const handleNextTab = () => {
    let currentTabIndex;
    currentTabIndex = tabIndex + 1;
    setTabActive(tabArr[currentTabIndex]);
    setTabIndex(currentTabIndex);
  };

  const handleSelectedTab = (e) => {
    setTabIndex(tabArr.indexOf(e));
    setTabActive(tabArr[tabArr.indexOf(e)]);
  };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setTeamInfo((data) => ({ ...data, [name]: value }));
  };

  const handleOnSubmit = () => {
    dispatch(registerTeam(teamInfo));
    // showModal(true);
    // isModal(false);
    setShowModal(true);
  };

  useEffect(() => {
    if (accounts === undefined || accounts.length === 0) {
      dispatch(getAccounts());
    } else {
      setAccountsList(accounts);
    }
    if (showModal) {
      setShowAlert(true);
    }
  }, [accounts, dispatch, showModal]);

  return (
    <AnimatePresence>
      {isModal && (
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
              <div className='w-full'>
                <div
                  className={`w-full ${
                    tabActive === 'Create' ? 'block' : 'hidden'
                  }`}
                >
                  <div className='relative'>
                    <XIcon
                      className='w-5 h-5 absolute top-0 left-0 opacity-40 cursor-pointer'
                      aria-hidden='true'
                      onClick={() => isModal(false)}
                    />
                    <h4 className='text-grey text-lg font-bold text-center tracking-wider'>
                      Create a team
                      <p className='w-3/4 text-xxs font-normal leading-4 text-center mt-1 mx-auto opacity-60'>
                        Create new team for your project, if you are creating a
                        project for an existing team, please skip this step.
                      </p>
                    </h4>
                    <div
                      className='text-sm flex items-center absolute top-0 right-0 opacity-60 cursor-pointer'
                      onClick={handleNextTab}
                    >
                      Next
                      <ChevronRightIcon
                        className='w-5 h-5 ml-2'
                        aria-hidden='true'
                      />
                    </div>
                  </div>
                  <div className='pt-6'>
                    <label className='text-xs' htmlFor='teamName'>
                      Team Name
                    </label>
                    <div className='mt-1 relative'>
                      <InputElement
                        className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                          errors.teamName ? 'border-danger' : 'border'
                        } ${
                          error && error.teamName ? 'border-danger' : 'border'
                        } focus:border-primary outline-none shadow-outline`}
                        id='teamName'
                        name='teamName'
                        type='text'
                        placeholder='Team name'
                        ref={register}
                        value={setTeamInfo.teamName}
                        onChange={handleOnChange}
                      />
                      <UserGroupIcon
                        className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                        aria-hidden='true'
                      />
                      {errors.teamName ? (
                        <ExclamationCircleIcon
                          className={`w-5 h-5 ${
                            errors.teamName ? 'text-danger' : 'text-correct'
                          } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                          aria-hidden='true'
                        />
                      ) : error?.teamName ? (
                        <ExclamationCircleIcon
                          className={`w-5 h-5 ${
                            error?.teamName ? 'text-danger' : 'text-correct'
                          } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                          aria-hidden='true'
                        />
                      ) : null}
                      <p className='text-xxs text-danger mt-2 absolute'>
                        {errors.teamName?.message}
                        {error && error.teamName?.msg}
                      </p>
                    </div>
                  </div>
                  <div className='pt-6'>
                    <label className='text-xs' htmlFor='teamEmail'>
                      Team Email
                    </label>
                    <div className='mt-1 relative'>
                      <InputElement
                        className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                          errors.teamEmail ? 'border-danger' : 'border'
                        } ${
                          error && error.teamEmail ? 'border-danger' : 'border'
                        } focus:border-primary outline-none shadow-outline`}
                        id='teamEmail'
                        name='teamEmail'
                        type='text'
                        placeholder='Team email'
                        ref={register}
                        value={setTeamInfo.teamEmail}
                        onChange={handleOnChange}
                      />
                      <MailIcon
                        className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                        aria-hidden='true'
                      />
                      {errors.teamEmail ? (
                        <ExclamationCircleIcon
                          className={`w-5 h-5 ${
                            errors.teamEmail ? 'text-danger' : 'text-correct'
                          } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                          aria-hidden='true'
                        />
                      ) : error?.teamEmail ? (
                        <ExclamationCircleIcon
                          className={`w-5 h-5 ${
                            error?.teamEmail ? 'text-danger' : 'text-correct'
                          } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                          aria-hidden='true'
                        />
                      ) : null}
                      <p className='text-xxs text-danger mt-2 absolute'>
                        {errors.teamEmail?.message}
                        {error && error.teamEmail?.msg}
                      </p>
                    </div>
                  </div>
                  <div className='pt-6'>
                    <label className='text-xs' htmlFor='teamDepartmentId'>
                      Department
                      <span className='text-xxs ml-1 opacity-60'>
                        (Optional)
                      </span>
                    </label>
                    <div className='mt-1 relative'>
                      <SearchDepartment
                        placeholder='Select department'
                        errorClassName={`border ${
                          error && error.department ? 'border-danger' : 'border'
                        } focus:border-primary outline-none shadow-outline`}
                        selectedDepartmentId={(selectedDepartmentId) =>
                          setTeamInfo((prevState) => ({
                            ...prevState,
                            teamDepartmentId: selectedDepartmentId,
                          }))
                        }
                      />
                      <OfficeBuildingIcon
                        className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                        style={{ zIndex: 60 }}
                        aria-hidden='true'
                      />
                    </div>
                  </div>
                  <div className='pt-6'>
                    <label className='text-xs' htmlFor='teamLeadId'>
                      Team Lead
                    </label>
                    <div className='mt-1 flex'>
                      <div className='w-full relative z-50'>
                        <SearchAssignee
                          className={`w-full px-4 py-5 text-xs leading-tight rounded-md appearance-none border focus:border-primary focus:outline-none focus:shadow-outline`}
                          id='teamLeadId'
                          name='teamLeadId'
                          type='text'
                          placeholder='Search team lead by name or email'
                          ref={register}
                          defaultUser={accountInfo._id}
                          accounts={accountsList}
                          selectedAssigneeId={(selectedAssigneeId) =>
                            setTeamInfo((prevState) => ({
                              ...prevState,
                              teamLeadId: selectedAssigneeId,
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className='pt-6'>
                    <label className='text-xs' htmlFor='teamDescription'>
                      Team Description
                    </label>
                    <div className='mt-2 relative'>
                      <InputElement
                        className={`w-full px-4 py-5 text-xs leading-tight border rounded-md appearance-none ${
                          errors.teamDescription
                            ? 'focus:border-danger'
                            : 'focus:border-primary'
                        } focus:border-primary focus:outline-none focus:shadow-outline`}
                        id='teamDescription'
                        name='teamDescription'
                        type='textarea'
                        placeholder='Optional'
                        ref={register}
                        value={teamInfo.teamDescription}
                        onChange={handleOnChange}
                      />
                    </div>
                  </div>
                </div>
                <div
                  className={`w-full ${
                    tabActive === 'Members' ? 'block' : 'hidden'
                  }`}
                >
                  <div className='relative'>
                    <XIcon
                      className='w-5 h-5 absolute top-0 left-0 opacity-40 cursor-pointer'
                      aria-hidden='true'
                      onClick={() => isModal(false)}
                    />
                    <h4 className='text-grey text-lg font-bold text-center tracking-wider'>
                      Invite members
                      <p className='w-2/4 text-xxs font-normal leading-4 text-center mt-1 mx-auto opacity-60'>
                        Search the name or email address of the member.
                      </p>
                    </h4>
                  </div>
                  <div className='mt-10 flex'>
                    <div className='w-full mr-2 relative z-50'>
                      <InvitePeople
                        className={`w-full px-4 py-5 text-sm leading-tight rounded-md appearance-none border focus:border-primary focus:outline-none focus:shadow-outline`}
                        id='invitedPeopleId'
                        name='invitedPeopleId'
                        type='text'
                        placeholder='Search team member by name or email'
                        ref={register}
                        accounts={accountsList}
                        selectedPeopleId={(selectedPeopleId) =>
                          setTeamInfo((prevState) => ({
                            ...prevState,
                            invitedPeopleId: selectedPeopleId,
                          }))
                        }
                        showAddInput={true}
                      />
                    </div>
                  </div>
                  <div className='w-1/4 absolute right-0 bottom-0'>
                    <motion.button
                      type='submit'
                      className='bg-primary w-full text-white text-xs text-white font-bold tracking-wider py-4 rounded-md'
                      whileHover='hover'
                      animate='initial'
                      variants={buttonBlueVariants}
                    >
                      Create team
                    </motion.button>
                  </div>
                </div>
              </div>
              <div className='w-full mt-16 mb-4'>
                <ul className='flex flex-row items-center justify-center'>
                  {tabSelected.map((option) => (
                    <li
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
      {showAlert &&
        (team ? (
          <SuccessConfirmation
            type='password'
            title='Team registration success'
            message={team?.msg}
            showModal={(showModal) => setShowModal(showModal)}
          />
        ) : null)}
    </AnimatePresence>
  );
};

export default CreateTeam;
