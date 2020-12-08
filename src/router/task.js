const express = require("express")
const router = express.Router()
const auth = require("../middleware/auth")
const taskCtrl = require('../controllers/task')

router.post("/tasks", auth, taskCtrl.createTask)

router.get("/tasksUser", auth, taskCtrl.findTask)

router.get("/tasks/:id", auth, taskCtrl.findTaskById)

router.patch("/tasks/:id",auth, taskCtrl.updateTask)

router.delete("/tasks/:id", auth, taskCtrl.deleteTask)

module.exports =router