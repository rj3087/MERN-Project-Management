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

const Alert = ({ showAlert, title, message, validationError }) => {
  const handleClearValidationError = () => {
    showAlert(false);
    validationError(false);
  };
  return (
    <AnimatePresence>
      <motion.div
        className='backdrop bg-darkLight bg-opacity-60 flex items-center fixed top-0 left-0 bottom-0 right-0 z-50'
        variants={backdrop}
        initial='hidden'
        animate='visible'
        exit='hidden'
      >
        <motion.div
          className='modal w-3/12 mx-auto bg-white flex flex-col'
          variants={modal}
        >
          <div className='pt-12 pl-8 pr-8'>
            <ExclamationIcon
              className='w-14 h-14 text-lightDanger mx-auto'
              aria-hidden='true'
            ></ExclamationIcon>
            <h4 className='w-3/4 text-md font-bold text-center tracking-wider mx-auto pt-6 pb-2 break-words'>
              {title}
            </h4>
          </div>
          <p className='w-5/6 text-center text-sm mx-auto pb-8 opacity-80'>
            {message}
          </p>
          <div className='mb-12 mx-auto flex'>
            <motion.button
              type='button'
              className='w-1/9 text-white text-sm font-medium tracking-wider py-4 px-12 rounded-md shadow-xl'
              onClick={handleClearValidationError}
              initial='rest'
              whileHover='hover'
              variants={hoverBtnDangerMotion}
            >
              Try again
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Alert;
