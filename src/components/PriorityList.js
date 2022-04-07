import React, { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';

import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

const listPriority = [
  {
    priority: 'Low',
  },
  {
    priority: 'Moderate',
  },
  {
    priority: 'High',
  },
  {
    priority: 'Very High',
  },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const PriorityList = ({ selectedPriority, returnPriority }) => {
  const [getPriority, setGetPriority] = useState();
  const [selected, setSelected] = useState(listPriority[0]);

  useEffect(() => {
    if (selected) {
      selectedPriority(selected.priority);
    }
    setGetPriority((prevData) => ({
      ...prevData,
      status: returnPriority && returnPriority,
    }));
  }, [selected, returnPriority]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className='mt-1 relative'>
            <Listbox.Button className='relative w-full bg-white text-xs flex items-center border rounded-md pl-4 pr-10 py-4 text-left cursor-default focus:outline-none focus:border-primary'>
              <span
                className='text-xs mr-3'
                style={{
                  fontSize: '1.2rem',
                  color: `${
                    getPriority && getPriority.status
                      ? getPriority && getPriority.status === 'Very High'
                        ? '#f65b5d'
                        : getPriority && getPriority.status === 'High'
                        ? '#FFA310'
                        : getPriority && getPriority.status === 'Moderate'
                        ? '#03BB3F'
                        : '#5CACF3'
                      : selected.priority === 'Very High'
                      ? '#f65b5d'
                      : selected.priority === 'High'
                      ? '#FFA310'
                      : selected.priority === 'Moderate'
                      ? '#03BB3F'
                      : '#5CACF3'
                  }`,
                }}
              >
                &bull;
              </span>
              <span className='block truncate'>
                {getPriority && getPriority.status
                  ? getPriority.status
                  : selected.priority}
              </span>
              <span className='ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                <SelectorIcon
                  className='h-5 w-5 opacity-40'
                  aria-hidden='true'
                />
              </span>
            </Listbox.Button>

            <Transition
              show={open}
              as={Fragment}
              leave='transition ease-in duration-100'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <Listbox.Options className='absolute z-10 mt-1 w-full bg-white shadow-dark max-h-56 rounded-md py-2 overflow-auto focus:outline-none'>
                {listPriority.map((priority, index) => (
                  <Listbox.Option
                    key={index}
                    className={({ active }) =>
                      classNames(
                        active
                          ? 'text-white bg-primary bg-opacity-80 text-xs'
                          : 'text-grey text-xs',
                        'cursor-default select-none relative py-2 pl-3 pr-9'
                      )
                    }
                    value={priority}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className='flex items-center'>
                          <span
                            className='text-xs'
                            style={{
                              fontSize: '1.2rem',
                              color: `${
                                priority.priority === 'Very High'
                                  ? '#f65b5d'
                                  : priority.priority === 'High'
                                  ? '#FFA310'
                                  : priority.priority === 'Moderate'
                                  ? '#03BB3F'
                                  : '#5CACF3'
                              }`,
                            }}
                          >
                            &bull;
                          </span>
                          <span
                            className={classNames(
                              selected ? 'text-xs' : 'font-normal',
                              'ml-3 block truncate'
                            )}
                          >
                            {priority.priority}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white text-xs' : 'text-primary',
                              'absolute inset-y-0 right-0 flex items-center pr-4'
                            )}
                          >
                            <CheckIcon className='h-5 w-5' aria-hidden='true' />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>
          </div>
        </>
      )}
    </Listbox>
  );
};

export default PriorityList;
