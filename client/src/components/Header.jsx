import { Avatar, Button, Dropdown, DropdownDivider, DropdownItem, Navbar, TextInput, theme } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { toggleTheme } from '../redux/theme/themeSlice';
import { signOutSuccess } from '../redux/user/userSlice';

const Header = () => {
 
  const [searchTerm, setSearchTerm] = useState('');

  const path = useLocation().pathname;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { currentUser } = useSelector((state) => state.user);
  const { theme } = useSelector((state) => state.theme);
 
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl)
    }
  },[location.search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);

  };

  const signOut = async () => {
    try {
      const res = await fetch('/api/auth/signout');
      const data = await res.json();
      if(res.ok){
        dispatch(signOutSuccess())
        navigate('/sign-in');
      }
    } catch (error) {
      console.log(error.nesssage)
    }
  }

  return (
    <Navbar className='border-b-2 fixed w-full f-full z-50 shadow-md shadow-teal-100'>
      <Link to="/" className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white">
        <span className='text-black dark:text-white'>Prashant's Blog</span>
      </Link>
      <form onSubmit={handleSubmit} className='hidden lg:inline-block'>
        <TextInput
          type="text"
          placeholder='Search...'
          rightIcon={AiOutlineSearch}
          className='inline'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <div className='flex gap-2 md:order-2'>
        <Button 
          className='w-12 h-10 hidden sm:inline' 
          color="gray" 
          pill
          onClick={() => dispatch(toggleTheme())}
          >
          {theme === 'light' ? <FaSun /> : <FaMoon />}
        </Button>
        {currentUser ?
          (
            <Dropdown
              arrowIcon={false}
              inline
              label={
                <Avatar alt="user" img={currentUser.profilePicture} rounded bordered color="success" />
              }
            >
              <Dropdown.Header>
                <span className='block text-sm'>{currentUser.username}</span>
                <DropdownDivider />
                <span className='block text-sm font-medium truncate'>{currentUser.email}</span>
              </Dropdown.Header>
              <Link to={'/dashboard?tab=profile'}>
                <DropdownItem>Profile</DropdownItem>
              </Link>
              <DropdownDivider />
              <Dropdown.Item onClick={signOut}>Sign Out</Dropdown.Item>
            </Dropdown>
          ) :
          (<Link to='/sign-in'>
            <Button gradientDuoTone='purpleToBlue' outline>
              Sign In
            </Button>
          </Link>
          )
        }
        <Navbar.Toggle />
      </div>
      <Navbar.Collapse>
        <Navbar.Link active={path === '/'} as={'div'} >
          <Link to="/">HOME</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/about"} as={'div'}>
          <Link to="/about">About</Link>
        </Navbar.Link>
        <Navbar.Link active={path === "/projects"} as={'div'}>
          <Link to="/projects">Projects</Link>
        </Navbar.Link>
      </Navbar.Collapse>
    </Navbar>
  )
}
export default Header;
