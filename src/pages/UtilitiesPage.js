import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Sidebar from '../components/sidebar/Sidebar';
import Topbar from '../components/header/Topbar';
import CreateDepartment from '../components/settings/department/CreateDepartment';
import CreateClient from '../components/settings/client/CreateClient';
import CreateTeam from '../components/settings/CreateTeam';
import SuccessConfirmation from '../components/notifications/SuccessConfirmation';

const UtilitiesPage = ({ socket }) => {
  const [accountInfo, setAccountInfo] = useState(
    JSON.parse(localStorage.getItem('loginAccount')) || ''
  );
  const [isToggleWidth, setToggleWidth] = useState(false);
  const [isModal, setIsModal] = useState();
  const [showModal, setShowModal] = useState(false);

  const departmentRegister = useSelector((state) => state.departmentRegister);
  const { department } = departmentRegister;

  const clientRegister = useSelector((state) => state.clientRegister);
  const { client } = clientRegister;

  const teamRegister = useSelector((state) => state.teamRegister);
  const { team } = teamRegister;

  return (
    <div className='w-full h-full flex'>
      <div
        className={`w-full h-20 ${isToggleWidth ? 'ml-12%' : 'ml-4%'} order-2`}
      >
        <Topbar title='Settings' />

        <div className='bg-lightGrey min-h-85vh flex flex-col relative'>
          {isModal === 'Department'
            ? isModal && (
                <CreateDepartment
                  isModal={(isModal) => setIsModal(isModal)}
                  showModal={(showModal) => setShowModal(showModal)}
                  currentAccount={accountInfo}
                />
              )
            : isModal === 'Client'
            ? isModal && (
                <CreateClient
                  isModal={(isModal) => setIsModal(isModal)}
                  showModal={(showModal) => setShowModal(showModal)}
                />
              )
            : isModal === 'Team'
            ? isModal && (
                <CreateTeam
                  isModal={(isModal) => setIsModal(isModal)}
                  showModal={(showModal) => setShowModal(showModal)}
                />
              )
            : null}
        </div>
      </div>
      <Sidebar
        isSlideNav={true}
        isToggleWidth={(isToggleWidth) => setToggleWidth(isToggleWidth)}
        isModal={(isModal) => setIsModal(isModal)}
      />
      {showModal &&
        (department ? (
          <SuccessConfirmation
            type='Department'
            name={department?.departmentName}
            message={department?.msg}
            showModal={(showModal) => setShowModal(showModal)}
          />
        ) : client ? (
          <SuccessConfirmation
            type='Client'
            name={client?.clientName}
            message={client?.msg}
            showModal={(showModal) => setShowModal(showModal)}
          />
        ) : team ? (
          <SuccessConfirmation
            type='Team'
            name={team?.teamName}
            message={team?.msg}
            showModal={(showModal) => setShowModal(showModal)}
          />
        ) : null)}
    </div>
  );
};

export default UtilitiesPage;
