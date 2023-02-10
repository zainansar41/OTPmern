import React, { useState } from 'react'
import avatar from '../assets/avatar.png'
import toast, { Toaster } from 'react-hot-toast'
import { passwordValidate } from '../helper/validate'
import { useFormik } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import '../componentsCSS/register.css'
import convertBase64 from '../helper/convert'
import { registerUser } from '../helper/helper'



export default function Register() {
    const navigate = useNavigate()
    const [file, setFile] = useState()
    const formik = useFormik({
        initialValues: {
            email: '',
            username: '',
            password: ''
        },
        validate: passwordValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            values = await Object.assign(values, { profile: file || '' })
            let registerPromise = registerUser(values)
            toast.promise(registerPromise, {
                loading: "Creating...! Don't close tab",
                success: "Registered Succesfully",
                error: "Try Later...!"
            })
            registerPromise.then(function(){navigate('/')})
        }
    })
    //formik doesnot support file input
    const onUpload = async e => {
        const base64 = await convertBase64(e.target.files[0]);
        setFile(base64)
    }

    return (
        <div className='UserName' style={{ height: "500px" }}>
            <Toaster position='top-center'></Toaster>
            <h3>Register</h3>
            <h6>we are happy yo choose us</h6>
            <form action="" onSubmit={formik.handleSubmit}>
                <div className="forImage">
                    <label htmlFor="profile">
                        <img style={{ borderRadius: "50%" }} src={file || avatar} alt="avatar" />
                    </label>
                    <input onChange={onUpload} type="file" name='profile' id='profile' />
                </div>
                <div className="inputfields">
                    <input {...formik.getFieldProps('email')} type="email" placeholder='abc@gmail.com' />
                    <input {...formik.getFieldProps('username')} type="text" placeholder='enter your name' />
                    <input {...formik.getFieldProps('password')} type="text" placeholder='enter the password' />
                    <button type="submit">Register</button>
                </div>
            </form>
            <div className="last">already register <Link className='abc' to={'/'}>Login</Link></div>
        </div>
    )
}
