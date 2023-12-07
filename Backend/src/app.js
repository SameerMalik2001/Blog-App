import express from "express";
import cors from 'cors'

const app = express()

app.use(cors())

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({limit:"16kb", extended:true}))
app.use(express.static("public"))

// import routes
import {userRouter} from './routes/user.routes.js'
import { vlogRouter } from "./routes/vlog.routes.js";

//route declaration
app.use('/api/users/', userRouter)
app.use('/api/vlogs/', vlogRouter)

export {app}