import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  OfficeBuildingIcon,
  MailIcon,
  XIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';

import { getAccounts } from '../../../redux/actions/accountActions';
import { registerDepartment } from '../../../redux/actions/utilitiesActions';
import InputElement from '../../ui/InputElement';
import SearchReporter from '../../SearchReporter';
import SuccessConfirmation from '../../notifications/SuccessConfirmation';

const schema = yup.object().shape({
  departmentName: yup
    .string()
    .min(8, 'Name must be at least 8 characters.')
    .required('Please Enter First Name'),
  departmentEmail: yup
    .string()
    .email('Please enter valid Email Address')
    .required('Please enter Email Address'),
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

const CreateDepartment = ({ isModal, showDeptModal, currentAccount }) => {
  const [accountsList, setAccountsList] = useState();
  const [departmentInfo, setDepartmentInfo] = useState({
    departmentName: '',
    departmentHeadId: currentAccount._id,
    departmentEmail: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const accountsGet = useSelector((state) => state.accountsGet);
  const { accounts } = accountsGet;

  const departmentRegister = useSelector((state) => state.departmentRegister);
  const { department, error } = departmentRegister;

  const dispatch = useDispatch();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setDepartmentInfo((data) => ({ ...data, [name]: value }));
  };

  const handleOnSubmit = () => {
    dispatch(registerDepartment(departmentInfo));
    // showDeptModal(true);
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

  useEffect(() => {
    console.log(departmentRegister);
  }, [departmentRegister]);

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
                <div className='relative'>
                  <h4 className='text-grey text-lg font-bold tracking-wider'>
                    Create a department
                    <p className='w-3/4 text-xxs font-normal leading-4 mt-1 opacity-60'>
                      Create new department for your project, if you are
                      creating a project for an existing department, please skip
                      this step.
                    </p>
                  </h4>
                  <XIcon
                    className='w-5 h-5 absolute top-0 right-0 opacity-40 cursor-pointer'
                    aria-hidden='true'
                    onClick={() => isModal(false)}
                  />
                </div>
                <div className='pt-6'>
                  <label className='text-xs' htmlFor='departmentName'>
                    Department name
                  </label>
                  <div className='mt-1 relative'>
                    <InputElement
                      className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                        errors.departmentName ? 'border-danger' : 'border'
                      } ${
                        error && error.departmentName
                          ? 'border-danger'
                          : 'border'
                      } focus:border-primary outline-none shadow-outline`}
                      id='departmentName'
                      name='departmentName'
                      type='text'
                      placeholder='Name'
                      ref={register}
                      value={setDepartmentInfo.departmentName}
                      onChange={handleOnChange}
                    />
                    <OfficeBuildingIcon
                      className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                      aria-hidden='true'
                    />
                    {errors.departmentName ? (
                      <ExclamationCircleIcon
                        className={`w-5 h-5 ${
                          errors.departmentName ? 'text-danger' : 'text-correct'
                        } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                        aria-hidden='true'
                      />
                    ) : error?.departmentName ? (
                      <ExclamationCircleIcon
                        className={`w-5 h-5 ${
                          error?.departmentName ? 'text-danger' : 'text-correct'
                        } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                        aria-hidden='true'
                      />
                    ) : null}
                    <p className='text-xxs text-danger mt-2 absolute'>
                      {errors.departmentName?.message}
                      {error && error.departmentName?.msg}
                    </p>
                  </div>
                </div>
                <div className='pt-6'>
                  <label className='text-xs' htmlFor='departmentHeadId'>
                    Department head
                  </label>
                  <div className='mt-1 flex'>
                    <div className='w-full relative z-50'>
                      <SearchReporter
                        className={`w-full px-4 py-5 text-xs leading-tight rounded-md appearance-none ${
                          errors.departmentHeadId
                            ? 'border-danger focus:border-danger'
                            : 'border focus:border-primary'
                        } border focus:border-primary focus:outline-none focus:shadow-outline`}
                        id='departmentHeadId'
                        name='departmentHeadId'
                        type='text'
                        placeholder='Search department head by name or email'
                        ref={register}
                        defaultUser={currentAccount._id}
                        accounts={accountsList}
                        selectedAssigneeId={(selectedAssigneeId) =>
                          setDepartmentInfo((prevState) => ({
                            ...prevState,
                            departmentHeadId: selectedAssigneeId,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className='pt-6'>
                  <label className='text-xs' htmlFor='departmentEmail'>
                    Department email address
                  </label>
                  <div className='mt-1 relative'>
                    <InputElement
                      className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                        errors.departmentName ? 'border-danger' : 'border'
                      } ${
                        error && error.departmentName
                          ? 'border-danger'
                          : 'border'
                      } focus:border-primary outline-none shadow-outline`}
                      id='departmentEmail'
                      name='departmentEmail'
                      type='text'
                      placeholder='Email'
                      ref={register}
                      value={setDepartmentInfo.departmentEmail}
                      onChange={handleOnChange}
                    />
                    <MailIcon
                      className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                      aria-hidden='true'
                    />
                    {errors.departmentEmail ? (
                      <ExclamationCircleIcon
                        className={`w-5 h-5 ${
                          errors.departmentEmail
                            ? 'text-danger'
                            : 'text-correct'
                        } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                        aria-hidden='true'
                      />
                    ) : error?.departmentEmail ? (
                      <ExclamationCircleIcon
                        className={`w-5 h-5 ${
                          error?.departmentEmail
                            ? 'text-danger'
                            : 'text-correct'
                        } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                        aria-hidden='true'
                      />
                    ) : null}
                    <p className='text-xxs text-danger mt-2 absolute'>
                      {errors.departmentEmail?.message}
                      {error && error.departmentEmail?.msg}
                    </p>
                  </div>
                </div>
              </div>
              <div className='pt-10 flex flex-row justify-end'>
                <motion.button
                  type='submit'
                  className='bg-primary text-white text-xs text-white font-bold tracking-wider py-4 px-8 rounded-md'
                  whileHover='hover'
                  animate='initial'
                  variants={buttonBlueVariants}
                >
                  Create department
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      {showAlert &&
        (department ? (
          <SuccessConfirmation
            type='password'
            title='Department registration success'
            message={department?.msg}
            showModal={(showModal) => setShowModal(showModal)}
          />
        ) : null)}
    </AnimatePresence>
  );
};

export default CreateDepartment;
