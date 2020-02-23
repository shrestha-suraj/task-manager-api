const mongoose=require('mongoose')
//The database name is passed within the link for the mongoose
mongoose.connect(process.env.MONGODB_CONNECTION_STRING,
    {
        useNewUrlParser:true,
        useUnifiedTopology:true,
        useCreateIndex:true,
        useFindAndModify:false
    })



////////////////////////////////////////////PART ONE/////////////////////////////////////////////////
//creating basic version of a user modol and then creating its instance with certian data and storing
//it to the database

//Note: User is the model, mongoose will search for collection called Users in the database
// Note: Notice that we havenot passed in the collection name for using mongoose
// const User=mongoose.model('User',{
//     name:{
//         //Charactericsts of the variable
//         type:String,
//         required:true, //Must have name.. Cannot leave empty
//         trim:true //Trims by removing spaces
//     },
//     email:{
//         type:String,
//         required:true,
//         lowercase:true,
//         trim:true,
//         validate(value){ //Validating the data
//             if(!validator.isEmail(value)){
//                 throw new Error('Email is not invalid')
//             }
//         }
//     },
//     password:{
//         type:String,
//         required:true,
//         trim:true,
//         minlength:7,
//         validate(value){
//             if(value.toLowerCase().includes('password')){
//                 throw new Error("The password cannot have word password.")
//             }
//         }
//     },
//     age:{
//         type:Number,
//         default:0, //Providing a default value
//         validate(value){ //Custom validator that can be used to do whatever we want
//            if(value<0){
//              throw new Error('')
//            }
//         }
//     }
// })

// //Creating instances of the model to add document to the database
// const me=new User({
//     name:"Christian      Ronaldo",
//     email:"suraj@gmail.com           ",
//     age:46,
//     password:"nepal123"
// })
// //Saving data to the database. Returns a promise
// me.save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{ 
//     console.log("Error: ",error)
// })
/////////////////////////////////PART ONE ENDS///////////////////////////////////////////////////////

//Challenge: Model for tasks and its instance and save it on databse

// const Task=mongoose.model('Task',{
//     description:{
//         type:String,
//         required:true, //Must fill this content of the document: Example of a validator: google
//         trim:true
//     },
//     completed:{
//         type:Boolean,
//         default:false
//     }
// })

// const myTask=new Task({  
//     description:"           Create a Novel     ",
//     completed:false
    
// })

// myTask.save().then((result)=>{
//     console.log(result)
// }).catch((error)=>{
//     console.log("Error: ",error)
// })