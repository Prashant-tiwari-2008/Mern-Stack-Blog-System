import React, { useState } from 'react'
import ReactQuill from 'react-quill';
import { Button, FileInput, Select, TextInput, Alert, Spinner } from 'flowbite-react'
import 'react-quill/dist/quill.snow.css';
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from 'firebase/storage'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { successBlog,createBlog,createBLogFailure } from '../redux/blog/blogSlice';
import { app } from '../firebase';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

const CreatePost = () => {
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);
  const [imageUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState('');
  const [publishError, setPublishError] = useState(null)
  
  const dispatch = useDispatch()
  const {loading, error: errorMessage} = useSelector((state) => state.blog);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const uploadImage = () => {
    try {
      if (!file) {
        setImageUploadError("Please select an image")
        return;
      }
      setImageUploadError(null);
      const storage = getStorage(app);
      const fileName = new Date().getTime() + '-' + file.name;
      const storageRef = ref(storage, `blog-App/Blog/Image/${fileName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageFileUploadProgress(progress.toFixed(0));
        },
        (error) => {
          setImageUploadError('Image upload failed');
          setImageFileUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
            setImageFileUploadProgress(null);
            setImageUploadError(null);
            setFormData({ ...formData, banner: downloadUrl })
          })
        }
      )
    } catch (error) {
      setImageUploadError(error.message);
    }
  }

  const submitBlog = async (e) => {
    dispatch(createBlog());
    e.preventDefault();
    if (!formData.title || !formData.banner || !formData.category || !formData.content) {
      setPublishError('Fill all the fields')
      dispatch(createBLogFailure('Fill all the fields'))
      return;
    }
    try {
      const res = await fetch('/api/blog/create', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (!res.ok) {
        setPublishError(data.message);
        return;
      } else {
        setPublishError(null);
        dispatch(successBlog(data));
        navigate(`/blog/${data.slug}`)
      }
    } catch (error) {
      setPublishError('Something went wrong');
      dispatch(createBLogFailure('Something went wrong'))
      dispatch(createBLogFailure())
    }
  }

  console.log(formData, "form data")

  return (
    <div className='p-3 max-w-4xl mx-auto'>
      <h1 className='text-center my-7 font-semibold text-3xl'>Create a post</h1>
      <form className='flex flex-col gap-4' onSubmit={submitBlog}>
        <div className='flex flex-col sm:flex-row gap-4 justify-between'>
          <TextInput className='flex-1' id="title" placeholder='Title' onChange={handleChange} />
          <Select id="category" onChange={handleChange}>
            <option value="uncategories">Select an option</option>
            <option value="React">React</option>
            <option value="Angular">Angular</option>
            <option value="Vue">Vue</option>
            <option value="NodeJs">Nodejs</option>
          </Select>
        </div>
        <div className='flex items-center justify-between gap-10 p-3 border-2 border-dashed border-sky-500 rounded-md'>
          <FileInput className='flex-1' type="image/*" id="banner" onChange={(e) => setFile(e.target.files[0])}></FileInput>
          {imageUploadError && <Alert color='failure'>{imageUploadError}</Alert>}
          <Button type='button' gradientDuoTone='purpleToBlue' outline onClick={uploadImage} disabled={imageUploadProgress}>{
            imageUploadProgress ?
              <div className='w-10 h-10'>
                <CircularProgressbar value={imageUploadProgress} text={`${imageUploadProgress || 0}%`} strokeWidth={10}
                  styles={buildStyles({
                    textColor: "white",
                    pathColor: "green",
                  })}
                />
              </div>
              : 'Upload Image'
          }</Button>
        </div>
        {formData.banner && <img src={formData.banner} alt="upload" className='w-full h-96 object-cover' />}
        <ReactQuill className='h-80 mb-12' id="content" placeholder='write a new post' theme='snow' onChange={(value) => setFormData({ ...formData, content: value })} />
        <Button type='submit' gradientDuoTone='purpleToPink' disabled={loading}>
          {
            loading ? 
            (
              <>
                <Spinner size='sm' />
                <span className='p-2'>loading...</span>
              </>
            )
            :(
              'Publish'
            )
          }
        </Button>
        {errorMessage && (
          <Alert className='mt-5' color='failure'>{errorMessage}</Alert>
        )}
      </form>
    </div>
  )
}
export default CreatePost;
