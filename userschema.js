
const mongoose= require("mongoose");
const jwt= require("jsonwebtoken");
const dotenv= require("dotenv");
dotenv.config({path:"./config.env"});

const UserSchema= new mongoose.Schema({
    fname:{
       type:String,
       require:true 
    },
    lname:{
       type:String,
       require:true
    },

    email:{
        type:String,
        require:true
    },
    hashPassword:{
        type:String,
        require:true
    },
    date:{
        type:Date,
        default:Date.now
    },
    tokens:[{
        token:{
            type:String,
            require:true
        }
    }]
});

UserSchema.methods.generateAuthToken= async function(){
    try {
        const sec=process.env.SECRET_KEY;
        const token=jwt.sign({_id:this._id.toString()},sec);
        this.tokens= this.tokens.concat({token});
        this.save();
        return token;
    } catch (error) {
        console.log(error);
    }
}

const User= mongoose.model("User", UserSchema);
module.exports=User;