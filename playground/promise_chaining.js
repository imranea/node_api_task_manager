require("../src/db/mongoose")
const User = require ('../src/models/user')

const updateManyDeleteAndCount = async(name,id,age)=>{
    const updateUser = await User.updateMany({name},{age})
    const userDelete = await User.findByIdAndDelete(id)
    const count = await User.countDocuments({age})

    return {
        updateUser,
        userDelete,
        count
    }
}

updateManyDeleteAndCount("Imrane","5eb03515dcf254664c1329af",4).then((result)=>{
    console.log(result)
}).catch((e)=>{
    console.log(e)
})

const updateAgeandCount = async(id,age)=>{
    const user = await User.findByIdAndUpdate(id,{age})
    const count =  await User.countDocuments({age})
    return count
}

updateAgeandCount("5eaf4307cb7f36422e77b0fa",2).then((count)=>{
    console.log(count)
}).catch((e)=>{
    console.log(e)
})