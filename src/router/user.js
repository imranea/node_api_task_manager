const express = require("express")
const auth = require("../middleware/auth")
const router = express.Router()
const userCtrl = require("../controllers/user")

const multer = require('multer')
const upload = multer({
    limits:{
        fileSize: 1000000
    },
    fileFilter(req,file,callback){
        /* callback(new Error('File must be a PDF'))
        callback(undefined,true)
        callback(undefined,false) */
        if(!file.originalname.match(/\.(jpg||jpeg||png)$/)){
            return callback(new Error('Please upload a jpg,jpeg or a png'))
        }
        callback(undefined,true)
    }
})

router.post('/users', userCtrl.signup)

router.get('/users', userCtrl.allUsers)

router.post('/users/login', userCtrl.login)

router.post('/users/logout', auth,userCtrl.logout)

router.post('/users/logoutAll', auth, userCtrl.logoutAll)

router.post('/users/me/avatar',auth,upload.single('avatar'), userCtrl.meAvatar,(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/users/me/avatar',auth,userCtrl.deleteMeAvatar)

router.get('/users/:id/avatar',userCtrl.avatarUser)

router.get("/users/me", auth ,userCtrl.me)

router.patch("/users/me", auth,userCtrl.updateUser)


router.delete("/users/me", auth,userCtrl.deleteUser)

module.exports= router