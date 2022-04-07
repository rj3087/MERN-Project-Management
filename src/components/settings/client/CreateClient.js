import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  UserIcon,
  MailIcon,
  PhoneIcon,
  XIcon,
  LocationMarkerIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/outline';
import { uploadAccountProfile } from '../../../redux/actions/accountActions';
import { registerClient } from '../../../redux/actions/utilitiesActions';
import InputElement from '../../ui/InputElement';
import SuccessConfirmation from '../../notifications/SuccessConfirmation';

const schema = yup.object().shape({
  clientName: yup
    .string()
    .min(6, 'Name must be at least 8 characters.')
    .required('Please enter client name'),
  clientEmail: yup
    .string()
    .email('Please enter valid Email Address')
    .required('Please enter your email address'),
  clientContact: yup
    .string()
    .min(10, 'Contact must be at least 10 characters.')
    .required('Please enter your contact no.'),
  clientLocation: yup
    .string()
    .min(12, 'Location must be at least 12 characters.')
    .required('Please enter your location'),
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

var defaultAccountProfile =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNTMgNTMiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUzIDUzOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI+DQo8cGF0aCBzdHlsZT0iZmlsbDojRTdFQ0VEOyIgZD0iTTE4LjYxMyw0MS41NTJsLTcuOTA3LDQuMzEzYy0wLjQ2NCwwLjI1My0wLjg4MSwwLjU2NC0xLjI2OSwwLjkwM0MxNC4wNDcsNTAuNjU1LDE5Ljk5OCw1MywyNi41LDUzDQoJYzYuNDU0LDAsMTIuMzY3LTIuMzEsMTYuOTY0LTYuMTQ0Yy0wLjQyNC0wLjM1OC0wLjg4NC0wLjY4LTEuMzk0LTAuOTM0bC04LjQ2Ny00LjIzM2MtMS4wOTQtMC41NDctMS43ODUtMS42NjUtMS43ODUtMi44ODh2LTMuMzIyDQoJYzAuMjM4LTAuMjcxLDAuNTEtMC42MTksMC44MDEtMS4wM2MxLjE1NC0xLjYzLDIuMDI3LTMuNDIzLDIuNjMyLTUuMzA0YzEuMDg2LTAuMzM1LDEuODg2LTEuMzM4LDEuODg2LTIuNTN2LTMuNTQ2DQoJYzAtMC43OC0wLjM0Ny0xLjQ3Ny0wLjg4Ni0xLjk2NXYtNS4xMjZjMCwwLDEuMDUzLTcuOTc3LTkuNzUtNy45NzdzLTkuNzUsNy45NzctOS43NSw3Ljk3N3Y1LjEyNg0KCWMtMC41NCwwLjQ4OC0wLjg4NiwxLjE4NS0wLjg4NiwxLjk2NXYzLjU0NmMwLDAuOTM0LDAuNDkxLDEuNzU2LDEuMjI2LDIuMjMxYzAuODg2LDMuODU3LDMuMjA2LDYuNjMzLDMuMjA2LDYuNjMzdjMuMjQNCglDMjAuMjk2LDM5Ljg5OSwxOS42NSw0MC45ODYsMTguNjEzLDQxLjU1MnoiLz4NCjxnPg0KCTxwYXRoIHN0eWxlPSJmaWxsOiM1NTYwODA7IiBkPSJNMjYuOTUzLDAuMDA0QzEyLjMyLTAuMjQ2LDAuMjU0LDExLjQxNCwwLjAwNCwyNi4wNDdDLTAuMTM4LDM0LjM0NCwzLjU2LDQxLjgwMSw5LjQ0OCw0Ni43Ng0KCQljMC4zODUtMC4zMzYsMC43OTgtMC42NDQsMS4yNTctMC44OTRsNy45MDctNC4zMTNjMS4wMzctMC41NjYsMS42ODMtMS42NTMsMS42ODMtMi44MzV2LTMuMjRjMCwwLTIuMzIxLTIuNzc2LTMuMjA2LTYuNjMzDQoJCWMtMC43MzQtMC40NzUtMS4yMjYtMS4yOTYtMS4yMjYtMi4yMzF2LTMuNTQ2YzAtMC43OCwwLjM0Ny0xLjQ3NywwLjg4Ni0xLjk2NXYtNS4xMjZjMCwwLTEuMDUzLTcuOTc3LDkuNzUtNy45NzcNCgkJczkuNzUsNy45NzcsOS43NSw3Ljk3N3Y1LjEyNmMwLjU0LDAuNDg4LDAuODg2LDEuMTg1LDAuODg2LDEuOTY1djMuNTQ2YzAsMS4xOTItMC44LDIuMTk1LTEuODg2LDIuNTMNCgkJYy0wLjYwNSwxLjg4MS0xLjQ3OCwzLjY3NC0yLjYzMiw1LjMwNGMtMC4yOTEsMC40MTEtMC41NjMsMC43NTktMC44MDEsMS4wM1YzOC44YzAsMS4yMjMsMC42OTEsMi4zNDIsMS43ODUsMi44ODhsOC40NjcsNC4yMzMNCgkJYzAuNTA4LDAuMjU0LDAuOTY3LDAuNTc1LDEuMzksMC45MzJjNS43MS00Ljc2Miw5LjM5OS0xMS44ODIsOS41MzYtMTkuOUM1My4yNDYsMTIuMzIsNDEuNTg3LDAuMjU0LDI2Ljk1MywwLjAwNHoiLz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K';

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

const CreateClient = ({ isModal, showModalClient }) => {
  const [clientInfo, setClientInfo] = useState({
    clientName: '',
    clientEmail: '',
    clientContact: '',
    clientLocation: '',
    accountProfileUploaded: '',
  });
  const [accountProfile, setAccountProfile] = useState();
  const [showModal, setShowModal] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const { register, errors, handleSubmit } = useForm({
    resolver: yupResolver(schema),
    mode: 'all',
  });

  const dispatch = useDispatch();

  const accountUploadProfile = useSelector(
    (state) => state.accountUploadProfile
  );
  const { profileAccount } = accountUploadProfile;

  const clientRegister = useSelector((state) => state.clientRegister);
  const { client, error } = clientRegister;

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setClientInfo((data) => ({ ...data, [name]: value }));
  };

  const handleOnchangeProfile = (e) => {
    if (
      e.target.files[0].type !== 'image/jpeg' &&
      e.target.files[0].type !== 'image/png'
    ) {
      console.log('wrong format');
    }
    setAccountProfile(e.target.files[0]);
    const formData = new FormData();
    formData.append(e.target.name, e.target.files[0]);
    dispatch(uploadAccountProfile(formData));
  };

  const handleOnSubmit = () => {
    dispatch(registerClient(clientInfo));
    setShowModal(true);
  };

  useEffect(() => {
    if (showModal) {
      setShowAlert(true);
    }
    if (profileAccount) {
      setClientInfo((prevData) => ({
        ...prevData,
        accountProfileUploaded: profileAccount.profilePicture,
      }));
    }
  }, [showModal, profileAccount]);

  return (
    <AnimatePresence>
      {isModal && (
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
              <div className='w-full'>
                <div className='relative'>
                  <h4 className='text-grey text-lg font-bold tracking-wider'>
                    Create a client
                    <p className='w-3/4 text-xxs font-normal leading-4 mt-1 opacity-60'>
                      Create new client for your project, if you are creating a
                      project for an existing client, please skip this step.
                    </p>
                  </h4>
                  <XIcon
                    className='w-5 h-5 absolute top-0 right-0 opacity-40 cursor-pointer'
                    aria-hidden='true'
                    onClick={() => isModal(false)}
                  />
                </div>
                <div className='pt-6'>
                  <div className='grid grid-flow-col grid-cols-2 gap-8'>
                    <div>
                      <label className='text-xs' htmlFor='clientName'>
                        Name
                      </label>
                      <div className='mt-1 relative'>
                        <InputElement
                          className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                            errors.clientName ? 'border-danger' : 'border'
                          } ${
                            error && error.clientName
                              ? 'border-danger'
                              : 'border'
                          } focus:border-primary outline-none shadow-outline`}
                          id='clientName'
                          name='clientName'
                          type='text'
                          placeholder='Name'
                          ref={register}
                          value={setClientInfo.clientName}
                          onChange={handleOnChange}
                        />
                        <UserIcon
                          className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                          aria-hidden='true'
                        />
                        {errors.clientName ? (
                          <ExclamationCircleIcon
                            className={`w-5 h-5 ${
                              errors.clientName ? 'text-danger' : 'text-correct'
                            } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                            aria-hidden='true'
                          />
                        ) : error?.clientName ? (
                          <ExclamationCircleIcon
                            className={`w-5 h-5 ${
                              error?.clientName ? 'text-danger' : 'text-correct'
                            } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                            aria-hidden='true'
                          />
                        ) : null}
                        <p className='text-xxs text-danger mt-2 absolute'>
                          {errors.clientName?.message}
                          {error && error.clientName?.msg}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className='text-xs' htmlFor='clientEmail'>
                        Email address
                      </label>
                      <div className='mt-1 relative'>
                        <InputElement
                          className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                            errors.clientEmail ? 'border-danger' : 'border'
                          } ${
                            error && error.clientEmail
                              ? 'border-danger'
                              : 'border'
                          } focus:border-primary outline-none shadow-outline`}
                          id='clientEmail'
                          name='clientEmail'
                          type='text'
                          placeholder='Email'
                          ref={register}
                          value={setClientInfo.clientEmail}
                          onChange={handleOnChange}
                        />
                        <MailIcon
                          className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                          aria-hidden='true'
                        />
                        {errors.clientEmail ? (
                          <ExclamationCircleIcon
                            className={`w-5 h-5 ${
                              errors.clientEmail
                                ? 'text-danger'
                                : 'text-correct'
                            } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                            aria-hidden='true'
                          />
                        ) : error?.clientEmail ? (
                          <ExclamationCircleIcon
                            className={`w-5 h-5 ${
                              error?.clientEmail
                                ? 'text-danger'
                                : 'text-correct'
                            } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                            aria-hidden='true'
                          />
                        ) : null}
                        <p className='text-xxs text-danger mt-2 absolute'>
                          {errors.clientEmail?.message}
                          {error && error.clientEmail?.msg}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-6'>
                  <div className='grid grid-flow-col grid-cols-2 gap-8'>
                    <div>
                      <label className='text-xs' htmlFor='clientContact'>
                        Contact no.
                      </label>
                      <div className='mt-1 relative'>
                        <InputElement
                          className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                            errors.clientContact ? 'border-danger' : 'border'
                          } ${
                            error && error.clientContact
                              ? 'border-danger'
                              : 'border'
                          } focus:border-primary outline-none shadow-outline`}
                          id='clientContact'
                          name='clientContact'
                          type='text'
                          placeholder='Provide contact no.'
                          ref={register}
                          value={setClientInfo.clientContact}
                          onChange={handleOnChange}
                        />
                        <PhoneIcon
                          className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                          aria-hidden='true'
                        />
                        {errors.clientContact ? (
                          <ExclamationCircleIcon
                            className={`w-5 h-5 ${
                              errors.clientContact
                                ? 'text-danger'
                                : 'text-correct'
                            } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                            aria-hidden='true'
                          />
                        ) : error?.clientContact ? (
                          <ExclamationCircleIcon
                            className={`w-5 h-5 ${
                              error?.clientContact
                                ? 'text-danger'
                                : 'text-correct'
                            } mt-0.88rem ml-3 mr-3 absolute top-0 right-0`}
                            aria-hidden='true'
                          />
                        ) : null}
                        <p className='text-xxs text-danger mt-2 absolute'>
                          {errors.clientContact?.message}
                          {error && error.clientContact?.msg}
                        </p>
                      </div>
                    </div>
                    <div>
                      <label className='text-xs' htmlFor='clientLocation'>
                        Location
                      </label>
                      <div className='mt-1 relative'>
                        <InputElement
                          className={`w-full px-10 py-4 text-xs leading-tight border rounded-md appearance-none ${
                            errors.clientLocation
                              ? 'focus:border-danger'
                              : 'focus:border-primary'
                          } focus:border-primary focus:outline-none focus:shadow-outline`}
                          name='clientLocation'
                          type='text'
                          placeholder='Based in'
                          ref={register}
                          value={setClientInfo.clientLocation}
                          onChange={handleOnChange}
                        />
                        <LocationMarkerIcon
                          className='w-5 h-5 mt-0.88rem ml-3 absolute top-0 opacity-30'
                          aria-hidden='true'
                        />
                        {errors.clientLocation !== undefined ? (
                          <p className='text-xxs text-danger mt-2'>
                            {errors.clientLocation?.message}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-6'>
                  <div className='flex flex-col'>
                    <div>
                      <label className='text-xs' htmlFor='clientContact'>
                        Profile picture
                      </label>
                    </div>
                    <div className='mt-1 w-1/4'>
                      <div className='flex flex-row items-center'>
                        <img
                          id='profile-preview'
                          src={
                            accountProfile
                              ? URL.createObjectURL(accountProfile)
                              : clientInfo.accountProfileUploaded
                              ? clientInfo.accountProfileUploaded
                              : defaultAccountProfile
                          }
                          alt='Client profile pic'
                          style={{
                            width: '64px',
                            height: '64px',
                            borderRadius: '50%',
                            border: '3px solid #ebe7f2',
                          }}
                        />
                        <div className='ml-6'>
                          <input
                            accept='image/*'
                            id='profile-upload'
                            type='file'
                            name='accountProfile'
                            style={{ display: 'none' }}
                            onChange={handleOnchangeProfile}
                          />
                          <label
                            className='bg-primary bg-opacity-10 text-dark text-xs font-bold py-2 px-6 rounded-md cursor-pointer'
                            htmlFor='profile-upload'
                          >
                            {profileAccount ? 'Change' : 'Upload'}
                          </label>
                          <label
                            className='bg-danger bg-opacity-10 text-danger text-xs font-bold ml-4 py-2 px-6 rounded-md cursor-pointer'
                            onClick={() => setAccountProfile('')}
                          >
                            Remove
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='pt-10 flex flex-row justify-end'>
                  <motion.button
                    type='submit'
                    className='bg-primary text-white text-xs text-white font-bold tracking-wider py-4 px-8 rounded-md'
                    whileHover='hover'
                    animate='initial'
                    variants={buttonBlueVariants}
                  >
                    Create client
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      {showAlert &&
        (client ? (
          <SuccessConfirmation
            type='password'
            title='Client registration success'
            message={client?.msg}
            showModal={(showModal) => setShowModal(showModal)}
          />
        ) : null)}
    </AnimatePresence>
  );
};

export default CreateClient;
