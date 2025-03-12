
const bcrypt = require("bcrypt")
const UserModel = require("../models/user.model")
const dotenv=require("dotenv")
const jwt = require("jsonwebtoken")
dotenv.config();

const JWR_SECRET_KEY = process.env.JWT_SECRET_KEY

const register = async (req, res, next) => {
    try {


        const response = await UserModel.create(req.body)
        res.json({
            success: true,
            message: "Register successfully",
            data: response
        })
    } catch (err) {
        next(err)
    }
}
const login = async (req, res, next) => {
    try {
        /**
         * Login Successful => email & password combination should match 
         * 2. not valid before
         * 3. not expired
         * 4.
         */
        const user = await UserModel.findOne({ email: req.body.email })
        if (!user) {
            res.status(400)
                .json({
                    success: false,
                    message: "Incorrect user or Password"
                })
            return;
        }
        const isValidUser = await bcrypt.compare(req.body.password, user.password)
        if (isValidUser) {
            const currentTimeInSec = parseInt(Date.now()/1000);
            const tokenData ={
                iat:currentTimeInSec,
            
                _id:user._id
            }
            const token =  jwt.sign(tokenData,JWR_SECRET_KEY,{
                expiresIn:3600,
                notBefore:0
            })

            // DB update for this token /Store this token in DB

            await UserModel.findByIdAndUpdate(user._id,{token:token})
            res.cookie("token",token)
            res.json({
                success: true,
                message: "Login successfully",
                token:token
            })
            return
        };

        res.status(400).json({
            success: false,
            message: "Incorrect userName or Password"
        })
    } catch (err) {
        next(err)
    }
}

const userController = {
    register,
    login
}
module.exports = userController