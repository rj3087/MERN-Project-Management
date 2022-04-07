import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Popover, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import moment from 'moment';
import { motion } from 'framer-motion';
import {
  BellIcon,
  DocumentReportIcon,
  MenuIcon,
  CodeIcon,
  ColorSwatchIcon,
  DesktopComputerIcon,
  CreditCardIcon,
} from '@heroicons/react/outline';
import { getNotificationByUserId } from '../../redux/actions/notificationActions';
import { updateNotificationStatusById } from '../../redux/actions/notificationActions';

const Notification = ({ socket, history }) => {
  const [accountInfo, setAccountInfo] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [notificationsFromLocalStorage, setNotificationsFromLocalStorage] =
    useState(JSON.parse(localStorage.getItem('notifications')) || '');
  const [notifications, setNotifications] = useState([]);
  const [notificationsFromSocket, setNotificationsFromSocket] = useState([]);
  const [noOfNotifications, setNoOfNotications] = useState(0);

  const dispatch = useDispatch();

  const getTaskNotificationByUserId = useSelector(
    (state) => state.getTaskNotificationByUserId
  );
  const { notificationByUserId } = getTaskNotificationByUserId;

  const updateNotifTaskStatusById = useSelector(
    (state) => state.updateNotifTaskStatusById
  );
  const { notifStatus } = updateNotifTaskStatusById;

  const handleUpdateStatus = (notifId) => {
    dispatch(updateNotificationStatusById(notifId));
  };

  useEffect(() => {
    if (socket) {
      socket.on('getAssignedNotification', (data) => {
        if (data) {
          setNotifications((prevState) => [...prevState, data]);
          setNotificationsFromSocket((prevState) => [...prevState, data]);
        }
      });
      socket.on('getInvitedNotification', (data) => {
        if (data) {
          setNotifications((prevState) => [...prevState, data]);
          setNotificationsFromSocket((prevState) => [...prevState, data]);
        }
      });
      socket.on('getMentionNotification', (data) => {
        if (data) {
          setNotifications((prevState) => [...prevState, data]);
          setNotificationsFromSocket((prevState) => [...prevState, data]);
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    if (!notificationByUserId) {
      dispatch(getNotificationByUserId(accountInfo._id));
    }
  }, [dispatch, notificationByUserId]);

  useEffect(() => {
    if (!notificationsFromSocket[0]?.senderInfo) {
      setNotifications(notificationByUserId);
    }
  }, [notificationByUserId, notificationsFromSocket]);

  useEffect(() => {
    setNoOfNotications(
      notifications &&
        notifications.filter((item) => item.seen === false).length
    );
  }, [notifications]);

  return (
    <motion.div className='ml-auto relative'>
      {notifications && notifications.length >= 1 ? (
        <Popover class='relative'>
          {({ open }) => (
            <div>
              <Popover.Button>
                <BellIcon
                  className='w-6 h-6 text-darkGrey cursor-pointer'
                  aria-hidden='true'
                />

                {noOfNotifications && noOfNotifications >= 1 ? (
                  <div
                    className='absolute'
                    style={{ top: '-4px', right: '-4px' }}
                  >
                    <p
                      className='text-white font-bold bg-danger rounded-full py-0.5 px-1.5'
                      style={{ fontSize: '8px' }}
                    >
                      {noOfNotifications}
                    </p>
                  </div>
                ) : null}
              </Popover.Button>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
              >
                <Popover.Panel
                  className='absolute w-screen mt-4 px-4 transform -translate-x-3/4 left-1/2'
                  style={{ width: '26rem', zIndex: '9999' }}
                >
                  <div className='overflow-hidden border-t border-l border-r border-opacity-40 shadow-lg'>
                    <div className='bg-white'>
                      {notifications
                        .slice(0, 6)
                        .sort()
                        .map((item) => (
                          <NavLink
                            key={item.senderInfo._id}
                            className='pb-4 flex items-center border-b border-opacity-40'
                            to={`/task/browse/${item.link}&notif_id=${item._id}`}
                            onClick={() => handleUpdateStatus(item._id)}
                          >
                            <div className='mr-2 pt-4 pl-4 pr-4 relative'>
                              {item.category === 'Project' ? (
                                <div className='bg-correct bg-opacity-90 mt-2 p-1 mr-2 absolute top-0 right-0 rounded-full'>
                                  <DocumentReportIcon
                                    className='w-3.5 h-3.5 text-white'
                                    aria-hidden='true'
                                  />
                                </div>
                              ) : (
                                <div className='bg-correct bg-opacity-90 mt-2 p-1 mr-2 absolute top-0 right-0 rounded-full'>
                                  <MenuIcon
                                    className='w-3.5 h-3.5 text-white'
                                    aria-hidden='true'
                                  />
                                </div>
                              )}
                              <img
                                className='mr-3 rounded-full'
                                src={item.senderInfo.accountProfileUploaded}
                                alt={`${item.senderInfo.firstName} ${item.senderInfo.lastName}`}
                                style={{ width: '50px', height: '50px' }}
                              />
                            </div>
                            <div className='w-full pt-4 pr-4 flex-col'>
                              <div className='flex mb-1'>
                                <p className='text-xs' style={{ width: '66%' }}>
                                  <strong>{`${item.senderInfo.firstName} ${item.senderInfo.lastName}`}</strong>
                                  &nbsp;{item.content}
                                  <div className='mt-1 flex items-center'>
                                    {item.type === 'Coding' ? (
                                      <div className='bg-primary mr-1.5 p-0.5 rounded-sm'>
                                        <CodeIcon
                                          className='w-3 h-3 text-white'
                                          aria-hidden='true'
                                        />
                                      </div>
                                    ) : item.type === 'Design' ? (
                                      <div className='bg-correct mr-1.5 p-0.5 rounded-sm'>
                                        <ColorSwatchIcon
                                          className='w-3 h-3 text-white'
                                          aria-hidden='true'
                                        />
                                      </div>
                                    ) : item.type === 'Web Design' ? (
                                      <div className='bg-danger bg-opacity-50 mr-1.5 p-0.5 rounded-sm'>
                                        <DesktopComputerIcon
                                          className='w-3 h-3 text-white'
                                          aria-hidden='true'
                                        />
                                      </div>
                                    ) : (
                                      <div className='bg-yellow mr-1.5 p-0.5 rounded-sm'>
                                        <CreditCardIcon
                                          className='w-3 h-3 text-white'
                                          aria-hidden='true'
                                        />
                                      </div>
                                    )}
                                    <p className='font-semibold mr-1.5'>
                                      {item.type}
                                    </p>
                                    <p
                                      className='font-semibold whitespace-normal'
                                      style={{
                                        width: '10rem',
                                        overflowWrap: 'break-word',
                                      }}
                                    >
                                      {item.name}
                                    </p>
                                    .
                                  </div>
                                </p>
                                <p
                                  className='text-xxs text-right flex-row ml-auto opacity-60'
                                  style={{ width: '34%' }}
                                >
                                  {moment(item.createdAt).fromNow()}
                                  <p
                                    class={`bg-primary w-1 h-1 mt-2 ml-auto p-1 ${
                                      !item.seen ? 'block' : 'hidden'
                                    } rounded-full`}
                                  >
                                    &nbsp;
                                  </p>
                                </p>
                              </div>
                            </div>
                          </NavLink>
                        ))}
                      {notifications.length >= 6 ? (
                        <div className='w-full'>
                          <button
                            className='text-xs font-bold my-4 mx-auto p-4 block border rounded-md hover:text-primary hover:border-primary transition duration-500 ease-in-out'
                            style={{ width: '88%' }}
                          >
                            View All Notifications
                          </button>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </div>
          )}
        </Popover>
      ) : (
        <div className='px-3 py-2 inline-flex items-center '>
          <BellIcon
            className='w-6 h-6 text-darkGrey cursor-pointer'
            aria-hidden='true'
          />
        </div>
      )}
    </motion.div>
  );
};

export default Notification;
