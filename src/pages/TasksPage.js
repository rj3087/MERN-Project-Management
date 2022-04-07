import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { PlusIcon, ChevronRightIcon } from '@heroicons/react/outline';

import { getAccounts } from '../redux/actions/accountActions';
import { getTaskList } from '../redux/actions/taskActions';

import Topbar from '../components/header/Topbar';
import { SmartFilter } from '../components/filter/SmartFilter';
import SortedList from '../components/filter/SortedList';
import Sidebar from '../components/sidebar/Sidebar';
import CreateTask from '../components/task/CreateTask';
import TaskViewModal from '../components/task/TaskViewModal';
import BoardView from '../components/BoardView';
import SuccessConfirmation from '../components/notifications/SuccessConfirmation';
import Alert from '../components/notifications/Alert';

const hoverBtnPrimaryMotion = {
  rest: { background: '#3F52E3', scale: 1 },
  hover: {
    background: '#2c3cb4',
    scale: 1.1,
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 100,
      ease: 'easeInOut',
    },
  },
};

const smartFilterArr = [
  { id: 1, label: 'My Tasks' },
  { id: 2, label: 'My Issues' },
  { id: 3, label: 'Invited Tasks' },
];

const TasksPage = ({ socket }) => {
  const [accountInfo, setAccountInfo] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [teamInfo, setTeamInfo] = useState(
    JSON.parse(localStorage.getItem('accountCurrentTeamList')) || ''
  );
  const [itemsInfo, setItemsInfo] = useState([]);
  const [taskInfo, setTaskInfo] = useState();
  const [tasksByAccount, setTasksByAccount] = useState();
  const [sortedItems, setSortedItems] = useState([]);
  const [sortType, SetSortType] = useState([
    {
      id: 1,
      status: 'Sort by',
      key: 'default',
    },
    {
      id: 2,
      status: 'Alpabetical',
      key: 'taskName',
    },
    {
      id: 3,
      status: 'Due Soon',
      key: 'dueDate',
    },
    {
      id: 4,
      status: 'Past Due',
      key: 'dueDate',
    },
    {
      id: 5,
      status: 'Newest first',
      key: 'createdAt',
    },
    {
      id: 6,
      status: 'Oldest first',
      key: 'createdAt',
    },
  ]);
  const [showTaskCreate, setShowTaskCreate] = useState();
  const [showTaskView, setShowTaskView] = useState();
  const [isToggleWidth, setToggleWidth] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [validationErrors, setValidationErrors] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [filteredTask, setFilteredTask] = useState([]);
  const [filterByCreatorId, setFilterByCreatorId] = useState([]);
  const [filterByAccoundId, setFilterByAccoundId] = useState([]);
  const [filterByInvitedPeopleId, setFilterByInvitedPeopleId] = useState([]);
  const [isSmartFiltered, setIsSmartFiltered] = useState('');
  const [searchResultId, setSearchResultId] = useState('');
  const [itemsInfoTemp, setItemsInfoTemp] = useState([]);

  const accountsGet = useSelector((state) => state.accountsGet);
  const { accounts } = accountsGet;

  const taskRegister = useSelector((state) => state.taskRegister);
  const { taskCreated } = taskRegister;

  const taskListGet = useSelector((state) => state.taskListGet);
  const { tasks } = taskListGet;

  const taskUpdateById = useSelector((state) => state.taskUpdateById);
  const { updatedTask } = taskUpdateById;

  const taskDeleteById = useSelector((state) => state.taskDeleteById);
  const { taskDeleted } = taskDeleteById;

  let location = useLocation();
  let history = useHistory();
  let projectIdUrl = history.location.state?.id;

  let pathArr = location.pathname.split('/');

  const dispatch = useDispatch();

  const handleShowTask = () => {
    setShowTaskCreate(true);
  };

  useEffect(() => {
    if (accounts === undefined || accounts.length === 0) {
      dispatch(getAccounts());
    }
  }, [accounts, dispatch]);

  useEffect(() => {
    const fetchTaskFromAPI = () => {
      if (tasks === undefined || tasks.length === 0) {
        dispatch(getTaskList());
      }
    };

    const timer = setTimeout(() => {
      fetchTaskFromAPI();
    }, 500);

    return () => clearTimeout(timer);
  }, [dispatch, tasks]);

  useEffect(() => {
    if (tasks) {
      setFilteredTask(
        tasks.filter((task) => task.projectId._id === projectIdUrl)
      );
    }
  }, [projectIdUrl, tasks]);

  useEffect(() => {
    setTaskInfo(sortedItems);
  }, [sortedItems]);

  useEffect(() => {
    const fetchTaskUseState = () => {
      if (tasks) {
        setFilterByCreatorId(
          tasks.filter((task) => task.taskCreatorId._id === accountInfo._id)
        );
        setFilterByAccoundId(
          tasks.filter((task) => task.taskAssigneeId === accountInfo._id)
        );
        setFilterByInvitedPeopleId(
          tasks.filter(({ invitedPeopleId }) =>
            invitedPeopleId.some(({ _id }) => _id === accountInfo._id)
          )
        );
        if (pathArr[2] === 'board' && projectIdUrl) {
          if (accountInfo.isAdmin) {
            setItemsInfo(
              tasks.filter((task) => task.projectId._id === projectIdUrl)
            );
          } else {
            if (isSmartFiltered === smartFilterArr[0].label) {
              setItemsInfo(
                filteredTask.filter(
                  (task) => task.taskCreatorId._id === accountInfo._id
                )
              );
            } else if (isSmartFiltered === smartFilterArr[1].label) {
              setItemsInfo(
                filteredTask.filter(
                  (task) => task.taskAssigneeId === accountInfo._id
                )
              );
            } else if (isSmartFiltered === smartFilterArr[2].label) {
              setItemsInfo(
                filteredTask.filter(({ invitedPeopleId }) =>
                  invitedPeopleId.some(({ _id }) => _id === accountInfo._id)
                )
              );
            } else {
              // setItemsInfo(filteredTask);
              if (itemsInfoTemp.length === 0) {
                setItemsInfoTemp(filteredTask);
              }
            }
          }
        } else {
          const combineArr = [
            ...filterByCreatorId,
            ...filterByAccoundId,
            ...filterByInvitedPeopleId,
          ];
          if (pathArr[pathArr.length - 1] === 'tasks') {
            if (accountInfo.isAdmin) {
              setItemsInfo(
                tasks.filter((task) => task.projectId._id === projectIdUrl)
              );
            } else {
              if (isSmartFiltered === smartFilterArr[0].label) {
                setItemsInfo(filterByCreatorId);
              } else if (isSmartFiltered === smartFilterArr[1].label) {
                setItemsInfo(filterByAccoundId);
              } else if (isSmartFiltered === smartFilterArr[2].label) {
                setItemsInfo(filterByInvitedPeopleId);
              } else {
                if (itemsInfo.length === 0) {
                  setItemsInfo(
                    combineArr.filter(function (value, index, array) {
                      return array.indexOf(value) === index;
                    })
                  );
                  setItemsInfoTemp(
                    combineArr.filter((element, index) => {
                      return combineArr.indexOf(element) === index;
                    })
                  );
                }
              }
            }
          }
        }
      }
    };

    const timer = setTimeout(() => {
      fetchTaskUseState();
    }, 200);

    return () => clearTimeout(timer);
  }, [tasks, pathArr]);

  // useEffect(() => {
  //   if (pathArr[pathArr.length - 1] !== 'tasks' && tasks) {
  //     dispatch(getProjTaskListById(projectIdUrl));
  //   }
  // }, [dispatch, pathArr, projectIdUrl, tasks]);

  useEffect(() => {
    dispatch(getTaskList());
    setItemsInfo(tasks);
  }, [dispatch, location]);

  useEffect(() => {
    if (taskDeleted) {
      dispatch(getTaskList());
      setItemsInfo(tasks);
    }
  }, [taskDeleted]);

  useEffect(() => {
    if (searchResultId) {
      setSortedItems(tasks.filter((project) => project._id === searchResultId));
    }
  }, [searchResultId]);

  useEffect(() => {
    if (!searchResultId) {
      setSortedItems(itemsInfoTemp);
    }
  }, [itemsInfoTemp, searchResultId]);

  return (
    <>
      <div className='w-full h-full flex'>
        <div
          className={`w-full h-20 ${
            isToggleWidth ? 'ml-12%' : 'ml-4%'
          } order-2`}
        >
          <Topbar
            socket={socket}
            searchBar={true}
            searchResult={(searchResult) => setSearchResultId(searchResult)}
            history={history}
          />
          <div className='bg-white'>
            <div className='bg-white py-4 px-10 flex border-b'>
              <div className='flex items-center'>
                <h1
                  className={`text-md text-darkGrey flex items-center ${
                    history.location.state?.name
                      ? 'font-medium'
                      : 'font-semibold'
                  }`}
                >
                  <span className='opacity-50'>Project</span>
                  <ChevronRightIcon
                    className='w-3.5 h-3.5 mx-1.5'
                    aria-hidden='true'
                  />
                  <span className='opacity-50'>Task</span>
                  <ChevronRightIcon
                    className='w-3.5 h-3.5 mx-1.5'
                    aria-hidden='true'
                  />
                  {history.location.state?.name && (
                    <strong>{history.location.state?.name}</strong>
                  )}
                </h1>
              </div>
              <div className='ml-auto'>
                <motion.button
                  type='button'
                  className='bg-primary w-1/9 text-white text-xs font-bold tracking-wider py-3 px-6 flex items-center rounded-md shadow-xl'
                  onClick={() => handleShowTask()}
                  initial='rest'
                  whileHover='hover'
                  variants={hoverBtnPrimaryMotion}
                >
                  <PlusIcon
                    className='bg-white w-4 h-4 text-primary mr-3 p-0.5 rounded-sm'
                    aria-hidden='true'
                  />
                  CREATE TASK
                </motion.button>
              </div>
              <SortedList
                typeOfSort={sortType}
                datas={itemsInfo}
                returnSortedItems={(returnSortedItems) =>
                  setSortedItems(returnSortedItems)
                }
              />
            </div>
            <div className='py-3 border-b'>
              <SmartFilter
                filterArr={smartFilterArr}
                smartFilteredAttr={(smartFilteredAttr) =>
                  setIsSmartFiltered(smartFilteredAttr)
                }
              />
            </div>
          </div>
          <div className='bg-lightGrey flex flex-col relative'>
            <BoardView
              listOfTasks={sortedItems}
              showTask={(showTaskView) => setShowTaskView(showTaskView)}
              taskInfo={(taskInfo) => setTaskInfo(taskInfo)}
            />
          </div>
        </div>
        <Sidebar
          isSlideNav={false}
          isToggleWidth={(isToggleWidth) => setToggleWidth(isToggleWidth)}
        />
      </div>
      {showTaskView && (
        <TaskViewModal
          accounts={accounts}
          showTaskView={(showTaskView) => setShowTaskView(showTaskView)}
          socket={socket}
          history={history}
          showModal={(showModal) => setShowModal(showModal)}
        />
      )}
      {showTaskCreate && (
        <CreateTask
          showTaskCreate={(showTaskCreate) => setShowTaskCreate(showTaskCreate)}
          socket={socket}
          showModal={(showModal) => setShowModal(showModal)}
          validationError={(validationError) =>
            setValidationErrors(validationError)
          }
          history={history}
        />
      )}
      {showModal && taskCreated ? (
        <SuccessConfirmation
          type='task'
          name={taskCreated.taskName}
          message={taskCreated.msg}
          showModal={(showModal) => setShowModal(showModal)}
        />
      ) : updatedTask ? (
        <SuccessConfirmation
          type='task'
          name={updatedTask.taskName}
          actionType='updated'
          message={updatedTask.msg}
          showModal={(showModal) => setShowModal(showModal)}
        />
      ) : null}
      {showAlert && (
        <Alert
          type='post'
          title='Hmmmp, Try again.'
          message={validationErrors.msg}
          showAlert={(showAlert) => setShowAlert(showAlert)}
          validationError={(validationError) =>
            setValidationErrors(validationError)
          }
        />
      )}
    </>
  );
};

export default TasksPage;
