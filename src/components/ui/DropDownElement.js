import { Fragment, useState, useEffect } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';

export const DropDownElement = ({
  className,
  data,
  selectedItem,
  returnSelectedItem,
}) => {
  const [selected, setSelected] = useState(data[0]);
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (returnSelectedItem && !isSelected) {
      setSelected((prevState) => ({
        ...prevState,
        item: returnSelectedItem,
      }));
    }

    if (isSelected) {
      selectedItem(selected.item);
    }
  }, [returnSelectedItem, selected.item]);

  return (
    <Listbox
      value={selected}
      onChange={setSelected}
      onClick={() => setIsSelected(true)}
    >
      <div className='relative mt-1'>
        <Listbox.Button className={className}>
          <span className='block truncate'>{selected.item}</span>
          <span className='absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none'>
            <SelectorIcon
              className='w-5 h-5 text-gray-400'
              aria-hidden='true'
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave='transition ease-in duration-100'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <Listbox.Options className='absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg focus:outline-none sm:text-sm'>
            {data.map((item, index) => (
              <Listbox.Option
                key={index}
                className={({ active }) =>
                  `cursor-default select-none relative py-2 pl-10 pr-4 ${
                    active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'
                  }`
                }
                value={item}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block truncate ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {item.item}
                    </span>
                    {selected ? (
                      <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                        <CheckIcon className='w-5 h-5' aria-hidden='true' />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};
