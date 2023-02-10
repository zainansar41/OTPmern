import React from 'react'
import avatar from '../assets/avatar.png'
import '../componentsCSS/username.css'
import { toast, Toaster } from 'react-hot-toast'
import { passwordValidate } from '../helper/validate'
import { useFormik } from 'formik'
import { Link ,useNavigate} from 'react-router-dom'
import useFetch from '../hooks/fetch.hook'
import { useAuthStore } from '../store/store'
import {verifyPassword} from '../helper/helper'


export default function Password() {
    const navigate=useNavigate()
    const { username } = useAuthStore(state => state.auth)
    const [{ isLoading, apiData, serverError }] = useFetch(`user/${username}`)
    const formik = useFormik({ 
        initialValues: {
            password: ''
        },
        validate: passwordValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            let passwordPromise = verifyPassword({username, password:values.password})
            toast.promise(passwordPromise,{
                loading:"checking ...!",
                success:"Login successful.... ",
                error:"password doesnot match"
            })
            passwordPromise.then(result=>{
                let {token}= result.data
                localStorage.setItem('token',token)
                navigate('/profile')
            })
        }
    })

    if (isLoading) return <h2 style={{ textAlign: "center" }}>isLoading</h2>
    if (serverError) return <h2 style={{ color: "red", textAlign: "center" }}>{serverError.message}</h2>

    return (
        <div className='UserName'>
            <Toaster position='top-center'></Toaster>
            <h3>Hello {apiData?.firstname || apiData?.username}</h3>
            <h6>explore more by connecting with us</h6>
            <form action="" onSubmit={formik.handleSubmit}>
                <div className="forImage">
                    <img src={apiData?.profile || avatar} style={{ borderRadius: "50%"}}alt="avatar" />
                </div>
                <div className="inputfields">
                    <input {...formik.getFieldProps('password')} type="text" placeholder='enter the password' />
                    <button type="submit">Sign In</button>
                </div>
            </form>
            <div className="last">forget password  <Link className='abc' to={'/recovery'}>Reset</Link></div>
        </div>
    )
}
