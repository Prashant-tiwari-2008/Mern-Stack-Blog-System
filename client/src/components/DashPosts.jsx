import React, { useEffect, useState } from 'react'
import { Button, Modal, Table } from 'flowbite-react'
import { useSelector } from 'react-redux';
import {HiOutlineExclamationCircle} from 'react-icons/hi';


const DashPosts = () => {
  const [posts, setPosts] = useState([]);
  const [showModal,setShowModel] = useState(false);
  const {currentUser} = useSelector((store) => store.user )
  const [showMore, setShowMore] = useState(true);
  const [postIdToDelete, setPostIdToDelete] = useState('');
 
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch('/api/blog/getBlogs?limit=9');
        const data = await res.json();
        if (res.ok) {
          setPosts(data.blogs);
          if(data.blogs.length < 9){
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    }
    if(currentUser.isAdmin){
      fetchBlog();
    }
  }, [])

  const handleShowMore = async () => {
    const startIndex = posts.length;
    try {
      const res = await fetch(`/api/blog/getBlogs?startIndex=${startIndex}`);
      const data = await res.json();
      if(res.ok){
        setPosts((prev) => [...prev,...data.blogs])
        if(data.blogs.length < 9){
          setShowMore(false);
        }
      }
      
    } catch (error) {
      console.log(error.message)
    }
  }


  const handleDelete = async() => {
    try {
      const res = await fetch(`/api/blog/delete/${postIdToDelete}`,{
        method : "DELETE"
      })
      const data = await res.json();
      if(res.ok){
        console.log(data,"data");
        setPosts((prev) => prev.filter((post) => post._id !== postIdToDelete));
        setShowModel(false)
      }else{
        console.log(data.message);
        setShowModel(false)
      }
      if(posts.length < 9){
        setShowMore(false);
      }
    } catch (error) {
      console.log(error.message)
      setShowModel(false)
    }
  }

  return (
    <div className='table-auto  md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && posts.length > 0 ? (
        <>
        <Table>
          <Table.Head>
            <Table.HeadCell>S. No</Table.HeadCell>
            <Table.HeadCell>Date Updated</Table.HeadCell>
            <Table.HeadCell>Post image</Table.HeadCell>
            <Table.HeadCell>Post title</Table.HeadCell>
            <Table.HeadCell>category</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
          </Table.Head>
          {posts.map((post,index) => (
            <Table.Body className='dividi-y' kay={post._id}>
              <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{post.createdAt}</Table.Cell>
                <Table.Cell><img src={post.banner} alt="post" className='h-10 w-10 rounded-full' /></Table.Cell>
                <Table.Cell>{post.title}</Table.Cell>
                <Table.Cell>{post.category}</Table.Cell>
                <Table.Cell className='text-red-800 cursor-pointer' onClick={() => {setShowModel(true),setPostIdToDelete(post._id)}}>Delete</Table.Cell>
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


export default DashPosts