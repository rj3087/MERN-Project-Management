import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SidebarData } from '../sidebar/SidebarData';
import { logoutAccount } from '../../redux/actions/accountActions';
import {
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from '@heroicons/react/outline';

const slideToggle = {
  slideOn: { width: '12%' },
  slideOff: {
    width: '4%',
    transition: {
      duration: 0.4,
      type: 'spring',
    },
  },
};

const iconMotion = {
  rest: { scale: 0.95 },
  hover: {
    scale: 1,
    left: '0.4rem',
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

const Sidebar = ({ isSlideNav, isToggleWidth, isModal }) => {
  const [isToggleNav, setToggleNav] = useState(isSlideNav);
  const [showTooltip, setShowTooltip] = useState();
  const [showSubMenu, setShowSubMenu] = useState(false);

  let location = useLocation();
  let history = useHistory();
  const dispatch = useDispatch();

  const handleToggleNav = () => {
    setToggleNav(!isToggleNav);
    isToggleWidth(!isToggleNav);
  };

  const handleShowSubItem = () => {
    history.push('/settings');
  };

  const handleShowTooltip = (e) => {
    setShowTooltip(e.currentTarget.id);
  };

  const handleOnLogout = (e) => {
    e.preventDefault();
    dispatch(logoutAccount());
  };

  useEffect(() => {
    if (location.pathname.substring(1) === 'settings') {
      setShowSubMenu(true);
    } else {
      setShowSubMenu(false);
    }
  }, [location.pathname]);

  return (
    <motion.div
      className='sidebar-menu bg-white h-screen fixed border-r order-1'
      animate={isToggleNav ? 'slideOn' : 'slideOff'}
      variants={slideToggle}
    >
      <motion.div className='p-5 w-full flex items-center relative'>
        <h1
          className={`text-1xl text-grey font-bold relative ${
            isToggleNav ? 'block ' : 'hidden'
          }`}
        >
          TeamTask
        </h1>
        <div
          className='bg-primary p-1.5 absolute rounded-full'
          style={{ right: '-0.8rem' }}
        >
          <ChevronRightIcon
            className={`w-3 h-3 text-white cursor-pointer ${
              isToggleNav ? 'ml-auto ' : null
            }`}
            aria-hidden='true'
            onClick={handleToggleNav}
          />
        </div>
      </motion.div>
      <ul>
        {SidebarData.MenuPrimary.map((item, key) => {
          return (
            <motion.li
              key={key}
              className='w-Full rounded-tr-full rounded-br-full'
              initial='rest'
              whileHover='hover'
            >
              {item.subItem && item.subItem ? (
                // eslint-disable-next-line jsx-a11y/anchor-is-valid
                <div className='mt-1 mx-4'>
                  <button
                    className={`${
                      showSubMenu ? 'bg-primary bg-opacity-10' : null
                    } w-full text-grey text-sm font-semibold ${
                      isToggleNav ? 'p-3' : 'p-0'
                    } flex flex-row items-center relative rounded-md hover:bg-primary hover:bg-opacity-10`}
                  >
                    <div
                      className={`w-full flex z-50 ${
                        isToggleNav ? 'block' : 'hidden'
                      } `}
                    >
                      <div className='flex' onClick={handleShowSubItem}>
                        <motion.div
                          className='h-23px flex items-center relative'
                          variants={iconMotion}
                        >
                          <div
                            className='w-5 h-5 text-grey mr-3 cursor-pointer'
                            aria-hidden='true'
                          >
                            {item.icon}
                          </div>
                        </motion.div>
                        <motion.span className='relative' variants={textMotion}>
                          {item.title}
                        </motion.span>
                      </div>
                      <div className='ml-auto'>
                        <div
                          className='w-4 h-4 text-grey mt-1 mr-2 cursor-pointer'
                          aria-hidden='true'
                        >
                          {showSubMenu ? (
                            <ChevronUpIcon
                              className='w-4 h-4'
                              aria-hidden='true'
                              onClick={() => setShowSubMenu(!showSubMenu)}
                            />
                          ) : (
                            <ChevronDownIcon
                              className='w-4 h-4'
                              aria-hidden='true'
                              onClick={() => setShowSubMenu(!showSubMenu)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <motion.div
                      id={item.title}
                      className={`block flex p-3 items-center relative ${
                        isToggleNav ? 'hidden' : 'block'
                      } z-40`}
                      onMouseEnter={(e) => handleShowTooltip(e)}
                      onMouseLeave={() => setShowTooltip('')}
                    >
                      <div
                        style={{ width: '19px', height: '19px' }}
                        className='w-5 h-5 text-grey cursor-pointer'
                        aria-hidden='true'
                        onClick={() => history.push('/settings')}
                      >
                        {item.icon}
                      </div>
                      {showTooltip && showTooltip === item.title ? (
                        <div className='bg-primary text-xxs text-white tracking-wider font-normal whitespace-nowrap absolute ml-9 py-2 px-4 rounded-md'>
                          <p>{item.title}</p>
                        </div>
                      ) : null}
                    </motion.div>
                  </button>
                  {showSubMenu &&
                    item.subItem.map((subItem) => (
                      <div className={`mt-2 ${isToggleNav ? 'pl-6' : 'pl-0'}`}>
                        <button
                          className={`w-full text-grey text-sm font-semibold ${
                            isToggleNav ? 'p-3' : 'p-0'
                          } flex flex-row items-center relative rounded-md hover:bg-primary hover:bg-opacity-10`}
                          onClick={() => isModal(subItem.modal)}
                        >
                          <div
                            className={`w-full flex z-50 ${
                              isToggleNav ? 'block' : 'hidden'
                            }`}
                          >
                            <motion.div className='h-23px flex items-center relative'>
                              <div
                                className='w-5 h-5 text-grey mr-3 cursor-pointer'
                                aria-hidden='true'
                              >
                                {subItem.icon}
                              </div>
                            </motion.div>
                            <motion.span
                              className='relative'
                              variants={textMotion}
                            >
                              {subItem.title}
                            </motion.span>
                          </div>
                          <motion.div
                            id={subItem.title}
                            className={`block p-3 flex items-center relative ${
                              isToggleNav ? 'hidden' : 'block'
                            } z-40`}
                            onMouseEnter={(e) => handleShowTooltip(e)}
                            onMouseLeave={() => setShowTooltip('')}
                          >
                            <div
                              style={{ width: '19px', height: '19px' }}
                              className='w-5 h-5 text-grey mr-4 cursor-pointer'
                              aria-hidden='true'
                            >
                              {subItem.icon}
                            </div>
                            {showTooltip && showTooltip === subItem.title ? (
                              <div className='bg-primary text-xxs text-white tracking-wider font-normal whitespace-nowrap absolute ml-9 py-2 px-4 rounded-md'>
                                <p>{subItem.title}</p>
                              </div>
                            ) : null}
                          </motion.div>
                        </button>
                      </div>
                    ))}
                </div>
              ) : (
                <NavLink
                  to={item.link}
                  className={`text-grey text-sm font-semibold mt-2 mx-4 ${
                    isToggleNav ? 'p-3' : 'p-0'
                  } flex flex-row items-center relative rounded-md hover:bg-primary hover:bg-opacity-10`}
                  activeClassName='active'
                >
                  <div
                    className={`flex z-50 ${isToggleNav ? 'block' : 'hidden'}`}
                  >
                    <motion.div
                      className='h-23px flex items-center relative'
                      variants={iconMotion}
                    >
                      <div
                        className='w-5 h-5 text-grey mr-3 cursor-pointer'
                        aria-hidden='true'
                      >
                        {item.icon}
                      </div>
                    </motion.div>
                    <motion.span className='relative' variants={textMotion}>
                      {item.title}
                    </motion.span>
                  </div>
                  <motion.div
                    id={item.title}
                    className={`block p-3 flex items-center relative ${
                      isToggleNav ? 'hidden' : 'block'
                    } z-40`}
                    onMouseEnter={(e) => handleShowTooltip(e)}
                    onMouseLeave={() => setShowTooltip('')}
                  >
                    <div
                      style={{ width: '19px', height: '19px' }}
                      className='w-5 h-5 text-grey mr-4 cursor-pointer'
                      aria-hidden='true'
                    >
                      {item.icon}
                    </div>
                  </motion.div>
                  {showTooltip && showTooltip === item.title ? (
                    <div className='bg-primary text-xxs text-white tracking-wider font-normal whitespace-nowrap absolute ml-12 py-2 px-4 rounded-md'>
                      <p>{item.title}</p>
                    </div>
                  ) : null}
                </NavLink>
              )}
            </motion.li>
          );
        })}
      </ul>
      <ul className='fixed bottom-0 mb-6'>
        {SidebarData.MenuSecondary.map((item, key) => {
          return (
            <motion.li
              key={key}
              className='w-Full rounded-tr-full rounded-br-full'
              initial='rest'
              whileHover='hover'
            >
              <NavLink
                to={item.link}
                className={`text-grey text-sm font-semibold mt-2 mx-4 ${
                  isToggleNav ? 'p-3' : 'p-0'
                } flex flex-row items-center relative rounded-md hover:bg-primary hover:bg-opacity-10`}
                activeClassName='active'
                onClick={item.title === 'Logout' ? handleOnLogout : null}
              >
                <div
                  className={`flex z-50 ${isToggleNav ? 'block' : 'hidden'}`}
                >
                  <motion.div
                    className='h-23px flex items-center relative'
                    variants={iconMotion}
                  >
                    <div
                      className='w-5 h-5 text-grey mr-3 cursor-pointer'
                      aria-hidden='true'
                    >
                      {item.icon}
                    </div>
                  </motion.div>
                  <motion.span className='relative' variants={textMotion}>
                    {item.title}
                  </motion.span>
                </div>
                <motion.div
                  id={item.title}
                  className={`block p-3 flex items-center relative ${
                    isToggleNav ? 'hidden' : 'block'
                  } z-40`}
                  onMouseEnter={(e) => handleShowTooltip(e)}
                  onMouseLeave={() => setShowTooltip('')}
                >
                  <div
                    style={{ width: '19px', height: '19px' }}
                    className='w-5 h-5 text-grey cursor-pointer'
                    aria-hidden='true'
                  >
                    {item.icon}
                  </div>
                </motion.div>
                {showTooltip && showTooltip === item.title ? (
                  <div className='bg-primary text-xxs text-white tracking-wider font-normal whitespace-nowrap absolute ml-12 py-2 px-4 rounded-md'>
                    <p>{item.title}</p>
                  </div>
                ) : null}
              </NavLink>
            </motion.li>
          );
        })}
      </ul>
    </motion.div>
  );
};

export default Sidebar;
