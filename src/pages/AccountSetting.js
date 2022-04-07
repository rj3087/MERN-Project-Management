import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion } from 'framer-motion';
import {
  CameraIcon,
  UserIcon,
  MailIcon,
  IdentificationIcon,
  OfficeBuildingIcon,
  PhoneIcon,
  LocationMarkerIcon,
  LockClosedIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';
import {
  getAccount,
  updateAccount,
  updateAccountPassword,
  uploadAccountProfile,
} from '../redux/actions/accountActions';
import Topbar from '../components/header/Topbar';
import Sidebar from '../components/sidebar/Sidebar';
import SidebarBlue from '../components/sidebar/SidebarBlue';
import InputElement from '../components/ui/InputElement';
import CreateDepartment from '../components/settings/department/CreateDepartment';
import SearchDepartment from '../components/settings/department/SearchDepartment';
import SuccessConfirmation from '../components/notifications/SuccessConfirmation';

var defaultAccountProfile =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTMgNTMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUzIDUzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBzdHlsZT0iZmlsbDojRTdFQ0VEOyIgZD0iTTE4LjYxMyw0MS41NTJsLTcuOTA3LDQuMzEzYy0wLjQ2NCwwLjI1My0wLjg4MSwwLjU2NC0xLjI2OSwwLjkwM0MxNC4wNDcsNTAuNjU1LDE5Ljk5OCw1MywyNi41LDUzDQoJYzYuNDU0LDAsMTIuMzY3LTIuMzEsMTYuOTY0LTYuMTQ0Yy0wLjQyNC0wLjM1OC0wLjg4NC0wLjY4LTEuMzk0LTAuOTM0bC04LjQ2Ny00LjIzM2MtMS4wOTQtMC41NDctMS43ODUtMS42NjUtMS43ODUtMi44ODh2LTMuMzIyDQoJYzAuMjM4LTAuMjcxLDAuNTEtMC42MTksMC44MDEtMS4wM2MxLjE1NC0xLjYzLDIuMDI3LTMuNDIzLDIuNjMyLTUuMzA0YzEuMDg2LTAuMzM1LDEuODg2LTEuMzM4LDEuODg2LTIuNTN2LTMuNTQ2DQoJYzAtMC43OC0wLjM0Ny0xLjQ3Ny0wLjg4Ni0xLjk2NXYtNS4xMjZjMCwwLDEuMDUzLTcuOTc3LTkuNzUtNy45NzdzLTkuNzUsNy45NzctOS43NSw3Ljk3N3Y1LjEyNg0KCWMtMC41NCwwLjQ4OC0wLjg4NiwxLjE4NS0wLjg4NiwxLjk2NXYzLjU0NmMwLDAuOTM0LDAuNDkxLDEuNzU2LDEuMjI2LDIuMjMxYzAuODg2LDMuODU3LDMuMjA2LDYuNjMzLDMuMjA2LDYuNjMzdjMuMjQNCglDMjAuMjk2LDM5Ljg5OSwxOS42NSw0MC45ODYsMTguNjEzLDQxLjU1MnoiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiM1NTYwODA7IiBkPSJNMjYuOTUzLDAuMDA0QzEyLjMyLTAuMjQ2LDAuMjU0LDExLjQxNCwwLjAwNCwyNi4wNDdDLTAuMTM4LDM0LjM0NCwzLjU2LDQxLjgwMSw5LjQ0OCw0Ni43Ng0KCQljMC4zODUtMC4zMzYsMC43OTgtMC42NDQsMS4yNTctMC44OTRsNy45MDctNC4zMTNjMS4wMzctMC41NjYsMS42ODMtMS42NTMsMS42ODMtMi44MzV2LTMuMjRjMCwwLTIuMzIxLTIuNzc2LTMuMjA2LTYuNjMzDQoJCWMtMC43MzQtMC40NzUtMS4yMjYtMS4yOTYtMS4yMjYtMi4yMzF2LTMuNTQ2YzAtMC43OCwwLjM0Ny0xLjQ3NywwLjg4Ni0xLjk2NXYtNS4xMjZjMCwwLTEuMDUzLTcuOTc3LDkuNzUtNy45NzcNCgkJczkuNzUsNy45NzcsOS43NSw3Ljk3N3Y1LjEyNmMwLjU0LDAuNDg4LDAuODg2LDEuMTg1LDAuODg2LDEuOTY1djMuNTQ2YzAsMS4xOTItMC44LDIuMTk1LTEuODg2LDIuNTMNCgkJYy0wLjYwNSwxLjg4MS0xLjQ3OCwzLjY3NC0yLjYzMiw1LjMwNGMtMC4yOTEsMC40MTEtMC41NjMsMC43NTktMC44MDEsMS4wM1YzOC44YzAsMS4yMjMsMC42OTEsMi4zNDIsMS43ODUsMi44ODhsOC40NjcsNC4yMzMNCgkJYzAuNTA4LDAuMjU0LDAuOTY3LDAuNTc1LDEuMzksMC45MzJjNS43MS00Ljc2Miw5LjM5OS0xMS44ODIsOS41MzYtMTkuOUM1My4yNDYsMTIuMzIsNDEuNTg3LDAuMjU0LDI2Ljk1MywwLjAwNHoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K';

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter valid Email Address')
    .required('Please enter Email Address'),
  firstName: yup
    .string()
    .min(2, 'First name must be at least 2 characters.')
    .required('Please Enter First Name'),
  jobTitle: yup
    .string()
    .min(2, 'First name must be at least 2 characters.')
    .required('Please Enter your job title'),
});

const buttonRedVariants = {
  initial: {
    backgroundColor: '#e3342f',
    scale: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 60,
      ease: 'easeInOut',
    },
  },
  hover: {
    backgroundColor: '#C34A36',
    scale: 1.1,
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 60,
      ease: 'easeInOut',
    },
  },
};

const buttonBlueVariants = {
  initial: {
    backgroundColor: '#3F52E3',
    scale: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 60,
      ease: 'easeInOut',
    },
  },
  hover: {
    backgroundColor: '#2e3db0',
    scale: 1.1,
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 60,
      ease: 'easeInOut',
    },
  },
};
const buttonLightBlueVariants = {
  initial: {
    backgroundColor: '#EBEDFC',
    color: '#3F52E3',
    scale: 1,
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 60,
      ease: 'easeInOut',
    },
  },
  hover: {
    backgroundColor: '#c5cbf6',
    scale: 1.1,
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 60,
      ease: 'easeInOut',
    },
  },
};

const AccountSettingPage = ({ history }) => {
  const [accountProfile, setAccountProfile] = useState();
  const [accountProfileName, setAccountProfileName] = useState();
  const [accountInfo, setAccountInfo] = useState({
    role: 'Agent',
    email: '',
    firstName: '',
    lastName: '',
    jobTitle: '',
    departmentId: '',
    location: '',
    contact: '',
    accountProfileUploaded: '',
  });
  const [accountPassword, setAccountPassword] = useState({
    _id: '',
    currentPassword: '',
    password: '',
  });
  const [isToggleWidth, setToggleWidth] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isModal, setIsModal] = useState();
  const [isActiveTab, setActiveTab] = useState();

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: 'onSubmit',
  });

  const dispatch = useDispatch();

  const accountLogin = useSelector((state) => state.accountLogin);
  const { currentAccountInfo } = accountLogin;

  const accountGet = useSelector((state) => state.accountGet);
  const { account } = accountGet;

  const accountUpdate = useSelector((state) => state.accountUpdate);
  const { updatedAccount, error } = accountUpdate;

  const accountPasswordUpdate = useSelector(
    (state) => state.accountPasswordUpdate
  );
  const { updatedPassword, errorPassword } = accountPasswordUpdate;

  const accountUploadProfile = useSelector(
    (state) => state.accountUploadProfile
  );
  const { profileAccount } = accountUploadProfile;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setAccountInfo((data) => ({ ...data, [name]: value }));
  };

  const handleOnPasswordChange = (e) => {
    const { name, value } = e.target;
    setAccountPassword((data) => ({ ...data, [name]: value }));
  };

  const handleOnchangeProfile = (e) => {
    if (
      e.target.files[0].type !== 'image/jpeg' &&
      e.target.files[0].type !== 'image/png'
    ) {
      console.log('wrong format');
    }
    setAccountProfile(e.target.files[0]);
    setAccountProfileName(e.target.name);
    const formData = new FormData();
    formData.append(e.target.name, e.target.files[0]);
    dispatch(uploadAccountProfile(formData));
  };

  const handleOnSubmit = () => {
    console.log(accountInfo);
    dispatch(updateAccount(accountInfo));
    setShowModal(true);
  };

  const handleOnChangePassword = () => {
    dispatch(
      updateAccountPassword({
        _id: account._id,
        currentPassword: accountPassword.currentPassword,
        password: accountPassword.password,
      })
    );
    setAccountPassword({
      currentPassword: '',
      password: '',
    });
    setShowModal(true);
  };

  useEffect(() => {
    if (!currentAccountInfo) {
      history.push('/login');
    } else {
      if (!account || !account.firstName) {
        dispatch(getAccount('profile'));
      } else {
        setAccountInfo(account);
      }
    }
    if (profileAccount) {
      setAccountInfo((prevData) => ({
        ...prevData,
        accountProfileUploaded: profileAccount.profilePicture,
      }));
    }

    if (updatedAccount) {
      setAccountInfo({
        isAdmin: false,
        email: updatedAccount.email,
        firstName: updatedAccount.firstName,
        lastName: updatedAccount.lastName,
        jobTitle: updatedAccount.jobTitle,
        departmentId: updatedAccount.departmentId,
        location: updatedAccount.location,
        contact: updatedAccount.contact,
        accountProfileUploaded: updatedAccount.accountProfileUploaded,
      });
    }
  }, [
    account,
    currentAccountInfo,
    dispatch,
    history,
    profileAccount,
    updatedAccount,
  ]);

  useEffect(() => {
    if (showModal) {
      setShowAlert(true);
    }
  }, [showModal]);

  console.log(error);

  return (
    <>
      <div className='bg-lightGrey w-full h-screen flex'>
        <div className='w-full h-full flex'>
          <div
            className={`w-full h-20 ${
              isToggleWidth ? 'ml-12%' : 'ml-4%'
            } order-2`}
          >
            <Topbar slideNav={true} title='Account Settings' />
            <div className='bg-white h-85.5vh m-8 flex'>
              <SidebarBlue
                slideNav={true}
                tabName={(isActiveTab) => setActiveTab(isActiveTab)}
              />
              <form
                className='form-container w-2/3 mt-12 relative order-1'
                onSubmit={handleSubmit(handleOnSubmit)}
              >
                <div
                  className={`bg-white w-10/12 ${
                    isActiveTab === 'account' || isActiveTab === undefined
                      ? 'block'
                      : 'hidden'
                  } absolute z-50`}
                >
                  <div>
                    <h1 className='text-lg font-bold mb-6'>
                      Profile
                      <p className='text-xs font-normal opacity-60'>
                        This information will to be displayed publicly.
                      </p>
                    </h1>
                    <div className='grid grid-flow-col grid-cols-2 gap-8 mb-6'>
                      <div className='flex flex-row items-center'>
                        <div
                          className='relative mr-6'
                          style={{ width: '90px' }}
                        >
                          <img
                            id='profile-preview'
                            src={
                              accountProfile
                                ? URL.createObjectURL(accountProfile)
                                : accountInfo.accountProfileUploaded
                                ? accountInfo.accountProfileUploaded
                                : defaultAccountProfile
                            }
                            alt='User Pic'
                            style={{
                              width: '90px',
                              height: '90px',
                              borderRadius: '50%',
                              border: '3px solid #f4f3f6',
                            }}
                          />
                          <input
                            accept='image/*'
                            id='profile-upload'
                            type='file'
                            name='accountProfile'
                            style={{ display: 'none' }}
                            onChange={handleOnchangeProfile}
                          />
                          <label
                            className='bg-lightGrey p-1 absolute -right-4 -bottom-4 border-4 border-white rounded-full cursor-pointer'
                            htmlFor='profile-upload'
                          >
                            <CameraIcon
                              className='w-5 h-5'
                              aria-hidden='true'
                            />
                          </label>
                        </div>
                        <div>
                          <h2 className='text-md font-bold'>
                            {`${accountInfo.firstName}
                              ${accountInfo.lastName}`}
                          </h2>

                          <p className='text-xs font-normal opacity-60'>
                            {accountInfo.jobTitle}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-flow-col grid-cols-2 gap-8'>
                      <div>
                        <label className='text-xs' htmlFor='firstName'>
                          First name
                        </label>
                        <div className='mt-1 relative'>
                          <InputElement
                            className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                              errors.firstName ? 'border-danger' : 'border'
                            } ${
                              error && error.firstName
                                ? 'border-danger'
                                : 'border'
                            } focus:border-primary outline-none shadow-outline`}
                            id='firstName'
                            name='firstName'
                            type='text'
                            placeholder='First name'
                            ref={register}
                            value={accountInfo.firstName}
                            onChange={handleOnChange}
                          />
                          <UserIcon
                            className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                            aria-hidden='true'
                          />
                          {errors.firstName && (
                            <ExclamationCircleIcon
                              className={`w-5 h-5 ${
                                errors.firstName
                                  ? 'text-danger'
                                  : 'text-correct'
                              } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                              aria-hidden='true'
                            />
                          )}
                          <p className='text-xxs text-danger mt-2 absolute'>
                            {errors.firstName?.message}
                            {error && error.firstName?.msg}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className='text-xs' htmlFor='lastName'>
                          Last name
                          <span className='text-xxs ml-1 opacity-60'>
                            (Optional)
                          </span>
                        </label>
                        <div className='mt-1 relative'>
                          <InputElement
                            className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                              errors.lastName ? 'border-danger' : 'border'
                            } ${
                              error && error.lastName
                                ? 'border-danger'
                                : 'border'
                            } focus:border-primary outline-none shadow-outline`}
                            id='lastName'
                            name='lastName'
                            type='text'
                            placeholder='Last name'
                            ref={register}
                            value={accountInfo.lastName}
                            onChange={handleOnChange}
                          />
                          <UserIcon
                            className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                            aria-hidden='true'
                          />
                          <p className='text-xxs text-danger mt-2 absolute'>
                            {errors.lastName?.message}
                            {error && error.lastName?.msg}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className='grid grid-flow-col grid-cols-2 gap-8'>
                      <div className='mt-6'>
                        <label className='text-xs' htmlFor='jobTitle'>
                          Job Title
                        </label>
                        <div className='mt-1 relative'>
                          <InputElement
                            className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                              errors.jobTitle ? 'border-danger' : 'border'
                            } focus:border-primary outline-none shadow-outline`}
                            id='jobTitle'
                            name='jobTitle'
                            type='text'
                            placeholder='Your job title'
                            ref={register}
                            value={accountInfo.jobTitle}
                            onChange={handleOnChange}
                          />
                          <IdentificationIcon
                            className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                            aria-hidden='true'
                          />
                          {errors.jobTitle && (
                            <ExclamationCircleIcon
                              className={`w-5 h-5 ${
                                errors.jobTitle ? 'text-danger' : 'text-correct'
                              } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                              aria-hidden='true'
                            />
                          )}
                          <p className='text-xxs text-danger mt-2 absolute'>
                            {errors.jobTitle?.message}
                          </p>
                        </div>
                      </div>
                      <div className='mt-6'>
                        <label className='text-xs' htmlFor='department'>
                          Department
                        </label>
                        <div className='w-full mt-1 relative'>
                          <div className='flex'>
                            <SearchDepartment
                              className='w-3/4'
                              errorClassName={`border ${
                                error && error.department
                                  ? 'border-danger'
                                  : 'border'
                              } focus:border-primary outline-none shadow-outline`}
                              placeholder='Your department'
                              selectedDepartmentId={(selectedDepartmentId) =>
                                setAccountInfo((prevState) => ({
                                  ...prevState,
                                  departmentId: selectedDepartmentId,
                                }))
                              }
                              returnDepartmentId={accountInfo.departmentId}
                            />
                            <OfficeBuildingIcon
                              className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                              style={{ zIndex: 60 }}
                              aria-hidden='true'
                            />
                            <div className='w-1/4 pl-4 flex items-stretch'>
                              <motion.div
                                className='w-full text-white text-xxs text-center font-bold py-2 flex items-center justify-center rounded-md cursor-pointer'
                                onClick={() => setIsModal(!isModal)}
                                whileHover='hover'
                                animate='initial'
                                variants={buttonLightBlueVariants}
                              >
                                Add department
                              </motion.div>
                            </div>
                          </div>
                          <p className='text-xxs text-danger mt-2 absolute'>
                            {error && error.department?.msg}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='mt-10'>
                    <h1 className='text-lg font-bold mb-6'>
                      Contact Information
                      <p className='text-xs font-normal opacity-60'>
                        This information will to be displayed publicly.
                      </p>
                    </h1>
                    <div className='grid grid-flow-col grid-cols-3 gap-8'>
                      <div>
                        <label className='text-xs' htmlFor='email'>
                          Email Address
                        </label>
                        <div className='mt-1 relative'>
                          <InputElement
                            className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                              errors.email ? 'border-danger' : 'border'
                            } ${
                              error && error.email ? 'border-danger' : 'border'
                            } focus:border-primary outline-none shadow-outline`}
                            id='email'
                            name='email'
                            type='text'
                            placeholder='Email'
                            ref={register}
                            value={accountInfo.email}
                            onChange={handleOnChange}
                          />
                          <MailIcon
                            className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                            aria-hidden='true'
                          />
                          <p className='text-xxs text-danger mt-2 absolute'>
                            {errors.email?.message}
                            {error && error.email?.msg}
                          </p>
                        </div>
                      </div>
                      <div>
                        <label className='text-xs' htmlFor='contact'>
                          Contact
                          <span className='text-xxs ml-1 opacity-60'>
                            (Optional)
                          </span>
                        </label>
                        <div className='mt-1 relative'>
                          <InputElement
                            className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                              errors.contact
                                ? 'focus:border-danger'
                                : 'focus:border-primary'
                            } focus:border-primary focus:outline-none focus:shadow-outline`}
                            id='contact'
                            name='contact'
                            type='text'
                            placeholder='Provide contact no.'
                            ref={register}
                            value={accountInfo.contact}
                            onChange={handleOnChange}
                          />
                          <PhoneIcon
                            className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                            aria-hidden='true'
                          />
                          {errors.contact !== undefined ? (
                            <>
                              <ExclamationCircleIcon
                                className={`w-5 h-5 ${
                                  errors.contact
                                    ? 'text-danger'
                                    : 'text-correct'
                                } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                                aria-hidden='true'
                              />
                              <p className='text-xxs text-danger mt-2'>
                                {errors.email?.message}
                              </p>
                            </>
                          ) : null}
                        </div>
                      </div>
                      <div>
                        <label className='text-xs' htmlFor='location'>
                          Location
                          <span className='text-xxs ml-1 opacity-60'>
                            (Optional)
                          </span>
                        </label>
                        <div className='mt-1 relative'>
                          <InputElement
                            className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                              errors.location
                                ? 'focus:border-danger'
                                : 'focus:border-primary'
                            } focus:border-primary focus:outline-none focus:shadow-outline`}
                            name='location'
                            type='text'
                            placeholder='Based in'
                            ref={register}
                            value={accountInfo.location}
                            onChange={handleOnChange}
                          />
                          <LocationMarkerIcon
                            className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                            aria-hidden='true'
                          />
                          {errors.location !== undefined ? (
                            <p className='text-xxs text-danger mt-2'>
                              {errors.location?.message}
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='pt-10 flex flex-row justify-end'>
                    <motion.button
                      type='reset'
                      className='bg-danger w-36 text-white tracking-wider font-bold mr-6 px-10 py-4 rounded-md'
                      whileHover='hover'
                      animate='initial'
                      variants={buttonRedVariants}
                    >
                      Clear
                    </motion.button>
                    <motion.button
                      type='submit'
                      className='bg-primary w-36 text-white tracking-wider font-bold px-10 py-4 rounded-md'
                      whileHover='hover'
                      animate='initial'
                      variants={buttonBlueVariants}
                    >
                      Save
                    </motion.button>
                  </div>
                </div>
                <div
                  className={`bg-white w-10/12 ${
                    isActiveTab === 'security' ? 'block' : 'hidden'
                  } absolute z-40`}
                >
                  <div>
                    <h1 className='text-lg font-bold mb-6'>
                      Security
                      <p className='text-xs font-normal opacity-60'>
                        This information will to be displayed publicly.
                      </p>
                    </h1>
                    <div className='grid grid-flow-col grid-cols-2 gap-8'>
                      <div className='pt-4'>
                        <label className='text-xs' htmlFor='currentPassword'>
                          Current Password
                        </label>
                        <div className='mt-1 relative'>
                          <InputElement
                            className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                              errors.password
                                ? 'focus:border-danger'
                                : 'focus:border-primary'
                            } focus:border-primary focus:outline-none focus:shadow-outline`}
                            id='currentPassword'
                            name='currentPassword'
                            type='password'
                            placeholder='Current Password'
                            ref={register}
                            value={accountPassword.currentPassword}
                            onChange={handleOnPasswordChange}
                          />
                          <LockClosedIcon
                            className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                            aria-hidden='true'
                          />
                          <p className='text-xxs text-danger mt-2 absolute'>
                            {errors.currentPassword?.message}
                            {errorPassword && errorPassword?.msg}
                          </p>
                        </div>
                      </div>
                      <div className='pt-4'>
                        <label className='text-xs' htmlFor='password'>
                          New Password
                        </label>
                        <div className='mt-1 relative'>
                          <InputElement
                            className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                              errors.password
                                ? 'focus:border-danger'
                                : 'focus:border-primary'
                            } focus:border-primary focus:outline-none focus:shadow-outline`}
                            id='password'
                            name='password'
                            type='password'
                            placeholder='New Password'
                            ref={register}
                            value={accountPassword.password}
                            onChange={handleOnPasswordChange}
                          />
                          <LockClosedIcon
                            className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                            aria-hidden='true'
                          />
                          <p className='text-xxs text-danger mt-2 absolute'>
                            {errors.password?.message}
                            {errorPassword?.password &&
                              errorPassword?.password.msg}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='pt-10 flex flex-row justify-end'>
                    <motion.button
                      type='button'
                      className='bg-primary text-white text-sm tracking-wider font-bold px-6 py-4 rounded-md'
                      onClick={handleOnChangePassword}
                      whileHover='hover'
                      animate='initial'
                      variants={buttonBlueVariants}
                    >
                      Change Password
                    </motion.button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <Sidebar
            isSlideNav={false}
            isToggleWidth={(isToggleWidth) => setToggleWidth(isToggleWidth)}
          />
        </div>
      </div>

      {showAlert &&
        (updatedAccount ? (
          <SuccessConfirmation
            type='account'
            title='Account update successful'
            message={updatedAccount?.msg}
            showModal={(showModal) => setShowModal(showModal)}
          />
        ) : updatedPassword ? (
          <SuccessConfirmation
            type='account'
            title='Password update successful'
            message={updatedPassword?.msg}
            showModal={(showModal) => setShowModal(showModal)}
          />
        ) : null)}
      {isModal && (
        <CreateDepartment
          isModal={(isModal) => setIsModal(isModal)}
          showDeptModal={(showDeptModal) => setShowDeptModal(showDeptModal)}
          currentAccount={accountInfo}
        />
      )}
    </>
  );
};

export default AccountSettingPage;
