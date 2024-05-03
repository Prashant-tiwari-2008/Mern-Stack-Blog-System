import { Button, Spinner } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link, useLocation, useParams } from 'react-router-dom';
import CommentSection from '../components/CommentSection';

const PostPage = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [currentBlog, setCurrentBlog] = useState({});

  const { blogSlug } = useParams();
  const location = useLocation();
  useEffect(() => {
    setLoading(true)
    const fetchBlog = async () => {
      const blogId = blogSlug.split("-").pop();
      const res = await fetch(`/api/blog/getBlog/${blogId}`);
      const data = await res.json();
      setCurrentBlog(data);
      setLoading(false)
    }
    fetchBlog();
  }, []);


  // todo: need to call the post form backend inplace of reudx-+
  if (loading) {
    return <p>Loading...</p>
  } else {
    return (
      <main className='p-3 flex flex-col max-w-6xl mx-auto'>
        <h1 className='text-center my-9 text-3xl font-serif max-w-2xl mx-auto lg:text-5xl'>{currentBlog && currentBlog.title}</h1>
        {/* <p className='text-center my-9'>
        <span className='border px-3 py-1 rounded-xl'>{blog.category}</span>
      </p> */}
        {/* //todo: need to understand */}

        <Link to={`/search?categiry=${currentBlog && currentBlog.category}`} className="self-center mt-5">
          <Button color='gray' pill>
            {currentBlog && currentBlog.category}
          </Button>
        </Link>
        <img src={currentBlog && currentBlog.banner} alt={currentBlog && currentBlog.title} className='mt-10 p-3 max-h-[600px] w-full object-cover'></img>
        <div className='flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-sm'>
          <span>{currentBlog && new Date(currentBlog.createdAt).toLocaleDateString()}</span>
          <span className='italic'>{currentBlog && (currentBlog.content.length / 1000).toFixed(0)} min read</span>
        </div>
        <div className='p-3 max-w-2xl mx-auto w-full post-content' dangerouslySetInnerHTML={{ __html: currentBlog && currentBlog.content }}>

        </div>

        {/* //todo : call to action  */}
        {/* <div className='max-w-4xl mx-auto w-full'>
        
      </div> */}

        {/* comment section will come here */}
        <CommentSection currentBlogId={currentBlog._id} />
      </main>
    )
  }
}
export default PostPage
