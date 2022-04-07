import React, { useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import moment from 'moment';

import {
  EyeIcon,
  TrashIcon,
  DesktopComputerIcon,
  DeviceMobileIcon,
  TemplateIcon,
  PencilAltIcon,
} from '@heroicons/react/outline';

import {
  getProjectById,
  getProjTaskListById,
  deleteProjectById,
} from '../redux/actions/projectActions';
import AlertConfirmation from './notifications/AlertConfirmation';
import Pagination from '../components/pagination/Pagination';

let PageSize = 10;

const ListView = ({
  datas,
  searchData,
  showProject,
  itemInfo,
  showConfirmation,
}) => {
  const [accountInfo, setAccountInfo] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [filteredList, setFilteredList] = useState();
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

  const handleOnGetProject = (e) => {
    showProject(true);
    dispatch(getProjectById(e));
  };

  const handleOnDeleteItem = (id, projectCreatorId, name) => {
    if (accountInfo._id === projectCreatorId || accountInfo.isAdmin) {
      setProjectName(name);
      if (id && name) {
        setShowAlert(true);
        setProjectId(id);
      }
    }
  };

  const handleOnGetTaskByProjId = (e) => {
    dispatch(getProjTaskListById(e.currentTarget.id));
    history.push({
      pathname: `/project/board/${e.currentTarget.innerText
        .replace(/\s+/g, '-')
        .toLowerCase()}`,
      state: { id: e.currentTarget.id, name: e.currentTarget.innerText },
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
    // if (datas) {
    //   setFilteredList(datas);
    // } else if (searchData) {
    //   setFilteredList([searchData]);
    // }

    if (project) {
      itemInfo(project);
    }
  }, [datas, itemInfo, project, searchData]);

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
      <div className='bg-white m-10 flex flex-col'>
        <div className='align-middle inline-block min-w-full'>
          <table className='min-w-full'>
            <thead className='border-b'>
              <tr>
                <th
                  scope='col'
                  className='text-sm text-left tracking-wide px-6 py-6 opacity-40'
                >
                  Project Name
                </th>
                <th
                  scope='col'
                  className='text-sm text-left tracking-wide px-6 py-6 opacity-40'
                >
                  Owner
                </th>
                <th
                  scope='col'
                  className='text-sm text-left tracking-wide px-6 py-6 opacity-40'
                >
                  Start Date
                </th>
                <th
                  scope='col'
                  className='text-sm text-left tracking-wide px-6 py-6 opacity-40'
                >
                  Due Date
                </th>
                <th
                  scope='col'
                  className='text-sm text-left tracking-wide px-6 py-6 opacity-40'
                >
                  Last Opened
                </th>
                <th
                  scope='col'
                  className='text-sm text-left tracking-wide px-6 py-6 opacity-40'
                >
                  Last Update
                </th>
                <th
                  scope='col'
                  className='text-sm text-center tracking-wide px-6 py-6 opacity-40'
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {currentPageData &&
                currentPageData.map((data) => (
                  <tr
                    key={data._id}
                    className='border-b cursor-pointer hover:bg-lightPrimary hover:bg-opacity-40 hover:text-primary'
                  >
                    <td
                      id={data._id}
                      projectName={data.projectName}
                      className='px-6 py-3 whitespace-nowrap'
                      style={{ width: '30%' }}
                      onClick={handleOnGetTaskByProjId}
                    >
                      <div className='text-sm flex items-center'>
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
                              title='Web DevelopmentView Project'
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
                              title='Mobile Development'
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
                              title='Design'
                              className='w-4 h-4 text-white'
                              aria-hidden='true'
                            />
                          </div>
                        ) : (
                          <div
                            className='bg-opacity-20 mr-3 p-1'
                            style={{
                              background: '#ffc40c',
                              width: '24px',
                              height: '24px',
                              borderRadius: '5px',
                            }}
                          >
                            <PencilAltIcon
                              title='Branding'
                              className='w-4 h-4 text-white'
                              aria-hidden='true'
                            />
                          </div>
                        )}
                        {data.projectName}
                      </div>
                    </td>
                    <td
                      id={data._id}
                      className='px-6 py-3 whitespace-nowrap text-xs'
                      style={{ width: '10%' }}
                      onClick={handleOnGetTaskByProjId}
                    >
                      {moment(data.startDate).format('LL')}
                    </td>
                    <td
                      id={data._id}
                      className='px-6 py-3 whitespace-nowrap text-xs'
                      style={{ width: '10%' }}
                      onClick={handleOnGetTaskByProjId}
                    >
                      {moment(data.dueDate).format('LL')}
                    </td>
                    <td
                      id={data._id}
                      className='px-6 py-3 whitespace-nowrap text-xs'
                      style={{ width: '10%' }}
                      onClick={handleOnGetTaskByProjId}
                    >
                      {moment(data.lastUpdate.date).format('LL')}
                    </td>
                    <td
                      id={data._id}
                      className='px-6 py-3 whitespace-nowrap text-xs'
                      style={{ width: '10%' }}
                      onClick={handleOnGetTaskByProjId}
                    >
                      {moment(data.lastOpenedDate).format('LL')}
                    </td>
                    <td
                      id={data._id}
                      className='px-6 py-3 whitespace-nowrap text-xs'
                      style={{ width: '10%' }}
                      onClick={handleOnGetTaskByProjId}
                    >
                      {moment(data.lastUpdate.date).format('LL')}
                    </td>
                    <td className='px-6 py-4' style={{ width: '9%' }}>
                      <div className='w-1/2 mx-auto flex'>
                        <EyeIcon
                          title='View Project'
                          className='w-4 h-4 mx-auto cursor-pointer'
                          aria-hidden='true'
                          onClick={() => handleOnGetProject(data._id)}
                        />
                        <TrashIcon
                          title='Delete Project'
                          className={`w-4 h-4 ${
                            accountInfo._id === data.creator[0]._id ||
                            accountInfo.isAdmin
                              ? 'pointer-events-auto'
                              : 'pointer-events-none opacity-30'
                          } mx-auto cursor-pointer`}
                          aria-hidden='true'
                          onClick={() =>
                            handleOnDeleteItem(
                              data._id,
                              data.projectCreatorId
                                ? data.projectCreatorId
                                : data.projectCreatorId,
                              data.projectName
                            )
                          }
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
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

export default ListView;
