import React, { useState } from 'react'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { reset, signInFailure, signInSuccess,signInstart} from '../redux/user/userSlice'

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
    <div className='flex items-center h-[93vh]'>
      <div className='flex p-3 w-96 lg:max-w-3xl mx-auto flex-col md:flex-row md:items-center'>
        <div className='flex-1 '>
          <form className="flex flex-col gap-4" onSubmit= {handleSubmit}>
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
                onChange={handleChange}
                onClick={() => dispatch(reset())}
              />
            </div>
            <div>
              <Label value="Your Password" />
              <TextInput
                type="password"
                placeholder="Password"
                id="password"
                onChange={handleChange}
                onClick={() => dispatch(reset())}
              />
            </div>
            <Button gradientDuoTone='purpleToPink' type='submit' disabled={loading} className='mt-5 sm:w-full'>
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