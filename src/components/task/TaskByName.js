import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  PlusCircleIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';
import { getAccounts } from '../../redux/actions/accountActions';
import { getTeams } from '../../redux/actions/utilitiesActions';
import { getProjectList } from '../../redux/actions/projectActions';
import {
  getTaskById,
  getTaskByName,
  deleteTaskById,
  updateTaskStatusById,
  updateTaskById,
} from '../../redux/actions/taskActions';
// import { registerTaskDescNotif } from '../../redux/actions/notificationActions';
import { updateNotificationNameLink } from '../../redux/actions/notificationActions';
import { getTaskCommentById } from '../../redux/actions/commentActions';

import Topbar from '../header/Topbar';
import Sidebar from '../sidebar/Sidebar';
import InputElement from '../ui/InputElement';
import SearchProject from '../SearchProject';
import SearchReporter from '../SearchReporter';
import SearchAssignee from '../SearchAssignee';
import PriorityList from '../PriorityList';
import RichTextEditor from '../RichTextEditor';
import CommentBox from '../comment/CommentBox';
import UploadAttachments from '../UploadAttachments';
import InvitePeople from '../InvitePeople';
import SuccessConfirmation from '../notifications/SuccessConfirmation';

const schema = yup.object().shape({
  taskName: yup.string().required('Please enter task name here'),
  dueDate: yup.string().required('Please enter task name here'),
});

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
const TaskByName = ({ socket, history }) => {
  const [accountInfo, setAccountInfo] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [accountsList, setAccountsList] = useState({});
  const [teamsList, setTeamsList] = useState({});
  const [isToggleWidth, setToggleWidth] = useState(false);
  const [taskInfo, setTaskInfo] = useState({
    _id: '',
    projectId: '',
    taskName: '',
    taskNote: {
      content: '',
      mentions: '',
    },
    dueDate: new Date(),
    taskReporterId: '',
    taskAssigneeId: '',
    priority: '',
    taskType: '',
    attachments: '',
    invitedPeopleId: [],
  });
  const [commentListByIdInfo, setCommentListByIdInfo] = useState();
  const [showDropContainer, setShowDropContainer] = useState(false);
  const [showAddInput, setShowAddInput] = useState(false);
  const [updatedDescription, setUpdatedDescription] = useState();
  const [showModal, setShowModal] = useState(false);

  const { register, errors, handleSubmit } = useForm({
    // resolver: yupResolver(schema),
    mode: 'all',
  });

  const dispatch = useDispatch();

  const accountsGet = useSelector((state) => state.accountsGet);
  const { accounts } = accountsGet;

  const teamListGet = useSelector((state) => state.teamListGet);
  const { teams } = teamListGet;

  const projectListGet = useSelector((state) => state.projectListGet);
  const { projects } = projectListGet;

  const taskGetById = useSelector((state) => state.taskGetById);
  const { taskByid } = taskGetById;

  const taskGetByName = useSelector((state) => state.taskGetByName);
  const { task } = taskGetByName;

  const taskUpdateById = useSelector((state) => state.taskUpdateById);
  const { updatedTask, error } = taskUpdateById;

  const registerTaskComment = useSelector((state) => state.registerTaskComment);
  const { taskComment } = registerTaskComment;

  const getTaskComment = useSelector((state) => state.getTaskComment);
  const { commentListById } = getTaskComment;

  const taskDeleteAttachmentFile = useSelector(
    (state) => state.taskDeleteAttachmentFile
  );
  const { updatedAttachment } = taskDeleteAttachmentFile;

  let location = useLocation();
  let pathArr = location.pathname.split('&');
  let taskPath = pathArr[0].split('/').pop();

  const handleOnDueDate = (date) => {
    setTaskInfo((prevData) => ({
      ...prevData,
      dueDate: date,
    }));
  };

  const handleOnShowDropContainer = () => {
    setShowDropContainer(!showDropContainer);
  };

  const handleOnShowAddInput = () => {
    setShowAddInput(!showAddInput);
  };

  // const handleNotification = () => {
  //   socket.emit('sendNotification', {
  //     senderInfo: accountInfo,
  //     receiverId: taskInfo.taskNote.mentions,
  //     content: 'Mentioned you in the',
  //     name: taskInfo.taskName,
  //     link: `task/${taskInfo.taskName}`,
  //     createdAt: Date.now(),
  //   });
  //   dispatch(
  //     registerTaskDescNotif({
  //       senderInfo: accountInfo,
  //       receiverId: taskInfo.taskNote.mentions,
  //       content: 'Mentioned you in the',
  //       name: taskInfo.taskName,
  //       link: `task/${taskInfo.taskName}`,
  //       createdAt: Date.now(),
  //     })
  //   );
  // };

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setTaskInfo((data) => ({ ...data, [name]: value }));
  };

  const handleOnSubmit = () => {
    if (taskInfo) {
      // handleNotification();
    }
    dispatch(updateTaskById(taskInfo, updatedDescription));
    dispatch(updateNotificationNameLink(taskInfo));
  };

  useEffect(() => {
    if (accounts === undefined || accounts.length === 0) {
      dispatch(getAccounts());
    } else {
      setAccountsList(accounts);
    }
  }, [accounts, dispatch]);

  useEffect(() => {
    if (teams === undefined || teams.length === 0) {
      dispatch(getTeams());
    } else {
      setTeamsList(teams);
    }
  }, [teams]);

  useEffect(() => {
    if (taskPath) {
      dispatch(getTaskByName(taskPath));
    }
  }, [dispatch, taskPath]);

  useEffect(() => {
    if (task && task[0]._id) {
      dispatch(getTaskById(task[0]._id));
    }
  }, [dispatch, task]);

  useEffect(() => {
    if (projects === undefined || projects.length === 0) {
      dispatch(getProjectList());
    }

    if (taskByid) {
      setTaskInfo((prevData) => ({
        ...prevData,
        _id: taskByid._id,
        projectId: taskByid.projectId._id,
        taskName: taskByid.taskName,
        dueDate: new Date(Date.parse(taskByid.dueDate)),
        taskNote: {
          content: taskByid.taskNote.content,
          mentions: taskByid.taskNote.mentions,
        },
        taskReporterId: taskByid.taskReporterId,
        taskAssigneeId: taskByid.taskAssigneeId,
        priority: taskByid.priority,
        taskType: taskByid.taskType,
        attachments: taskByid.attachments.map((id) => id),
        invitedPeopleId: taskByid.invitedPeopleId.map((id) => id._id),
      }));
    }

    if (updatedAttachment) {
      setTaskInfo((prevData) => ({
        ...prevData,
        attachments: updatedAttachment,
      }));
    }

    if (!commentListById && taskInfo._id) {
      dispatch(getTaskCommentById(taskInfo._id));
    } else {
      setCommentListByIdInfo(commentListById);
    }
  }, [
    accountInfo,
    taskByid,
    dispatch,
    projects,
    updatedAttachment,
    commentListById,
    taskInfo._id,
  ]);

  useEffect(() => {
    if (taskComment) {
      dispatch(getTaskCommentById(taskInfo._id));
    } else {
      setCommentListByIdInfo(commentListById);
    }
  }, [taskComment]);

  useEffect(() => {
    if (updatedTask) {
      setShowModal(true);
    }
  }, [updatedTask]);

  return (
    <div className='w-full h-full flex'>
      <div
        className={`w-full h-20 ${isToggleWidth ? 'ml-12%' : 'ml-4%'} order-2`}
      >
        <Topbar title='My board' socket={socket} />
        <div className='bg-lightGrey min-h-93vh p-10'>
          <form
            className='form-container bg-white w-full mx-auto'
            onSubmit={handleSubmit(handleOnSubmit)}
          >
            <div className='w-full p-12 flex flex-row'>
              <div className='w-66%'>
                <label className='text-sm font-semibold' htmlFor='password'>
                  Project
                </label>
                <div className='mt-2 flex'>
                  <div className='w-full relative z-50'>
                    <SearchProject
                      className={`w-full pl-9 pr-4 pt-4 pb-4 text-xs leading-tight rounded-md appearance-none ${
                        errors.projectName
                          ? 'border-danger focus:border-danger'
                          : 'border focus:border-primary'
                      } border focus:border-primary focus:outline-none focus:shadow-outline`}
                      id='projectName'
                      name='projectName'
                      type='text'
                      placeholder='Search project name'
                      ref={register}
                      projects={projects}
                      returnProj={taskByid}
                      selectedProjectId={(selectedProjectId) =>
                        setTaskInfo((prevData) => ({
                          ...prevData,
                          projectId: selectedProjectId,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className='pt-6'>
                  <label className='text-sm font-semibold' htmlFor='password'>
                    Task name
                  </label>
                  <div className='mt-2 relative'>
                    <InputElement
                      className={`w-full px-4 py-4 text-xs leading-tight rounded-md appearance-none ${
                        errors.taskName
                          ? 'border-danger focus:border-danger'
                          : 'border focus:border-primary'
                      } border focus:border-primary focus:outline-none focus:shadow-outline`}
                      id='taskName'
                      name='taskName'
                      type='text'
                      placeholder='Enter your task name here'
                      ref={register}
                      value={taskInfo.taskName}
                      onChange={handleOnChange}
                    />
                  </div>
                </div>
                <div className='pt-6'>
                  <label className='text-sm font-semibold' htmlFor='password'>
                    Description
                  </label>
                  <div className='mt-2 relative'>
                    <RichTextEditor
                      accounts={accounts}
                      returnContent={taskInfo.taskNote.content}
                      convertedContent={(convertedContent) =>
                        setUpdatedDescription((prevData) => ({
                          ...prevData,
                          taskNote: {
                            content: convertedContent.content.replaceAll(
                              '@',
                              ''
                            ),
                            mentions: convertedContent.mentions,
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className='w-full pt-6'>
                  <div className='flex'>
                    <label
                      className='text-sm font-semibold '
                      htmlFor='password'
                    >
                      Attachments
                    </label>
                    <motion.div
                      className='text-primary ml-2 opacity-60 cursor-pointer'
                      whileHover={{
                        scale: 1.2,
                        color: '#3F52E3',
                        opacity: 1,
                        transition: { duration: 0.2 },
                      }}
                      onClick={handleOnShowDropContainer}
                    >
                      <PlusCircleIcon className='w-5 h-5' aria-hidden='true' />
                    </motion.div>
                  </div>
                  <div className='mt-2 relative'>
                    <UploadAttachments
                      taskId={taskByid && taskByid._id}
                      attachments={taskInfo.attachments}
                      uploadedAttachments={(uploadedAttachments) =>
                        setTaskInfo((prevState) => ({
                          ...prevState,
                          attachments: uploadedAttachments,
                        }))
                      }
                      showDropContainer={showDropContainer}
                      viewType='Row'
                    />
                  </div>
                </div>
                <div className='pt-6'>
                  <label className='text-sm font-semibold' htmlFor='password'>
                    {commentListByIdInfo && commentListByIdInfo.length >= 2
                      ? `${commentListByIdInfo.length} Comments`
                      : 'Comment'}
                  </label>
                  <div className='mt-8 relative'>
                    <CommentBox
                      accountList={accounts}
                      accountInfo={accountInfo}
                      taskId={taskInfo._id}
                      commentListByIdInfo={commentListByIdInfo}
                    />
                  </div>
                </div>
              </div>
              <div className='w-26% ml-auto'>
                <div className='w-full'>
                  <label className='text-sm font-semibold' htmlFor='password'>
                    Report to
                  </label>
                  <div className='mt-2 flex'>
                    <div className='w-full relative z-50'>
                      <SearchReporter
                        className={`w-full px-4 py-4 text-xs leading-tight border rounded-md appearance-none ${
                          error && error.taskReporterId
                            ? 'border-danger'
                            : 'border'
                        } focus:border-primary outline-none shadow-outline`}
                        id='taskReporterId'
                        name='taskReporterId'
                        type='text'
                        placeholder='Search reporter by name or email'
                        ref={register}
                        accounts={accounts}
                        selectedAssigneeId={(selectedAssigneeId) =>
                          setTaskInfo((prevState) => ({
                            ...prevState,
                            taskReporterId: selectedAssigneeId,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className='w-full pt-6'>
                  <label className='text-sm font-semibold' htmlFor='password'>
                    Assign to
                  </label>
                  <div className='mt-2 flex'>
                    <div className='w-full relative z-40'>
                      <SearchAssignee
                        className={`w-full px-4 py-4 text-xs leading-tight border rounded-md appearance-none ${
                          errors.taskAssigneeId ? 'border-danger' : 'border'
                        } ${
                          error && error.taskAssigneeId
                            ? 'border-danger'
                            : 'border'
                        } focus:border-primary outline-none shadow-outline`}
                        id='taskAssigneeId'
                        name='taskAssigneeId'
                        type='text'
                        placeholder='Search people by name or email'
                        ref={register}
                        accounts={accountsList}
                        teams={teamsList}
                        returnAssignee={taskInfo && taskInfo.taskAssigneeId}
                        selectedAssigneeId={(selectedAssigneeId) =>
                          setTaskInfo((prevState) => ({
                            ...prevState,
                            taskAssigneeId: selectedAssigneeId,
                          }))
                        }
                      />
                      {errors.taskAssigneeId && (
                        <ExclamationCircleIcon
                          className={`w-5 h-5 ${
                            errors.taskAssigneeId
                              ? 'text-danger'
                              : 'text-correct'
                          } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                          aria-hidden='true'
                        />
                      )}
                      {errors.taskAssigneeId ? (
                        <ExclamationCircleIcon
                          className={`w-5 h-5 ${
                            errors.taskAssigneeId
                              ? 'text-danger'
                              : 'text-correct'
                          } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                          aria-hidden='true'
                        />
                      ) : error?.taskAssigneeId ? (
                        <ExclamationCircleIcon
                          className={`w-5 h-5 ${
                            error?.taskAssigneeId
                              ? 'text-danger'
                              : 'text-correct'
                          } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                          aria-hidden='true'
                        />
                      ) : null}
                      <p className='text-xxs text-danger mt-2 absolute'>
                        {errors.taskAssigneeId?.message}
                        {error && error.taskAssigneeId?.msg}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='w-full pt-6'>
                  <label className='text-sm font-semibold' htmlFor='password'>
                    Priority
                  </label>
                  <div className='mt-2 relative'>
                    <PriorityList
                      selectedPriority={(selectedPriority) =>
                        setTaskInfo((prevData) => ({
                          ...prevData,
                          priority: selectedPriority,
                        }))
                      }
                    />
                  </div>
                </div>
                <div className='w-full pt-6'>
                  <div className='w-full'>
                    <label className='text-sm font-semibold' htmlFor='password'>
                      Due Date
                    </label>
                    <div className='mt-2'>
                      <DatePicker
                        selected={taskInfo.dueDate}
                        onChange={(date) => handleOnDueDate(date)}
                        className='w-full px-4 py-5 relative border rounded-md focus:border-primary focus:outline-none focus:shadow-outline'
                      />
                    </div>
                  </div>
                </div>
                <div className='w-full pt-12'>
                  <div className='flex'>
                    <label
                      className='text-sm font-semibold '
                      htmlFor='password'
                    >
                      People watching
                    </label>
                    <motion.div
                      className='ml-2 opacity-60 cursor-pointer'
                      whileHover={{
                        scale: 1.2,
                        color: '#3F52E3',
                        opacity: 1,
                        transition: { duration: 0.2 },
                      }}
                      onClick={handleOnShowAddInput}
                    >
                      <PlusCircleIcon className='w-5 h-5' aria-hidden='true' />
                    </motion.div>
                  </div>
                  <div className='mt-4 relative'>
                    <InvitePeople
                      className={`w-full px-4 py-5 text-sm leading-tight rounded-md appearance-none ${
                        errors.invitedPeopleId
                          ? 'border-danger focus:border-danger'
                          : 'border focus:border-primary'
                      } border focus:border-primary focus:outline-none focus:shadow-outline`}
                      id='invitedPeopleId'
                      name='invitedPeopleId'
                      type='text'
                      placeholder='Search assignee by name or email'
                      ref={register}
                      accounts={accounts}
                      // returnInvitedId={task}
                      selectedPeopleId={(selectedPeopleId) =>
                        setTaskInfo((prevData) => ({
                          ...prevData,
                          invitedPeopleId: selectedPeopleId,
                        }))
                      }
                      showAddInput={showAddInput}
                    />
                  </div>
                </div>
                <div className='w-full'>
                  <motion.button
                    type='submit'
                    className='bg-primary w-full text-sm text-white text-center font-bold tracking-wider px-2 py-4 rounded-md shadow-lg cursor-pointer'
                    initial='rest'
                    whileHover='hover'
                    variants={hoverBtnPrimaryMotion}
                  >
                    UPDATE TASK
                  </motion.button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
      <Sidebar
        isSlideNav={false}
        isToggleWidth={(isToggleWidth) => setToggleWidth(isToggleWidth)}
      />
      {showModal && (
        <SuccessConfirmation
          history={history}
          title={updatedTask.title ? updatedTask.title : updatedTask.title}
          message={updatedTask.title ? updatedTask.msg : updatedTask.msg}
          showModal={(showModal) => setShowModal(showModal)}
          redirect='/tasks'
        />
      )}
    </div>
  );
};

export default TaskByName;
