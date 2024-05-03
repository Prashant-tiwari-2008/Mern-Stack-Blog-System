import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';
import { useState } from 'react';


export const UploadImage = async(imageFile) =>{
    // const [imageUploading,setImageFileUploading] = useState(false);
    // const [imageFileUploadError, setImageFileUploadError] = useState('');
    const storage = getStorage(app);
    const fileName = new Date().getTime() + imageFile.name
    const storageRef = ref(storage,`blog-App/User/Image/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef,imageFile);
    uploadTask.on(
        'state_changed',
        (snapshot) => {
            const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100 ;
            setImageFileUploadPregress(progress.toFixed(0));
        },(error) => {
            setImageFileUploadError('Could not upload image(File must be less than 2MD)');
            setImageFileUploadProgress(null);
            setImageFile(null);
            setImageFileUrl(null);
            setImageFileUploading(false);
        },
        () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setImageFileUrl(downloadURL);
                setFormData({...FormData,profilePicture:downloadURL});
                setImageFileUploading(false)
            })
        }
    )  
}