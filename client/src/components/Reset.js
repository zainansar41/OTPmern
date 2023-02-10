import React from 'react'
import '../componentsCSS/username.css'
import { toast, Toaster } from 'react-hot-toast'
import { resetPasswordValidate } from '../helper/validate'
import { useFormik } from 'formik'
import {resetPassword} from '../helper/helper'
import { useAuthStore } from '../store/store'
import { useNavigate } from 'react-router-dom'

export default function Reset() {
    const {username} = useAuthStore(state => state.auth)
    const navigate = useNavigate()
    const formik = useFormik({
        initialValues: {
            password: '',
            conPassword:''
        },
        validate:resetPasswordValidate,
        validateOnBlur: false,
        validateOnChange: false,
        onSubmit: async values => {
            let resetPromise = resetPassword({username, password:values.conPassword})

            toast.promise(resetPromise,{
                loading:"Updating ...",
                success:"Succesfully Update",
                error: "Unable to update password"
            })

            resetPromise.then(function(){navigate('/password')})
        }
    })

    return (
        <div className='UserName'>
            <Toaster position='top-center'></Toaster>
            <h3>Reset</h3>
            <h6>Enter new password</h6>
            <form action="" onSubmit={formik.handleSubmit}>
                <div className="inputfields">
                    <input {...formik.getFieldProps('password')} type="text" placeholder='enter New password' />
                    <input {...formik.getFieldProps('conPassword')} type="text" placeholder='Repeat password' />
                    <button type="submit">Reset</button>
                </div>
            </form>
        </div>
    )
}
