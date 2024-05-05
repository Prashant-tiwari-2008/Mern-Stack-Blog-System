import React, { useEffect, useState } from 'react'
import { Button } from 'flowbite-react'
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom'
const Home = () => {
  const [recentPosts, setRecentPosts] = useState([]);
  const [randomPosts, setRandomPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/blog/getBlogs');
      const data = await res.json();
      setRecentPosts(data.blogs);
    }
    fetchPosts();

    const fetchRandomPosts = async () => {
      const res = await fetch('/api/blog/random');
      const data = await res.json();
      setRandomPosts(data.blogs);
    }
    fetchRandomPosts();

    const fetchPopularPosts = async () => {
      const res = await fetch('/api/blog/mostpopular');
      const data = await res.json();
      setPopularPosts(data.blogs);
    }
    fetchPopularPosts();
  }, []);

  return (
    <>
    {/*  <div className='flex flex-col justify-center items-center lg:flex-row mx-auto min-h-[85vh] gap-5'>
         <div className="flex flex-col gap-10  mx-auto">
          <h1 className='text-9xl'>Stay curious.</h1>
          <h2>Discver stories, thinking, and expertise from writers on any topic.</h2>
          <p>Here you'll find a variety of articles and tutorials on topics such as web development, software engineering, and programming languages.</p>
          <Button gradientDuoTone='purpleToBlue'>Start Reading</Button>
        </div> */}
        {/* <div className=''>
          <img className='h-96 w-full' src='https://firebasestorage.googleapis.com/v0/b/image-and-docs.appspot.com/o/blog-App%2FBlog%2FImage%2F1707495082651-vlcsnap-2018-01-23-16h28m34s374.png?alt=media&token=a549c990-f20b-448d-8bb4-423e0f178626'></img>
        </div> 
      </div>*/}
      <div className='max-w-8xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {recentPosts && recentPosts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className='flex flex-wrap pl-2 gap-2 lg:pl-16'>
              {recentPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link to={'/search'} className="text-lg text-teal-500 hover:underline text-center">
              View all posts
            </Link>
          </div>
        )}
      </div>
      <div className='max-w-8xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {popularPosts && popularPosts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='underline text-2xl font-semibold text-center'>Most Popular Posts</h2>
            <div className="flex flex-wrap pl-2 gap-2 lg:pl-16">
              {popularPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link to={'/search'} className="text-lg text-teal-500 hover:underline text-center">
              View all posts
            </Link>
          </div>
        )}
      </div>
      <div className='max-w-8xl mx-auto p-3 flex flex-col gap-8 py-7'>
        {randomPosts && randomPosts.length > 0 && (
          <div className='flex flex-col gap-6'>
            <h2 className='underline text-2xl font-semibold text-center'>Random Posts</h2>
            <div className="flex flex-wrap pl-2 gap-2 lg:pl-16">
              {randomPosts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link to={'/search'} className="text-lg text-teal-500 hover:underline text-center">
              View all posts
            </Link>
          </div>
        )}
      </div>
    </>
  )
}

export default Home