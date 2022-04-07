import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MailIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';

import { loginAccount } from '../redux/actions/accountActions';
import InputElement from '../components/ui/InputElement';
import SuccessConfirmation from '../components/notifications/SuccessConfirmation';
import AlertConfirmation from '../components/notifications/AlertConfirmation';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid Email Address')
    .required('Please enter Email Address'),
  password: yup.string().required('Please Enter Password'),
});

const hoverBtnPrimaryMotion = {
  rest: { background: '#3F52E3' },
  hover: {
    background: '#2c3cb4',
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 100,
      ease: 'easeInOut',
    },
  },
};

const LoginPage = ({ history }) => {
  const [accountInfo, setAccountInfo] = useState({
    email: '',
    password: '',
    persistLogin: false,
  });
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const dispatch = useDispatch();

  const accountLogin = useSelector((state) => state.accountLogin);
  const { currentAccountInfo, error } = accountLogin;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo((data) => ({ ...data, [name]: value }));
  };

  const handleOnCheckboxChange = (e) => {
    setAccountInfo((data) => ({ ...data, persistLogin: e.target.checked }));
  };

  const HandleOnSubmit = () => {
    dispatch(loginAccount(accountInfo));
    setShowModal(true);
  };

  useEffect(() => {
    if (currentAccountInfo) {
      history.push('/');
    } else {
      history.push('/login');
    }
  }, [currentAccountInfo, history]);

  useEffect(() => {
    if (showModal) {
      setShowAlert(true);
    }
  }, [showModal]);

  return (
    <div className='bg-white'>
      <div className='w-1/3 h-screen flex justify-center items-center'>
        <form
          className='form-container w-2/3'
          onSubmit={handleSubmit(HandleOnSubmit)}
        >
          <h1 className='md:text-4xl font-extrabold mb-10'>
            Log in to your account
            <p className='text-sm font-normal mt-4 opacity-60'>
              Log in now to easily monitor and manage your task.
            </p>
          </h1>
          <div className='relative'>
            <label className='text-xs' for='email'>
              Email Address
            </label>
            <div className='mt-1 relative'>
              <InputElement
                className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                  errors.email ? 'border-danger' : 'border'
                } ${
                  error && error.email ? 'border-danger' : 'border'
                } focus:border-primary outline-none shadow-outline`}
                id='email'
                name='email'
                type='text'
                placeholder='Enter your email address here'
                ref={register}
                value={accountInfo.email}
                onChange={handleOnChange}
              />
              <MailIcon
                className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                aria-hidden='true'
              />
              {errors.email && (
                <ExclamationCircleIcon
                  className={`w-5 h-5 ${
                    errors.email ? 'text-danger' : 'text-correct'
                  } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                  aria-hidden='true'
                />
              )}
              <p className='text-xxs text-danger mt-2 absolute'>
                {errors.email?.message}
                {error && error.email?.msg}
              </p>
            </div>
          </div>
          <div className='mt-6'>
            <label className='text-xs' for='password'>
              Password
            </label>
            <div className='mt-1 relative'>
              <InputElement
                className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                  errors.password ? 'border-danger' : 'border'
                } ${
                  error && error.password ? 'border-danger' : 'border'
                } focus:border-primary outline-none shadow-outline`}
                id='password'
                name='password'
                type='password'
                placeholder='Enter your password here'
                ref={register}
                value={accountInfo.password}
                onChange={handleOnChange}
              />
              <LockClosedIcon
                className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                aria-hidden='true'
              />
              <p className='text-xxs text-danger mt-2 absolute'>
                {errors.password?.message}
                {error && error.password?.msg}
              </p>
            </div>
          </div>
          <div className='mt-8 flex flex-row'>
            <div className='w-1/2'>
              <InputElement
                type='checkbox'
                className='h-4 w-4 border-0'
                onChange={handleOnCheckboxChange}
              />
              <span className='text-xs ml-2 relative bottom-1'>
                Keep me signed in
              </span>
            </div>
            <div className='w-1/2 text-right'>
              <NavLink
                to='/forgot-password'
                className='text-primary text-xs font-semibold'
                activeClassName='selected'
              >
                Forgot Password?
              </NavLink>
            </div>
          </div>
          <div className='pt-6'>
            <motion.button
              type='submit'
              className='w-full text-white font-bold tracking-wider px-10 py-4 rounded-md'
              initial='rest'
              whileHover='hover'
              variants={hoverBtnPrimaryMotion}
            >
              Sign In
            </motion.button>
          </div>
          <div className='text-center pt-6'>
            <p className='text-xs relative bottom-1'>
              Not registered yet?&nbsp;
              <NavLink
                to='/register'
                className='text-primary font-bold underline'
                activeClassName='selected'
              >
                Create a new account
              </NavLink>
            </p>
          </div>
        </form>
      </div>
      {/* {showAlert &&
        (error ? (
          <AlertConfirmation
            type='email'
            title='Login account error'
            message={error?.msg}
            buttonConfirmCancel={false}
            buttonConfirmPlaceholder='Try again'
            showAlert={(showAlert) => setShowAlert(showAlert)}
          />
        ) : (
          <SuccessConfirmation
            type='email'
            title='Login account successful'
            message={currentAccountInfo?.msg}
            showModal={(showModal) => setShowModal(showModal)}
          />
        ))} */}
    </div>
  );
};

export default LoginPage;
