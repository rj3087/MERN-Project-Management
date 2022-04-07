import React, { Fragment, useState, useEffect, useMemo } from 'react';
import moment from 'moment';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/solid';
import { ChevronDownIcon } from '@heroicons/react/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const SortedList = ({ datas, typeOfSort, returnSortedItems }) => {
  const [selected, setSelected] = useState(typeOfSort[0]);

  const useSortableItem = (items, config = selected) => {
    const [sortConfig, setSortConfig] = useState(config);
    const sortedItem = useMemo(() => {
      let sortableItems = [...items];

      if (sortConfig.id === 2) {
        sortableItems.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) return -1;
          else if (b[sortConfig.key] > a[sortConfig.key]) return 1;
          else return 0;
        });
      }

      if (sortConfig.id === 3) {
        let date = moment(Date.now()).format();

        sortableItems = datas
          .filter((item) => item.dueDate > date)
          .sort((a, b) => {
            if (a[sortConfig.key] < b[sortConfig.key]) return -1;
            else if (b[sortConfig.key] > a[sortConfig.key]) return 1;
            else return 0;
          });

        // sortableItems = datas.filter((item) => date < item.dueDate);
      }
      if (sortConfig.id === 4) {
        let date = moment(Date.now()).format();
        sortableItems = datas.filter((item) => date > item.dueDate);
      }

      if (sortConfig.id === 5) {
        sortableItems.sort((a, b) => {
          if (a[sortConfig.key] > b[sortConfig.key]) return -1;
          else if (b[sortConfig.key] < a[sortConfig.key]) return 1;
          else return 0;
        });
      }

      if (sortConfig.id === 6) {
        sortableItems.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) return -1;
          else if (b[sortConfig.key] > a[sortConfig.key]) return 1;
          else return 0;
        });
      }
      return sortableItems;
    }, [items, sortConfig]);

    const requestSortType = (key) => {
      setSortConfig(key);
    };

    return { items: sortedItem, requestSortType };
  };

  useEffect(() => {
    requestSortType(selected);
  }, [selected]);

  const { items, requestSortType } = useSortableItem(datas && datas);

  useEffect(() => {
    returnSortedItems(items);
  }, [items]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <>
          <div className='w-9rem ml-4 relative'>
            <Listbox.Button className='relative w-full bg-white text-xs border rounded-md shadow-sm pl-4 pr-10 py-3 text-left cursor-default focus:outline-none focus:border-primary'>
              <span className='block truncate'>{selected.status}</span>
              <span className='ml-3 absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
                <ChevronDownIcon
                  className='h-4 w-4 opacity-40'
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
              <Listbox.Options className='absolute z-10 mt-1 w-full bg-white shadow-lg max-h-56 rounded-md py-2 overflow-auto focus:outline-none'>
                {typeOfSort.map((status) => (
                  <Listbox.Option
                    key={status.id}
                    className={({ active }) =>
                      classNames(
                        active
                          ? 'text-white text-xs bg-primary bg-opacity-80'
                          : 'text-grey text-xs',
                        'cursor-default select-none relative py-3 pl-3 pr-9'
                      )
                    }
                    value={status}
                  >
                    {({ selected, active }) => (
                      <>
                        <div className='flex items-center'>
                          <span
                            className={classNames(
                              selected ? 'text-xs' : 'font-normal',
                              'ml-3 block truncate'
                            )}
                          >
                            {status.status}
                          </span>
                        </div>

                        {selected ? (
                          <span
                            className={classNames(
                              active ? 'text-white' : 'text-primary',
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

export default SortedList;
