import { Alert, Button, Modal, Textarea, ModalHeader } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom';
import Comment from './Comment';
import { HiOutlineExclamationCircle } from 'react-icons/hi'
const CommentSection = ({ currentBlogId }) => {
  const { currentUser } = useSelector((state) => state.user);
  const { blog } = useSelector((state) => state.blog);

  const [currentComment, setCurrentComment] = useState('')
  const [commentError, setCommentError] = useState('')
  const [comments, setComments] = useState([]);
  const [commentToDelete, setCommentToDelete] = useState(null)
  const [showModal, setShowModal] = useState(false);
  const navigator = useNavigate();

  useEffect(() => {
    const getComments = async () => {
      try {
        const res = await fetch(`/api/comment/getPostComments/${currentBlogId}`);
        if (!res.ok) {
          setCommentError('Something wents wrong')
        }
        const data = await res.json();
        console.log("data in comment section ", data);
        setComments(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    getComments();
  }, [currentBlogId])

  const hanldeSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/comment/create`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify({
          content: currentComment,
          currentBlogId,
          userId: currentUser._id
        })
      })
      const data = await res.json();
      if (res.ok) {
        setCurrentComment('');
        setCommentError('');
        setComments([data.comment, ...comments]);
      }

    } catch (error) {
      console.log(error, "error");
    }
  }

  const handleEdit = async (comment, editComment) => {
    setComments(comments.map((c) =>
      c._id === comment._id ? { ...c, content: editComment } : c
    ))
  }


  const handleLike = async (commentId) => {
    try {
      if (!currentUser) {
        navigator('/sign-in');
        return;
      }
      const res = await fetch(`/api/comment/likeComment/${commentId}`)
      const data = await res.json();
      if (res.ok) {
        debugger
        setComments(comments.map((comment) => 
          comment._id == commentId ?
            {
              ...comment,
              likes : comment.likes + 1
            }
            :
            comment
        ))
      }
    } catch (error) {
      console.log(error.message, "error");
    }
  }

  console.log("Data", comments)

  const handleDelete = async (commentId) => {
    setShowModal(false);
    try {
      if (!currentUser) {
        navigator('/sign-in');
        return
      }
      const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
        method: "DELETE"
      });
      if (res.ok) {
        const data = await res.json();
        setComments(comments.filter((comment) => comment._id !== commentId))
      }
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
      {currentUser ?
        <div className='flex justify-start items-center gap-1 text-gray-500 text-sm'>
          <p>Signed in as :</p>
          <img
            className='w-6 h-6 rounded-full object-cover'
            src={currentUser.profilePicture}
            alt={currentUser.profilePicture}
          />
          <p>{currentUser.username}</p>
        </div>
        :
        <div className='text-sm text-teal-500 my-5 flex gap-1'>
          You must be signed in to comment
          <Link className='text-blue-500 hover:underline' to={'/sign-in'}>Sign In</Link>
        </div>
      }
      {currentUser &&
        <form className='border border-gray-500 rounded-lg p-3 my-4' onSubmit={hanldeSubmit}>
          <Textarea rows="3" maxLength='200' placeholder='Add a comment...'
            value={currentComment} onChange={(e) => setCurrentComment(e.target.value)}
          />
          <div className='flex justify-between mt-5 items-center'>
            <p className='text-gray-500 text-xs'>{200 - currentComment.length} character remaining</p>
            <Button gradientDuoTone='purpleToBlue' type="submit" outline>Submit</Button>
          </div>
          {commentError && (
            <Alert color="failure" className='mt-5'>{commentError}</Alert>
          )}
        </form>
      }
      {
        comments.length === 0 ?
          <p className='text-sm my-5'>No Comments yet!</p>
          :
          <>
            <div className='text-sm my-5 flex items-center gap-1'>
              <p>Comments</p>
              <div className='border border-gray-400 py-1 px-2 rounded-sm'>
                <p>{comments.length}</p>
              </div>
            </div>
            {comments.map((comment) => {
              return (
                <Comment
                  key={comment._id}
                  comment={comment}
                  onLike={handleLike}
                  onEdit={handleEdit}
                  onDelete={(commentId) => {
                    setShowModal(true);
                    setCommentToDelete(commentId);
                  }}
                />
              )
            })
            }
          </>
      }
      <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this comment ?
            </h3>
            <div className="flex justify-center gap-4">
              <Button color='failure' onClick={() => handleDelete(commentToDelete)}>Yes, I'm sure</Button>
              <Button color='failure' onClick={() => setShowModal(false)}>Nn, cancel</Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default CommentSection