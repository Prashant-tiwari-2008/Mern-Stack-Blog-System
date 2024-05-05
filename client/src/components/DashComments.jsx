import React, { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'flowbite-react'
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

const DashComments = () => {
  const [comments, setComments] = useState([]);
  const [showModal, setShowModel] = useState(false);
  const { currentUser } = useSelector((store) => store.user)
  const [showMore, setShowMore] = useState(true);
  const [commentIdToDelete, setCommentIdToDelete] = useState('');

  useEffect(() => {
    const fetchComment = async () => {
      try {
        const res = await fetch('/api/comment/getComments?limit=9');
        const data = await res.json();
        if (res.ok) {
          setComments(data.comments);
          if (data.comments.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    if (currentUser.isAdmin) {
      fetchComment();
    }
  }, [])

  const handleShowMore = async () => {
    const startIndex = comments.length;
    try {
      const res = await fetch(`/api/comment/getComments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setComments((prev) => [...prev, ...data.comments])
        if (data.comments.length < 9) {
          setShowMore(false);
        }
      }

    } catch (error) {
      console.log(error.message)
    }
  }


  const handleDelete = async () => {
    try {
      const res = await fetch(`/api/comment/delete/${commentIdToDelete}`, {
        method: "DELETE"
      })
      const data = await res.json();
      if (res.ok) {
        
        console.log(data, "data");
        setComments((prev) => prev.filter((comment) => {
          comment._id !== commentIdToDelete
        }));
      setShowModel(false)
    }else {
      console.log(data.message);
      setShowModel(false)
    }
  } catch (error) {
    console.log(error.message)
    setShowModel(false)
  }
}

return (
  <div className='table-auto overflow-x-scroll md:overflow-auto md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
    {currentUser.isAdmin && comments.length > 0 ? (
      <>
        <Table>
          <Table.Head>
            <Table.HeadCell>S.NO</Table.HeadCell>
            <Table.HeadCell>Date created</Table.HeadCell>
            <Table.HeadCell>Comment content</Table.HeadCell>
            <Table.HeadCell>Number of likes</Table.HeadCell>
            <Table.HeadCell>PostId</Table.HeadCell>
            <Table.HeadCell>UserId</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          {comments.map((comment, index) => (
            <Table.Body className='dividi-y' kay={comment._id}>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{comment.createdAt}</Table.Cell>
                <Table.Cell>{comment.content}</Table.Cell>
                <Table.Cell>{comment.likes}</Table.Cell>
                <Table.Cell>{comment.blogId}</Table.Cell>
                <Table.Cell>{comment.creatorId}</Table.Cell>
                <Table.Cell className='text-red-800 cursor-pointer' onClick={() => { setShowModel(true), setCommentIdToDelete(comment._id) }}>Delete</Table.Cell>
              </Table.Row>
            </Table.Body>
          ))}
        </Table>
        {showMore && (
          <button onClick={handleShowMore} className='w-full text-teal-500 self-center text-sm py-7'> Show More
          </button>
        )}
      </>
    ) : (
      <p>You have no comments yet !</p>
    )}
    <Modal show={showModal} onClose={() => setShowModel(false)} popup size='md'>
      <Modal.Header />
      <Modal.Body>
        <div className='text-center'>
          <HiOutlineExclamationCircle className="className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
          <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete this user ?</h3>
          <div className='flex justify-center gap-4'>
            <Button color='failure' onClick={() => handleDelete()}>Yes, I'm sure</Button>
            <Button color='gray' onClick={() => setShowModel(false)}>No, cancel</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  </div>
)
}

export default DashComments