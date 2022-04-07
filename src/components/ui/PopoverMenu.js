import { Fragment } from 'react';
import { Popover, Transition } from '@headlessui/react';
import { useHistory } from 'react-router-dom';
import {
  DotsVerticalIcon,
  ClipboardListIcon,
  DocumentAddIcon,
  EyeIcon,
  TrashIcon,
} from '@heroicons/react/outline';

export const PopoverMenu = ({
  account,
  item,
  isShowProjectTask,
  isShowProject,
  isDeleteProject,
}) => {
  let history = useHistory();

  const handleRedirectTaskPage = () => {
    history.push('/tasks');
  };
  return (
    <div className='w-full'>
      <Popover>
        {({ open }) => (
          <>
            <Popover.Button
              className={`
                ${open ? '' : 'text-opacity-90'}
                text-grey flex`}
            >
              <DotsVerticalIcon
                className={`${open ? '' : 'text-opacity-70'}
                  w-4 h-4`}
                aria-hidden='true'
              />
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
              <Popover.Panel
                className='absolute z-10 w-screen max-w-lg px-4 mt-3 transform'
                style={{ right: '-100%' }}
              >
                <div className='bg-white overflow-hidden shadow-md'>
                  <div className='bg-white p-4 relative grid gap-1 grid-cols-2'>
                    <div
                      className='p-3 flex cursor-pointer group'
                      onClick={handleRedirectTaskPage}
                    >
                      <div className='bg-primary text-white w-10 h-10 py-1 px-2 mr-4 flex items-center justify-center rounded-md group-hover:bg-white group-hover:text-grey transition duration-500 ease-in-out'>
                        <DocumentAddIcon
                          className='w-5 h-5'
                          aria-hidden='true'
                        />
                      </div>
                      <div>
                        <p className='text-xs font-bold mb-1'>Add task</p>
                        <p
                          className='text-xxs opacity-60'
                          style={{ lineHeight: '14px' }}
                        >
                          Add task to this project
                        </p>
                      </div>
                    </div>
                    <div
                      className='p-3 flex cursor-pointer group'
                      onClick={() =>
                        isShowProjectTask({
                          id: item._id,
                          name: item.projectName,
                        })
                      }
                    >
                      <div className='bg-yellow text-white w-10 h-10 py-1 px-2 mr-4 flex items-center justify-center rounded-md group-hover:bg-white group-hover:text-grey transition duration-500 ease-in-out'>
                        <ClipboardListIcon
                          className='w-5 h-5'
                          aria-hidden='true'
                        />
                      </div>
                      <div>
                        <p className='text-xs font-bold mb-1'>View tasks</p>
                        <p
                          className='text-xxs opacity-60'
                          style={{ lineHeight: '14px' }}
                        >
                          View the list of task related to the project
                        </p>
                      </div>
                    </div>
                    <div
                      className='p-3 flex cursor-pointer group'
                      onClick={() => isShowProject(item._id)}
                    >
                      <div className='bg-correct text-white w-10 h-10 py-1 px-2 mr-4 flex items-center justify-center rounded-md group-hover:bg-opacity-0 group-hover:text-grey transition duration-500 ease-in-out'>
                        <EyeIcon className='w-5 h-5' aria-hidden='true' />
                      </div>
                      <div>
                        <p className='text-xs font-bold mb-1'>View project</p>
                        <p
                          className='text-xxs opacity-60'
                          style={{ lineHeight: '14px' }}
                        >
                          View this project
                        </p>
                      </div>
                    </div>
                    <div
                      className={`${
                        account._id === item.projectCreatorId || account.isAdmin
                          ? 'pointer-events-auto'
                          : 'pointer-events-none opacity-30'
                      } p-3 flex cursor-pointer group`}
                      onClick={() => isDeleteProject(item)}
                    >
                      <div className='bg-danger bg-opacity-50 text-white w-10 h-10 py-1 px-2 mr-4 flex items-center justify-center rounded-md group-hover:bg-opacity-0 group-hover:text-grey transition duration-500 ease-in-out'>
                        <TrashIcon className='w-5 h-5' aria-hidden='true' />
                      </div>
                      <div>
                        <p className='text-xs font-bold mb-1'>Delete project</p>
                        <p
                          className='text-xxs opacity-60'
                          style={{ lineHeight: '14px' }}
                        >
                          Delete this project
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Popover.Panel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  );
};
