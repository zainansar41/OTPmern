//send mail to user
import nodemailer from 'nodemailer'
import Mailgen from 'mailgen';

import ENV from '../config.js'


/** send mail from real gmail account */
// its a post request
export default async (req, res) => {

    const {username ,userEmail,text, subject } = req.body;

    let config = {
        service : 'gmail',
        auth : {
            user: ENV.EMAIL,
            pass: ENV.PASSWORD
        }
    }

    let transporter = nodemailer.createTransport(config);

    let MailGenerator = new Mailgen({
        theme: "default",
        product : {
            name: "zain",
            link : 'https://mailgen.js/'
        }
    })

    let response = {
        body: {
            name : username,
            intro: "Mail from Our Site",
            table : {
                data : [
                    {
                        Mail :text
                    }
                ]
            },
            outro: "Thank you for choosing us"
        }
    }

    let mail = MailGenerator.generate(response)

    let message = {
        from : ENV.EMAIL,
        to : userEmail,
        subject: subject|| "OTP for reset password",
        html: mail
    }

    transporter.sendMail(message).then(() => {
        return res.status(201).json({
            msg: "you should receive an email"
        })
    }).catch(error => {
        return res.status(500).json({ error })
    })

    // res.status(201).json("sendOTP Successfully...!");
}


