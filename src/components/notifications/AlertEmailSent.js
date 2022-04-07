import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckIcon } from '@heroicons/react/outline';

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

const SuccessConfirmation = ({
  type,
  name,
  history,
  showModal,
  title,
  message,
  redirect,
}) => {
  const handleOnCloseModal = () => {
    showModal(false);

    if (redirect) {
      history.push('/tasks');
      window.location.reload(false);
    } else {
      window.location.reload(false);
    }
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          className='backdrop bg-darkLight bg-opacity-60 flex items-center fixed top-0 left-0 bottom-0 right-0 z-50'
          variants={backdrop}
          initial='hidden'
          animate='visible'
          exit='hidden'
        >
          <motion.div
            className='modal w-3/12 mx-auto bg-white flex flex-col rounded-lg'
            variants={modal}
          >
            <div className='pt-8 pl-8 pr-8'>
              <CheckIcon
                className='w-14 h-14 text-correct mx-auto'
                aria-hidden='true'
              ></CheckIcon>
              <h4 className='w-4/4 text-md font-bold text-center tracking-wider mx-auto pt-6 pb-2 break-words'>
                {type} named {name} is successfully created?
              </h4>
            </div>
            <p className='w-5/6 text-center text-sm mx-auto pb-8 opacity-80'>
              {message}
            </p>
            <div className='mb-12 mx-auto flex'>
              <button
                type='button'
                className='bg-correct w-1/9 text-white text-sm font-medium tracking-wider py-4 px-12 rounded-md'
                onClick={handleOnCloseModal}
              >
                Confirm
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SuccessConfirmation;
