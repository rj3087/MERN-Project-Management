import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import {
  XIcon,
  DesktopComputerIcon,
  CodeIcon,
  ColorSwatchIcon,
  CreditCardIcon,
  ExclamationCircleIcon,
  DocumentTextIcon,
} from '@heroicons/react/outline';

import { getAccounts } from '../../redux/actions/accountActions';
import { getTeams } from '../../redux/actions/utilitiesActions';
import { getProjectList } from '../../redux/actions/projectActions';
import { registerTask } from '../../redux/actions/taskActions';
import { registerTaskAssignedNotif } from '../../redux/actions/notificationActions';

import InputElement from '../ui/InputElement';
import SearchProject from '../SearchProject';
import SearchAssignee from '../SearchAssignee';
import SearchReporter from '../SearchReporter';
import RichTextEditor from '../RichTextEditor';
import PriorityList from '../PriorityList';
import UploadAttachements from '../UploadAttachments';
import InvitePeople from '../InvitePeople';

const schema = yup.object().shape({
  taskName: yup
    .string()
    .min(4, 'Name must be at least 4 characters.')
    .required('Please enter task name'),
  taskAssigneeId: yup
    .string()
    .required('Please select assignee for this project'),
});

const backdrop = {
  hidden: { display: 'none' },
  visible: { display: 'flex', transition: { delay: 0.2 } },
};

const modal = {
  hidden: { position: 'relative', top: '-120', scale: 0 },
  visible: {
    top: '0',
    scale: 1,
    transition: { delay: 0.5, type: 'spring', stiffness: 120 },
  },
};

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

const tabArr = ['General', 'Type', 'Upload', 'Invitation'];

const CreateTask = ({ showTaskCreate, socket, showModal, validationError }) => {
  const [accountsList, setAccountsList] = useState({});
  const [teamsList, setTeamsList] = useState({});
  const [accountInfo, setAccountInfo] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [taskInfo, setTaskInfo] = useState({
    projectId: '',
    taskName: '',
    taskNote: '',
    taskReporterId: accountInfo._id,
    taskAssigneeId: '',
    dueDate: new Date(),
    priority: '',
    taskType: '',
    attachments: {
      fileThumbnail: '',
      name: '',
      size: '',
      uploadDate: '',
      status: true,
    },
    invitedPeopleId: [],
  });

  const [tabSelected, setTabSelected] = useState(tabArr);
  const [tabActive, setTabActive] = useState(tabArr[0]);
  const [selectedClass, setSelectedClass] = useState();
  let [tabIndex, setTabIndex] = useState(0);

  const accountsGet = useSelector((state) => state.accountsGet);
  const { accounts } = accountsGet;

  const projectListGet = useSelector((state) => state.projectListGet);
  const { projects } = projectListGet;

  const taskRegister = useSelector((state) => state.taskRegister);
  const { taskCreated, error } = taskRegister;

  const teamListGet = useSelector((state) => state.teamListGet);
  const { teams } = teamListGet;

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const dispatch = useDispatch();

  let { projectIdUrl } = useParams();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setTaskInfo((data) => ({ ...data, [name]: value }));
  };

  const handleNextTab = () => {
    var currentTabIndex;
    currentTabIndex = tabIndex + 1;
    setTabActive(tabArr[currentTabIndex]);
    setTabIndex(currentTabIndex);
  };

  const handleSelectedTab = (e) => {
    setTabIndex(tabArr.indexOf(e));
    setTabActive(tabArr[tabArr.indexOf(e)]);
  };

  const HandleDueDate = (date) => {
    setTaskInfo((prevState) => ({
      ...prevState,
      dueDate: date,
    }));
  };

  const handleTaskType = (selected) => {
    setTaskInfo((prevState) => ({
      ...prevState,
      taskType: selected,
    }));
    setSelectedClass(selected);
  };

  const handleTaskNotifications = () => {
    if (taskInfo.taskAssigneeId) {
      socket.emit('sendAssignedNotification', {
        senderInfo: accountInfo,
        receiverId: taskInfo.taskAssigneeId,
        category: 'Task',
        name: taskInfo.taskName,
        type: taskInfo.taskType,
        content: 'invited an issue to you',
        link: `${taskInfo.taskName}`,
        createdAt: Date.now(),
        seen: false,
      });

      dispatch(
        registerTaskAssignedNotif({
          senderInfo: accountInfo,
          receiverId: taskInfo.taskAssigneeId,
          category: 'Task',
          name: taskInfo.taskName,
          type: taskInfo.taskType,
          content: 'assigned an issue to you',
          link: `${taskInfo.taskName}`,
          createdAt: Date.now(),
          seen: false,
        })
      );
    }

    if (taskInfo.invitedPeopleId) {
      let invitedId = '';

      for (let i = 0; i < taskInfo.invitedPeopleId.length; i++) {
        invitedId = taskInfo.invitedPeopleId[i];
      }

      socket.emit('sendInvitedNotification', {
        senderInfo: accountInfo,
        receiverId: invitedId,
        category: 'Task',
        name: taskInfo.taskName,
        type: taskInfo.taskType,
        content: 'invited an issue to you',
        link: `${taskInfo.taskName}`,
        createdAt: Date.now(),
        seen: false,
      });

      dispatch(
        registerTaskAssignedNotif({
          senderInfo: accountInfo,
          receiverId: invitedId,
          category: 'Task',
          name: taskInfo.taskName,
          type: taskInfo.taskType,
          content: 'invited an issue to you',
          link: `${taskInfo.taskName}`,
          createdAt: Date.now(),
          seen: false,
        })
      );
    }

    if (taskInfo.taskNote?.mentions) {
      let mentionId = '';

      for (let i = 0; i < taskInfo.taskNote.mentions.length; i++) {
        mentionId = taskInfo.taskNote.mentions[i];
      }

      socket.emit('sendMentionNotification', {
        senderInfo: accountInfo,
        receiverId: mentionId,
        category: 'Task',
        name: taskInfo.taskName,
        type: taskInfo.taskType,
        content: 'mentioned you in issue',
        link: `${taskInfo.taskName}`,
        createdAt: Date.now(),
        seen: false,
      });

      dispatch(
        registerTaskAssignedNotif({
          senderInfo: accountInfo,
          receiverId: mentionId,
          category: 'Task',
          name: taskInfo.taskName,
          type: taskInfo.taskType,
          content: 'mentioned you in issue',
          link: `${taskInfo.taskName}`,
          createdAt: Date.now(),
          seen: false,
        })
      );
    }
  };

  const handleOnSubmit = () => {
    dispatch(registerTask(taskInfo));
    showModal(true);
    handleTaskNotifications();
  };

  useEffect(() => {
    if (accounts === undefined || accounts.length === 0) {
      dispatch(getAccounts());
    } else {
      setAccountsList(accounts);
      if (projects === undefined || projects.length === 0) {
        dispatch(getProjectList());
      }
    }
    if (error) {
      validationError(error);
    }
    if (taskCreated) {
      showModal(true);
    }
  }, [accounts, dispatch]);

  useEffect(() => {
    if (teams === undefined || teams.length === 0) {
      dispatch(getTeams());
    } else {
      setTeamsList(teams);
    }
  }, [teams]);

  return (
    <AnimatePresence>
      {showTaskCreate && (
        <motion.div
          className='backdrop bg-darkLight bg-opacity-60 flex items-center fixed top-0 left-0 bottom-0 right-0 z-50'
          variants={backdrop}
          initial='hidden'
          animate='visible'
          exit='hidden'
        >
          <motion.div
            className='modal w-4/12 bg-white mx-auto p-8 flex flex-col rounded-lg'
            variants={modal}
          >
            <form
              className='form-container w-full flex flex-col relative'
              onSubmit={handleSubmit(handleOnSubmit)}
            >
              <div
                className={`w-full ${
                  tabActive === 'General' ? 'block' : 'hidden'
                }`}
              >
                <div className='relative'>
                  <h4 className='text-grey text-lg font-bold text-center tracking-wider'>
                    CREATE TASK
                  </h4>
                  <XIcon
                    className='w-5 h-5 absolute top-0 right-0 opacity-40 cursor-pointer'
                    aria-hidden='true'
                    onClick={() => showTaskCreate(false)}
                  />
                </div>
                <div className='mt-8'>
                  <label className='text-sm font-semibold' htmlFor='password'>
                    Select Project
                  </label>
                  <div className='mt-2 flex'>
                    <div className='w-full mr-2 relative z-50'>
                      <SearchProject
                        className={`w-full pl-10 pr-4 pt-4 pb-4 text-xs leading-tight border rounded-md appearance-none ${
                          error && error.projectId ? 'border-danger' : 'border'
                        } focus:border-primary outline-none shadow-outline`}
                        id='projectName'
                        name='projectName'
                        type='text'
                        placeholder='Search project name'
                        ref={register}
                        projects={projects}
                        projByUrl={projectIdUrl}
                        selectedProjectId={(selectedProjectId) =>
                          setTaskInfo((prevState) => ({
                            ...prevState,
                            projectId: selectedProjectId,
                          }))
                        }
                      />
                      {errors.projectId && (
                        <ExclamationCircleIcon
                          className={`w-5 h-5 ${
                            errors.projectId ? 'text-danger' : 'text-correct'
                          } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                          aria-hidden='true'
                        />
                      )}
                      <p className='text-xxs text-danger mt-2 absolute'>
                        {error && error.projectId?.msg}
                      </p>
                    </div>
                  </div>
                </div>
                <div className='mt-6'>
                  <label className='text-sm font-semibold' htmlFor='password'>
                    Task name
                  </label>
                  <div className='mt-2 relative'>
                    <InputElement
                      className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                        errors.taskName ? 'border-danger' : 'border'
                      } ${
                        error && error.taskName ? 'border-danger' : 'border'
                      } focus:border-primary outline-none shadow-outline`}
                      id='taskName'
                      name='taskName'
                      type='text'
                      placeholder='Enter your task name here'
                      ref={register}
                      value={taskInfo.taskName}
                      onChange={handleOnChange}
                    />
                    <DocumentTextIcon
                      className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                      aria-hidden='true'
                    />
                    {errors.taskName ? (
                      <ExclamationCircleIcon
                        className={`w-5 h-5 ${
                          errors.taskName ? 'text-danger' : 'text-correct'
                        } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                        aria-hidden='true'
                      />
                    ) : error?.taskName ? (
                      <ExclamationCircleIcon
                        className={`w-5 h-5 ${
                          error?.taskName ? 'text-danger' : 'text-correct'
                        } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                        aria-hidden='true'
                      />
                    ) : null}
                    <p className='text-xxs text-danger mt-2 absolute'>
                      {errors.taskName?.message}
                      {error && error.taskName?.msg}
                    </p>
                  </div>
                </div>
                <div className='mt-6 flex flex-row'>
                  <div className='w-1/2 relative' style={{ zIndex: '49' }}>
                    <label
                      className='text-sm font-semibold'
                      htmlFor='taskReporterId'
                    >
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
                          defaultUser={accountInfo._id}
                          accounts={accountsList}
                          selectedAssigneeId={(selectedAssigneeId) =>
                            setTaskInfo((prevState) => ({
                              ...prevState,
                              taskReporterId: selectedAssigneeId,
                            }))
                          }
                        />
                        {errors.taskReporterId && (
                          <ExclamationCircleIcon
                            className={`w-5 h-5 ${
                              errors.taskReporterId
                                ? 'text-danger'
                                : 'text-correct'
                            } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                            aria-hidden='true'
                          />
                        )}
                        <p className='text-xxs text-danger mt-2 absolute'>
                          {error && error.taskReporterId?.msg}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className='w-1/2 ml-4 relative'>
                    <label
                      className='text-sm font-semibold'
                      htmlFor='taskAssigneeId'
                    >
                      Assign to
                    </label>
                    <div className='mt-2 flex'>
                      <div className='w-full relative z-50'>
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
                </div>

                <div className='mt-6 flex flex-row'>
                  <div className='w-1/2 relative' style={{ zIndex: '49' }}>
                    <label className='text-sm font-semibold' htmlFor='password'>
                      Due Date
                    </label>
                    <div className='mt-2'>
                      <DatePicker
                        selected={taskInfo.dueDate}
                        minDate={new Date()}
                        onChange={(date) => HandleDueDate(date)}
                        className='w-full text-xs px-4 py-4 border rounded-md focus:border-primary focus:outline-none focus:shadow-outline'
                      />
                    </div>
                  </div>
                  <div className='w-1/2 ml-4 relative'>
                    <label className='text-sm font-semibold' htmlFor='password'>
                      Priority
                    </label>
                    <div className='mt-2 relative'>
                      <PriorityList
                        selectedPriority={(selectedPriority) =>
                          setTaskInfo((prevState) => ({
                            ...prevState,
                            priority: selectedPriority,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-6'>
                  <label className='text-sm font-medium' htmlFor='password'>
                    Insert Description
                  </label>
                  <div className='mt-2 relative'>
                    <RichTextEditor
                      accounts={accountsList}
                      convertedContent={(convertedContent) =>
                        setTaskInfo((prevState) => ({
                          ...prevState,
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
              </div>
              <div
                className={`w-full ${
                  tabActive === 'Type' ? 'block' : 'hidden'
                }`}
              >
                <div className='relative rounded-tl-lg rounded-tr-lg'>
                  <h4 className='text-grey text-lg font-bold text-center tracking-wider'>
                    SELECT TYPE
                  </h4>
                  {error && (
                    <p className='w-full text-xxs text-danger text-center mt-2 absolute'>
                      {error.taskType?.msg}
                    </p>
                  )}
                  <XIcon
                    className='w-5 h-5 absolute top-0 right-0 opacity-40 cursor-pointer'
                    aria-hidden='true'
                    onClick={() => showTaskCreate(false)}
                  />
                </div>
                <div className='mt-12 flex justify-center'>
                  <div
                    id='Coding'
                    className={`w-2/6 ${
                      selectedClass === 'Coding'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } mr-6 py-8 px-12 border rounded-lg cursor-pointer hover:bg-primary hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleTaskType(e.currentTarget.id)}
                  >
                    <CodeIcon
                      className={`${
                        selectedClass === 'Coding'
                          ? 'text-primary opacity-10'
                          : ''
                      } w-8 h-8 mx-auto opacity-20`}
                      aria-hidden='true'
                    />
                    <h5 className='text-grey text-md font-bold text-center mt-4'>
                      Coding
                    </h5>
                  </div>
                  <div
                    id='Design'
                    className={`w-2/6 ${
                      selectedClass === 'Design'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } mr-6 py-8 px-12 border rounded-lg cursor-pointer hover:bg-primary hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleTaskType(e.currentTarget.id)}
                  >
                    <ColorSwatchIcon
                      className={`${
                        selectedClass === 'Design'
                          ? 'text-primary opacity-10'
                          : ''
                      } w-8 h-8 mx-auto opacity-20`}
                      aria-hidden='true'
                    />
                    <h5 className='text-grey text-md font-bold text-center mt-4'>
                      Design
                    </h5>
                  </div>
                </div>
                <div className='mt-12 flex justify-center'>
                  <div
                    id='WebDesign'
                    className={`w-2/6 ${
                      selectedClass === 'WebDesign'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } mr-6 py-8 px-12 border rounded-lg cursor-pointer hover:bg-primary hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleTaskType(e.currentTarget.id)}
                  >
                    <DesktopComputerIcon
                      className={`${
                        selectedClass === 'WebDesign'
                          ? 'text-primary opacity-10'
                          : ''
                      } w-8 h-8 mx-auto opacity-20`}
                      aria-hidden='true'
                    />
                    <h5 className='text-grey text-md font-bold text-center mt-4'>
                      Web Design
                    </h5>
                  </div>
                  <div
                    id='Branding'
                    className={`w-2/6 ${
                      selectedClass === 'Branding'
                        ? 'bg-primary bg-opacity-10 border-primary'
                        : ''
                    } mr-6 py-8 px-12 border rounded-lg cursor-pointer hover:bg-primary hover:bg-opacity-10 hover:border-primary`}
                    onClick={(e) => handleTaskType(e.currentTarget.id)}
                  >
                    <CreditCardIcon
                      className={`${
                        selectedClass === 'Branding'
                          ? 'text-primary opacity-10'
                          : ''
                      } w-8 h-8 mx-auto opacity-20`}
                      aria-hidden='true'
                    />
                    <h5 className='text-grey text-md font-bold text-center mt-4'>
                      Branding
                    </h5>
                  </div>
                </div>
              </div>
              <div
                className={`w-full ${
                  tabActive === 'Upload' ? 'block' : 'hidden'
                }`}
              >
                <div className='relative rounded-tl-lg rounded-tr-lg'>
                  <h5 className='text-grey text-lg font-bold text-center tracking-wider'>
                    UPLOAD FILES
                  </h5>
                  <XIcon
                    className='w-5 h-5 absolute top-0 right-0 opacity-40 cursor-pointer'
                    aria-hidden='true'
                    onClick={() => showTaskCreate(false)}
                  />
                </div>
                <div className='w-full mt-10'>
                  <UploadAttachements
                    uploadedAttachments={(uploadedAttachments) =>
                      setTaskInfo((prevState) => ({
                        ...prevState,
                        attachments: uploadedAttachments,
                      }))
                    }
                    showDropContainer={true}
                  />
                </div>
              </div>
              <div
                className={`w-full ${
                  tabActive === 'Invitation' ? 'block' : 'hidden'
                }`}
              >
                <div className='relative rounded-tl-lg rounded-tr-lg'>
                  <h4 className='text-grey text-lg font-bold text-center tracking-wider'>
                    INVITE OTHER TO THIS TASK
                  </h4>
                  <XIcon
                    className='w-5 h-5 absolute top-0 right-0 opacity-40 cursor-pointer'
                    aria-hidden='true'
                    onClick={() => showTaskCreate(false)}
                  />
                </div>
                <div className='mt-10 flex'>
                  <div className='w-full mr-2 relative z-50'>
                    <InvitePeople
                      className={`w-full px-4 py-4 text-xs leading-tight rounded-md appearance-none ${
                        errors.invitedPeopleId
                          ? 'border-danger focus:border-danger'
                          : 'border focus:border-primary'
                      } border focus:border-primary focus:outline-none focus:shadow-outline`}
                      id='invitedPeopleId'
                      name='invitedPeopleId'
                      type='text'
                      placeholder='Search account by name or email'
                      ref={register}
                      accounts={accountsList}
                      selectedPeopleId={(selectedPeopleId) =>
                        setTaskInfo((prevState) => ({
                          ...prevState,
                          invitedPeopleId: selectedPeopleId,
                        }))
                      }
                      showAddInput={true}
                    />
                  </div>
                </div>
              </div>
              <div className='w-1/4 absolute right-0 bottom-0'>
                {tabIndex === tabArr.length - 1 ? (
                  <motion.button
                    type='submit'
                    className='bg-primary w-full text-sm text-white font-bold tracking-wider px-2 py-4 rounded-md shadow-lg'
                    initial='rest'
                    whileHover='hover'
                    variants={hoverBtnPrimaryMotion}
                  >
                    CREATE
                  </motion.button>
                ) : (
                  <motion.div
                    className='bg-primary w-full text-sm text-white text-center font-bold tracking-wider px-2 py-4 rounded-md shadow-lg cursor-pointer'
                    onClick={() => handleNextTab()}
                    initial='rest'
                    whileHover='hover'
                    variants={hoverBtnPrimaryMotion}
                  >
                    NEXT
                  </motion.div>
                )}
              </div>
              <div className='w-full mt-10 mb-6'>
                <ul className='flex flex-row items-center justify-center'>
                  {tabSelected.map((option, index) => (
                    <li
                      key={index}
                      id={option}
                      className={`${
                        tabActive === option
                          ? 'bg-primary w-22px'
                          : 'bg-darkGrey w-8px'
                      } h-8px text-lg text-primary text-center m-1 rounded-full cursor-pointer`}
                      onClick={() => handleSelectedTab(option)}
                    >
                      <span className='hidden'>{option}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateTask;
