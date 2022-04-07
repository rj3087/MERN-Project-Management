import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import moment from 'moment';

import { updateTaskSeen } from '../../redux/actions/messageActions';
import avatarIcon from '../../../src/assets/user-avatar.png';

const ConversationList = ({
  currentConversation,
  messagesList,
  users,
  currentUser,
  currentMessage,
  updateSeen,
}) => {
  const [friendId, setFriendId] = useState();
  const [userId, setUserId] = useState([]);
  const [lastMessage, setLastMessage] = useState();

  const textTruncate = (str, num) => {
    return str.length > num ? str.slice(0, num) + '...' : str;
  };

  const dispatch = useDispatch();

  useEffect(() => {
    setFriendId(
      currentConversation &&
        currentConversation?.members.find((id) => id !== currentUser)
    );
    if (userId === undefined || userId.length === 0) {
      setUserId(users && users.find((id) => id._id === friendId));
    }
    if (!lastMessage) {
      setLastMessage(
        messagesList?.filter((id) => id?.senderId._id !== currentUser)[
          messagesList?.filter((id) => id?.senderId._id !== currentUser)
            .length - 1
        ]
      );
    }
    if (updateSeen.length > 0) {
      dispatch(updateTaskSeen(updateSeen));
    }
  }, [
    currentConversation,
    currentConversation?.members,
    currentUser,
    friendId,
    lastMessage,
    messagesList,
    userId,
    users,
    updateSeen,
  ]);
  return (
    <>
      <div className='w-full flex items-center'>
        <div className='w-15% mr-4 relative'>
          <img
            className='mr-2 rounded-full'
            src={
              userId && userId.accountProfileUploaded
                ? userId.accountProfileUploaded
                : avatarIcon
            }
            alt={userId && `${userId.firstName} ${userId.lastName}`}
            title={userId && `${userId.firstName} ${userId.lastName}`}
          />
        </div>
        <div className='w-85% text-grey flex flex-col'>
          <div className='flex items-center'>
            <p className='text-xs font-bold'>
              {userId && `${userId.firstName} ${userId.lastName}`}
            </p>
            <p className='text-xxs font-bold ml-auto opacity-40'>
              {moment(lastMessage?.createdAt).startOf('mins').fromNow()}
            </p>
          </div>
          <div className='w-full mt-2 flex items-center'>
            <p className='text-sm font-medium opacity-60'>
              {lastMessage?.messageText &&
                textTruncate(lastMessage?.messageText, 42)}
            </p>
            <div className='ml-auto relative rounded-xl'>
              {messagesList?.filter((id) => id.senderId._id !== currentUser) ? (
                messagesList?.filter(
                  (id) => id.senderId._id !== currentUser && id.seen === false
                ).length >= 1 ? (
                  <p className='bg-danger text-white text-xxs ml-auto py-0.5 px-1.5 rounded-xl'>
                    {messagesList?.filter(
                      (id) =>
                        id.senderId._id !== currentUser && id.seen === false
                    ).length + currentMessage.length}
                  </p>
                ) : currentMessage.length === 0 ? null : null
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConversationList;
