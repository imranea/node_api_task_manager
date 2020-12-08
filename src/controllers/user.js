const User = require ('../models/user');
const sharp = require('sharp');
const {sendWelcomeEmail,sendDeleteEmail} =require('../emails/account')

exports.signup = async (req,res)=>{
    const user = new User(req.body)
    try{
        const token = await user.generateAuthToken()
        sendWelcomeEmail(user.email,user.name)
        await user.save();
        res.status(201).send({user,token})
    }catch(e){
        res.status(400).send(e)
    }
}

 exports.login = async (req,res)=>{
    try{
        const user= await User.findByCredentials(req.body.email,req.body.password)
        const token = await user.generateAuthToken()
        res.send({user,token})
    }catch(e){
        res.status(400).send({message:"Erreur de login or password"})
    }  
}

exports.logout = async (req,res) =>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !== req.token
        })
        await req.user.save()

        res.status(200).json({message:"Vous avez bien été déconnecté"})
    }catch(e){
        res.status(500).json({erreur:e})
    }
}

exports.me = async(req,res)=>{

    res.send(req.user)
}

exports.meAvatar = async (req,res) =>{
    const buffer = await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).send({message:"The avatar was upload"})
}

exports.deleteMeAvatar = async (req,res) =>{
    req.user.avatar=undefined
    await req.user.save()
    res.status(200).send({message:"The avatar was delete"})
}

exports.avatarUser = async (req,res) =>{
    try{
        const user = await User.findById(req.params.id)

        if(!user || !user.avatar){
            throw new Error()
        }

        res.set('Content-Type','image/png')
        res.send(user.avatar)

    }catch(e){
        res.status(404).send({message:e})
    }
}


exports.updateUser =  async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdate = ['name','email','password','age']
    const isValidOperation = updates.every((update)=>allowedUpdate.includes(update))

    if(!isValidOperation){
        return res.status(404).send({ error: "Invalid update!" })
    }

    try{
        updates.forEach((update)=>{
            req.user[update]=req.body[update]
        })

        console.log(req.user)

        await req.user.save()

        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
}


exports.deleteUser= async(req,res)=>{
    try{
        sendDeleteEmail(req.user.email,req.user.name)
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
}

exports.allUsers = async(req,res) =>{
    try{
        const users = await User.find({})
        res.status(200).json({users})
    }catch(e){
        res.status(500).json({message:e})
    }
    
}

exports.logoutAll = async (req,res) =>{
    //res.send(req.user)
    try{
        req.user.tokens = []
        await req.user.save()
        res.status(200).json({message:"Vous avez bien été déconnecté de tous les appareils"})
    }catch(e){
        res.status(500).json({message : e})
    }
}