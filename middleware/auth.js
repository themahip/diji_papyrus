const jwt= require("jsonwebtoken");
const User= require("../userschema.js");
const dotenv= require("dotenv");

dotenv.config({path:"../config.env"});

const auth= async (req,res,next)=>{

try {
    const token= req.cookies.jwt;
    const sec=process.env.SECRET_KEY;
    const verifyUser= jwt.verify(token,sec);
    console.log(verifyUser);
    const user= await User.findOne({_id:verifyUser._id});
    console.log(user);
    next();
} catch (error) {
    return res.status(221).json({ error: "login first" });
}
   

}

module.exports=auth;
   

