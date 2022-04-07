import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { registerTaskComment } from '../../redux/actions/commentActions';
import RichTextEditorComment from '../RichTextEditorComment';
import CommentList from './CommentList';

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

const hoverBtnDangerMotion = {
  rest: { background: '#e3342f', scale: 1 },
  hover: {
    background: '#C34A36',
    scale: 1.1,
    transition: {
      duration: 0.1,
      type: 'spring',
      stiffness: 100,
      ease: 'easeInOut',
    },
  },
};

const CommentBox = ({
  accountList,
  accountInfo,
  taskId,
  commentListByIdInfo,
}) => {
  const [accounts, setAccounts] = useState();
  const [taskComment, setTaskComment] = useState({
    taskId: '',
    commentId: '',
    content: '',
    mentions: '',
  });
  const [updatedDescription, setUpdatedDescription] = useState({});
  const [editorLength, setEditorLength] = useState();
  const [clearEditorState, setClearEditorState] = useState();

  const dispatch = useDispatch();

  const handleSubmitComment = () => {
    dispatch(registerTaskComment(updatedDescription));
    setClearEditorState(true);
  };

  useEffect(() => {
    if (accountList) {
      setAccounts(accountList);
    }
    if (taskId) {
      setUpdatedDescription((prevData) => ({
        ...prevData,
        taskId: taskId,
        commentId: accountInfo._id,
      }));
    }
  }, [accountInfo._id, accountList, accounts, taskId]);

  return (
    <>
      <div className='w-full flex flex-row'>
        <div className='pr-6'>
          <img
            className='rounded-full'
            src={accountInfo.accountProfileUploaded}
            alt={`${accountInfo.firstName} ${accountInfo.lastName}`}
            style={{ width: '2.6rem', height: '2.6rem' }}
          />
        </div>
        <RichTextEditorComment
          accounts={accounts}
          returnContent={taskComment.content}
          convertedContent={(convertedContent) =>
            setUpdatedDescription((prevData) => ({
              ...prevData,
              taskComment: {
                content: convertedContent.content.replaceAll('@', ''),
                mentions: convertedContent.mentions,
              },
            }))
          }
          editorLength={(editorLength) => setEditorLength(editorLength)}
          clearEditorState={clearEditorState}
        />
      </div>
      {editorLength && editorLength.length !== 0 ? (
        <div className='my-8 pl-16 mx-auto flex'>
          <motion.button
            type='button'
            className='w-1/9 text-white text-xs font-medium tracking-wider py-4 px-4 rounded-md shadow-xl'
            onClick={handleSubmitComment}
            initial='rest'
            whileHover='hover'
            variants={hoverBtnPrimaryMotion}
          >
            Save
          </motion.button>
          <motion.button
            type='button'
            className='w-1/9 text-white text-xs font-medium tracking-wider ml-6 py-4 px-4 rounded-md shadow-xl'
            initial='rest'
            whileHover='hover'
            variants={hoverBtnDangerMotion}
          >
            Cancel
          </motion.button>
        </div>
      ) : null}

      <CommentList commentListByIdInfo={commentListByIdInfo} />
    </>
  );
};

export default CommentBox;
