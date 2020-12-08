require("../src/db/mongoose")
const Task = require("../src/models/task")

/* Task.findByIdAndRemove("5eb02ba301e10d564fb184c9").then((task)=>{
    console.log(task)
    return Task.countDocuments({completed:false})
}).then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
}) */

const deleteTaskAndCount = async(id,complete)=>{
    const userDelete = await Task.findByIdAndDelete(id)
    const count = await Task.countDocuments(complete)
    return {
        userDelete,
        count
    }
}

deleteTaskAndCount("5eaf4aba44c4a2506916332a",false).then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})