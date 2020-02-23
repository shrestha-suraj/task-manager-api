const express=require('express')
const User=require('../models/user')
const auth=require('../middleware/auth')
const router=new express.Router()
const sharp=require('sharp')//For image modifying
const {sendWelcomeEmail,sendDeleteEmail}=require('../emails/accounts')


router.post('/users',async (request,response)=>{
    const user=new User(request.body)
    //If await runs into error the code below wont work
    try{
        const token=await user.generateAuthToken()
        user.tokens=user.tokens.concat({token})
        await user.save()
        sendWelcomeEmail(user.email,user.name)
        response.status(201).send({user,token})
    }catch(error){
        response.status(400).send({error:error.toString()})
    } 
    // user.save().then((result)=>{
    //     response.status(201).send(result)
    // }).catch((error)=>{
    //     response.status(400).send({error:error.toString()})
    // })
})


router.post('/users/login',async (request,response)=>{
    try{
        //This function is being defined in User Schema
        const user=await User.findByCredentials(request.body.email,request.body.password)
        const token=await user.generateAuthToken()
        user.tokens=user.tokens.concat({token})
        await user.save()
        response.send({user,token})
    }catch(error){
        response.status(400).send()
    }
})

router.post('/users/logout',auth,async (request,response)=>{
    try{
        request.user.tokens=request.user.tokens.filter((token)=>token.token!==request.token)
        await request.user.save()
        response.send()
    }catch(error){
        response.status(500).send()
    }
})

router.post('/users/logoutAll',auth,async (request,response)=>{
    try{
        const user=request.user
        user.tokens=[]
        await user.save()
        response.status(200).send("User has been logged out from all systems.")
    }catch(error){
        response.status(500).send()
    }
})


router.get('/users/me',auth,async (request,response)=>{
    try{
        response.send(request.user)
    }catch(error){
        response.status(500).send({error:error.message})
    }

    // User.find({}).then((users)=>{
    //     response.send(users)
    // }).catch((error)=>{
    //     response.status(500).send({error:error.message})
    // })
})

// router.get('/users/:id',async (request,response)=>{
//     const _id=request.params.id
//     try{
//         const user=await User.findById(_id)
//         if(!user){
//             return response.status(404).send()
//         }
//         response.send(user)
//     }catch(error){
//         response.status(500).send({error:error.message})
//     }
    
//     // User.findById(_id).then((user)=>{
//     //     if(!user){
//     //         return response.status(404).send()
//     //     }
//     //     console.log("Log 2")
//     //     response.send(user)
//     // }).catch((error)=>{
//     //     console.log("Log 3")
//     //     response.status(500).send()
//     // })
// })

router.patch('/users/me',auth,async(request,response)=>{
    //this process is added to make sure users don't update unnecessary content
    //For example: you don't want user to update the id of the users.. So take precaution
    //This will return the property of the object provided from the user
    const updates=Object.keys(request.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return response.status(400).send({error:"Invalid update operation"})
    }
    try{
        //This is done to make middleware run everytime we update something
        const user=request.user
        updates.forEach((update)=>user[update]=request.body[update])
        await user.save()
        //Setiing new:true will return object of updated user rather than old user
        //runValidators:true will make sure that the update contents are validated first
        // const user=await User.findByIdAndUpdate(_id,request.body,{new:true,runValidators:true})
        // if(!user){
        //     return response.status(404).send()
        // }
        response.send(user)
    }catch(error){
        response.status(400).send({error:error.message})
    }
})

router.delete('/users/me',auth,async (request,response)=>{
    try{
        // const user=await User.findByIdAndDelete(request.user._id)
        // if(!user){
        //     return response.status(404).send()
        // }
        await request.user.remove()
        sendDeleteEmail(request.user.email,request.user.name)
        response.send(request.user)
    }catch(error){
        response.status(500).send()
    }
})

const multer=require('multer')
const upload=multer({
   //dest:'avatars', //Removing this will make multer not save the image on folder and
   //give access to the image on the place where we have used multer as middleware
   limits:{
       fileSize:1000000
   },
   fileFilter(request,file,callback){
       if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
        return callback(new Error('Pleas Upload Image File of : JPEG, JPG or PNG'))
       }
       callback(undefined,true)
   }
})

router.post('/users/me/avatar',auth,upload.single('upload'),async (request,response)=>{
    const buffer=await sharp(request.file.buffer).resize({width:250,height:250}).png().toBuffer()
    request.user.avatar=buffer//This has access to that file which you did not use the dest:'dir name'
    await request.user.save()
    response.send()
},(error,request,response,next)=>{
    response.status(400).send({error:error.message})
})
//How to render the binary image on html
// <img src='data:image/jpg;base64,binaryDatafromDatabase'>

router.delete('/users/me/avatar',auth,async(request,response)=>{
    request.user.avatar=''
    await request.user.save()
    response.send('Image successfully deleted')
})

router.get('/users/:id/avatar',async(request,response)=>{
    const _id=request.params.id
    try{
        const user=await User.findById(_id)
        if(!user || !user.avatar){
            throw new Error()
        }
        //We need to let the user know what kind of image we are transfering too
        //response.set('is used to set data on header file.Takes key value pair')
        response.set('Content-Type','image/png').send(user.avatar)
    }catch(error){
        response.status(404).send({error:error.message})
    }
})

//In such case the front end can render the image by just calling this url on image tag i.e.
//<img src='http://localhost:3000/users/5e5206048ba9ca5a01a5bb59/avatar'>

module.exports=router