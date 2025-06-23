import { Router } from 'express'
import { login } from './../controllers/usuario'

const authRoutes = Router()
console.log('login router cargado');
authRoutes.post('/login', login)

export default authRoutes

