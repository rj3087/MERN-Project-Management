import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Menu, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import { CogIcon, SupportIcon, LogoutIcon } from '@heroicons/react/outline';
import { NavLink } from 'react-router-dom';
import { logoutAccount } from '../../redux/actions/accountActions';

var defaultAvatar =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTMgNTMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUzIDUzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBzdHlsZT0iZmlsbDojRTdFQ0VEOyIgZD0iTTE4LjYxMyw0MS41NTJsLTcuOTA3LDQuMzEzYy0wLjQ2NCwwLjI1My0wLjg4MSwwLjU2NC0xLjI2OSwwLjkwM0MxNC4wNDcsNTAuNjU1LDE5Ljk5OCw1MywyNi41LDUzDQoJYzYuNDU0LDAsMTIuMzY3LTIuMzEsMTYuOTY0LTYuMTQ0Yy0wLjQyNC0wLjM1OC0wLjg4NC0wLjY4LTEuMzk0LTAuOTM0bC04LjQ2Ny00LjIzM2MtMS4wOTQtMC41NDctMS43ODUtMS42NjUtMS43ODUtMi44ODh2LTMuMzIyDQoJYzAuMjM4LTAuMjcxLDAuNTEtMC42MTksMC44MDEtMS4wM2MxLjE1NC0xLjYzLDIuMDI3LTMuNDIzLDIuNjMyLTUuMzA0YzEuMDg2LTAuMzM1LDEuODg2LTEuMzM4LDEuODg2LTIuNTN2LTMuNTQ2DQoJYzAtMC43OC0wLjM0Ny0xLjQ3Ny0wLjg4Ni0xLjk2NXYtNS4xMjZjMCwwLDEuMDUzLTcuOTc3LTkuNzUtNy45NzdzLTkuNzUsNy45NzctOS43NSw3Ljk3N3Y1LjEyNg0KCWMtMC41NCwwLjQ4OC0wLjg4NiwxLjE4NS0wLjg4NiwxLjk2NXYzLjU0NmMwLDAuOTM0LDAuNDkxLDEuNzU2LDEuMjI2LDIuMjMxYzAuODg2LDMuODU3LDMuMjA2LDYuNjMzLDMuMjA2LDYuNjMzdjMuMjQNCglDMjAuMjk2LDM5Ljg5OSwxOS42NSw0MC45ODYsMTguNjEzLDQxLjU1MnoiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiM1NTYwODA7IiBkPSJNMjYuOTUzLDAuMDA0QzEyLjMyLTAuMjQ2LDAuMjU0LDExLjQxNCwwLjAwNCwyNi4wNDdDLTAuMTM4LDM0LjM0NCwzLjU2LDQxLjgwMSw5LjQ0OCw0Ni43Ng0KCQljMC4zODUtMC4zMzYsMC43OTgtMC42NDQsMS4yNTctMC44OTRsNy45MDctNC4zMTNjMS4wMzctMC41NjYsMS42ODMtMS42NTMsMS42ODMtMi44MzV2LTMuMjRjMCwwLTIuMzIxLTIuNzc2LTMuMjA2LTYuNjMzDQoJCWMtMC43MzQtMC40NzUtMS4yMjYtMS4yOTYtMS4yMjYtMi4yMzF2LTMuNTQ2YzAtMC43OCwwLjM0Ny0xLjQ3NywwLjg4Ni0xLjk2NXYtNS4xMjZjMCwwLTEuMDUzLTcuOTc3LDkuNzUtNy45NzcNCgkJczkuNzUsNy45NzcsOS43NSw3Ljk3N3Y1LjEyNmMwLjU0LDAuNDg4LDAuODg2LDEuMTg1LDAuODg2LDEuOTY1djMuNTQ2YzAsMS4xOTItMC44LDIuMTk1LTEuODg2LDIuNTMNCgkJYy0wLjYwNSwxLjg4MS0xLjQ3OCwzLjY3NC0yLjYzMiw1LjMwNGMtMC4yOTEsMC40MTEtMC41NjMsMC43NTktMC44MDEsMS4wM1YzOC44YzAsMS4yMjMsMC42OTEsMi4zNDIsMS43ODUsMi44ODhsOC40NjcsNC4yMzMNCgkJYzAuNTA4LDAuMjU0LDAuOTY3LDAuNTc1LDEuMzksMC45MzJjNS43MS00Ljc2Miw5LjM5OS0xMS44ODIsOS41MzYtMTkuOUM1My4yNDYsMTIuMzIsNDEuNTg3LDAuMjU0LDI2Ljk1MywwLjAwNHoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K';

const Avatar = ({ profilePic, name, isAdmin, history }) => {
  const [isToggleClass, setToggleClass] = useState(false);

  const dispatch = useDispatch();

  const handleToggleClass = () => {
    setToggleClass(!isToggleClass);
  };

  const handleOnLogout = (e) => {
    e.preventDefault();
    dispatch(logoutAccount());
  };

  return (
    <div className='w-10 ml-auto'>
      <div className='flex items-center relative inline-block z-20'>
        <Menu>
          {({ open }) => (
            <>
              <Menu.Button className='inline-flex justify-right w-full transition duration-150 ease-in-out'>
                <div
                  className={`${
                    isToggleClass ? 'avatar-top' : ''
                  } flex flex-row items-center`}
                  onClick={handleToggleClass}
                >
                  <img
                    src={
                      profilePic !== 'undefined' ? profilePic : defaultAvatar
                    }
                    style={{
                      width: '2.6rem',
                      height: '2.6rem',
                      borderRadius: '50%',
                      position: 'relative',
                      left: '1px',
                      bottom: '0.5px',
                    }}
                    alt='profile'
                  />
                </div>
              </Menu.Button>

              <Transition
                show={open}
                enter='transition ease-out duration-100'
                enterFrom='transform opacity-0 scale-95'
                enterTo='transform opacity-100 scale-100'
                leave='transition ease-in duration-75'
                leaveFrom='transform opacity-100 scale-100'
                leaveTo='transform opacity-0 scale-95'
              >
                <Menu.Items
                  static
                  className='absolute right-0 w-56 mt-7 origin-top-right bg-white divide-y divide-gray-100 border border-opacity-40 shadow-lg outline-none'
                >
                  <div className='bg-lightGrey px-4 py-3'>
                    <p className='text-xs leading-5'>Signed in as</p>
                    <p className='text-darkGrey text-sm font-bold'>{name}</p>
                    <p className='text-darkGrey opacity-60 text-xxs font-semibold capitalize'>
                      {isAdmin ? 'Project Administrator' : 'Agent'}
                    </p>
                  </div>
                  <div className='py-2'>
                    <Menu.Item>
                      {({ active }) => (
                        <NavLink
                          to='/account-setting'
                          className={`${
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700'
                          } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left relative`}
                        >
                          <CogIcon
                            className='w-5 h-5 opacity-70 absolute'
                            aria-hidden='true'
                          />
                          <span className='ml-8'>Account settings</span>
                        </NavLink>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        <NavLink
                          to='/support'
                          className={`${
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700'
                          } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left relative`}
                        >
                          <SupportIcon
                            className='w-5 h-5 opacity-70 absolute'
                            aria-hidden='true'
                          />
                          <span className='ml-8'>Support</span>
                        </NavLink>
                      )}
                    </Menu.Item>
                  </div>
                  <div className='py-1'>
                    <Menu.Item>
                      {({ active }) => (
                        <button
                          className={`${
                            active
                              ? 'bg-gray-100 text-gray-900'
                              : 'text-gray-700'
                          } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left relative`}
                          onClick={handleOnLogout}
                        >
                          <LogoutIcon
                            className='w-5 h-5 opacity-70 absolute'
                            aria-hidden='true'
                          />
                          <span className='ml-8'>Log out</span>
                        </button>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </>
          )}
        </Menu>
      </div>
    </div>
  );
};

export default Avatar;
