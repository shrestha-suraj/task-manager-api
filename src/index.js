require('./db/mongoose')
const express=require('express')
const userRouter=require('./routers/user')
const taskRouter=require('./routers/tasks')
const app=express()
const port=process.env.PORT
app.use(express.json())
app.use(userRouter)
app.use(taskRouter)
app.listen(port,()=>{
    console.log("Server is up on port "+port)
})

//Automatically parse incoming json to an object when accessing request body

//Middleware makes sure which request to past or stop
// app.use((request,response,next)=>{
//     if (request.method==='GET'){
//         response.send('Get request are disabled')
//     }else{
//         next()
//     }
// })




// const multer=require('multer')

// const upload=multer({
//     //Destination
//     dest:'images'
// })

// //Adding multer middleware in uploads
// app.post('/upload',upload.single('upload'),(request,response)=>{
//     response.send()
// })


//www.regex101.com

// const multer=require('multer')
// const upload=multer({
//     dest:'user-images',//Folder to store image in
//     limits:{
//         fileSize:1000000 // 1000000bytes= 1MB//Number of bytes
//     },
//     fileFilter(request,file,callback){  //Types of files to accept
//         //File object has information about the file. These properties are accessible on npm multer docs
//         // Original statement used: if(!file.originalname.endsWith('.pdf')){
//         if(!file.originalname.match(/\.(doc|docx)$/)){ //This is used instead of above statement to
//             //make upload of multiple accepeted files easy
//             callback(new Error('File must be a document file')) //If there was error on file
//         }
//         callback(undefined,true) //If upload was successful
//         // callback(undefined,false)//If upload was unsuccessful
//     }

// })

// app.post('/tests',upload.single('upload'),(request,response)=>{
//     response.send()
// },(error,request,response,next)=>{
//     response.status(400).send({error:error.message})
// })





// const Task=require('./models/task')
// const User=require('./models/user')
// const main=async()=>{
//     const user=await User.findById('5e51e516411bda40893f85c0')
//     await user.populate('tasks').execPopulate()
//     console.log(user.tasks)
//     // const task=await Task.findById('5e51e5eabc4048421aeb304f')
//     // //Since i used rel:'User' in the Task Schmena
//     // //The below code runs to fetch whole data about the user
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)
// }
// main()