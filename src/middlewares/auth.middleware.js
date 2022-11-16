const jwt = require('jsonwebtoken');
const secret = require('../configs/jwt.config')

const authServices = require('../services/auth.service')

const verifyToken = (req,res,next)=>{
    const token = req.headers.authorization;
    try {
        const decode = jwt.verify(token, secret);
        // console.log(decode);
        req.username = decode.username
        req.userId = decode.id
        next();
    } catch (error) {
        res.status(500).send("Verify token is failed")
        return;
    }
}

const checkExistUsername = async (req,res,next)=>{
    const username = req.body.username;
    try {
        const user = await authServices.searchExistUsers(username)
        
        if(user){
            console.log("Username is already existing! SIGNUP");
            res.status(500).send({message:"Username is already existing!"})
            return
        }
        next()
    } catch (error) {
        console.log('Error in checkExistUsername');
        res.status(500).send({message:"Error in checkExistUsername"})
        return;
    }
}

module.exports = {verifyToken, checkExistUsername}