import React, { useEffect, useState } from 'react'
import '../componentsCSS/recovery.css'
import { toast, Toaster } from 'react-hot-toast'
import { passwordValidate } from '../helper/validate'
import { useAuthStore } from '../store/store'
import { generateOTP, verifyOTP } from '../helper/helper'
import { useNavigate } from 'react-router-dom'

export default function Recovery() {
    const { username } = useAuthStore(state => state.auth);
    const [OTP, setOTP] = useState();
    const navigate = useNavigate()
    let n = 1
    useEffect(() => {
        if (n === 1) {
            generateOTP(username).then((OTP) => {

                console.log(n)
                console.log(OTP)
                if (OTP) {
                    n++
                    return toast.success('OTP has been send to your email!')
                }
                n++
                return toast.error('Problem while generating OTP!')


            })
        }
    }, []);


    async function onSubmit(e) {
        e.preventDefault();
        try {
            let { status } = await verifyOTP({ username, code: OTP })
            if (status === 201) {
                toast.success('Verify Successfully!')
                return navigate('/reset')
            }
        } catch (error) {
            return toast.error('Wront OTP! Check email again!')
        }
    }

    // handler of resend OTP
    function resendOTP() {

        let sentPromise = generateOTP(username);

        toast.promise(sentPromise,
            {
                loading: 'Sending...',
                success: <b>OTP has been send to your email!</b>,
                error: <b>Could not Send it!</b>,
            }
        );

        sentPromise.then((OTP) => {
            console.log(OTP)
        });

    }

    return (
        <div className='UserName'>
            <Toaster position='top-center'></Toaster>
            <h3>Recovery</h3>
            <h6>OTP has been sent to your Email</h6>
            <form action="" >
                <div className="inputfields">
                    <span>Enter 6 digit OTP to continue</span>
                    <input onChange={(e) => setOTP(e.target.value)} type="text" placeholder='enter the OTP' />
                    <button type="submit" onClick={onSubmit}>Recover</button>
                </div>
            </form>
            <div className="last">Don't Get OTP <button onClick={resendOTP}>Resend</button></div>
        </div>
    )
}
