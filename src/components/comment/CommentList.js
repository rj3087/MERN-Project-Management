import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import DOMPurify from 'dompurify';
import moment from 'moment';
import { Menu, Transition } from '@headlessui/react';
import { DotsHorizontalIcon } from '@heroicons/react/solid';
import { TrashIcon, PencilAltIcon } from '@heroicons/react/outline';

const CommentList = ({ commentListByIdInfo }) => {
  const [toggleClass, setToggleClass] = useState(false);

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  const handleToggleClass = () => {
    setToggleClass(!toggleClass);
  };

  return (
    <>
      <div className='w-2/4 flex flex-col'>
        {commentListByIdInfo &&
          commentListByIdInfo.map((comment) => (
            <div key={comment._id} className='mb-6 flex flex-row items-start'>
              <img
                className='rounded-full'
                src={comment.commentId.accountProfileUploaded}
                alt={`${comment.commentId.firstName} ${comment.commentId.lastName}`}
                style={{ width: '2.2rem', height: '2.2rem' }}
              />
              <div className='pl-6'>
                <h3 className='text-sm font-bold'>
                  {`${comment.commentId.firstName} ${comment.commentId.lastName}`}{' '}
                </h3>
                <h4 className='text-xxs opacity-60'>
                  {moment(comment.createdAt).fromNow()}
                </h4>
                <p
                  className='text-sm font-medium pt-2'
                  dangerouslySetInnerHTML={createMarkup(
                    JSON.parse(comment.taskComment.content)
                  )}
                />
              </div>
              <Menu>
                {({ open }) => (
                  <>
                    <Menu.Button
                      className='mt-0.5 ml-2 relative transition duration-150 ease-in-out outline-none'
                      onClick={handleToggleClass}
                      style={{ zIndex: '99' }}
                    >
                      <DotsHorizontalIcon
                        className='w-3 h-3 cursor-pointer'
                        aria-hidden='true'
                      />
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
                        className='absolute w-28 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg outline-none'
                      >
                        <div className='px-4 py-3'>
                          <p className='text-xs leading-5'>Actions </p>
                        </div>
                        <div className='py-2'>
                          <Menu.Item>
                            {({ active }) => (
                              <div className='p-3 flex cursor-pointer hover:bg-lightGrey'>
                                <TrashIcon
                                  className='w-4 h-4 opacity-70 absolute'
                                  aria-hidden='true'
                                />
                                <span className='text-xs ml-6'>Delete</span>
                              </div>
                            )}
                          </Menu.Item>
                          <Menu.Item>
                            {({ active }) => (
                              <div className='p-3 flex cursor-pointer hover:bg-lightGrey'>
                                <PencilAltIcon
                                  className='w-4 h-4 opacity-70 absolute'
                                  aria-hidden='true'
                                />
                                <span className='text-xs ml-6'>Edit</span>
                              </div>
                            )}
                          </Menu.Item>
                        </div>
                      </Menu.Items>
                    </Transition>
                  </>
                )}
              </Menu>
            </div>
          ))}
      </div>
    </>
  );
};

export default CommentList;
