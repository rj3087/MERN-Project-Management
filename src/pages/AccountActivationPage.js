import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import jwt from 'jsonwebtoken';

import {
  activateAccount,
  reActivationAccount,
} from '../redux/actions/accountActions';
import SuccessConfirmation from '../components/notifications/SuccessConfirmation';
import AlertConfirmation from '../components/notifications/AlertConfirmation';

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

const ActionActivationPage = ({ history }) => {
  const [accountInfo, setAccountInfo] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const dispatch = useDispatch();

  const accountActivation = useSelector((state) => state.accountActivation);
  const { account, error } = accountActivation;

  let { activationToken } = useParams();

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(activateAccount(activationToken));
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      setShowAlert(true);
    }
  }, [showModal]);

  useEffect(() => {
    if (error?.sendAnotherToken && accountInfo) {
      dispatch(reActivationAccount(accountInfo));
    }
  }, [error?.sendAnotherToken, accountInfo, dispatch]);

  useEffect(() => {
    const decoded = jwt.decode(activationToken, 'Token1234');

    setAccountInfo(decoded);
  }, [activationToken]);

  console.log(showAlert);

  return (
    <div className='bg-white'>
      <div className='w-1/3 h-screen flex justify-center items-center'>
        <form
          className='form-container w-2/3'
          noValidate
          onSubmit={handleOnSubmit}
        >
          <h1 className='md:text-4xl font-extrabold mb-8'>
            Please activate your account.
            <p className='text-sm font-normal mt-4 opacity-60'>
              Before you can login, you must active your account by pressing
              active button.
            </p>
          </h1>
          <div className='w-1/3'>
            <motion.button
              type='submit'
              className='w-full text-white font-bold tracking-wider px-10 py-4 rounded-md'
              initial='rest'
              whileHover='hover'
              variants={hoverBtnPrimaryMotion}
            >
              Activate
            </motion.button>
          </div>
        </form>
      </div>
      {showAlert &&
        (error ? (
          <AlertConfirmation
            type='account'
            title='Account activation error'
            message={error?.msg}
            buttonConfirmCancel={false}
            buttonConfirmPlaceholder='Send another activation link'
            showAlert={(showAlert) => setShowAlert(showAlert)}
          />
        ) : (
          <SuccessConfirmation
            type='account'
            title='Account activation successful'
            message={account?.msg}
            showModal={(showModal) => setShowModal(showModal)}
          />
        ))}
    </div>
  );
};

export default ActionActivationPage;
