import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import NaturalDragAnimation from 'natural-drag-animation-rbdnd';
import moment from 'moment';
import DOMPurify from 'dompurify';
import { Menu, Transition } from '@headlessui/react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  ClockIcon,
  EyeIcon,
  DotsVerticalIcon,
  TrashIcon,
} from '@heroicons/react/outline';
import { faPaperclip } from '@fortawesome/fontawesome-free-solid';

import {
  getTaskById,
  deleteTaskById,
  updateTaskStatusById,
} from '../redux/actions/taskActions';
import AlertConfirmation from './notifications/AlertConfirmation';

const BoardView = ({ listOfTasks, showTask }) => {
  const [accountInfo, setAccountInfo] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [filteredList, setFilteredList] = useState(listOfTasks);
  const [proposed, setProposed] = useState(filteredList);
  const [inProgress, setInProgress] = useState(filteredList);
  const [review, setReview] = useState(filteredList);
  const [done, setDone] = useState(filteredList);
  const [toggleClass, setToggleClass] = useState(false);
  const [taskId, setTaskId] = useState();
  const [taskName, setTaskName] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alertAction, setAlertAction] = useState(false);

  let listColumns = {};

  const [columns, setColumns] = useState(listColumns);

  const taskDeleteById = useSelector((state) => state.taskDeleteById);
  const { error } = taskDeleteById;

  const dispatch = useDispatch();

  const textTruncate = (str, num) => {
    return str.length > num ? str.slice(0, num) + '...' : str;
  };

  const HandleOnGetTask = (e) => {
    showTask(true);
    dispatch(getTaskById(e));
  };

  const handleOnDeleteItem = (id, taskCreatorId, name) => {
    if (accountInfo._id === taskCreatorId || accountInfo.isAdmin) {
      setTaskName(name);
      if (id && name) {
        setShowAlert(true);
        setTaskId(id);
      }
    }
  };

  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
      dispatch(
        updateTaskStatusById({
          id: destItems[0]._id,
          status: destColumn.name,
        })
      );
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  const createMarkup = (html) => {
    return {
      __html: DOMPurify.sanitize(html),
    };
  };

  const handleToggleClass = () => {
    setToggleClass(!toggleClass);
  };

  useEffect(() => {
    if (listOfTasks) {
      setProposed(
        listOfTasks.filter((assign) => assign.taskStatus === 'Proposed')
      );
      setInProgress(
        listOfTasks.filter((assign) => assign.taskStatus === 'In Progress')
      );
      setReview(listOfTasks.filter((assign) => assign.taskStatus === 'Review'));
      setDone(listOfTasks.filter((assign) => assign.taskStatus === 'Done'));

      if (alertAction) {
        dispatch(deleteTaskById(taskId));
        setShowAlert(false);
        setAlertAction(false);
      }
      if (error) {
        setShowAlert(false);
        setAlertAction(false);
      }
    }
  }, [alertAction, listOfTasks, dispatch, error, taskId]);

  useEffect(() => {
    if (listOfTasks) {
      let listColumns = {
        1: {
          name: 'Proposed',
          items: proposed,
        },
        2: {
          name: 'In Progress',
          items: inProgress,
        },
        3: {
          name: 'Review',
          items: review,
        },
        4: {
          name: 'Done',
          items: done,
        },
      };

      setColumns(listColumns);
    }
  }, [listOfTasks, done, inProgress, proposed, review]);

  return (
    <>
      <div className='w-full p-10 grid grid-cols-4 gap-10'>
        <DragDropContext
          onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
        >
          {Object.entries(columns).map(([columnId, column], index) => {
            return (
              <div className='bg-white p-6' key={columnId}>
                <div className='mb-6 flex'>
                  <h2 className='text-sm font-bold mr-auto'>{column.name}</h2>
                </div>
                <Droppable droppableId={columnId} key={columnId}>
                  {(provided, snapshot) => {
                    return (
                      <>
                        <div
                          className='list-none'
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                        >
                          {column.items.map(
                            (
                              {
                                _id,
                                taskCreatorId,
                                priority,
                                taskName,
                                attachments,
                                taskNote,
                                invitedPeopleId,
                                dueDate,
                              },
                              index
                            ) => {
                              return (
                                <Draggable
                                  key={_id}
                                  draggableId={_id}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <NaturalDragAnimation
                                      style={provided.draggableProps.style}
                                      snapshot={snapshot}
                                    >
                                      {(style) => (
                                        <div
                                          className='bg-lightGrey mt-6 pt-4 pl-6 pb-6 pr-6'
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          style={style}
                                        >
                                          <>
                                            <div className='w-full flex flex-row items-center relative'>
                                              <div className='w-full text-xs font-bold mr-auto flex flex-row items-center opacity-60'>
                                                <ClockIcon
                                                  className='w-4 h-4 mr-1'
                                                  aria-hidden='true'
                                                />
                                                {moment(dueDate).format('LL')}
                                              </div>
                                              <Menu>
                                                {({ open }) => (
                                                  <>
                                                    <Menu.Button
                                                      className='p-4 relative transition duration-150 ease-in-out outline-none'
                                                      onClick={
                                                        handleToggleClass
                                                      }
                                                      style={{ left: '21px' }}
                                                    >
                                                      <DotsVerticalIcon
                                                        className='w-4 h-4 ml-auto cursor-pointer'
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
                                                        className='absolute right-0 w-28 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg outline-none z-50'
                                                      >
                                                        <div className='px-4 py-3'>
                                                          <p className='text-xs leading-5'>
                                                            Actions
                                                          </p>
                                                        </div>
                                                        <div className='py-2'>
                                                          <Menu.Item>
                                                            {({ active }) => (
                                                              <div
                                                                className={`${
                                                                  accountInfo._id ===
                                                                    taskCreatorId._id ||
                                                                  accountInfo.isAdmin
                                                                    ? 'pointer-events-auto'
                                                                    : accountInfo._id ===
                                                                        taskCreatorId ||
                                                                      accountInfo.isAdmin
                                                                    ? 'pointer-events-auto'
                                                                    : 'pointer-events-none opacity-30'
                                                                } p-3 flex cursor-pointer hover:bg-lightGrey`}
                                                                onClick={() =>
                                                                  handleOnDeleteItem(
                                                                    _id,
                                                                    taskCreatorId._id
                                                                      ? taskCreatorId._id
                                                                      : taskCreatorId,
                                                                    taskName
                                                                  )
                                                                }
                                                              >
                                                                <TrashIcon
                                                                  className='w-4 h-4 opacity-70 absolute'
                                                                  aria-hidden='true'
                                                                />
                                                                <span className='text-xs ml-6'>
                                                                  Delete
                                                                </span>
                                                              </div>
                                                            )}
                                                          </Menu.Item>
                                                          <Menu.Item>
                                                            {({ active }) => (
                                                              <div
                                                                className='p-3 flex cursor-pointer hover:bg-lightGrey'
                                                                onClick={() =>
                                                                  HandleOnGetTask(
                                                                    _id
                                                                  )
                                                                }
                                                              >
                                                                <EyeIcon
                                                                  className='w-4 h-4 opacity-70 absolute'
                                                                  aria-hidden='true'
                                                                />
                                                                <span className='text-xs ml-6'>
                                                                  View
                                                                </span>
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
                                            <button
                                              className='w-full'
                                              onClick={() =>
                                                HandleOnGetTask(_id)
                                              }
                                            >
                                              <div className='w-full flex flex-row items-start'>
                                                <div className='w-73% text-xs text-left font-bold'>
                                                  {textTruncate(taskName, 44)}
                                                </div>
                                                <p
                                                  className='w-25% text-xxs text-primary text-center tracking-wider ml-auto py-2 px-3 rounded-md'
                                                  style={{
                                                    backgroundColor: `${
                                                      priority === 'Very High'
                                                        ? '#f65b5d'
                                                        : priority === 'High'
                                                        ? '#FFA310'
                                                        : priority ===
                                                          'Moderate'
                                                        ? '#03BB3F'
                                                        : '#5CACF3'
                                                    }`,
                                                    color: `${
                                                      priority === 'Very High'
                                                        ? '#fff'
                                                        : priority === 'High'
                                                        ? '#fff'
                                                        : priority ===
                                                          'Moderate'
                                                        ? '#fff'
                                                        : '#fff'
                                                    }`,
                                                  }}
                                                >
                                                  {priority}
                                                </p>
                                              </div>
                                              {attachments[0]
                                                ?.fileThumbnail && (
                                                <div className='text-sm font-bold pt-6 flex items-center'>
                                                  {attachments[0]
                                                    ?.fileThumbnail && (
                                                    <div
                                                      className='w-full h-15vh rounded-md'
                                                      style={{
                                                        backgroundImage: `url(${attachments[0].fileThumbnail})`,
                                                        backgroundRepeat:
                                                          'no-repeat',
                                                        backgroundSize: 'cover',
                                                        backgroundPosition:
                                                          'center center',
                                                      }}
                                                    ></div>
                                                  )}
                                                </div>
                                              )}
                                              {taskNote.content.length !==
                                              11 ? (
                                                <div className='pt-4'>
                                                  <p
                                                    className='text-xs text-left font-medium opacity-60'
                                                    dangerouslySetInnerHTML={createMarkup(
                                                      textTruncate(
                                                        JSON.parse(
                                                          taskNote.content
                                                        ),
                                                        64
                                                      )
                                                    )}
                                                  ></p>
                                                  <div className='task-comment-view mt-2 relative'></div>
                                                </div>
                                              ) : null}
                                              <div className='mr-auto pt-4 pb-2 flex flex-row items-center'>
                                                <div className='mr-auto flex flex-row'>
                                                  {invitedPeopleId.map(
                                                    (people, index) => (
                                                      <img
                                                        key={index}
                                                        className='rounded-full relative'
                                                        src={
                                                          people.accountProfileUploaded
                                                        }
                                                        alt={`${people.firstName} ${people.lastName}`}
                                                        title={`${people.firstName} ${people.lastName}`}
                                                        style={{
                                                          width: '32px',
                                                          height: '32px',
                                                          left: index * -14,
                                                        }}
                                                      />
                                                    )
                                                  )}
                                                </div>
                                                <div className='text-xs font-bold flex flex-row items-center ml-auto opacity-40'>
                                                  <FontAwesomeIcon
                                                    icon={faPaperclip}
                                                    className='w-5 h-5 mr-1'
                                                  />
                                                  {attachments[0]?.fileThumbnail
                                                    ? attachments.length
                                                    : 0}
                                                  <EyeIcon
                                                    className='w-4 h-4 ml-2 mr-1'
                                                    aria-hidden='true'
                                                  />
                                                  {invitedPeopleId.length}
                                                </div>
                                              </div>
                                            </button>
                                          </>
                                        </div>
                                      )}
                                    </NaturalDragAnimation>
                                  )}
                                </Draggable>
                              );
                            }
                          )}
                        </div>
                        {/* {provided.placeholder} */}
                      </>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
      {showAlert && (
        <AlertConfirmation
          type='task'
          name={taskName}
          message={`You're about to permanently delete this task, it's comments and attachments, and all of its data.`}
          buttonConfirmCancel={true}
          buttonConfirmPlaceholder='Confirm'
          showAlert={(showAlert) => setShowAlert(showAlert)}
          showModal={(showModal) => setShowModal(showModal)}
          alertAction={(alertAction) => setAlertAction(alertAction)}
        />
      )}
    </>
  );
};

export default BoardView;
