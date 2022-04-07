import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { LockClosedIcon } from '@heroicons/react/outline';

import { resetPassword } from '../redux/actions/accountActions';
import InputElement from '../components/ui/InputElement';
import SuccessConfirmation from '../components/notifications/SuccessConfirmation';
import AlertConfirmation from '../components/notifications/AlertConfirmation';

const schema = yup.object().shape({
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
});

const ResetPasswordPage = ({ history }) => {
  const [passwordInfo, setPasswordInfo] = useState({
    password: '',
    confirmPassword: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const { resetToken } = useParams();

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const dispatch = useDispatch();

  const passwordReset = useSelector((state) => state.passwordReset);
  const { password, error } = passwordReset;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setPasswordInfo((data) => ({ ...data, [name]: value }));
  };

  const HandleOnSubmit = () => {
    dispatch(
      resetPassword({
        resetToken: resetToken,
        password: passwordInfo.password,
      })
    );
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      setShowAlert(true);
    }
  }, [showModal]);

  console.log(error);

  return (
    <>
      <div className='w-1/3 h-screen flex justify-center items-center'>
        <form
          className='form-container w-2/3'
          onSubmit={handleSubmit(HandleOnSubmit)}
        >
          <h1 className='md:text-4xl font-extrabold mb-10'>
            Reset your password?
            <p className='text-sm font-normal mt-4 opacity-60'>
              You new password must be different from previous used passwords.
            </p>
          </h1>
          <div>
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
                ref={register}
                value={passwordInfo.password}
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
                } focus:border-primary outline-none shadow-outline`}
                id='confirmPassword'
                name='confirmPassword'
                type='password'
                placeholder='Confirm Password'
                ref={register}
                value={passwordInfo.confirmPassword}
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
                {errors.confirmPassword?.message}
              </p>
            </div>
          </div>
          <div className='mt-10'>
            <button
              type='submit'
              className='bg-primary w-full text-white font-bold tracking-wider px-10 py-4 rounded-md hover:bg-dark'
            >
              Change Password
            </button>
          </div>
        </form>
      </div>
      {showAlert && password ? (
        <SuccessConfirmation
          type='password'
          title='Reset password successful'
          message={password?.msg}
          showModal={(showModal) => setShowModal(showModal)}
        />
      ) : null}
    </>
  );
};

export default ResetPasswordPage;
