import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Searchbar from './Searchbar';
import Notification from './Notification';
import Avatar from './Avatar';

const OnlineList = ({ user, roomId }) => {
  const HandleGetUserId = (e) => {
    roomId(e);
  };
  return (
    <>
      <div className='bg-white w-1/4 mr-6 p-6 rounded-lg'>
        {user &&
          user.map((user) => (
            <button
              className='mb-6 flex'
              onClick={() => HandleGetUserId(user._id)}
            >
              <div className='relative'>
                <div
                  className={`w-12px h-12px ${
                    user.onlineStatus === 'online'
                      ? 'bg-correct'
                      : !user.onlineStatus
                      ? 'bg-darkGrey'
                      : ''
                  } absolute rounded-full`}
                ></div>
                <img
                  key={user._id}
                  className='mr-4 rounded-full'
                  src={user.accountProfileUploaded}
                  alt={`${user.firstName} ${user.lastName}`}
                  title={`${user.firstName} ${user.lastName}`}
                  style={{
                    width: '42px',
                    height: '42px',
                  }}
                />
              </div>
              <p className='text-xs text-grey font-bold'>{`${user.firstName} ${user.lastName}`}</p>
            </button>
          ))}
      </div>
    </>
  );
};

export default OnlineList;
