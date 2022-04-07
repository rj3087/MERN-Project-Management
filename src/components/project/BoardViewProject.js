import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Popover, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
import moment from 'moment';
import {
  DesktopComputerIcon,
  DeviceMobileIcon,
  TemplateIcon,
  ClockIcon,
  PencilAltIcon,
} from '@heroicons/react/outline';
import {
  getProjectById,
  getProjTaskListById,
  deleteProjectById,
} from '../../redux/actions/projectActions';
import AlertConfirmation from '../notifications/AlertConfirmation';
import Pagination from '../pagination/Pagination';
import { PopoverMenu } from '../ui/PopoverMenu';

let PageSize = 10;

const BoardViewProject = ({
  datas,
  searchData,
  showProject,
  itemInfo,
  showConfirmation,
}) => {
  const [accountInfo, setAccountInfo] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [filteredList, setFilteredList] = useState(searchData);
  const [projectId, setProjectId] = useState();
  const [projectName, setProjectName] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [alertAction, setAlertAction] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const projectGetById = useSelector((state) => state.projectGetById);
  const { project } = projectGetById;

  let history = useHistory();
  const dispatch = useDispatch();

  const textTruncate = (str, num) => {
    return str.length > num ? str.slice(0, num) + '...' : str;
  };

  const handleCheckDaysLeft = (a, b) => {
    let d1 = moment(new Date(a));
    let d2 = moment(new Date(b));
    return d2.diff(d1, 'days');
  };

  const handleOnGetProject = (e) => {
    showProject(true);
    dispatch(getProjectById(e));
  };

  const handleOnDeleteItem = (e) => {
    if (accountInfo._id === e.projectCreatorId || accountInfo.isAdmin) {
      setProjectName(e.projectName);
      setProjectId(e._id);
    }
  };

  const handleOnGetTaskByProjId = (e) => {
    // dispatch(getProjTaskListById(e));
    // history.push(`/project/board/${e}`);
    dispatch(getProjTaskListById(e.id));
    history.push({
      pathname: `/project/board/${e.name.replace(/\s+/g, '-').toLowerCase()}`,
      state: { id: e.id, name: e.name },
    });
  };

  const currentPageData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return filteredList && filteredList.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredList]);

  useEffect(() => {
    if (datas) {
      setFilteredList(datas);
    }

    if (project) {
      itemInfo(project);
    }
  }, [datas, itemInfo, project]);

  useEffect(() => {
    if (projectId && projectName) {
      setShowAlert(true);
    }
  }, [projectName, projectId]);

  useEffect(() => {
    if (alertAction) {
      dispatch(deleteProjectById(projectId));
      setShowAlert(false);
      setAlertAction(false);
    }
    if (showModal) {
      setShowAlert(true);
    }
  }, [alertAction, dispatch, projectId, showModal]);

  return (
    <>
      <div className='m-10'>
        <div className='grid grid-cols-4 gap-8'>
          {currentPageData &&
            currentPageData.map((data) => (
              <div key={data._id}>
                <div className='bg-white text-sm min-h-228px p-8 flex flex-col'>
                  <div className='flex mb-4 items-center'>
                    {data.projectCategory === 'Web Development' ? (
                      <div
                        className='bg-primary mr-3 p-1'
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '5px',
                        }}
                      >
                        <DesktopComputerIcon
                          className='w-4 h-4 text-white'
                          aria-hidden='true'
                        />
                      </div>
                    ) : data.projectCategory === 'Mobile Development' ? (
                      <div
                        className='bg-correct mr-3 p-1'
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '5px',
                        }}
                      >
                        <DeviceMobileIcon
                          className='w-4 h-4 text-white'
                          aria-hidden='true'
                        />
                      </div>
                    ) : data.projectCategory === 'Design' ? (
                      <div
                        className='bg-danger bg-opacity-50 mr-3 p-1'
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '5px',
                        }}
                      >
                        <TemplateIcon
                          className='w-4 h-4 text-white'
                          aria-hidden='true'
                        />
                      </div>
                    ) : (
                      <div
                        className='bg-yellow mr-3 p-1'
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '5px',
                        }}
                      >
                        <PencilAltIcon
                          title='View Project'
                          className='w-4 h-4 text-white'
                          aria-hidden='true'
                        />
                      </div>
                    )}
                    <div className='ml-auto'>
                      {handleCheckDaysLeft(data.startDate, data.dueDate) ===
                      0 ? (
                        <div className='ml-auto flex'>
                          <p
                            className='bg-danger bg-opacity-90 text-white text-xxs p-1.5 text-center block rounded-md'
                            style={{ lineHeight: '12px' }}
                          >
                            Due already
                          </p>
                        </div>
                      ) : (
                        <div
                          className={`${
                            handleCheckDaysLeft(data.startDate, data.dueDate) <=
                            0
                              ? 'bg-danger bg-opacity-90 text-white'
                              : 'bg-primary bg-opacity-10 text-primary'
                          } ml-auto p-1.5 flex items-center rounded-md`}
                        >
                          <ClockIcon
                            className='w-3 h-3 mr-2'
                            aria-hidden='true'
                          />
                          <p
                            className='text-xxs'
                            style={{ lineHeight: '1px' }}
                          >{`${handleCheckDaysLeft(
                            data.startDate,
                            data.dueDate
                          )} ${
                            handleCheckDaysLeft(data.startDate, data.dueDate) <=
                            0
                              ? 'day'
                              : 'days'
                          } left`}</p>
                        </div>
                      )}
                    </div>
                    <div className='relative left-1'>
                      <PopoverMenu
                        account={accountInfo}
                        item={data}
                        isShowProjectTask={(isShowProjectTask) =>
                          handleOnGetTaskByProjId(isShowProjectTask)
                        }
                        isShowProject={(isShowProject) =>
                          handleOnGetProject(isShowProject)
                        }
                        isDeleteProject={(isDeleteProject) => {
                          handleOnDeleteItem(isDeleteProject);
                        }}
                      />
                    </div>
                  </div>
                  <div className='font-bold mb-2'>{data.projectName}</div>
                  <div className='font-medium opacity-60 mb-6'>
                    {textTruncate(data.projectNote, 82)}
                  </div>
                  <div className='w-full flex mt-auto'>
                    <div className='mr-auto'>
                      <img
                        src={data.client[0].accountProfileUploaded}
                        className='border rounded-full'
                        style={{
                          width: '2rem',
                          border: '1px solid #e3e6fa',
                        }}
                        alt={data.client[0].clientName}
                      />
                    </div>
                    <div className='ml-auto'>
                      <img
                        src={data.creator[0].accountProfileUploaded}
                        alt={data.creator[0].projectCreatorName}
                        className='rounded-full'
                        style={{
                          width: '2rem',
                          height: '2rem',
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {showAlert && (
        <AlertConfirmation
          type='project'
          name={projectName}
          message={`You're about to permanently delete this task, it's comments and attachments, and all of its data.`}
          buttonConfirmCancel={true}
          buttonConfirmPlaceholder='Confirm'
          showAlert={(showAlert) => setShowAlert(showAlert)}
          showModal={(showModal) => setShowModal(showModal)}
          alertAction={(alertAction) => setAlertAction(alertAction)}
        />
      )}

      {filteredList && (
        <Pagination
          className='pagination-bar'
          currentPage={currentPage}
          totalCount={filteredList.length}
          pageSize={PageSize}
          handleOnPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </>
  );
};

export default BoardViewProject;
