import { Router } from 'express'
import DbRoutes from './services/db/routes'
import DsRoutes from './services/ds/routes'

const router = Router()

router.use('/db', DbRoutes)
router.use('/ds', DsRoutes)

export default router