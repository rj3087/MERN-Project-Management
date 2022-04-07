import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Listbox, Transition } from '@headlessui/react';
import { CheckIcon, SelectorIcon } from '@heroicons/react/solid';
import {
  getDepartmentById,
  getDepartmentList,
} from '../../../redux/actions/utilitiesActions';

const SearchDepartment = ({
  className,
  errorClassName,
  placeholder,
  selectedDepartmentId,
  returnDepartmentId,
}) => {
  const initialValue = [{ option: placeholder }];
  const [selected, setSelected] = useState(initialValue[0]);

  const departmentGetById = useSelector((state) => state.departmentGetById);
  const { departmentById } = departmentGetById;

  const departmentListGet = useSelector((state) => state.departmentListGet);
  const { departments } = departmentListGet;

  const dispatch = useDispatch();

  useEffect(() => {
    if (returnDepartmentId) {
      dispatch(getDepartmentById(returnDepartmentId));
    }
  }, [dispatch, returnDepartmentId]);

  useEffect(() => {
    if (departments === undefined || departments.length === 0) {
      dispatch(getDepartmentList());
    }
  }, [dispatch]);

  useEffect(() => {
    if (!returnDepartmentId) {
      selectedDepartmentId(selected._id);
    }
  }, [selected]);

  return (
    <div className={className}>
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative' style={{ zIndex: '60' }}>
          <Listbox.Button
            className={`bg-white w-full text-left py-4 pl-3 pr-10 relative ${errorClassName} rounded-md cursor-pointer focus:outline-none`}
          >
            <span
              className={`text-xs block truncate ${
                departments ? 'opacity-100' : 'opacity-90'
              } ${
                selected.option === placeholder
                  ? 'text-placeholder'
                  : 'text-grey'
              } pl-7`}
            >
              {selected.departmentName
                ? selected.departmentName
                : departmentById?.departmentName
                ? departmentById.departmentName
                : selected.option}
            </span>
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
            <Listbox.Options className='absolute w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
              {departments?.map((item) => (
                <Listbox.Option
                  key={item._id}
                  className={({ active }) =>
                    `${active ? 'text-amber-900 bg-amber-100' : 'text-gray-900'}
                          cursor-default select-none relative py-2 pl-10 pr-4`
                  }
                  value={item}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`${
                          selected ? 'font-medium' : 'font-normal'
                        } block truncate`}
                      >
                        {item.departmentName}
                      </span>
                      {selected ? (
                        <span
                          className={`${
                            active ? 'text-amber-600' : 'text-amber-600'
                          }
                                absolute inset-y-0 left-0 flex items-center pl-3`}
                        >
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
    </div>
  );
};

export default SearchDepartment;
