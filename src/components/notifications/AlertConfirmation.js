import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExclamationIcon } from '@heroicons/react/outline';

const backdrop = {
  hidden: { display: 'none' },
  visible: { display: 'flex', transition: { delay: 0.5 } },
};

const modal = {
  hidden: { scale: 0 },
  visible: {
    scale: 1,
    transition: { delay: 0.2, type: 'spring', stiffness: 120 },
  },
};

const hoverBtnPrimaryMotion = {
  rest: { background: '#3F52E3', scale: 1 },
  hover: {
    background: '#2c3cb4',
    scale: 1.1,
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 100,
      ease: 'easeInOut',
    },
  },
};

const hoverBtnDangerMotion = {
  rest: { background: '#e3342f', scale: 1 },
  hover: {
    background: '#C34A36',
    scale: 1.1,
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 100,
      ease: 'easeInOut',
    },
  },
};

const AlertConfirmation = ({
  showAlert,
  showModal,
  alertAction,
  type,
  title,
  name,
  message,
  buttonConfirmCancel,
  buttonConfirmPlaceholder,
  buttonCancelPlaceholder,
  errorFallback,
  path,
  history,
}) => {
  const handleOnCloseModal = () => {
    showAlert(false);
    showModal(false);
  };

  const handleAlertAction = () => {
    alertAction(true);
  };

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          className='backdrop bg-darkLight bg-opacity-60 flex items-center fixed top-0 left-0 bottom-0 right-0 z-50'
          variants={backdrop}
          initial='hidden'
          animate='visible'
          exit='hidden'
          onClick={() => handleOnCloseModal()}
        >
          <motion.div
            className='modal w-3/12 mx-auto bg-white flex flex-col'
            variants={modal}
          >
            {errorFallback ? (
              <>
                <div className='pt-10 pl-10 pr-10'>
                  <ExclamationIcon
                    className='w-14 h-14 text-lightDanger mx-auto'
                    aria-hidden='true'
                  ></ExclamationIcon>
                  <h4 className='w-3/4 text-md font-bold text-center tracking-wider pt-6 mx-auto pb-8 break-words'>
                    {errorFallback}
                  </h4>
                </div>
                <div className='mb-8 mx-auto flex'>
                  <button
                    type='button'
                    className='bg-primary w-1/9 text-white text-sm font-medium tracking-wider py-4 px-12 rounded-md shadow-xl transform hover:bg-dark hover:scale-110 transition duration-500 ease-in-out'
                    onClick={handleOnCloseModal}
                  >
                    Confirm
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className='pt-10 pl-10 pr-10'>
                  <ExclamationIcon
                    className='w-14 h-14 text-lightDanger mx-auto'
                    aria-hidden='true'
                  ></ExclamationIcon>
                  {title ? (
                    <h4 className='w-4/4 text-md font-bold text-center tracking-wider mx-auto pt-6 pb-2 break-words'>
                      {title}
                    </h4>
                  ) : (
                    <h4
                      className='w-3/4 text-md font-bold text-center tracking-wider mx-auto pt-4 pb-2 break-words'
                      style={{ lineHeight: '18px' }}
                    >
                      Are your sure you want to delete {type} named {name}?
                    </h4>
                  )}
                </div>
                <p className='w-5/6 text-center text-sm mx-auto pb-8 opacity-80'>
                  {message}
                </p>
                <div className='pb-10 mx-auto flex'>
                  {buttonConfirmCancel ? (
                    <>
                      <motion.button
                        type='button'
                        className='w-1/9 text-white text-sm font-bold tracking-wider py-4 px-12 rounded-md shadow-xl'
                        onClick={handleOnCloseModal}
                        initial='rest'
                        whileHover='hover'
                        variants={hoverBtnPrimaryMotion}
                      >
                        CANCEL
                      </motion.button>
                      <motion.button
                        type='button'
                        className='bg-danger w-1/9 text-white text-sm font-bold tracking-wider ml-6 py-4 px-12 rounded-md shadow-xl'
                        onClick={handleAlertAction}
                        initial='rest'
                        whileHover='hover'
                        variants={hoverBtnDangerMotion}
                      >
                        DELETE
                      </motion.button>
                    </>
                  ) : (
                    <>
                      <motion.button
                        type='button'
                        className='w-1/9 text-white text-sm font-bold tracking-wider py-4 px-12 rounded-md shadow-xl'
                        onClick={handleOnCloseModal}
                        initial='rest'
                        whileHover='hover'
                        variants={hoverBtnDangerMotion}
                      >
                        {buttonConfirmPlaceholder}
                      </motion.button>
                    </>
                  )}
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AlertConfirmation;
