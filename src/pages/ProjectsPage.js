import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { ViewListIcon, ViewGridIcon, PlusIcon } from '@heroicons/react/outline';

import { getProjectList } from '../redux/actions/projectActions';
import Topbar from '../components/header/Topbar';
import Sidebar from '../components/sidebar/Sidebar';
import SortByAccount from '../components/filter/SortByAccount';
import SortedList from '../components/filter/SortedList';
import ListView from '../components/ListView';
import BoardViewProject from '../components/project/BoardViewProject';
import CreateProject from '../components/project/CreateProject';
import ProjectView from '../components/ProjectView';
import SuccessConfirmation from '../components/notifications/SuccessConfirmation';
import AlertConfirmation from '../components/notifications/AlertConfirmation';

const ProjectsPage = ({ socket, history }) => {
  const [accountInfo, setAccountInfo] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [teamInfo, setTeamInfo] = useState(
    JSON.parse(localStorage.getItem('accountCurrentTeamList')) || ''
  );
  const [itemsInfo, setItemsInfo] = useState([]);
  const [itemsInfoTemp, setItemsInfoTemp] = useState([]);
  const [itemInfo, setItemInfo] = useState();
  const [sortedItems, setSortedItems] = useState();
  const [sortType, SetSortType] = useState([
    {
      id: 1,
      status: 'Sort by',
      key: 'default',
    },
    {
      id: 2,
      status: 'Alpabetical',
      key: 'projectName',
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
  const [showProjectCreate, setShowProjectCreate] = useState(false);
  const [showProjectView, setShowProjectView] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isToggleWidth, setToggleWidth] = useState(false);
  const [validationErrors, setValidationErrors] = useState(false);
  const [searchResultId, setSearchResultId] = useState('');
  const [showToolTip, setShowTooltip] = useState('');
  const [showViewType, setShowViewType] = useState('list');

  const projectRegister = useSelector((state) => state.projectRegister);
  const { project } = projectRegister;

  const projectListGet = useSelector((state) => state.projectListGet);
  const { projects } = projectListGet;

  const projectDeletedById = useSelector((state) => state.projectDeletedById);
  const { deletedProjectById, error } = projectDeletedById;

  const projectUpdateById = useSelector((state) => state.projectUpdateById);
  const { updatedProject } = projectUpdateById;

  const dispatch = useDispatch();

  const handleShowTooltip = (e) => {
    setShowTooltip(e);
  };

  useEffect(() => {
    const fetchProject = () => {
      if (projects === undefined || projects.length === 0) {
        dispatch(getProjectList(accountInfo._id));
      }
    };

    const timer = setTimeout(() => {
      fetchProject();
    }, 500);

    return () => clearTimeout(timer);
  }, [accountInfo._id, dispatch]);

  useEffect(() => {
    if (accountInfo.isAdmin) {
      setItemsInfo(projects);
    } else {
      if (projects) {
        const filterByAccoundId = projects.filter(
          (project) => project.projectCreatorId === accountInfo._id
        );

        const leadId = teamInfo.currentTeam.map((id) => id.teamLeadId);
        const InvitedId = teamInfo.currentTeam.map((id) => id.invitedPeopleId);
        const filterLeadid = leadId.filter((id) => id === accountInfo._id);

        // const filterInvitedid = InvitedId.flat().filter(
        //   (id) => id === accountInfo._id
        // );

        const filterInvitedid = InvitedId.filter(
          (id) => id === accountInfo._id
        );
        const filterByTeamLeadId = projects.filter(
          (project) => project.whoCanEditId === filterLeadid[0]
        );
        const filterByInvitedId = projects.filter(
          (project) => project.whoCanEditId === filterInvitedid
        );

        let combineArr = [];

        if (
          filterByAccoundId.length >= 1 ||
          filterByTeamLeadId.length >= 1 ||
          filterByInvitedId.length >= 1
        ) {
          combineArr = [
            ...filterByAccoundId,
            ...filterByTeamLeadId,
            ...filterByInvitedId,
          ];
          setItemsInfo(
            combineArr.filter((element, index) => {
              return combineArr.indexOf(element) === index;
            })
          );
          if (itemsInfoTemp.length === 0) {
            setItemsInfoTemp(
              combineArr.filter((element, index) => {
                return combineArr.indexOf(element) === index;
              })
            );
          }

          // setItemsInfoTemp(
          //   combineArr.filter((element, index) => {
          //     return combineArr.indexOf(element) === index;
          //   })
          // );
        }
      }
    }
  }, [projects, dispatch]);

  useEffect(() => {
    if (projectRegister.error) {
      setShowAlert(true);
    }
  }, [projectRegister.error]);

  useEffect(() => {
    if (deletedProjectById) {
      dispatch(getProjectList());
    }
  }, [deletedProjectById, dispatch]);

  useEffect(() => {
    if (searchResultId) {
      setSortedItems(
        projects.filter((project) => project._id === searchResultId)
      );
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
          <div className='bg-white py-4 px-10 flex border-b'>
            <div className='mr-auto flex items-center'>
              <h1 className='text-lg text-darkGrey font-bold'>Project</h1>
            </div>
            <div className='ml-auto flex flex-row items-center'>
              {itemsInfo && (
                <SortByAccount
                  datas={itemsInfo}
                  returnSortedItems={(returnSortedItems) =>
                    setSortedItems(returnSortedItems)
                  }
                />
              )}
              <button
                type='button'
                className={`bg-primary w-1/9 text-white text-xs font-semibold tracking-wider ${
                  !itemsInfo ? 'mr-11' : null
                } py-3 px-6 flex items-center rounded-md shadow-xl hover:bg-dark`}
                onClick={() => setShowProjectCreate(true)}
              >
                <PlusIcon
                  className='bg-white w-4 h-4 text-primary mr-3 p-0.5 rounded-sm'
                  aria-hidden='true'
                />
                CREATE PROJECT
              </button>
              {itemsInfo && (
                <SortedList
                  typeOfSort={sortType}
                  datas={itemsInfo}
                  returnSortedItems={(returnSortedItems) =>
                    setSortedItems(returnSortedItems)
                  }
                />
              )}
              <div
                className={`list bg-primary text-white ${
                  showViewType === 'board' ? 'bg-lightGrey text-darkGrey' : null
                } mx-4 p-2 relative cursor-pointer hover:bg-primary hover:text-white`}
                style={{
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) =>
                  handleShowTooltip(e.currentTarget.className.split(' ')[0])
                }
                onMouseLeave={() => setShowTooltip('')}
                onClick={() => setShowViewType('list')}
              >
                <ViewListIcon
                  title='View as list'
                  className='w-6 h-6'
                  aria-hidden='true'
                />
                {showToolTip === 'list' ? (
                  <div
                    id='View as List'
                    className='bg-primary text-xxxs text-white tracking-wider font-normal mt-3 py-1.5 px-2 whitespace-nowrap absolute right-0 rounded-md'
                    style={{ zIndex: '50' }}
                  >
                    View as list
                  </div>
                ) : null}
              </div>
              <div
                className={`board bg-primary text-white ${
                  showViewType === 'list' ? 'bg-lightGrey text-darkGrey' : null
                } p-2 relative cursor-pointer hover:bg-primary hover:text-white`}
                style={{
                  borderRadius: '4px',
                }}
                onMouseEnter={(e) =>
                  handleShowTooltip(e.currentTarget.className.split(' ')[0])
                }
                onMouseLeave={() => setShowTooltip('')}
                onClick={() => setShowViewType('board')}
              >
                <ViewGridIcon
                  title='View as board'
                  className='w-6 h-6'
                  aria-hidden='true'
                />
                {showToolTip === 'board' ? (
                  <div
                    className='bg-primary text-xxxs text-white tracking-wider font-normal mt-3 py-1.5 px-2 whitespace-nowrap absolute right-0 rounded-md'
                    style={{ zIndex: '50' }}
                  >
                    View as board
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          <div className='flex flex-col relative'>
            {showViewType === 'list' ? (
              <ListView
                datas={sortedItems}
                showProject={(showProjectView) =>
                  setShowProjectView(showProjectView)
                }
                itemInfo={(itemInfo) => setItemInfo(itemInfo)}
                history={history}
              />
            ) : (
              <BoardViewProject
                datas={sortedItems}
                showProject={(showProjectView) =>
                  setShowProjectView(showProjectView)
                }
                itemInfo={(itemInfo) => setItemInfo(itemInfo)}
                isViewProject={showProjectView}
                history={history}
              />
            )}
          </div>
        </div>
        <Sidebar
          isSlideNav={false}
          isToggleWidth={(isToggleWidth) => setToggleWidth(isToggleWidth)}
        />
      </div>
      {showProjectView && (
        <ProjectView
          showProjectView={(showProjectView) =>
            setShowProjectView(showProjectView)
          }
          projectByIdInfo={itemInfo}
          history={history}
          showModal={(showModal) => setShowModal(showModal)}
        />
      )}
      {showProjectCreate && (
        <CreateProject
          showProjectCreate={(showProjectCreate) =>
            setShowProjectCreate(showProjectCreate)
          }
          project={project}
          showModal={(showModal) => setShowModal(showModal)}
          validationError={(validationError) =>
            setValidationErrors(validationError)
          }
          history={history}
        />
      )}
      {showModal && project ? (
        <SuccessConfirmation
          type='Project'
          name={project.projectName}
          message={project.msg}
          showModal={(showModal) => setShowModal(showModal)}
        />
      ) : updatedProject ? (
        <SuccessConfirmation
          type='Project'
          name={updatedProject.projectName}
          actionType='updated'
          message={updatedProject.msg}
          showModal={(showModal) => setShowModal(showModal)}
        />
      ) : null}
      {showAlert && (
        <AlertConfirmation
          type='project'
          title='Project registration error'
          message={
            projectRegister.error.projectCategory
              ? projectRegister.error.projectCategory.msg
              : projectRegister.error.whoCanEdit.msg
          }
          buttonConfirmCancel={false}
          buttonConfirmPlaceholder='Try again'
          showAlert={(showAlert) => setShowAlert(showAlert)}
          showModal={(showModal) => setShowModal(showModal)}
        />
      )}
    </>
  );
};

export default ProjectsPage;
