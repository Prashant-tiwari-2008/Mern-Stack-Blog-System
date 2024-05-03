import React, { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'flowbite-react'
import { useSelector } from 'react-redux';
import {HiOutlineExclamationCircle} from 'react-icons/hi';

const DashUser = () => {
  const [users, setUsers] = useState([]);
  const [showModal,setShowModel] = useState(false);
  const {currentUser} = useSelector((store) => store.user )
  const [showMore, setShowMore] = useState(true);
  const [userIdToDelete, setUserIdToDelete] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/user/getusers?limit=9');
        const data = await res.json();
        if (res.ok) {
          setUsers(data.user);
          if(data.user.length < 9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    if(currentUser.isAdmin){
      fetchUser();
    }
  }, [])

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(`/api/user/getusers?startIndex=${startIndex}`);
      const data = await res.json();
      if(res.ok){
        setUsers((prev) => [...prev,...data.user])
        if(data.user.length < 9){
          setShowMore(false);
        }
      }
      
    } catch (error) {
      console.log(error.message)
    }
  }

  const handleDelete = async() => {
    try {
      const res = await fetch(`/api/user/delete/${userIdToDelete}`,{
        method : "DELETE"
      })
      const data = await res.json();
      if(res.ok){
        console.log(data,"data");
        setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        setShowModel(false)
      }else{
        console.log(data.message);
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
        <Table>
          <Table.Head>
          <Table.HeadCell>S.NO</Table.HeadCell>
            <Table.HeadCell>Date created</Table.HeadCell>
            <Table.HeadCell>User image</Table.HeadCell>
            <Table.HeadCell>Username</Table.HeadCell>
            <Table.HeadCell>Email</Table.HeadCell>
            <Table.HeadCell>Admin</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          {users.map((user,index) => (
            <Table.Body className='dividi-y' kay={user._id}>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{user.createdAt}</Table.Cell>
                <Table.Cell><img src={user.profilePicture} alt="user" className='h-10 w-10 rounded-full' /></Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>{user.isAdmin ? "true" : "false"}</Table.Cell>
                <Table.Cell className='text-red-800 cursor-pointer' onClick={() => {setShowModel(true),setUserIdToDelete(user._id)}}>Delete</Table.Cell>
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
        <p>You have no users yet !</p>
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

export default DashUser