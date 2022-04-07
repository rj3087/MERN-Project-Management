import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Searchbar from '../Searchbar';
import Notification from '../notifications/Notification';
import Avatar from './Avatar';

const Topbar = ({ socket, searchBar, searchResult, history }) => {
  const [accountInfo, setAccountInfo] = useState();

  const accountLogin = useSelector((state) => state.accountLogin);
  const { currentAccountInfo } = accountLogin;

  const dispatch = useDispatch();

  useEffect(() => {
    if (!accountInfo) {
      setAccountInfo(currentAccountInfo);
    }
  }, [accountInfo, currentAccountInfo]);

  return (
    <div className='bg-white ml-auto py-3 px-10 flex flex-row border-b'>
      {searchBar ? (
        <Searchbar searchId={(searchId) => searchResult(searchId)} />
      ) : null}
      {accountInfo && (
        <div
          className={`${searchBar ? 'ml-auto' : 'ml-auto'} flex items-end`}
          style={{ width: '6%' }}
        >
          <Notification socket={socket} history={history} />
          <Avatar
            profilePic={`${currentAccountInfo.accountProfileUploaded}`}
            name={`${currentAccountInfo.firstName} ${accountInfo.lastName}`}
            isAdmin={currentAccountInfo.isAdmin}
          />
        </div>
      )}
    </div>
  );
};

export default Topbar;
