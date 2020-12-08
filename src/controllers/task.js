const Task = require ('../models/task')

exports.createTask = async(req,res)=>{

    const task = new Task({
        ...req.body,
        owner:req.user._id
    })

    try{
        await task.save()
        res.status(201).send({task})
    }catch(e){
        res.status(500).send(e)
    }
}

// GET /tasksUsers?completed=true
// GET /taskUsers?limit=10&skip=0 -------- skip fixe what the page you want
// GET /taskUsers?sortBy=createdAt:des
exports.findTask =async(req,res)=>{
    const match = {}
    const sort={}

    if(req.query.completed){
        match.completed= req.query.completed === 'true'
    }

    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1:1
    }

    try{
        await req.user.populate({ /** Configure what task you want (completed or not) */
            path:'tasks',
            match,
            options:{
                limit: parseInt(req.query.limit),
                skip:parseInt(req.query.skip),
                sort
            }
        }).execPopulate()
        res.status(201).send(req.user.tasks)
    }catch(e){
        res.status(500).send(e)
    }
    
}

exports.findTaskById =async(req,res)=>{
    const _id = req.params.id
    try{
       
        const task = await Task.findOne({_id,owner:req.user._id})

        if(!task){
            return res.status(404).send("Not Found")
        }
        res.status(201).send(task)
    }catch(e){
        res.status(500).send(e)
    }
}

exports.updateTask =async(req,res)=>{
    const updates = Object.keys(req.body)
    const updateAllowed = ['description','completed']
    const isValidOperation = updates.every((update)=> updateAllowed.includes(update))

    if(!isValidOperation){
        return res.status(404).send({error: "Task not found to update"})
    }
        try{
            const taskToUpdate =  await Task.findOne({_id:req.params.id,owner:req.user._id})
            updates.forEach(update => {
                taskToUpdate[update]=req.body[update]
            });
            await taskToUpdate.save()

            if(!taskToUpdate){
                return res.status(404).send({error : "Task Not Found"})
            }
            res.send(taskToUpdate)
        }catch(e){
            res.status(400).send(e)
        }
}

exports.deleteTask = async(req,res)=>{
    try{
        const tasktoDelete = await Task.findOneAndDelete({_id:req.params.id,owner:req.user._id})
        if(!tasktoDelete){
            return res.status(404).send()
        }
        res.send(tasktoDelete)
    }catch(e){
        res.status(400).send(e)
    }
}
