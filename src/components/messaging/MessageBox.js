import React, { useState, useEffect } from 'react';
import moment from 'moment';

import avatarIcon from '../../../src/assets/user-avatar.png';

const ChatBox = ({ message }) => {
  const [currentUser] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );

  return (
    <>
      <div className='w-100%'>
        {message && message.senderId._id === currentUser._id ? (
          <>
            <div className='w-full flex flex-row justify-end'>
              <div className='w-60% flex'>
                <div className='w-90%'>
                  <div className='bg-darkGrey w-80% bg-opacity-90 text-xs ml-auto p-3 rounded-tl-3xl rounded-tr-3xl rounded-bl-3xl'>
                    {message.messageMedia.length >= 1 ? (
                      <div className='flex'>
                        <div className='mt-2 mb-4 flex flex-row'>
                          {message.messageMedia.map((file, index) => (
                            <div
                              key={index}
                              style={{
                                backgroundImage: `url(${file})`,
                                backgroundPosition: 'center center',
                                backgroundSize: 'cover',
                                width: '180px',
                                height: '120px',
                                marginRight: '1rem',
                                borderRadius: '0.3rem',
                                position: 'relative',
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <p>{message.messageText}</p>
                  </div>
                </div>
                <div className='w-10% mt-auto flex justify-end'>
                  <img
                    className='rounded-full'
                    src={
                      message && message.senderId.accountProfileUploaded
                        ? message.senderId.accountProfileUploaded
                        : avatarIcon
                    }
                    alt={
                      message &&
                      `${message.senderId.firstName} ${message.senderId.lastName}`
                    }
                    title={
                      message &&
                      `${message.senderId.firstName} ${message.senderId.lastName}`
                    }
                    style={{ width: '42px', height: 'auto' }}
                  />
                </div>
              </div>
            </div>
            <div className='w-57% text-xxs text-left mt-2 mb-6 flex justify-end'>
              {moment(message.createdAt).startOf('mins').fromNow()}
            </div>
          </>
        ) : (
          <>
            <div className='w-full flex flex-row justify-start'>
              <div className='w-60% flex'>
                <div className='w-10% mt-auto flex justify-start'>
                  <img
                    className='mr-2 rounded-full'
                    src={
                      message && message.senderId.accountProfileUploaded
                        ? message.senderId.accountProfileUploaded
                        : avatarIcon
                    }
                    alt={
                      message &&
                      `${message.senderId.firstName} ${message.senderId.lastName}`
                    }
                    title={
                      message &&
                      `${message.senderId.firstName} ${message.senderId.lastName}`
                    }
                    style={{ width: '42px', height: 'auto' }}
                  />
                </div>
                <div className='w-90%'>
                  <div className='bg-primary bg-opacity-90 w-80% text-white text-xs mr-auto p-3 rounded-tl-3xl rounded-tr-3xl rounded-br-3xl'>
                    {message.messageMedia.length >= 1 ? (
                      <div className='flex'>
                        <div className='mt-2 mb-4 flex flex-row'>
                          {message.messageMedia.map((file, index) => (
                            <div
                              key={index}
                              style={{
                                backgroundImage: `url(${file})`,
                                backgroundPosition: 'center center',
                                backgroundSize: 'cover',
                                width: '180px',
                                height: '120px',
                                marginRight: '1rem',
                                borderRadius: '0.3rem',
                                position: 'relative',
                              }}
                            ></div>
                          ))}
                        </div>
                      </div>
                    ) : null}
                    <p>{message.messageText}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-49% text-xxs text-right mt-2 mb-6'>
              {moment(message.createdAt).startOf('mins').fromNow()}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default ChatBox;
