import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import { MailIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { forgotPassword } from '../redux/actions/accountActions';
import InputElement from '../components/ui/InputElement';
import SuccessConfirmation from '../components/notifications/SuccessConfirmation';
import AlertConfirmation from '../components/notifications/AlertConfirmation';
import Alert from '../components/notifications/Alert';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid Email Address')
    .required('Please enter Email Address'),
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

const ForgotPasswordPage = ({ history }) => {
  const [emailInfo, setEmailInfo] = useState({
    email: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [validationErrors, setValidationErrors] = useState(false);

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const dispatch = useDispatch();

  const passwordForgot = useSelector((state) => state.passwordForgot);
  const { email, error } = passwordForgot;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setEmailInfo((data) => ({ ...data, [name]: value }));
  };

  const handleOnSubmit = () => {
    dispatch(forgotPassword(emailInfo));
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      setShowAlert(true);
    }
  }, [showModal]);

  return (
    <>
      <div className='w-1/3 h-screen flex justify-center items-center'>
        <form
          className='form-container w-2/3'
          onSubmit={handleSubmit(handleOnSubmit)}
        >
          <h1 className='md:text-4xl font-extrabold mb-10'>
            Forgot your password?
            <p className='text-sm font-normal mt-4 opacity-60'>
              Enter the email associated with your account and we'll send an
              email with instruction to reset your password.
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
                value={emailInfo.email}
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
          <div className='mt-10'>
            <motion.button
              type='submit'
              className='bg-primary w-full text-white font-bold tracking-wider px-10 py-4 rounded-md outline-none'
              initial='rest'
              whileHover='hover'
              variants={hoverBtnPrimaryMotion}
            >
              Send instructions
            </motion.button>
          </div>
        </form>
      </div>
      {showAlert && email ? (
        <SuccessConfirmation
          type='email'
          title='Forgot password successful'
          message={email?.msg}
          showModal={(showModal) => setShowModal(showModal)}
        />
      ) : null}
    </>
  );
};

export default ForgotPasswordPage;
