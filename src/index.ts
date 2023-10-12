import express from "express"
import morgan from "morgan"
import cors from "cors"
import {PrismaClient, Task} from "@prisma/client"
import bcrypt from 'bcrypt'
const SECRET = "secret"
import jwt from "jsonwebtoken"
import Server from "socket.io"


const app = express();
const io = new Server(app)

const port = process.env.PORT || 3000;

app.use(morgan("dev"));
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const prisma = new PrismaClient()

io.on('connection', () => {
    console.log('a user connected');
});


app.get("/", async (req, res) => {
    const users = await prisma.user.findMany()
    res.send(users)
})

app.post("/signup", async (req, res) => {

    const salt = await bcrypt.genSalt(10)
    const crypted_password = await bcrypt.hash(req.body.password, salt)


    const {id, email} = await prisma.user.create({
        data: {
            email: req.body.email,
            password: crypted_password,
        },
    })
    const access_token = jwt.sign({ id }, SECRET, { expiresIn: "3 hours" })

    res.send({ id, email, token: access_token })
})

app.get("/tasks", async (req, res) => {
    const tasks = await prisma.task.findMany()
    res.send(tasks)
})

app.post("/new", async (req, res) => {
    const myTask : Task = req.body
    const task = await prisma.task.create({
        data: myTask
    })
    io.emit("Task:create", task)
    res.send(task)
})

app.put("/:id", async (req, res) => {
    const myTask : Task = req.body
    const task = await prisma.task.update({
        where: {
            id: parseInt(req.params.id)
        },
        data: myTask
    })
    io.emit("Task:edit", task)
    res.send(task)
})


app.delete("/:id", async (req, res) => {

    const task = await prisma.task.delete({
        where: {
            id: parseInt(req.params.id)
        }
    })
    io.emit("Task:delete", task)
    res.send(task)
})




app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});