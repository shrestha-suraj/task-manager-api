const mongoose=require('mongoose')
const taskSchema=new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim: true,
    },
    completed:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    }
},{
    timestamps:true //Making timestamp for when the data is created and updated
})

const Task=mongoose.model('Task',taskSchema)

module.exports=Task