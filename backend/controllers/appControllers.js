import userModel from "../models/userModel.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import  otpGenerator  from 'otp-generator'

//middleware for checking user name
export async function verifyUser(req,res,next){
    try{
        const {username} = req.method =="GET"? req.query :req.body

        //check the existance
        let exist= await userModel.findOne({username})
        if(!exist) return res.status(404).send({error:"user not found"})
        next()
    }
    catch(error){
        return res.send({error:"authentication error"})
    }
}


export async function register(req, res) {
    try {
        const { username, password, profile, email } = req.body
        const existingUsername = new Promise((resolve, reject) => {
            userModel.findOne({ username }, function (err, user) {
                if (err) reject(new Error(err))
                if (user) reject({ error: "please use Unique username" })
                resolve()
            })
        })
        const existingEmail = new Promise((resolve, reject) => {
            userModel.findOne({ email }, function (err, user) {
                if (err) reject(new Error(err))
                if (user) reject({ error: "email is already taken" })

                resolve()
            })
        })
        Promise.all([existingUsername, existingEmail]).then(() => {
            if (password) {
                bcrypt.hash(password, 12).then(hashedpassword => {

                    const user = new userModel({
                        username,
                        password: hashedpassword,
                        profile: profile || '',
                        email
                    })
                    user.save().then(result => { res.status(201).send({ msg: "You has been register successfully" }) })
                        .catch(error => {
                            res.status(500).send({ error })
                        })

                }).catch(error => {
                    return res.send({ error: "unable to hashed passowrd" })
                })
            }
        }).catch(error => {
            return res.send({ error })
        })
    }
    catch (error) {
        res.send(error)
    }
}


export async function login(req, res) {
    const { username, password } = req.body
    try {
        userModel.findOne({username})
        .then(user=>{
            bcrypt.compare(password, user.password)
            .then(passwordCheck=>{
                if(!passwordCheck)return res.status(400).send({error:"incorrect password"})

                //create JWT token
                const token = jwt.sign({
                    userID : user._id,
                    username : user.username
                },'@42/ahc',{expiresIn: "24h"})
                return res.status(200).send({
                    msg:"succefully Loged in",
                    username: user.username,
                    token
                })
            })
            .catch(error=>{
                res.status(400).send({error:"Password is incorrect"})
            })
        })
        .catch(error=>{
            res.status(404).send({error:"username not found"})
        })
    }
    catch (error) {
        return res.status(500).send({ error});
    }

}


export async function getUser(req, res) {
    const {username} = req.params;
    try {
        
        if(!username) return res.send({error: "Invalid user"})
        userModel.findOne({username},function(err,user){
            if(err) return res.send({err})
            if(!user) return res.send({error:" No such user found"})

            //removing password from user
            const {password,...rest} = Object.assign({},user.toJSON())

            return res.status(201).send(rest)
        })

    } catch (error) {
        return res.status(404).send({error:"can not find user"})
    }
}

export async function updateUser(req, res) {

    try {
        const {userID} = req.user
        if(userID){
            const body = req.body
            userModel.updateOne({_id:userID},body,function (err,data) {
                if(err) throw err
                return res.status(201).send({msg:"Record Update"})
            })
        }
        else{
            res.status(401).send({error:"User not found"})
        }
        
    } catch (error) {
        res.status(401).send({error})
    }

}


export async function generateOTP(req, res) {
    req.app.locals.OTP= await otpGenerator.generate(6,{lowerCaseAlphabets:false,upperCaseAlphabets:false,specialChars:false})
    res.status(201).send({code:req.app.locals.OTP})
}


export async function verifyOTP(req, res) {
    const {code} = req.query
    if(parseInt(req.app.locals.OTP) === parseInt(code)){
        req.app.locals.OTP= null;
        req.app.locals.resetSession = true;
        return res.status(201).send({msg: "verified OTP"})
    }
    res.status(400).send({error:"Error occur"})
}


export async function createResetSession(req, res) {
    if(req.app.locals.resetSession){
        req.app.locals.resetSession=false//for once
        return res.status(201).send({msg:"access granted"})
    }
    res.status(440).send({error:"Session expired"})
}


export async function resetPassword(req, res) {
    try {
        if(!req.app.locals.resetSession){
            return res.status(440).send({error:"Session expired"})
        }
        const {username, password}= req.body
        try {
            userModel.findOne({username})
            .then(user=>{
                bcrypt.hash(password,12)
                .then(hashedpassword=>{
                    userModel.updateOne({username},{password:hashedpassword},function(err,data){
                        if(data) return res.status(201).send({msg:"password Updates"})
                        throw err
                    })
                })
                .catch(error=>{
                    res.status(500).send({error:"unable to hash"})
                })
            })
            .catch(error=>{
                res.status(404).send({error:"username not found"})
            })
        } catch (error) {
            res.status(500).send({error})
        }
    } catch (error) {
        res.status(401).send({error})
    }
}