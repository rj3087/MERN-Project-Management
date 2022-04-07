import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import moment from 'moment';

import {
  XIcon,
  UploadIcon,
  CheckIcon,
  TrashIcon,
} from '@heroicons/react/outline';

import { motion } from 'framer-motion';
import pdfIcon from '../assets/PDF-icon-img.png';
import htmlIcon from '../assets/HTML-icon-img.png';
import txtIcon from '../assets/TXT-icon-img.png';
import {
  uploadTaskAttachments,
  deleteTaskAttachment,
  deleteTaskAttachmentFile,
} from '../redux/actions/taskActions';
import AlertConfirmation from './notifications/AlertConfirmation';

const heightMotion = {
  visible: { height: '186px', padding: '2rem', opacity: 1 },
  hidden: { height: '0', padding: 0, opacity: 0.4 },
};

const UploadAttachements = ({
  taskId,
  attachments,
  uploadedAttachments,
  showDropContainer,
  viewType,
}) => {
  const [files, setFiles] = useState([]);
  const [updatedFiles, setUpdatedFiles] = useState([]);
  const [imgPreviewData, setImgPreviewData] = useState();
  const [itemName, setItemName] = useState();
  const [removeItem, setRemoveItem] = useState();
  const [showAlert, setShowAlert] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [alertAction, setAlertAction] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(false);

  const dispatch = useDispatch();
  const taskUploadAttachments = useSelector(
    (state) => state.taskUploadAttachments
  );
  const { uploadAttachments } = taskUploadAttachments;

  const { getRootProps, getInputProps, open, acceptedFiles } = useDropzone({
    noClick: true,
    noKeyboard: true,
    onDrop: (acceptedFiles) => {
      setUpdatedFiles(
        acceptedFiles.map((file) =>
          file.type === 'image/jpeg' ||
          file.type === 'image/jpeg' ||
          file.type === 'image/png' ||
          file.type === 'image/gif'
            ? Object.assign(file, {
                fileThumbnail: URL.createObjectURL(file),
              })
            : file
        )
      );
      acceptedFiles.map((file) =>
        file.type === 'image/jpeg' ||
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/gif'
          ? setFiles((prevData) => [
              ...prevData,
              {
                fileThumbnail: URL.createObjectURL(file),
                name: file.name,
                size: file.size,
                uploadDate: moment(file.lastModifiedDate).format(),
                status: false,
              },
            ])
          : file
      );
    },
  });

  const handleFileToBytes = (bytes) => {
    const units = ['bytes', 'KB', 'MB'];
    let l = 0,
      n = parseInt(bytes, 10) || 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }

    return n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l];
  };

  const handleRemoveItem = (e) => {
    if (e.status === true) {
      setShowAlert(true);
      setItemName(e.name);
      setRemoveItem(e);
    } else {
      setFiles(files.filter((item) => item !== e));
    }
  };

  const handleUpload = () => {
    const formData = new FormData();
    for (let i = 0; i < updatedFiles.length; i++) {
      formData.append('uploadAttachments', updatedFiles[i]);
    }
    dispatch(uploadTaskAttachments(formData));
  };

  const handleOnPreview = (e) => {
    setImgPreviewData({
      imgSrc: e.currentTarget.src,
      imgName: e.currentTarget.alt,
      imgDateTime: e.currentTarget.getAttribute('imgdatetime'),
      imgFilesize: e.currentTarget.getAttribute('imgfilesize'),
    });
  };

  const handleOnRemovePreview = () => {
    setImgPreviewData({});
  };

  useEffect(() => {
    if (attachments && files.length === 0) {
      setFiles(attachments);
    }

    if (attachments) {
      setFiles(attachments);
    }

    if (uploadAttachments && uploadAttachments.length >= 1) {
      uploadedAttachments(uploadAttachments);
      setFiles(files.map((data) => ({ ...data, status: true })));
    }
  }, [attachments, uploadStatus, uploadAttachments]);

  useEffect(() => {
    if (alertAction) {
      setFiles([files.filter((item) => item !== removeItem)][0]);
      dispatch(deleteTaskAttachment('attachments', removeItem.name));
      dispatch(deleteTaskAttachmentFile(taskId, removeItem.name));
      setShowAlert(false);
      setAlertAction(false);
    }
  }, [alertAction]);

  return (
    <>
      {showDropContainer && (
        <motion.div
          className='p-8 border border-dashed rounded-md overflow-hidden'
          variants={heightMotion}
          transition={{
            delay: 0.2,
            duration: 0.4,
            type: 'spring',
            stiffness: 60,
            ease: 'easeInOut',
          }}
        >
          <div {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            <UploadIcon
              className='w-7 h-7 mx-auto mb-4 opacity-40 cursor-pointer'
              aria-hidden='true'
            />
            <p className='text-xs text-center font-semibold opacity-40'>
              Drop files to upload or click
            </p>
            <div className='w-1/4 bg-primary bg-opacity-90 text-white text-center mt-5 mx-auto py-2 rounded-md hover:bg-dark shadow-lg'>
              <button
                className='font-bold text-xs'
                type='button'
                onClick={() => {
                  open();
                  setUploadStatus(false);
                }}
              >
                CHOOSE FILE
              </button>
            </div>
          </div>
        </motion.div>
      )}
      <>
        {files[0] && (
          <ul
            className={`${
              !files[0]?.status && files.length >= 2
                ? 'h-28vh pr-4 overflow-y-auto'
                : files[0].status === true && !files[0]._id && files.length >= 2
                ? 'h-28vh mt-8 pr-4 overflow-y-auto'
                : files[0].status === true && !files[0]._id && files.length <= 1
                ? 'pr-4 overflow-y-auto'
                : 'h-auto'
            }`}
          >
            {files &&
              files.map((file, index) =>
                file.status === false ? (
                  <li key={index} className='mt-6'>
                    {file.fileThumbnail ? (
                      <>
                        {file && (
                          <div className='flex items-center pb-6 border-b relative'>
                            <img
                              className='cursor-pointer'
                              src={file.fileThumbnail}
                              alt={file.name}
                              imgdatetime={file.uploadDate}
                              style={{
                                width: '122px',
                                height: 'auto',
                                borderRadius: '0.5rem',
                              }}
                              onClick={(e) => handleOnPreview(e)}
                            />

                            {file && (
                              <div className='ml-4' style={{ width: '62%' }}>
                                <p className='w-3/4 text-xs font-bold uppercase break-all mb-2'>
                                  {file.name}
                                </p>
                                <p className='text-xs opacity-40'>
                                  {`${moment(file.uploadedDate).format(
                                    'LL'
                                  )} at 
                  ${moment(file.uploadedDate).format('LT')}`}
                                </p>
                              </div>
                            )}

                            {!file.status ? (
                              <TrashIcon
                                className='w-5 h-5 text-danger ml-auto mr-4 cursor-pointer transition duration-400 ease-in-out'
                                aria-hidden='true'
                                onClick={() => handleRemoveItem(file)}
                              />
                            ) : null}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {files && (
                          <div className='flex items-center pb-4 border-b'>
                            {file && file.type === 'application/pdf' ? (
                              <img
                                src={pdfIcon}
                                alt='PDF Icon'
                                style={{ width: '42px', height: 'auto' }}
                              />
                            ) : file.type === 'text/html' ? (
                              <img
                                src={htmlIcon}
                                alt='PDF Icon'
                                style={{ width: '42px', height: 'auto' }}
                              />
                            ) : file.type === 'text/plain' ? (
                              <img
                                src={txtIcon}
                                alt='PDF Icon'
                                style={{ width: '42px', height: 'auto' }}
                              />
                            ) : (
                              ''
                            )}
                            {file && (
                              <div className='ml-4' style={{ width: '62%' }}>
                                <p className='text-xs font-bold'>{file.path}</p>
                                <p className='text-xxs font-bold opacity-40'>
                                  {`${moment(new Date()).format('ll')} at 
                  ${moment(new Date()).format('LT')}`}
                                  - {handleFileToBytes(file.size)}
                                </p>
                              </div>
                            )}
                            {uploadAttachments && uploadStatus ? (
                              <UploadIcon
                                className='w-5 h-5 text-check ml-auto mr-4'
                                aria-hidden='true'
                              />
                            ) : (
                              <TrashIcon
                                className='w-5 h-5 ml-auto mr-4 cursor-pointer transition duration-400 ease-in-out hover:text-danger'
                                aria-hidden='true'
                                onClick={() => handleRemoveItem(file)}
                              />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </li>
                ) : file.status === true && !file._id ? (
                  <li key={index} className='mt-6'>
                    {file.fileThumbnail ? (
                      <>
                        {file && (
                          <div className='flex items-center pb-6 border-b relative'>
                            <img
                              className='cursor-pointer'
                              src={file.fileThumbnail}
                              alt={file.name}
                              imgdatetime={file.lastModifiedDate}
                              imgfilesize={file.size}
                              style={{
                                width: '122px',
                                height: 'auto',
                                borderRadius: '0.5rem',
                              }}
                              onClick={(e) => handleOnPreview(e)}
                            />

                            {file && (
                              <div className='ml-4' style={{ width: '62%' }}>
                                <p className='w-3/4 text-xs font-bold uppercase break-all mb-2'>
                                  {file.name}
                                </p>
                                <p className='text-xs opacity-40'>
                                  {`${moment(file.uploadedDate).format(
                                    'LL'
                                  )} at 
                  ${moment(file.uploadedDate).format('LT')}`}
                                </p>
                              </div>
                            )}

                            {!file.status ? (
                              <UploadIcon
                                className='w-6 h-6 text-danger ml-auto mr-4'
                                aria-hidden='true'
                              />
                            ) : file.status === true && !file._id ? (
                              <>
                                <div
                                  className='absolute rounded-full shadow-xl'
                                  style={{
                                    backgroundColor: '#d2fadb',
                                    top: '-0.5rem',
                                    left: '6.4rem',
                                  }}
                                >
                                  <CheckIcon
                                    className='w-5 h-5 text-check m-1'
                                    aria-hidden='true'
                                  />
                                </div>
                                <TrashIcon
                                  className='w-5 h-5 text-danger ml-auto cursor-pointer transition duration-400 ease-in-out'
                                  aria-hidden='true'
                                  onClick={() => handleRemoveItem(file)}
                                />
                              </>
                            ) : null}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {files && (
                          <div className='flex items-center pb-4 border-b'>
                            {file && file.type === 'application/pdf' ? (
                              <img
                                src={pdfIcon}
                                alt='PDF Icon'
                                style={{ width: '42px', height: 'auto' }}
                              />
                            ) : file.type === 'text/html' ? (
                              <img
                                src={htmlIcon}
                                alt='PDF Icon'
                                style={{ width: '42px', height: 'auto' }}
                              />
                            ) : file.type === 'text/plain' ? (
                              <img
                                src={txtIcon}
                                alt='PDF Icon'
                                style={{ width: '42px', height: 'auto' }}
                              />
                            ) : (
                              ''
                            )}
                            {file && (
                              <div className='ml-4' style={{ width: '62%' }}>
                                <p className='text-xs font-bold'>{file.path}</p>
                                <p className='text-xxs font-bold opacity-40'>
                                  {`${moment(new Date()).format('ll')} at 
                  ${moment(new Date()).format('LT')}`}
                                  &nbsp;-&nbsp;{handleFileToBytes(file.size)}
                                </p>
                              </div>
                            )}
                            {uploadAttachments && uploadStatus ? (
                              <UploadIcon
                                className='w-5 h-5 text-check ml-auto mr-4'
                                aria-hidden='true'
                              />
                            ) : (
                              <TrashIcon
                                className='w-5 h-5 text-danger ml-auto mr-4 cursor-pointer transition duration-400 ease-in-out'
                                aria-hidden='true'
                                onClick={() => handleRemoveItem(file)}
                              />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </li>
                ) : null
              )}
          </ul>
        )}
      </>
      {files.find((image) => !image._id) && showDropContainer ? (
        <div className='w-1/6 my-8 ml-auto'>
          <button
            type='button'
            className='bg-primary w-full text-xs text-white font-bold tracking-wider px-2 py-3 rounded-md shadow-lg hover:bg-dark'
            onClick={handleUpload}
          >
            Upload files
          </button>
        </div>
      ) : null}
      <>
        {viewType === 'Tiles' ? (
          <ul className='pt-2 grid grid-cols-3 gap-8'>
            {files &&
              files.map((file, index) =>
                file._id && file.status === true ? (
                  <li key={index} className='p-4 border rounded-md'>
                    {file.fileThumbnail ? (
                      <>
                        {file && (
                          <div className='flex items-center relative'>
                            <img
                              className='cursor-pointer'
                              src={file.fileThumbnail}
                              alt={file.name}
                              imgdatetime={file.uploadDate}
                              imgfilesize={file.size}
                              style={{
                                width: 'auto',
                                height: '72px',
                                borderRadius: '0.5rem',
                              }}
                              onClick={(e) => handleOnPreview(e)}
                            />
                            {file && (
                              <div className='ml-4' style={{ width: '62%' }}>
                                <p className='w-3/4 text-xs font-bold uppercase break-all mb-2'>
                                  {file.name}
                                </p>
                                <p className='text-xxs opacity-40'>
                                  {`${moment(file.uploadDate).format('LL')} at 
                  ${moment(file.uploadDate).format('LT')}`}
                                  &nbsp;-&nbsp;{handleFileToBytes(file.size)}
                                </p>
                              </div>
                            )}

                            {!file.status ? (
                              <UploadIcon
                                className='w-6 h-6 text-danger ml-auto mr-4'
                                aria-hidden='true'
                              />
                            ) : file.status === true && file._id ? (
                              <TrashIcon
                                className='w-5 h-5 text-danger ml-auto mr-4 cursor-pointer transition duration-400 ease-in-out'
                                aria-hidden='true'
                                onClick={() => handleRemoveItem(file)}
                              />
                            ) : null}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {files && (
                          <div className='flex items-center pb-4 border-b'>
                            {file && file.type === 'application/pdf' ? (
                              <img
                                src={pdfIcon}
                                alt='PDF Icon'
                                style={{ width: '42px', height: 'auto' }}
                              />
                            ) : file.type === 'text/html' ? (
                              <img
                                src={htmlIcon}
                                alt='PDF Icon'
                                style={{ width: '42px', height: 'auto' }}
                              />
                            ) : file.type === 'text/plain' ? (
                              <img
                                src={txtIcon}
                                alt='PDF Icon'
                                style={{ width: '42px', height: 'auto' }}
                              />
                            ) : (
                              ''
                            )}
                            {file && (
                              <div className='ml-4' style={{ width: '62%' }}>
                                <p className='text-xs font-bold'>{file.path}</p>
                                <p className='text-xxs font-bold opacity-40'>
                                  {`${moment(new Date()).format('ll')} at 
                  ${moment(new Date()).format('LT')}`}
                                  - {handleFileToBytes(file.size)}
                                </p>
                              </div>
                            )}
                            {uploadAttachments && uploadStatus ? (
                              <UploadIcon
                                className='w-5 h-5 text-check ml-auto mr-4'
                                aria-hidden='true'
                              />
                            ) : (
                              <TrashIcon
                                className='w-5 h-5 ml-auto mr-4 opacity-50 cursor-pointer transition duration-400 ease-in-out hover:text-primary'
                                aria-hidden='true'
                                onClick={() => handleRemoveItem(file)}
                              />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </li>
                ) : null
              )}
          </ul>
        ) : viewType === 'Row' ? (
          <ul
            className={`${
              files.length >= 2 && files[0].status === true && files[0]._id
                ? 'h-28vh pr-4 overflow-y-auto'
                : 'h-auto hidden'
            }`}
          >
            {files &&
              files.map((file, index) =>
                file._id && file.status === true ? (
                  <li key={index} className='mb-6 p-4 border rounded-md'>
                    {file.fileThumbnail ? (
                      <>
                        {file && (
                          <div className='flex items-center relative'>
                            <img
                              className='cursor-pointer'
                              src={file.fileThumbnail}
                              alt={file.name}
                              imgdatetime={file.uploadDate}
                              imgfilesize={file.size}
                              style={{
                                width: '122px',
                                height: 'auto',
                                borderRadius: '0.5rem',
                              }}
                              onClick={(e) => handleOnPreview(e)}
                            />
                            {file && (
                              <div className='ml-4' style={{ width: '62%' }}>
                                <p
                                  className='w-3/4 text-xs font-bold break-all mb-2'
                                  style={{ lineHeight: '12px' }}
                                >
                                  {file.name}
                                </p>
                                <p className='text-xs opacity-40'>
                                  {`${moment(file.uploadDate).format('LL')} at 
                  ${moment(file.uploadDate).format('LT')}`}
                                  &nbsp;-&nbsp;{handleFileToBytes(file.size)}
                                </p>
                              </div>
                            )}

                            {!file.status ? (
                              <UploadIcon
                                className='w-6 h-6 text-danger ml-auto mr-4'
                                aria-hidden='true'
                              />
                            ) : file.status === true && file._id ? (
                              <TrashIcon
                                className='w-5 h-5 ml-auto mr-4 cursor-pointer transition duration-400 ease-in-out hover:text-danger'
                                aria-hidden='true'
                                onClick={() => handleRemoveItem(file)}
                              />
                            ) : null}
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        {files && (
                          <div className='flex items-center pb-4 border-b'>
                            {file && file.type === 'application/pdf' ? (
                              <img
                                src={pdfIcon}
                                alt='PDF Icon'
                                style={{ width: '42px', height: 'auto' }}
                              />
                            ) : file.type === 'text/html' ? (
                              <img
                                src={htmlIcon}
                                alt='PDF Icon'
                                style={{ width: '42px', height: 'auto' }}
                              />
                            ) : file.type === 'text/plain' ? (
                              <img
                                src={txtIcon}
                                alt='PDF Icon'
                                style={{ width: '42px', height: 'auto' }}
                              />
                            ) : (
                              ''
                            )}

                            {file && (
                              <div className='ml-4' style={{ width: '62%' }}>
                                <p className='text-xs font-bold'>{file.path}</p>
                                <p className='text-xxs font-bold opacity-40'>
                                  {`${moment(new Date()).format('ll')} at 
                  ${moment(new Date()).format('LT')}`}
                                  - {handleFileToBytes(file.size)}
                                </p>
                              </div>
                            )}

                            {uploadAttachments && uploadStatus ? (
                              <UploadIcon
                                className='w-5 h5 text-check ml-auto mr-4'
                                aria-hidden='true'
                              />
                            ) : (
                              <TrashIcon
                                className='w-4 h-4 ml-auto mr-4 opacity-50 cursor-pointer transition duration-400 ease-in-out hover:text-primary'
                                aria-hidden='true'
                                onClick={() => handleRemoveItem(file)}
                              />
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </li>
                ) : null
              )}
          </ul>
        ) : null}
      </>
      {imgPreviewData?.imgSrc && (
        <div className='bg-black fixed top-0 bottom-0 left-0 right-0 z-50 bg-opacity-80'>
          <div className='w-full h-full flex flex-col justify-center'>
            <div className='mt-6 mr-6 p-1 absolute top-0 right-0 rounded-md hover:bg-white hover:bg-opacity-10'>
              <XIcon
                className='text-white w-6 h-6 cursor-pointer'
                aria-hidden='true'
                onClick={handleOnRemovePreview}
              />
            </div>
            <h4 className='text-white text-xl text-center font-bold uppercase mb-2'>
              {imgPreviewData.imgName}
            </h4>
            <p className='text-white text-center text-md mb-8 opacity-50'>
              {`${moment(imgPreviewData.imgDateTime).format('LL')} - ${moment(
                imgPreviewData.imgDateTime
              ).format('LT')} - ${handleFileToBytes(
                imgPreviewData.imgFilesize
              )}`}
            </p>
            <img
              className='mx-auto'
              src={imgPreviewData.imgSrc}
              alt='preview'
              style={{
                width: '620px',
                height: 'auto',
                borderRadius: '0.5rem',
              }}
            />
          </div>
        </div>
      )}
      {showAlert && (
        // <AlertConfirmation
        //   type='image'
        //   name={itemName}
        //   message={`You're about to permanently delete this image.`}
        //   showAlert={(showAlert) => setShowAlert(showAlert)}
        //   alertAction={(alertAction) => setAlertAction(alertAction)}
        // />
        <AlertConfirmation
          type='image'
          name={itemName}
          message={`You're about to permanently delete this image.`}
          buttonConfirmCancel={true}
          showAlert={(showAlert) => setShowAlert(showAlert)}
          alertAction={(alertAction) => setAlertAction(alertAction)}
          showModal={(showModal) => setShowModal(showModal)}
        />
      )}
    </>
  );
};

export default UploadAttachements;
