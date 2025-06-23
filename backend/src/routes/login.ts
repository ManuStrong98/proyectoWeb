import { Router } from 'express'
import { login } from './../controllers/usuario'

const authRoutes = Router()
authRoutes.post('/login', login)

export default authRoutes

