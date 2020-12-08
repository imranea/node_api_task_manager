const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt =  require("bcryptjs")
const jwt = require('jsonwebtoken')
const Task =  require('./task')


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required:true,
        trim:true
    },
    email:{
        type: String,
        unique:true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("It's not a mail")
            }
        }
    },
    age:{
        type: Number,
        default:0,
        validate(value){
            if (value<0) {
                throw new Error("age must be positiv")
            }
        }
    },
    password:{
        type: String,
        required:true,
        trim:true,
        validate(value){
            if(!validator.isLength(value,{min:6})){
                throw new Error("Must have more than 6 letter")
            }
            if(validator.contains(value.toLowerCase(),"password")){
                throw new Error("Your password is password")
            }
        },
    },
    tokens:[{
        token:{
            type:String,
            required:true
        }
    }],
    avatar:{
        type:Buffer
    }
},{
    timestamps:true
})

userSchema.virtual('tasks',{ // configure relation between User and Task
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON = function(){ // toJson return our object with what we want in there
    const user = this
    const userObject = user.toObject() // method from mongoose to return object

    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar


    return userObject
}

userSchema.methods.generateAuthToken = async function(){
    const user = this

    const token = jwt.sign({_id:user._id.toString()}, process.env.STRING_TOKEN)

    user.tokens =  user.tokens.concat({token})
    await user.save();
    return token
}

userSchema.statics.findByCredentials = async (email,password) =>{
    const user = await User.findOne({email})

    if(!user){
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password,user.password)

    if(!isMatch){
        throw new Error('Unable to login')
    }

    return user
}

//hash the plain text passwors before saving
userSchema.pre('save', async function (next) {
    const user = this

    if(user.isModified('password')){
        user.password= await bcrypt.hash(user.password,8)
    }

    next()
})

// Delete user task when user is removed
userSchema.pre('remove',async function(next){
    const user = this
    await Task.deleteMany({owner:user._id})

    next()
})


const User = mongoose.model("User", userSchema) 

module.exports = User
