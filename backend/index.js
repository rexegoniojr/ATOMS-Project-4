import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import path from 'path'
import compression from 'compression'
import { fileURLToPath } from 'url';
import { Server } from 'socket.io'
import { createServer } from 'http'

import { AccountRouter } from './routes/AccountRoutes.js'
import { StatusRouter } from './routes/StatusRoutes.js'
import { SelectionRouter } from './routes/SelectionRoutes.js'
import { PreAlertRouter } from './routes/PreAlertRoute.js'
import { PermitRouter } from './routes/PermitRoute.js'
import { CDTRouter } from './routes/CDTRoutes.js'
import { CDTApprovedRouter } from './routes/CDTApprovedRoutes.js'
import { PRESADRouter } from './routes/PRESADRoutes.js'
import { PeerCheckerRouter } from './routes/PeerCheckerRoutes.js'
import { LodgeRouter } from './routes/LodgeRoutes.js'
import { PortalRouter } from './routes/PortalRoutes.js'
import { FundRequestRouter } from './routes/FundRequestRoutes.js'
import { DORORouter } from './routes/DORORoutes.js'
import { RERouter } from './routes/ReEntryRoutes.js'
import { FileRouter } from './routes/FileRoutes.js'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config()
const app = express()
app.use(compression())
app.use(express.json())
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "Access-Control-Allow-Credentials",
    ],
}))
app.use(cookieParser())

app.use('/api/account', AccountRouter)
app.use('/api/status', StatusRouter)
app.use('/api/selection', SelectionRouter)
app.use('/api/pre_alert', PreAlertRouter)
app.use('/api/permit', PermitRouter)
app.use('/api/CDT', CDTRouter)
app.use('/api/CDTApproved', CDTApprovedRouter)
app.use('/api/PRESAD', PRESADRouter)
app.use('/api/PeerChecker', PeerCheckerRouter)
app.use('/api/Lodge', LodgeRouter)
app.use('/api/Portal', PortalRouter)
app.use('/api/Fund_Request', FundRequestRouter)
app.use('/api/DORO', DORORouter)
app.use('/api/RE', RERouter)
app.use('/api/Files', FileRouter)

app.use(express.static(path.join(__dirname, '..', 'frontend')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'frontend', 'index.html'))
});
const { MONGO_URL, PORT } = process.env;
app.listen(PORT, () => console.log(`Server Status: Listening on port ${PORT}`))
mongoose
    .connect(MONGO_URL)
    .then(() => console.log('Server Status: Database Connected'))
    .catch((err) => console.log('Server Status: Database connection Error: ' + err))

const server = createServer(app)
const io = new Server(server)

io.on('connection', (socket) => {
    socket.on('User Login', (name) => {
        console.log(`${name} is online`)
    })

    socket.on('User Logout', (name) => {
        console.log(`${name} is offline`)
    })

    socket.on('Notification', (userKey) => {

    })
})

server.listen(() => {
    console.log(`IO Server: Listening on port ${PORT}`)
})