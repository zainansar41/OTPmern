import React from 'react'
import avatar from '../assets/avatar.png'
import '../componentsCSS/username.css'
import { Toaster } from 'react-hot-toast'
import { usernameValidate } from '../helper/validate'
import { useFormik } from 'formik'
import { Link, useNavigate } from 'react-router-dom'
import {useAuthStore} from '../store/store'

export default function Username() {

    const navigate = useNavigate();
    const setUsername = useAuthStore(state=>state.setUsername)

    const formik = useFormik({
        initialValues: {
            username: ''
        }, 
        validate:usernameValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            setUsername(values.username)
            navigate('/password')
        }
    })

    return (
        <div className='UserName'>
            <Toaster position='top-center'></Toaster>
            <h3>Welcome Back</h3>
            <h6>explore more by connecting with us</h6>
            <form action="" onSubmit={formik.handleSubmit}>
                <div className="forImage">
                    <img src={avatar} alt="avatar" />
                </div>
                <div className="inputfields">
                    <input {...formik.getFieldProps('username')} type="text" placeholder='enter the Username' />
                    <button type="submit">Let's Go</button>
                </div>
            </form>
            <div className="last">Not a member <Link className='abc' to={'/register'}>Register</Link></div>
        </div>
    )
}
