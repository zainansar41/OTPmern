import React, { useState } from 'react'
import avatar from '../assets/avatar.png'
import { toast,Toaster } from 'react-hot-toast'
import { profileValidation } from '../helper/validate'
import { useFormik } from 'formik'
import '../componentsCSS/register.css'
import convertBase64 from '../helper/convert'
import useFetch from '../hooks/fetch.hook'
import { useAuthStore } from '../store/store'
import {updateUser} from '../helper/helper'
import { useNavigate } from 'react-router-dom'



export default function Profile() {
    const navigate = useNavigate()


    const [{ isLoading, apiData, serverError }] = useFetch()

    const [file, setFile] = useState()
    const formik = useFormik({
        initialValues: {
            firstName:apiData?.firstName || '',
            lastName:apiData?.lastName||'',
            mobileNo:apiData?.mobileNo || '',
            email: apiData?.email||'',
            address:apiData?.address || ''
        },
        enableReinitialize:true,
        validate: profileValidation,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            values = await Object.assign(values, { profile: file || '' })
            let updatePromise = updateUser(values)
            toast.promise(updatePromise,{
                loading:"Updating ...!",
                success:"Update successful.... ",
                error:"Error in Updating"
            })
            updatePromise.then(result=>{
                let {token}= result.data
                console.log(token)
                localStorage.setItem('token',token)
                navigate('/profile')
            })
        }
    })
    //formik doesnot support file input
    const onUpload = async e => {
        const base64 = await convertBase64(e.target.files[0]);
        setFile(base64)
        


    }
    if (isLoading) return <h2 style={{ textAlign: "center" }}>isLoading</h2>
    if (serverError) return <h2 style={{ color: "red", textAlign: "center" }}>Sorry this page Doesnot support ReLoad try Login again</h2>
    return (
        <div className='UserName' style={{ height: "450px", width: "400px" }}>
            <Toaster position='top-center'></Toaster>
            <h3>Register</h3>
            <h6>we are happy yo choose us</h6>
            <form action="" onSubmit={formik.handleSubmit}>
                <div className="forImage">
                    <label htmlFor="profile">
                        <img style={{ borderRadius: "50%", height:'80px',width:'80px'}} src={file || apiData?.profile || avatar} alt="avatar" />
                    </label>
                    <input onChange={onUpload} type="file" name='profile' id='profile' />
                </div>
                <div className="inputfields">
                    <div className="nameFields" style={{display:'flex'}}>
                        <input {...formik.getFieldProps('firstName')} type="text" placeholder='firstName'style={{width:'100px',marginRight:'30px'}} />
                        <input {...formik.getFieldProps('lastName')} type="text" placeholder='lastName' style={{width:'100px'}}/>
                    </div>
                    <div className="contactFields" style={{display:'flex'}}>
                        <input {...formik.getFieldProps('mobileNo')} type="text" placeholder='Mobile No'style={{width:'100px', marginRight:'30px'}} />
                        <input {...formik.getFieldProps('email')} type="email" placeholder='abc@gmail.com' style={{width:'100px'}} />
                    </div>
                    <input {...formik.getFieldProps('address')} type="text" placeholder='Address' />
                    <button type="submit">Update</button>
                </div>
            </form>
        </div>
    )
}
