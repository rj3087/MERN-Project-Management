import React, { useState, useEffect, Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { ChevronDoubleDownIcon } from '@heroicons/react/outline';

const SortByAccount = ({ datas, returnSortedItems }) => {
  const [filterInfo, setFilterInfo] = useState();
  const [sortedItems, setSortedItems] = useState();
  const [active, setActive] = useState();
  const [showAvatar, setShowAvatar] = useState(1);

  const handleOnFilterByProfile = (e) => {
    if (active === e.currentTarget.id) {
      setActive('');
    } else {
      setActive(e.currentTarget.id);
    }
  };

  const handleOnDisplayAvatars = () => {
    setShowAvatar(
      showAvatar >= filterInfo.length ? showAvatar : showAvatar + 1
    );
  };

  useEffect(() => {
    if (datas) {
      setFilterInfo(datas);
    }
    setSortedItems(datas.filter((item) => item.creator[0]._id === active));
  }, [active, datas]);

  useEffect(() => {
    if (active) {
      returnSortedItems(sortedItems);
    } else {
      returnSortedItems(datas);
    }
  }, [sortedItems, active]);

  return (
    <>
      <div className='pl-14'>
        <div
          className={`${
            filterInfo && filterInfo.length >= 1 ? 'mr-2' : 'mr-6'
          } flex items-center justify-right`}
        >
          {filterInfo &&
            filterInfo
              .filter(
                (v, i, a) =>
                  a.findIndex(
                    (t) => t.projectCreatorId === v.projectCreatorId
                  ) === i
              )
              .slice(0, 5)
              .map((item) => (
                <img
                  className={`mr-2 rounded-full border-1px ${
                    active === item.creator[0]._id ? 'border-primary p-0.5' : ''
                  } cursor-pointer transition duration-75 ease-in`}
                  key={item._id}
                  id={item.creator[0]._id}
                  src={item.creator[0].accountProfileUploaded}
                  alt={`${item.creator[0].firstName} ${item.creator[0].lastName}`}
                  title={`${item.creator[0].firstName} ${item.creator[0].lastName}`}
                  style={{ width: '40px', height: '40px' }}
                  onClick={handleOnFilterByProfile}
                />
              ))}
        </div>
      </div>
      <Popover className='relative z-50'>
        {({ open }) => (
          <>
            <Popover.Button>
              {filterInfo && filterInfo.length >= 1 ? (
                <div
                  className={`${
                    open ? 'bg-lightGrey' : 'bg-white'
                  } shadow-dark rounded-full relative mr-4`}
                  style={{ width: '32px', height: '32px' }}
                >
                  <ChevronDoubleDownIcon
                    className='h-3 w-3 absolute mt-2.5 ml-2.5 opacity-60 cursor-pointer hover:text-primary'
                    aria-hidden='true'
                  />
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
              <Popover.Panel className='bg-white w-52 absolute z-50 mt-3 transform left-2/2'>
                <div className='overflow-hidden shadow-lg'>
                  <div className='pt-4 pl-4 pr-4'>
                    {filterInfo &&
                      filterInfo
                        .filter(
                          (v, i, a) =>
                            a.findIndex(
                              (t) => t.projectCreatorId === v.projectCreatorId
                            ) === i
                        )
                        .slice(0, showAvatar)
                        .map((item) => (
                          <div
                            className='flex items-center justify-center cursor-pointer'
                            key={item._id}
                            id={item.creator[0]._id}
                            onClick={handleOnFilterByProfile}
                          >
                            <img
                              className={`mr-2 mb-4 rounded-full border-1px ${
                                active === item.creator[0]._id
                                  ? 'border-primary p-0.5'
                                  : ''
                              } cursor-pointer transition duration-75 ease-in`}
                              src={item.creator[0].accountProfileUploaded}
                              alt={`${item.creator[0].firstName} ${item.creator[0].lastName}`}
                              title={`${item.creator[0].firstName} ${item.creator[0].lastName}`}
                              style={{ width: '40px', height: '40px' }}
                            />
                            <p className='text-xs'>
                              {`${item.creator[0].firstName} ${item.creator[0].lastName}`}
                              <span className='text-xxs font-bold mb-6 ml-auto block rounded-full opacity-60'>
                                {
                                  datas.filter(
                                    (data) =>
                                      data.creator[0]._id ===
                                      item.creator[0]._id
                                  ).length
                                }
                                &nbsp; Project Assigned
                              </span>
                            </p>
                          </div>
                        ))}
                  </div>
                  {filterInfo &&
                  filterInfo.filter(
                    (v, i, a) =>
                      a.findIndex(
                        (t) => t.projectCreatorId === v.projectCreatorId
                      ) === i
                  ).length === showAvatar ? (
                    ''
                  ) : (
                    <p
                      className='text-xs text-center ml-4 mr-4 mb-4 py-3 border cursor-pointer'
                      onClick={handleOnDisplayAvatars}
                    >
                      Show More
                    </p>
                  )}
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </>
  );
};

export default SortByAccount;
