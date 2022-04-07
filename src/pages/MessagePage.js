import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';
import { getAccountById, getAccounts } from '../redux/actions/accountActions';
import {
  registerConversation,
  getConversationById,
} from '../redux/actions/conversationActions';
import {
  registerMessage,
  getMessageList,
  getMessageById,
  uploadMessageAttachments,
} from '../redux/actions/messageActions';
import {
  SearchIcon,
  PaperAirplaneIcon,
  DocumentAddIcon,
} from '@heroicons/react/outline';
import { XCircleIcon } from '@heroicons/react/solid';
import Topbar from '../components/header/Topbar';
import Sidebar from '../components/sidebar/Sidebar';
import ConversationList from '../components/messaging/ConversationList';
import MessageBox from '../components/messaging/MessageBox';
import InputElement from '../components/ui/InputElement';
import avatarIcon from '../assets/user-avatar.png';

const MessagePage = ({ socket, history }) => {
  const [accountInfo, setAccountInfo] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [userInfo, setUserInfo] = useState();
  const [conversationInfo, setConversationInfo] = useState([]);
  const [currentConversationInfo, setCurrentConversationInfo] = useState([]);
  const [currentMessage, setCurrentMessage] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [arrivalMessage, setArrivalMessage] = useState();
  const [chatAttachment, setChatAttachment] = useState([]);
  const [updateSeen, setUpdateSeen] = useState([]);
  const [search, setSearch] = useState();
  const [isToggleWidth, setToggleWidth] = useState(false);

  const dispatch = useDispatch();

  const accountLogin = useSelector((state) => state.accountLogin);
  const { currentAccountInfo } = accountLogin;

  const accountGetById = useSelector((state) => state.accountGetById);
  const { accountById } = accountGetById;

  const accountsGet = useSelector((state) => state.accountsGet);
  const { accounts } = accountsGet;

  const conversationGetById = useSelector((state) => state.conversationGetById);
  const { conversation } = conversationGetById;

  const messageListGet = useSelector((state) => state.messageListGet);
  const { messages } = messageListGet;

  const messageGetById = useSelector((state) => state.messageGetById);
  const { message } = messageGetById;

  const messageUploadAttachments = useSelector(
    (state) => state.messageUploadAttachments
  );
  const { uploadAttachments } = messageUploadAttachments;

  const handleGetMessage = (conversation) => {
    setCurrentConversationInfo(conversation);
    dispatch(
      getAccountById(
        conversation.members.find((id) => id !== currentAccountInfo._id)
      )
    );
    dispatch(getMessageById(conversation._id));
  };

  const handleOnCreateConversation = (e) => {
    dispatch(
      registerConversation({
        senderId: currentAccountInfo._id,
        receiverId: e.currentTarget.id,
      })
    );
    dispatch(getConversationById(currentAccountInfo._id));
  };

  const handleSendMessage = (e) => {
    e.preventDefault();

    if (newMessage) {
      const messageData = {
        conversationId: currentConversationInfo._id,
        senderId: currentAccountInfo._id,
        messageText: newMessage.messageText,
        messageMedia: uploadAttachments,
      };

      dispatch(registerMessage(messageData));

      socket?.emit('sendMessage', {
        senderId: currentAccountInfo,
        receiverId: currentConversationInfo.members.find(
          (id) => id !== currentAccountInfo._id
        ),
        message: newMessage.messageText,
        messageMedia: chatAttachment,
        seen: false,
      });

      setCurrentMessage((currentMessage) => [
        ...currentMessage,
        {
          senderId: currentAccountInfo,
          messageText: newMessage.messageText,
          messageMedia: chatAttachment,
          seen: false,
        },
      ]);
    }
  };

  const handleOnSearch = (val) => {
    const params = val.currentTarget.value;

    const user = userInfo.filter((item) => item._id !== accountInfo._id);

    if (params === '') {
      setSearch([]);
    } else {
      setSearch(user);
    }
  };

  const handleOnChange = (e) => {
    setNewMessage((data) => ({ ...data, messageText: e.target.value }));
  };

  const handleOnUploadChat = (e) => {
    const newArray = [];
    const formData = new FormData();

    Array.from(e.target.files).forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        newArray.push(reader.result);
        setChatAttachment(newArray);
      };

      formData.append('messageUploadAttachments', file);
    });

    dispatch(uploadMessageAttachments(formData));
  };

  const handleOnRemoveImg = (e) => {
    setChatAttachment(chatAttachment.filter((item) => item !== e));
  };

  useEffect(() => {
    if (!currentAccountInfo) {
      history.push('/login');
    } else {
      if (accounts === undefined || accounts.length === 0) {
        dispatch(getAccounts());
      } else {
        setUserInfo(accounts);
      }
      if (!conversation) {
        dispatch(getConversationById(currentAccountInfo._id));
      } else {
        setConversationInfo(conversation);

        const fetchMsg = () => {
          if (messages === undefined || messages.length === 0) {
            dispatch(getMessageList());
          }
        };

        const timer = setTimeout(() => {
          fetchMsg();
        }, 500);

        return () => clearTimeout(timer);
      }
    }
  }, [accounts, conversation, currentAccountInfo, dispatch, history, messages]);

  useEffect(() => {
    if (socket) {
      socket.on('getMessage', (data) => {
        setArrivalMessage({
          senderId: data.accountId,
          messageText: data.message,
          messageMedia: data.messageMedia,
          createdAt: Date.now(),
        });
      });
    }
  }, [currentAccountInfo._id, socket]);

  useEffect(() => {
    if (message) {
      const filteredMessage = message.filter(
        (id) => id.senderId._id !== currentAccountInfo._id
      );

      const newMessages = filteredMessage?.map((mess) => {
        return { ...mess, seen: true };
      });

      setCurrentMessage(message);
      setUpdateSeen(newMessages);
    }
  }, [currentAccountInfo._id, message]);

  useEffect(() => {
    if (arrivalMessage) {
      setCurrentMessage((currentMessage) => [
        ...currentMessage,
        arrivalMessage,
      ]);
    }
  }, [arrivalMessage, currentConversationInfo]);

  return (
    <>
      <div className='w-full h-full flex'>
        <div
          className={`w-full h-20 ${
            isToggleWidth ? 'ml-12%' : 'ml-4%'
          } order-2`}
        >
          <Topbar socket={socket} searchBar={false} />
          <div className='bg-lightGrey p-10 flex flex-col'>
            <div className='w-full h-83.8vh flex flex-row'>
              <div className='bg-white w-1/4 h-90% mr-10 pb-6 flex flex-col'>
                <div className='relative'>
                  <div className='w-full pt-6 pl-8 pb-7 pr-8 relative border-b'>
                    <InputElement
                      className='w-full px-10 py-3 text-xs leading-tight border rounded-md appearance-none
               focus:border-primary focus:outline-none focus:shadow-outline'
                      id='people'
                      name='people'
                      type='text'
                      placeholder='Looking for someone?'
                      onChange={handleOnSearch}
                    />
                    <SearchIcon
                      className='w-5 h-5 mt-8 ml-3 absolute top-0 opacity-30'
                      aria-hidden='true'
                    />
                    <div className='relative z-20'>
                      {search && (
                        <div className='bg-white w-full absolute shadow-md'>
                          {search.map((data) => (
                            <div
                              id={data._id}
                              key={data._id}
                              className='p-4 flex items-center cursor-pointer hover:bg-darkGrey hover:bg-opacity-60'
                            >
                              <img
                                className='mr-2 rounded-full'
                                src={
                                  data.accountProfileUploaded
                                    ? data.accountProfileUploaded
                                    : avatarIcon
                                }
                                alt={`${data.firstName} ${data.lastName}`}
                                style={{ width: '36px', height: 'auto' }}
                              />
                              <div className='text-xs'>
                                <p className='font-bold'>{`${data.firstName} ${data.lastName}`}</p>
                                <p className='text-xxs opacity-60'>
                                  {data.email}
                                </p>
                              </div>
                              <div
                                id={data._id}
                                className='bg-primary text-white text-xxs ml-auto py-1.5 px-3 rounded-lg cursor-pointer'
                                onClick={handleOnCreateConversation}
                              >
                                Send Message
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <h2 className='text-md font-bold pt-8 pl-8 pb-6 pr-8 border-b'>
                    {conversation?.length >= 1
                      ? 'All Conversations'
                      : 'All Conversation'}
                    {conversation && (
                      <span className='bg-danger text-white text-xxs ml-2 py-1 px-1.5 relative -top-3 rounded-full'>
                        {conversation?.length}
                      </span>
                    )}
                  </h2>
                </div>
                {conversationInfo.map((conversation, index) => (
                  <div
                    key={index}
                    className='p-6 cursor-pointer hover:bg-darkGrey hover:bg-opacity-60'
                    onClick={() => handleGetMessage(conversation)}
                  >
                    <ConversationList
                      currentConversation={conversation}
                      messagesList={messages && messages}
                      currentMessage={currentMessage}
                      users={userInfo}
                      currentUser={currentAccountInfo._id}
                      updateSeen={updateSeen}
                    />
                  </div>
                ))}
              </div>
              <div className='bg-white w-3/4 mr-6 flex flex-col'>
                {accountById && (
                  <div className='p-6 flex border-b'>
                    <>
                      <div className='relative'>
                        {/* {userOnline
                          ?.map((id) => id?.userId)
                          .find((id) => id === accountById?._id) ? (
                          <span
                            className='bg-correct mr-2 absolute right-0 bottom-0 rounded-full'
                            style={{ width: '0.8rem', height: '0.8rem' }}
                          ></span>
                        ) : (
                          <span
                            className='bg-darkGrey mr-2 absolute right-0 bottom-0 rounded-full'
                            style={{ width: '0.8rem', height: '0.8rem' }}
                          ></span>
                        )} */}
                        <img
                          className='mr-2 rounded-full'
                          src={
                            accountById.accountProfileUploaded
                              ? accountById.accountProfileUploaded
                              : avatarIcon
                          }
                          alt={
                            currentMessage &&
                            `${accountById.firstName} ${accountById.lastName}`
                          }
                          style={{ width: '45px', height: 'auto' }}
                        />
                      </div>
                      <div className='ml-2 flex flex-col justify-center'>
                        <p className='text-sm font-bold'>
                          {`${accountById.firstName} ${accountById.lastName}`}
                        </p>
                        <p className='text-xs font-bold opacity-60'>
                          {accountById.jobTitle}
                        </p>
                      </div>
                    </>
                  </div>
                )}
                <div className='w-full pt-8 pl-8 pr-8 overflow-x-auto'>
                  {currentConversationInfo === undefined ||
                  currentConversationInfo.length === 0 ? (
                    <div className='w-38% text-7xl p-12 flex opacity-20 '>
                      Click or Search the user to start conversation...
                    </div>
                  ) : (
                    currentMessage.map((message, index) => (
                      <ScrollToBottom key={index} className='message-container'>
                        <MessageBox message={message} />
                      </ScrollToBottom>
                    ))
                  )}
                </div>
                <div
                  className={`w-full mt-auto p-8 flex ${
                    currentMessage.length !== 0 ? 'border-t' : null
                  }`}
                >
                  {currentConversationInfo === undefined ||
                  currentConversationInfo.length === 0 ? null : (
                    <div className='w-full relative'>
                      <div className='focus-whitin p-2 border rounded-lg outline-none focus:border-primary focus:outline-none'>
                        {chatAttachment === undefined ||
                        chatAttachment.length === 0 ? null : (
                          <div
                            className='mb-2 p-2 flex flex-row'
                            style={{ width: '100% ', height: '120px' }}
                          >
                            {chatAttachment.map((data) => (
                              <div
                                style={{
                                  backgroundImage: `url(${data})`,
                                  backgroundPosition: 'center center',
                                  backgroundSize: 'cover',
                                  width: '120px',
                                  height: '120px',
                                  marginRight: '1rem',
                                  borderRadius: '0.3rem',
                                  position: 'relative',
                                }}
                              >
                                <XCircleIcon
                                  className='text-primary w-2rem h-2rem  absolute -top-7 -right-14 cursor-pointer opacity-80'
                                  aria-hidden='true'
                                  onClick={() => handleOnRemoveImg(data)}
                                />
                              </div>
                            ))}
                          </div>
                        )}

                        <textarea
                          className='w-full text-xs pt-4 pl-2 pb-4 pr-20 outline-none focus:outline-none'
                          type='textarea'
                          rows='1'
                          placeholder='Write Message...'
                          onChange={handleOnChange}
                          value={newMessage?.messageText}
                        />
                      </div>
                      <div className='mb-8 mr-12 absolute bottom-0 right-0'>
                        <input
                          accept='image/*'
                          id='chat-upload'
                          type='file'
                          name='messageUploadAttachments'
                          multiple
                          style={{ display: 'none' }}
                          onChange={handleOnUploadChat}
                        />
                        <label
                          className='border-white rounded-full cursor-pointer'
                          htmlFor='chat-upload'
                        >
                          <DocumentAddIcon
                            className='text-primary w-5 h-5'
                            aria-hidden='true'
                          />
                        </label>
                      </div>
                      <button
                        className='mb-9 absolute bottom-0 right-0'
                        onClick={handleSendMessage}
                      >
                        <PaperAirplaneIcon
                          className='text-primary w-5 h-5 mt-3 mr-3 transform rotate-45 hover:w-6'
                          aria-hidden='true'
                        />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Sidebar
          isSlideNav={false}
          isToggleWidth={(isToggleWidth) => setToggleWidth(isToggleWidth)}
        />
      </div>
    </>
  );
};

export default MessagePage;
