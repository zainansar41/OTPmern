import { Router } from "express";
import * as controller from '../controllers/appControllers.js'
import auth,{localVariables} from "../middleware/auth.js";
import sendOTP from '../controllers/mailer.js'
const router = Router()


router.route('/register').post(controller.register)

router.route('/registerMail').post(sendOTP)

router.route('/authenticate').post(controller.verifyUser,(req,res)=>res.end())

router.route('/login').post(controller.verifyUser,controller.login)

// get routes
router.route('/user/:username').get(controller.getUser)//user with useraname

router.route('/generateOTP').get(controller.verifyUser,localVariables,controller.generateOTP)//generate OTP

router.route('/verifyOTP').get(controller.verifyUser,controller.verifyOTP)//verify OTP

router.route('/createResetSession').get(controller.createResetSession)

// update routes

router.route('/updateuser').put(auth,controller.updateUser)
router.route('/resetPassword').put(controller.verifyUser,controller.resetPassword)


export default router