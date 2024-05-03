import React, { useState } from 'react'
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react'
import { Link, useNavigate } from 'react-router-dom';
import themeImage from '../assets/theme-image.jpg'
const SignUp = () => {
  const baseUrl = "http://localhost:4000"
  const[loading,setLoading] = useState(false);
  const[formData,setFormData] = useState({});
  const[errorMessage,setErrorMessage] = useState('')
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({...formData, [e.target.id] : e.target.value.trim()});
  }
  
  const handleSubmit = async(e) =>{
    e.preventDefault();
    if(!formData.username || !formData.email || !formData.password){
      return setErrorMessage('Please fill out the all fields')
    }
    try {
      setLoading(true);
      setErrorMessage(null);
      const res = await fetch(baseUrl + '/api/auth/signup',{
        method :"POST",
        headers : {'Content-Type' : 'application/json'},
        body : JSON.stringify(formData)
      });
      const data = await res.json();
      if(data.success == false){
        return setErrorMessage(data.message);
      }
      setLoading(false);
      if(res.ok){
        navigate('/sign-in');
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false)
    }
  }

  return (
    <div className='mt-28 md:mt-56'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5'>
        {/* left */}
        <div className='flex-1'>
          <Link to="/">
            <img className='rounded-lg' src={themeImage} alt="theme" style={{"height":"300px", width:"300px"}}/>
            </Link>
        </div>
        {/* right */}
        <div className='flex-1'>
          <form action="flex flex-col gap-4" onSubmit={handleSubmit}>
            <div>
              <Label value="Your Name" />
              <TextInput
                type="text"
                id="username"
                placeholder="username"
                onChange={handleChange}
              />
            </div>
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
                  'Sign Up'
                )
              }
            </Button>
            {/* <OAuth /> */}
          </form>
          <div className='flex gap-2 text mt-5'>
            <span>Have an account ?</span>
            <Link to="/sign-in" className='text-blue-500'>Sign In</Link>
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
export default SignUp;