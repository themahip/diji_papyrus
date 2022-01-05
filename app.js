const express= require("express");
const app=express();
const dotenv= require("dotenv");
const bodyPraser=require("body-parser");
const validator= require("email-validator");
const mongoose= require("mongoose");
const jwt=require("jsonwebtoken");
const bcrypt= require("bcrypt");
const auth= require("./middleware/auth.js")
const cookieParser= require("cookie-parser");
const PORT=3000;
const User= require("./userschema.js");
dotenv.config({path:"./config.env"});


app.use(bodyPraser.urlencoded({extended:true}));
app.use(cookieParser())

const URL=process.env.URL;

mongoose.connect(URL,{ useNewUrlParser: true});

app.get("/register",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
});

app.get("/home",auth,(req,res)=>{
    res.sendFile(__dirname+"/home.html");
    console.log(req.cookies.jwt);
})

app.post("/register",async(req,res)=>{

  const {fname,lname, email, password, cpassword}=req.body;
    console.log(req.body);
    const hashPassword=(await bcrypt.hash(password,10)).toString();
    const hashcPassword=(await bcrypt.hash(cpassword,10));


    if (!fname || !email || !password || !cpassword || !lname) {
        return res.status(221).json({ error: "Please fill in all fields" });
    }
    else if(password!==cpassword){
        return res.status(221).json({ error: "Password didn't match" });
    }
    else if(password.lenght<6){
        return res.status(221).json({ error: "Password must be 6 characters long." });
    }
    else if(!validator.validate(email)){
        return res.status(221).json({ error: "Email not validated." });
    }

    else{
        User.findOne({email:email},async(err,foundUser)=>{
            if(err){
                console.log(err);
            }
            else if(foundUser){
                return res.status(221).json({error:"email already exist"});
            }
            else{
                const newUser= new User({
                   fname,
                   lname,
                   email,
                   hashPassword
                });
                    const token=await newUser.generateAuthToken();
                    res.cookie("jwt",token,{
                        expire:new Date(Date.now()+50000),
                        // httpOnly:true,
                        // secure:true  --only can be used in production version. So uncomment when deploying..

                    });
                    console.log(token);
                    // const nUser= await newUser.save();
                    // res.status(201).send("welcome!!");

             const nuser= await newUser.save(()=>{
                   
                    res.send("welcome!!");
                });
            }
        })
        
    }

})

app.get("/login",(req,res)=>{
   res.sendFile(__dirname+"/login.html");
});

app.post("/login",async(req,res)=>{
    const {email,password}=req.body;

    User.findOne({email:email},async(error,foundUser)=>{
        if(error){
            console.log(error);
        }
        else if(foundUser){
            const isMatch = await bcrypt.compare(password,foundUser.hashPassword);
   
            const token=await foundUser.generateAuthToken();
            console.log(token);
            res.cookie("jwt",token,{
                expire:new Date(Date.now()+5000000),
                // httpOnly:true,
                // secure:true  --only can be used in production version. So uncomment when deploying..
         
            });
         
            if(isMatch){
               res.send("welcome!!")
            }
            else{
             return res.status(221).json({ error: "email and password didn't match" });
            }
            
        }
       
    }); 
})

// const jwt= require("jsonwebtoken");

// const createToken=async()=>{
//   const token=await jwt.sign({_id:"abcdefghijkl"},"mynameismahipadhikariabackenddeveloper");
// console.log(token);

// const userVer= jwt.verify(token,"mynameismahipadhikariabackenddeveloper");
// console.log(userVer._id);
// }
// createToken();




app.listen(3000,()=>{
    console.log(`The server is running on port ${PORT}`);
})





