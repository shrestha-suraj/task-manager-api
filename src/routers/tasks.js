const express=require('express')
const auth=require('../middleware/auth')
const Task=require('../models/task')
const router=new express.Router()

router.post('/tasks',auth,async (request,response)=>{
    // const newTask=new Task(request.body)
    const newTask=new Task({
        ...request.body,
        owner:request.user._id
    })
    try{
        await newTask.save()
        response.send(newTask)
    }catch(error){
        response.status(500).send({error:error.message})
    }
    // newTask.save().then((result)=>{
    //     response.send(result)
    // }).catch((error)=>{
    //     response.status(401).send({error:error.message})
    // })

})

//Pagination is the process of limiting data sent to user such that
// when user interract with the data and runs out of it, more data is sent
//Example: Google Search page with  next page options
//Example: Instagram news feed where its infinite scroll comes to action
// limit skip
//GET /tasks?limit=10&skip=10

//Sorting
//GET /tasks?sortBy=createdAt_asc or createdAt_dsc

router.get('/tasks',auth,async (request,response)=>{
    try{
        // const tasks=await Task.find({owner:request.user._id})
        //Checking if there is any query with the url
        const match={}
        const sort={}
        if(request.query.completed){
            match.completed=request.query.completed==='true'
        }
        if(request.query.sortBy){
            const parts=request.query.sortBy.split('_')
            sort[parts[0]]=parts[1]==='desc'?-1:1
        }
        await request.user.populate({
            path:'tasks',
            match,
            options:{ //This is for pagination
                limit:parseInt(request.query.limit),
                skip:parseInt(request.query.skip),
                sort
                
                // sort:{
                //     // creeatedAt:-1 //-1 for descending and 1 for ascending
                //     completed:-1
                // }
            }
        }).execPopulate()
        response.send(request.user.tasks)
    }catch(error){
        response.status(500).send({error:error.message})
    }
    
    // Task.find({}).then((result)=>{
    //     if(!result){
    //         return response.status(404).send() 
    //     }
    //     response.send(result)
    // }).catch((error)=>{
    //     response.status(500).send({error:error.message})
    // })
})
router.get('/tasks/:id',auth,async (request,response)=>{
    const _id=request.params.id
    try{
        // const task=await Task.findById(_id)
        const task=await Task.findOne({_id:_id,owner:request.user._id})
        response.send(task)
    }catch(error){
        response.status(500).send({error:error.message})
    }

    // Task.findById(_id).then((result)=>{
    //     if(!result){
    //         return response.status(404).send()
    //     }
    //     response.send(result)
    // }).catch((error)=>{
    //     response.status(500).send({error:error.message})
    // })
})

router.patch('/tasks/:id',auth,async (request,response)=>{
    const updateData=Object.keys(request.body)
    const validUpdates=['description','completed']
    const isValid=updateData.every((update)=>validUpdates.includes(update))
    if(!isValid){
        return response.status(400).send({error:"Invalid Input Detected"})
    }
    try{
        const task=await Task.findOne({_id:request.params.id,owner:request.user._id})
        if(!task){
            return response.status(404).send({error:"Cannot Find User"})
        }
        updateData.forEach((update)=>task[update]=request.body[update])
        await task.save()
        // const task=await Task.findByIdAndUpdate(request.params.id,request.body,{new:true,runValidators:true})
        
        response.send(task)
    }catch(error){
        response.status(400).send({error:error.message})
    }
})

router.delete('/tasks/:id',auth,async (request,response)=>{
    try{
        const task=await Task.findOneAndDelete({_id:request.params.id,owner:request.user._id})
        if(!task){
            return response.status(404).send()
        }
        response.send(task)
    }catch(error){
        response.status(500).send()
    }
})

module.exports=router