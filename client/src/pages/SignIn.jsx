import React, { useState } from 'react'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import themeImage from '../assets/theme-image.jpg'
import { useDispatch, useSelector } from 'react-redux'
import { signInFailure, signInSuccess,signInstart } from '../redux/user/userSlice'

const SignIn = () => {
  const [formData, setFormData] = useState({});
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { loading, error: errorMessage } = useSelector((state) => state.user);
 
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return dispatch(signInFailure("Please fill all the fields"))
    }
    try {
      dispatch(signInstart)
      let res = await fetch('/api/auth/signin', {
        method: "POST",
        headers: { 'Content-Type': "application/json" },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if (data.success == false) {
        dispatch(signInFailure(data.message))
      }
      if(res.ok){
        dispatch(signInSuccess(data))
        navigate('/')
      }
    } catch (error) {
      dispatch(signInFailure(error.message))
    }
  }

  return (
    <div className='my-28 md:mt-56'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to="/">
            <img className='rounded-lg' src={themeImage} alt="theme" style={{ "height": "300px", width: "300px" }} />
          </Link>
        </div>
        {/* right */}
        <div className='flex-1'>
          <form action="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading} className='mt-5 w-96 sm:w-full'>
              {loading ?
                (
                  <>
                    <Spinner size='sm' />
                    <span className='pl-3'>Loading...</span>
                  </>
                ) : (
                  'Sign In'
                )
              }
            </Button>
            {/* <OAuth /> */}
          </form>
          <div className='flex gap-2 text mt-5'>
            <span>Don't Have an account ?</span>
            <Link to="/sign-up" className='text-blue-500'>Sign Up</Link>
          </div>
          {errorMessage && (
            <Alert className="mt-5" color="failure">
              {errorMessage}
            </Alert>
          )}
        </div>
      </div>
    </div>
  )
}

export default SignIn