import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserIcon, KeyIcon, BellIcon } from '@heroicons/react/outline';

const iconMotion = {
  rest: { scale: 0.95 },
  hover: {
    scale: 1,
    left: '0.6rem',
    transition: {
      duration: 0.2,
      type: 'spring',
      stiffness: 60,
      ease: 'easeInOut',
    },
  },
};

const textMotion = {
  rest: {},
  hover: {
    left: '0.4rem',
    transition: {
      delay: 0.2,
      duration: 0.4,
      type: 'spring',
      stiffness: 60,
      ease: 'easeInOut',
    },
  },
};

const SidebarBlue = ({ slideNav, tabName }) => {
  const [toggleNav, setToggleNav] = useState(slideNav);
  const [addActiveTab, setAddActiveTab] = useState('account');

  const handleActiveTab = (e) => {
    tabName(e.currentTarget.id);
    setAddActiveTab(e.currentTarget.id);
  };

  return (
    <>
      <motion.div className='mr-12 relative border-r order-1'>
        <nav className='w-full mt-10 flex flex-col'>
          <ul>
            <motion.li
              className={`${
                addActiveTab === 'account' ? 'opacity-100' : 'opacity-50'
              } w-full mr-4`}
              initial='rest'
              whileHover='hover'
            >
              <motion.button
                id='account'
                className='p-5 flex flex-row flex items-center relative'
                onClick={handleActiveTab}
              >
                <div className={`flex z-50 ${toggleNav ? 'block' : 'hidden'}`}>
                  <motion.div
                    className='h-23px flex items-center relative'
                    variants={iconMotion}
                  >
                    <UserIcon
                      className='w-5 h-5 text-darkGrey mr-4 cursor-pointer'
                      aria-hidden='true'
                    />
                  </motion.div>
                  <motion.p
                    className='text-sm text-darkGrey text-left relative'
                    variants={textMotion}
                  >
                    Account
                    <span className='text-xxs font-light block'>
                      Set the account settings
                    </span>
                  </motion.p>
                </div>
              </motion.button>
            </motion.li>
            <motion.li
              className={`${
                addActiveTab === 'security' ? 'opacity-100' : 'opacity-50'
              } w-full mr-4`}
              initial='rest'
              whileHover='hover'
            >
              <motion.button
                id='security'
                className='p-5 flex flex-row flex items-center relative'
                onClick={handleActiveTab}
              >
                <div className={`flex z-50 ${toggleNav ? 'block' : 'hidden'}`}>
                  <motion.div
                    className='h-23px flex items-center relative'
                    variants={iconMotion}
                  >
                    <KeyIcon
                      className='w-5 h-5 text-darkGrey mr-4 cursor-pointer'
                      aria-hidden='true'
                    />
                  </motion.div>
                  <motion.p
                    className='text-sm text-darkGrey text-left relative'
                    variants={textMotion}
                  >
                    Security
                    <span className='text-xxs text-darkGrey font-light block'>
                      Set the security settings
                    </span>
                  </motion.p>
                </div>
              </motion.button>
            </motion.li>
            <motion.li
              className={`${
                addActiveTab === 'notifications' ? 'opacity-100' : 'opacity-50'
              } w-full mr-4`}
              initial='rest'
              whileHover='hover'
            >
              <motion.button
                id='notifications'
                className='p-5 flex flex-row flex items-center relative'
                onClick={handleActiveTab}
              >
                <div className={`flex z-50 ${toggleNav ? 'block' : 'hidden'}`}>
                  <motion.div
                    className='h-23px flex items-center relative'
                    variants={iconMotion}
                  >
                    <BellIcon
                      className='w-5 h-5 text-darkGrey mr-4 cursor-pointer'
                      aria-hidden='true'
                    />
                  </motion.div>
                  <motion.p
                    className='text-sm text-darkGrey text-left relative'
                    variants={textMotion}
                  >
                    Notifications
                    <span className='text-xxs text-darkGrey font-light block'>
                      Set the notification settings
                    </span>
                  </motion.p>
                </div>
              </motion.button>
            </motion.li>
          </ul>
        </nav>
      </motion.div>
    </>
  );
};

export default SidebarBlue;
