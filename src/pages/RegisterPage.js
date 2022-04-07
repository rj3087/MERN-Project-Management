import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { NavLink } from 'react-router-dom';

import {
  MailIcon,
  LockClosedIcon,
  UserIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';

import { registerAccount } from '../redux/actions/accountActions';
import InputElement from '../components/ui/InputElement';
import SuccessConfirmation from '../components/notifications/SuccessConfirmation';
import AlertConfirmation from '../components/notifications/AlertConfirmation';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid Email Address')
    .required('Please enter Email Address'),
  password: yup
    .string()
    .min(10, 'Password must be at least 10 characters.')
    .max(22, 'Password must be maximum 22 characters.')
    .required('Please Enter Password')
    .matches(
      /^.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?].*$/,
      'Password must contain 8 characters, one Uppercase, one Lowercase, one Number and one special case Character'
    ),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match'),
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters.')
    .required('Please Enter First Name'),
  lastName: yup.string(),
});

const LoginPage = ({ history }) => {
  const [accountInfo, setAccountInfo] = useState({
    role: 'user',
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isErrorPassword, setIsErrorPassword] = useState(false);

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const dispatch = useDispatch();

  const accountRegister = useSelector((state) => state.accountRegister);
  const { account, error } = accountRegister;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo((data) => ({ ...data, [name]: value }));
  };
  const HandleOnSubmit = (e) => {
    dispatch(registerAccount(accountInfo));
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      setShowAlert(true);
    }
    if (errors.password) {
      setIsErrorPassword(true);
    }
    if (accountInfo.password.length >= 1) {
      setIsErrorPassword(false);
    }
  }, [showModal, errors.password, accountInfo.password]);

  return (
    <>
      <div className='w-1/3 h-screen flex justify-center items-center'>
        <form
          className='form-container w-2/3'
          onSubmit={handleSubmit(HandleOnSubmit)}
        >
          <h1 className='md:text-4xl font-extrabold mb-10'>
            Sign up for an account
            <p className='text-sm font-normal mt-1 opacity-60'>
              Join us to easily monitor and manage your task.
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
                placeholder='Email'
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
                placeholder='Password'
                errorPassword={isErrorPassword}
                ref={register}
                value={accountInfo.password}
                onChange={handleOnChange}
              />
              <LockClosedIcon
                className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                aria-hidden='true'
              />
              <p
                className='text-xxs text-danger mt-2 absolute'
                style={{ lineHeight: '10px' }}
              >
                {errors.password?.message}
                {error && error.password?.msg}
              </p>
            </div>
          </div>
          <div className='mt-6'>
            <label className='text-xs' for='confirmPassword'>
              Confirm Password
            </label>
            <div className='mt-1 relative'>
              <InputElement
                className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                  errors.confirmPassword ? 'border-danger' : 'border'
                } ${
                  error && error.confirmPassword ? 'border-danger' : 'border'
                } focus:border-primary outline-none shadow-outline`}
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                placeholder='Confirm Password'
                ref={register}
                value={accountInfo.confirmPassword}
                onChange={handleOnChange}
              />
              <LockClosedIcon
                className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                aria-hidden='true'
              />
              <p className='text-xxs text-danger mt-2 absolute'>
                {errors.confirmPassword?.message}
                {error && error.confirmPassword?.msg}
              </p>
            </div>
          </div>
          <div className='grid grid-flow-col grid-cols-2 gap-4'>
            <div className='mt-6'>
              <label className='text-xs' for='firstName'>
                First name
              </label>
              <div className='mt-1 relative'>
                <InputElement
                  className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                    errors.firstName ? 'border-danger' : 'border'
                  } ${
                    error && error.firstName ? 'border-danger' : 'border'
                  } focus:border-primary outline-none shadow-outline`}
                  id='firstName'
                  name='firstName'
                  type='text'
                  placeholder='First name'
                  ref={register}
                  value={accountInfo.firstName}
                  onChange={handleOnChange}
                />
                <UserIcon
                  className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                  aria-hidden='true'
                />
                <p className='text-xxs text-danger mt-2 absolute'>
                  {errors.firstName?.message}
                  {error && error.firstName?.msg}
                </p>
              </div>
            </div>
            <div className='mt-6'>
              <label className='text-xs' for='lastName'>
                Last name
              </label>
              <div className='mt-1 relative'>
                <InputElement
                  className='w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none focus:border-primary focus:outline-none focus:shadow-outline'
                  id='lastName'
                  name='lastName'
                  type='text'
                  placeholder='Last name'
                  ref={register}
                  value={accountInfo.lastName}
                  onChange={handleOnChange}
                />
                <UserIcon
                  className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                  aria-hidden='true'
                />
                <p className='text-xxs text-danger mt-2'>
                  {errors.lastName?.message}
                </p>
              </div>
            </div>
          </div>
          <div className='mt-8'>
            <InputElement type='checkbox' className='h-4 w-4 border-0' />
            <span className='text-xs ml-2 relative bottom-1'>
              I accept the Terms and Subscription
            </span>
          </div>
          <div className='mt-8'>
            <button
              type='submit'
              className='bg-primary w-full text-white font-bold tracking-wider px-10 py-4 rounded-md hover:bg-dark'
            >
              Sign Up
            </button>
          </div>
          <div className='text-center mt-6'>
            <p className='text-xs relative bottom-1'>
              Already have an account?&nbsp;
              <NavLink
                to='/login'
                className='text-primary font-bold underline'
                activeClassName='selected'
              >
                Login
              </NavLink>
            </p>
          </div>
        </form>
      </div>
      {showAlert &&
        (account ? (
          <SuccessConfirmation
            type='password'
            title='Account registration success'
            message={account?.msg}
            showModal={(showModal) => setShowModal(showModal)}
          />
        ) : null)}
    </>
  );
};

export default LoginPage;
