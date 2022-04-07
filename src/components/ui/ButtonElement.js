import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';

const hoverBtnScalePrimaryMotion = {
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

const hoverBtnScaleDangerMotion = {
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

const hoverBtnColorPrimaryMotion = {
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

const hoverBtnColorDangerMotion = {
  rest: { background: '#e3342f' },
  hover: {
    background: '#C34A36',
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 100,
      ease: 'easeInOut',
    },
  },
};

const ButtonElement = forwardRef(
  ({ id, type, placeholder, className, motionVariants }, ref) => {
    return (
      <>
        {type === 'submit' ? (
          <motion.button
            type='submit'
            className='w-full text-white font-bold tracking-wider px-10 py-4 rounded-md'
            initial='rest'
            whileHover='hover'
            variants={motionVariants}
          >
            {placeholder}
          </motion.button>
        ) : type === 'button' ? (
          <motion.button
            type='button'
            className='w-full text-white font-bold tracking-wider px-10 py-4 rounded-md'
          >
            {placeholder}
          </motion.button>
        ) : null}
      </>
    );
  }
);

export default ButtonElement;
